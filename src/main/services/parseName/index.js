import bindings from 'kawabinds'

import { eventsList } from 'vendor'
import { Logger } from '../../utils'

const events = eventsList.parse

const logger = new Logger('Parse')

async function parse (event, name) {
  try {
    event.returnValue = bindings.parseName(name)
  } catch (e) {
    logger.error(`Could not parse name ${name}`)
    event.returnValue = e.message
  }
}

export default {
  eventName: events.main,
  handler: parse
}
