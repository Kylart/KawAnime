import { getWatchListFromUser } from 'mal-scraper'
import { formatList } from './helpers'

export default async function (username) {
  let result = []
  let offset = 0

  for (;;) {
    const data = await getWatchListFromUser(username, offset)

    if (data) {
      offset += data.length

      result = [...result, ...data]

      // MAL max page result is 300, so we look for the next entries
      // only if there are 300 entries.
      if (data.length !== 300) {
        break
      }
    } else {
      break
    }
  }

  return formatList(result)
}
