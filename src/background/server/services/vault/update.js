import { eventsList } from '../../../../vendor'
import { Logger } from '../../utils'
import { setupCreds } from '../../externals'

const events = eventsList.vault.update

const logger = new Logger('Vault (Update)')

async function setCredentials (event, { service, credentials }) {
  try {
    const data = await setupCreds(service, credentials)

    logger.info(`Successfully registered credentials for ${service}.`)

    event.returnValue = data
  } catch (e) {
    logger.error(`Could not register credentials for ${service}`)
    event.returnValue = { error: e.message }
  }
}

export default {
  eventName: events.main,
  handler: setCredentials
}
