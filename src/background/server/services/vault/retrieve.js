import { eventsList } from '../../../../vendor'
import { Logger } from '../../utils'
import { getCreds } from '../../externals'

const events = {
  get: eventsList.vault.get,
  has: eventsList.vault.has
}

const logger = new Logger('Vault (Get)')

async function getCredentials (event, service) {
  try {
    const data = await getCreds(service)

    logger.info(`Successfully retrieved credentials for ${service}.`)

    event.returnValue = data
  } catch (e) {
    logger.error(`Could not retrieve credentials for ${service}`)
    event.returnValue = { error: e.message }
  }
}

async function hasCredentials (event, service) {
  try {
    const data = await getCreds(service)

    event.returnValue = !!data
  } catch (e) {
    logger.error(`Could not retrieve credentials for ${service}`)
    event.returnValue = { error: e.message }
  }
}

export default [{
  eventName: events.get.main,
  handler: getCredentials
}, {
  eventName: events.has.main,
  handler: hasCredentials
}]
