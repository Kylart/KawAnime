import { eventsList } from 'vendor'
import { Logger } from '../../utils'
import { getCreds } from '../../externals'

const events = {
  get: eventsList.vault.get,
  has: eventsList.vault.has
}

const logger = new Logger('Vault (Get)')

async function getCredentials (event, { service, properties }) {
  try {
    const data = await getCreds({ service, properties })

    logger.info(`Successfully retrieved credentials for ${service}.`)

    event.returnValue = data
  } catch (e) {
    logger.error(`Could not retrieve credentials for ${service}.`)
    event.returnValue = { error: e.message }
  }
}

async function hasCredentials (event, { service, properties }) {
  try {
    const data = await getCreds(service, properties)
    const toSend = Object.keys(data).reduce((acc, key) => {
      return [
        ...acc,
        { key, value: data[key] }
      ]
    }, [])

    event.sender.send(events.has.success, { data: toSend, service })
  } catch (e) {
    logger.error(`Could not retrieve credentials for ${service}.`)
  }
}

export default [{
  eventName: events.get.main,
  handler: getCredentials
}, {
  eventName: events.has.main,
  handler: hasCredentials
}]
