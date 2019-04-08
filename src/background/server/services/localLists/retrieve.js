import { eventsList } from '../../../../vendor'
import { localFiles } from '../../externals'
import { Logger } from '../../utils'

const logger = new Logger('Local Lists (Get)')

const FILE_NAME = 'lists.json'

const events = eventsList.localLists.get

async function retrieve (event) {
  try {
    const result = localFiles.getFile(FILE_NAME)
    event.sender.send(events.success, JSON.stringify(result))
  } catch (e) /* istanbul ignore next */ {
    logger.error('An error occurred.', e.stack)
    event.sender.send(events.error, e.message)
  }
}

export default {
  eventName: events.main,
  handler: retrieve
}
