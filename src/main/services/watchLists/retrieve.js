import { eventsList } from 'vendor'
import { mal, anilist, kitsu } from '../../externals'
import { Logger } from '../../utils'

const events = eventsList.watchLists.get

const logger = new Logger('Watch Lists (From Provider) [Get]')

const providers = {
  mal: mal.watchLists,
  kitsu: kitsu.watchLists.get,
  anilist: anilist.watchLists.get
}

async function lists (event, { service: provider, user }) {
  try {
    if (!Object.keys(providers).includes(provider)) throw new Error('This provider is not handled.')

    if (!user) {
      logger.info('No user, returning.')
      return
    }

    const data = await providers[provider](user)

    logger.info(`Successfully retrieved ${user}'s watch lists with ${provider}.`)

    event.sender.send(events.success, { service: provider, list: data })
  } catch (e) {
    logger.error(`Could not retrieve ${user}'s watch lists with provider ${provider}`, e)
    event.sender.send(events.error, { service: provider, msg: e.message })
  }
}

export default {
  eventName: events.main,
  handler: lists
}
