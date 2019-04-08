import { eventsList } from '../../../../vendor'
import { mal } from '../../externals'
import { Logger } from '../../utils'

const events = eventsList.watchLists

const logger = new Logger('Watch Lists (From Provider)')

const providers = {
  mal: mal.watchLists
}

async function seasons (event, { provider, user }) {
  try {
    if (!Object.keys(providers).includes(provider)) throw new Error('This provider is not handled.')

    const data = await providers[provider](user)

    logger.info(`Successfully retrieved ${user}'s watch lists.`)

    event.sender.send(events.success, data)
  } catch (e) {
    logger.error(`Could not retrieve ${user}'s watch lists with provider ${provider}`)
    event.sender.send(events.error, e.message)
  }
}

export default {
  eventName: events.main,
  handler: seasons
}
