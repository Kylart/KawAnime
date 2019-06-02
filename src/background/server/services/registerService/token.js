import { eventsList } from '../../../../vendor'
import { anilist } from '../../externals'
import { Logger } from '../../utils'

const events = eventsList.register.token
const logger = new Logger('Services [Access Token]')

const providers = {
  anilist: anilist.auth.setup.getAccessToken
}

async function handler (event, { service, code }) {
  try {
    await providers[service](code)

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
