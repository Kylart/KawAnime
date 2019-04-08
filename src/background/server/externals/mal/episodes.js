import { getEpisodesList } from 'mal-scraper'

export default async function (info) {
  return getEpisodesList(info)
}
