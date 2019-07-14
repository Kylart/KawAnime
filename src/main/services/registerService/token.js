import { eventsList } from 'vendor'
import { anilist, kitsu } from '../../externals'
import { Logger } from '../../utils'

const events = eventsList.register.token
const logger = new Logger('Services [Access Token]')

const providers = {
  kitsu: kitsu.auth.setup.getAccessToken,
  anilist: anilist.auth.setup.saveToken
}

async function handler (event, data) {
  const { service } = data

  try {
    await providers[service](data)

    event.sender.send(events.success, service)
  } catch (e) {
    logger.error('Could not get access token.', e.stack)
    event.sender.send(events.error, { service, msg: e.message })
    throw new Error(`Unauthorized for ${service}.`)
  }
}

export default {
  eventName: events.main,
  handler
}
