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

async function getInfo (entries) {
  const query = makeQuery(entries)

  const { data } = await graphql(GRAPHQL_ENDPOINT, query)

  return format(data)
}

async function handler (event, entries) {
  try {
    // Getting useful info like thumbnail, genres,...
    const info = await getInfo(entries)

    console.log(info)

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
