import { eventsList } from 'vendor'
import { Logger } from '../../utils'
import { parseName } from '../../externals'

const events = eventsList.parse

const logger = new Logger('Parse')

async function parse (event, name) {
  try {
    event.returnValue = parseName(name)
  } catch (e) {
    logger.error(`Could not parse name ${name}`)
    event.returnValue = e.message
  }
}

export default {
  eventName: events.main,
  handler: parse
}
