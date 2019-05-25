import { eventsList } from '../../../../vendor'
import { anilist, setupCreds } from '../../externals'
import { Logger } from '../../utils'

const events = eventsList.register.token
const logger = new Logger('Services [Access Token]')

const providers = {
  // kitsu: kitsu.watchLists,
  anilist: anilist.auth.setup.getAccessToken
}

async function handler (event, { service, code }) {
  try {
    const data = await providers[service](code)
    const now = (new Date()).getTime()

    logger.info(`Received token for ${service}.`)

    await setupCreds(service, {
      ...data,
      expiresAt: now + data.expiresIn
    })

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
