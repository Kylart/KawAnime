import { eventsList } from 'vendor'
import { Logger, hashName } from '../../utils'
import { localFiles } from '../../externals'

const logger = new Logger('Local Lists (Update)')
const FILE_NAME = 'localLists.json'
const events = eventsList.localLists.update

function update (data) {
  return localFiles.writeFile(data, FILE_NAME)
}

function handler (event, { type, data, isDelete = false }) {
  try {
    const storage = localFiles.getFile(FILE_NAME)
    const currentList = storage[type]

    const index = currentList.findIndex(({ name, key }) => name === data.name || (data.key && key === data.key))
    const isUpdate = index !== -1

    if (isDelete) {
      if (index === -1) throw new Error('Cannot delete non-existing entry.')

      currentList.splice(index, 1)

      logger.info(`Deleted ${data.name} from ${type} list.`)
    } else if (isUpdate) {
      const current = currentList[index]
      // Updating each value separately as there might be other keys
      // that were not sent here.
      Object.keys(data).forEach((key) => {
        current[key] = data[key]
      })

      logger.info(`Updated ${type} list`)
    } else {
      // Setting up data key
      data.key = hashName(data.name)

      currentList.push(data)
    }

    update(storage)

    logger.info('Successfully saved storage.')

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
