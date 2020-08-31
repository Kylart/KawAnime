import { eventsList } from 'vendor'
import { Logger } from '../../utils'
import { localFiles } from '../../externals'
import { hashName, getCurrentFile } from './utils'

const logger = new Logger('Local Files (Update)')
const FILE_NAME = 'locals.json'
const events = eventsList.local.update

function update (data) {
  return localFiles.writeFile(data, FILE_NAME)
}

function handler (event, data) {
  try {
    const storage = getCurrentFile()
    const { title, info, isUpdate, isReset, titles } = data

    if (isReset) {
      for (const name of titles) {
        const key = hashName(name)

        storage[key] = undefined

        logger.info(`Erased info for ${name}.`)
      }

      update(storage)

      event.returnValue = data

      return
    }

    const key = hashName(title)

    // If asked for an update but the key is not in storage,
    // we simply exit return success.
    if (isUpdate && !Object.prototype.hasOwnProperty.call(storage, key)) {
      return
    }

    storage[key] = info

    update(storage)
    logger.info(`${isUpdate ? 'Updated' : 'Saved'} info for ${title}.`)

    event.sender.send(events.success, data)
  } catch (e) {
    logger.error('Failed to update local information', e)
    event.sender.send(events.error, e.message)
  }
}

export default {
  eventName: events.main,
  handler
}
