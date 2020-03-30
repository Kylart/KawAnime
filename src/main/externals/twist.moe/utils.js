/**
 * @typedef {import('./types').Entry} Entry
 * @typedef {import('./types').FormattedEntry} FormattedEntry
 * @typedef {import('./types').RawEpisode} RawEpisode
 * @typedef {import('./types').FormattedEpisode} FormattedEpisode
 */

// Can be found somewhere here: https://github.com/vn-ki/anime-downloader/blob/master/anime_downloader/sites/twistmoe.py
export const DECRYPT_KEY = 'LXgIVP&PorO68Rq7dTx8N^lP!Fa5sGJ^*XK'
export const DEFAULT_HEADERS = {
  'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.46 Safari/537.36',
  'x-access-token': '1rj2vRtegS8Y60B3w3qNZm5T2Q0TN2NR'
}

export const BASE_URL = 'https://twist.moe'
export const API_URL = `${BASE_URL}/api`

/**
 * Convert a simple entry parameters to camelCase
 *
 * @param {Entry} entry
 * @returns {FormattedEntry}
 */
export function format (entry) {
  return {
    ...entry,
    altTitle: entry.alt_title,
    hbTitle: entry.hb_title,
    malTitle: entry.mal_title,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
    slug: {
      ...entry.slug,
      animeId: entry.slug.anime_id,
      createdAt: entry.slug.createdAt,
      updatedAt: entry.slug.updatedAt
    }
  }
}
