import { parseSync } from 'anitomy-js'

import { eventsList } from 'vendor'
import { Logger } from '../../utils'

const events = eventsList.parse

const logger = new Logger('Parse')

async function news (event, name) {
  try {
    event.returnValue = parseSync(name)
  } catch (e) {
    logger.error(`Could not parse name ${name}`)
    event.returnValue = e.message
  }
}

export default {
  eventName: events.main,
  handler: news
}
