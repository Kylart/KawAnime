import { eventsList } from '../../../../vendor'
import { Logger } from '../../utils'
import { getCreds } from '../../externals'

const events = eventsList.vault.get

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

export default {
  eventName: events.main,
  handler: getCredentials
}
