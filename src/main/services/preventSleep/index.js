import { powerSaveBlocker } from 'electron'

import { eventsList } from 'vendor'
import { Logger } from '../../utils'

const events = eventsList.preventSleep

const logger = new Logger('Prevent Sleep')

async function togglePreventSleep (event, id) {
  try {
    const isOn = id !== null && powerSaveBlocker.isStarted(id)

    if (isOn) {
      powerSaveBlocker.stop(id)
      event.returnValue = null

      logger.info('Stopped blocking computer from sleeping')
    } else {
      const newId = powerSaveBlocker.start('prevent-display-sleep')

      if (powerSaveBlocker.isStarted(newId)) {
        event.returnValue = newId
        logger.info('Preventing computer from sleeping.')
      }
    }

    return
  } catch (e) {
    logger.error('Could not prevent computer from sleeping.', e.message)
  }

  event.returnValue = null
}

export default {
  eventName: events.main,
  handler: togglePreventSleep
}
