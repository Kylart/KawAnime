import { eventsList } from 'vendor'
import { Logger } from '../../utils'
import { localFiles } from '../../externals'

const logger = new Logger('Config (Update)')
const FILE_NAME = 'config.json'
const events = eventsList.config.update

function update (data) {
  return localFiles.writeFile(data, FILE_NAME)
}

function handler (event, data) {
  try {
    update(data)

    logger.info('Updated user configuration.')

    event.sender.send(events.success)
  } catch (e) {
    logger.error('Failed to update user configuration', e)
    event.sender.send(events.error, e.message)
  }
}

export default {
  eventName: events.main,
  handler
}
