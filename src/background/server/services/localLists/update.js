import { eventsList } from '../../../../vendor'
import { Logger } from '../../utils'
import { localFiles } from '../../externals'

const logger = new Logger('Local Lists (Update)')
const FILE_NAME = 'lists.json'
const events = eventsList.localLists.update

function update (data) {
  return localFiles.writeFile(data, FILE_NAME)
}

function handler (event, data) {
  try {
    update(data)

    logger.info(`Updated local lists.`)

    event.sender.send(events.success)
  } catch (e) {
    logger.error('Failed to update local information', e)
    event.sender.send(events.error, e.message)
  }
}

export default {
  eventName: events.main,
  handler
}
