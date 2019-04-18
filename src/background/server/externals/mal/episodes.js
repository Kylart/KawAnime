import { getEpisodesList, getInfoFromName } from 'mal-scraper'

export default async function ({ infoProvider, id, name }) {
  try {
    if (infoProvider !== 'mal') {
      const { id: _id, title } = await getInfoFromName(name, false)

      return getEpisodesList({ id: _id, name: title })
    }

    return getEpisodesList({ id, name })
  } catch (e) {
    throw e
  }
}
