import { eventsList } from '../../../../../vendor'
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

async function getInfo (entries) {
  // Let's make a maximum of 20 entries per query
  const queries = []
  const nbQueries = Math.floor(entries.length / NB_MAX_QUERIES) + 1

  for (let i = 0; i < nbQueries; ++i) {
    const start = i * NB_MAX_QUERIES
    const end = start + NB_MAX_QUERIES

    const query = makeQuery(entries.slice(start, end))

    queries.push(graphql(GRAPHQL_ENDPOINT, query).catch((err) => {
      console.log(`Query #${i} failed`, err)
      throw err
    }))
  }

  const results = await Promise.all(queries)

  return format(
    results
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
    logger.error('An error occurred.', e.stack)
    event.sender.send(events.error, e.message)
  }
}

export default {
  eventName: events.main,
  handler
}
