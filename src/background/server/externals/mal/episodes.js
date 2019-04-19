import { getEpisodesList, getInfoFromName } from 'mal-scraper'

export default async function ({ infoProvider, malId, id, name }) {
  try {
    if (infoProvider !== 'mal' && !malId) {
      const { id: _id, title } = await getInfoFromName(name, false)

      return getEpisodesList({ id: _id, name: title })
    }

    return getEpisodesList({ id: malId || id, name })
  } catch (e) {
    throw e
  }
}
