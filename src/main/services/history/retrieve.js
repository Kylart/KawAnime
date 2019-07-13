import { eventsList } from 'vendor'
import { localFiles } from '../../externals'
import { Logger } from '../../utils'

const logger = new Logger('History (Get)')

const FILE_NAME = 'history.json'

const events = eventsList.history.get

async function retrieve (event) {
  try {
    const result = localFiles.getFile(FILE_NAME)
    event.sender.send(events.success, result)
  } catch (e) /* istanbul ignore next */ {
    logger.error('An error occurred.', e.stack)
    event.sender.send(events.error, e.message)
  }
}

export default {
  eventName: events.main,
  handler: retrieve
}
