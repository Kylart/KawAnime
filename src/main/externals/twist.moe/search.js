import { BASE_URL, API_URL, DEFAULT_HEADERS, format } from './utils'
import decrypt from './decrypt'

import { Logger, https } from '../../utils'

const logger = new Logger('Twist.moe')

/**
 * @typedef {import('./types').Entry} Entry
 * @typedef {import('./types').FormattedEntry} FormattedEntry
 * @typedef {import('./types').RawEpisode} RawEpisode
 * @typedef {import('./types').FormattedEpisode} FormattedEpisode
 */

/**
 * Retrieves all the available entries from Twist.moe
 *
 * @returns {Promise<[FormattedEntry]>}
 */
export async function getAll () {
  try {
    /** @type {[Entry]} */
    const animes = await https.get(`${API_URL}/anime`, [], DEFAULT_HEADERS)
    const entries = animes.map(format)

    return entries
  } catch (e) {
    logger.error('Could not retrieve all anime.', e)
    return null
  }
}

/**
 * Returns a list of all the available episodes
 *
 * @param {Entry} entry Entry to get the episodes of
 *
 * @returns {[FormattedEpisode]}
 */
export async function getEpisodes (entry) {
  try {
    /** @type {[RawEpisode]} */
    const rawEps = await https.get(`${API_URL}/anime/${entry.slug.slug}/sources`, [], { ...DEFAULT_HEADERS, json: true })

    return rawEps
      .map(({ id, source, number }) => ({
        id,
        source,
        number,
        title: `${entry.title} - ${number}`,
        url: [BASE_URL, decrypt(source)].join('')
      }))
      .filter(({ url }) => url)
      .sort((a, b) => b.number - a.number)
  } catch (e) {
    logger.error('Could not retrieve anime episodes.', e)
    return null
  }
}
