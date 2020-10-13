import { eventsList } from 'vendor'
import { localFiles } from '../../../externals'
import { graphql, Logger } from '../../../utils'
import { GRAPHQL_ENDPOINT } from '../../../externals/anilist/utils'

import makeQuery from './makeQuery'
import format from './format'

const FILE_NAME = 'localLists.json'
const logger = new Logger('Local Lists (Info)')
const events = eventsList.localLists.info
const keyPrefix = 'a'
const NB_MAX_QUERIES = 20

/**
 * This method modifies its given arguments.
 * Handles Not found errors in long GraphQL queries. It will feed the `failures`
 * argument so that it's possible to retry failed queries without the Not Found
 * names.
 *
 * @param {Error} error
 * @param {Array} entries CurrentEntries of the query. Will be modified.
 * @param {Array} failures Accumulator that will receive the error. Will be modified.
 *
 * @returns {undefined}
 */
function handleFailures (error, entries, failures) {
  // Trying to find which query made the error
  const { response: { errors }, query } = error

  errors.forEach(({ locations, status }) => {
    // Only Not Found errors
    if (status === 404) {
      locations.forEach(({ line }) => {
        const entryName = query.split('\n')[line - 1].match(/"([^)]+)"/)[0].slice(1, -1)
        const entryIndex = entries.findIndex(
          ({ name }) => {
            return entryName === name
              // treatment applied to headers
              .replace(/"/g, '\\"')
              .replace(/\s*\([^)]*\)\s*/g, '')
              .trim()
          }
        )

        if (entryIndex >= 0) {
          entries.splice(entryIndex, 1)
        }
      })
    }
  })

  failures.push(
    graphql(GRAPHQL_ENDPOINT, makeQuery(entries))
      .catch((error) => logger.error('Persistent Error for GraphQL request', error))
  )
}

async function getInfo (entries) {
  // Let's make a maximum of 20 entries per query
  const queries = []
  const failures = []
  const nbQueries = Math.floor(entries.length / NB_MAX_QUERIES) + 1

  for (let i = 0; i < nbQueries; ++i) {
    const start = i * NB_MAX_QUERIES
    const end = start + NB_MAX_QUERIES

    const currentEntries = entries.slice(start, end)
    const query = makeQuery(currentEntries)

    queries.push(
      graphql(GRAPHQL_ENDPOINT, query)
        .catch((err) => handleFailures(err, currentEntries, failures))
    )
  }

  let results = await Promise.all(queries)
  results = [
    ...results,
    ...(await Promise.all(failures)
      .catch((err) => logger.error('Could not save failures...', err))
    )
  ]

  return format(
    results
      .filter(Boolean)
      .reduce((acc, { data }) => {
        Object.keys(data).forEach((key) => {
          acc[key] = data[key]
        })

        return acc
      }, {})
  )
}

async function handler (event, entries) {
  try {
    // Getting useful info like thumbnail, genres,...
    const info = await getInfo(entries)

    const storage = localFiles.getFile(FILE_NAME)

    entries.forEach((entry) => {
      const listName = entry.list
      const list = storage[listName]

      // At this point, there is no way the entry isn't in the list
      const index = list.findIndex(({ name }) => name === entry.name)
      const key = `${keyPrefix}${entry.key}`
      const _info = info[key]

      // This would most likely mean there is no data for this
      // entry. We are doomed.
      if (!_info || index === -1) return

      const currentEntry = list[index]

      // Updating
      Object.assign(currentEntry, _info)
    })

    // Updating local storage
    localFiles.writeFile(storage, FILE_NAME)

    event.sender.send(events.success, storage)
  } catch (e) {
    logger.error('Could not update watch list info.', e.message)
    event.sender.send(events.error, e.message)
  }
}

export default {
  eventName: events.main,
  handler
}
