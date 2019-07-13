import { eventsList } from 'vendor'
import { mal } from '../../externals'
import { Logger } from '../../utils'

const events = eventsList.news

const logger = new Logger('News')

const providers = {
  mal: mal.news
}

async function news (event, { provider, number }) {
  try {
    if (!Object.keys(providers).includes(provider)) throw new Error('This provider is not handled.')

    const data = await providers[provider](number)

    logger.info('Successfully retrieved the news.')

    event.sender.send(events.success, data)
  } catch (e) {
    logger.error(`Could not retrieve news with provider ${provider}`)
    event.sender.send(events.error, e.message)
  }
}

export default {
  eventName: events.main,
  handler: news
}
