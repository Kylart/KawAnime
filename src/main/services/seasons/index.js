import { eventsList } from 'vendor'
import { mal, anilist } from '../../externals'
import { Logger } from '../../utils'

const events = eventsList.seasons

const logger = new Logger('Seasons')

const providers = {
  mal: mal.season,
  anilist: anilist.season
}

async function seasons (event, { provider, year, season }) {
  try {
    if (!Object.keys(providers).includes(provider)) throw new Error('This provider is not handled.')

    const data = await providers[provider](year, season)

    logger.info(`Successfully retrieved ${season} ${year}.`)

    event.sender.send(events.success, data)
  } catch (e) {
    logger.error(`Could not retrieve ${season} ${year} with provider ${provider}`)
    event.sender.send(events.error, e.message)
  }
}

export default {
  eventName: events.main,
  handler: seasons
}
