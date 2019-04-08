import { max, min } from 'lodash'

import { eventsList } from '../../../../vendor'
import { parseName as parse, engines } from '../../externals'
import { Logger } from '../../utils'

const logger = new Logger('Download')

const events = eventsList.download

function formatMagnets (data, searchData, feed) {
  const magnets = []
  const eps = []
  const isPantsu = feed === 'pantsu'

  data.forEach((elem) => {
    const parsed = Object.assign({}, parse(elem.name))
    const ep = parseInt(parsed.episodeOrMovieNumber)

    eps.push(ep)

    if (ep <= searchData.untilEp && ep >= searchData.fromEp) {
      magnets.push({
        name: parsed.title,
        link: isPantsu ? elem.magnet : elem.links.magnet,
        nb: ep,
        quality: parsed.resolution,
        fansub: parsed.releaseGroup
      })
    }
  })

  return {
    minEp: min(eps),
    maxEp: max(eps),
    magnets
  }
}

async function download (event, args) {
  try {
    const { feed } = args

    const searchData = {
      quality: args.quality || '',
      name: args.name || '',
      fansub: args.fansub.replace('None', '') || '',
      fromEp: args.fromEp || -Infinity,
      untilEp: args.untilEp || Infinity
    }

    logger.info('Received a download request. Feed is ' + feed, searchData)

    const engine = engines[feed]
    const term = `[${searchData.fansub}] ${searchData.quality.replace('p', '')} ${searchData.name}`

    const data = await engine.search(term)

    event.sender.send(events.success, { magnets: formatMagnets(data, searchData, feed), ...args })
  } catch (e) /* istanbul ignore next */ {
    logger.error('An error occurred.', e.stack)
    event.sender.send(events.error, e.message)
  }
}

export default {
  eventName: events.main,
  handler: download
}
