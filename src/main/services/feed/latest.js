import { eventsList } from 'vendor'
import { Logger } from '../../utils'
import { parseName as parse, engines } from '../../externals'

const logger = new Logger('Releases')

const events = eventsList.latest

async function getLatest (event, { feed, quality, term, fansub = '' }) {
  // This method will only return the raw feed from
  // the source, if a search must be done, it must be done
  // after receiving those data.
  fansub = fansub.replace('None', '')
    ? `[${fansub}]`
    : ''

  // Currently, feed can only be 'pantsu' or 'si'
  const query = [fansub, quality.replace('p', ''), term].join(' ')
  const engine = engines[feed]

  try {
    logger.info('Retrieving latest releases...')

    const result = (await engine.search(query, 150, { filter: '0', category: '1_0', sort: 'id', direction: 'desc' }))
      .map((elem) => ({
        ...elem,
        parsedName: parse(elem.name)
      }))

    logger.info('Sending latest releases.')

    event.sender.send(events.success, result)
  } catch (e) {
    logger.error('Error while getting the releases', e)

    event.sender.send(events.error, e.message)
  }
}

export default {
  eventName: events.main,
  handler: getLatest
}
