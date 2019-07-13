import { eventsList } from 'vendor'
import { mal, kitsu } from '../../externals'
import { Logger } from '../../utils'

const events = eventsList.episodes

const logger = new Logger('Episodes')

const providers = {
  mal: mal.episodes,
  kitsu: kitsu.episodes
}

async function episodes (event, { infoProvider, provider, id, name, malId }) {
  try {
    if (!Object.keys(providers).includes(provider)) throw new Error('This provider is not handled.')

    const data = await providers[provider]({ infoProvider, id, name, malId })

    logger.info(`Successfully retrieved episodes information for ${name}.`)

    event.sender.send(events.success, { name, data })
  } catch (e) {
    logger.error(`Could not retrieve episodes information for ${name} with provider ${provider}`)
    event.sender.send(events.error, { name, msg: e.message })
  }
}

export default {
  eventName: events.main,
  handler: episodes
}
