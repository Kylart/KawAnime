import { eventsList } from 'vendor'
import { anilist, kitsu } from '../../externals'
import { Logger } from '../../utils'

const events = eventsList.watchLists.update

const logger = new Logger('Watch Lists (From Provider) [Update]')

const providers = {
  // mal: mal.watchLists,
  kitsu: kitsu.watchLists.update,
  anilist: anilist.watchLists.update
}

async function update (event, { service: provider, args }) {
  try {
    if (!Object.keys(providers).includes(provider)) throw new Error('This provider is not handled.')

    const data = await providers[provider](args)

    logger.info(`Successfully updated watch lists on ${provider}.`)

    event.sender.send(events.success, { service: provider, list: data })
  } catch (e) {
    logger.error(`Could not update watch lists with provider ${provider}`, e)
    event.sender.send(events.error, { service: provider, msg: e.message })
  }
}

export default {
  eventName: events.main,
  handler: update
}
