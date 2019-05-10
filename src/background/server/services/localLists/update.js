import { eventsList } from '../../../../vendor'
import { Logger } from '../../utils'
import { localFiles } from '../../externals'

const logger = new Logger('Local Lists (Update)')
const FILE_NAME = 'localLists.json'
const events = eventsList.localLists.update

function update (data) {
  return localFiles.writeFile(data, FILE_NAME)
}

function handler (event, { type, data }) {
  try {
    const storage = localFiles.getFile(FILE_NAME)
    const currentList = storage[type]

    const index = currentList.findIndex(({ name }) => name === data.name)
    const isUpdate = index !== -1

    if (isUpdate) {
      const current = currentList[index]
      // Updating each value separately as there might be other keys
      // that were not sent here.
      Object.keys(data).forEach((key) => {
        current[key] = data[key]
      })
    } else {
      currentList.push(data)
    }

    update(storage)

    logger.info(`Updated ${type} list with:`, data)

    event.sender.send(events.success, storage)
  } catch (e) {
    logger.error('Failed to update local information', e)
    event.sender.send(events.error, e.message)
  }
}

export default {
  eventName: events.main,
  handler
}
