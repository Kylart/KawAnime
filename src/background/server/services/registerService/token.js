import { eventsList } from '../../../../vendor'
import { anilist, kitsu } from '../../externals'
import { Logger } from '../../utils'

const events = eventsList.register.token
const logger = new Logger('Services [Access Token]')

const providers = {
  kitsu: kitsu.auth.setup.getAccessToken,
  anilist: anilist.auth.setup.getAccessToken
}

async function handler (event, { service, code, email, username, password }) {
  try {
    await providers[service]({ token: code, username: service === 'kitsu' ? email : username, password })

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
