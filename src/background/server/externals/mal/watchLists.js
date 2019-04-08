import { getWatchListFromUser } from 'mal-scraper'

export default async function (username) {
  try {
    let result = []
    let offset = 0

    for (;;) {
      const data = await getWatchListFromUser(username, offset)

      if (data) {
        offset += data.length

        result = [ ...result, ...data ]
      } else {
        break
      }
    }

    return result
  } catch (e) {
    throw e
  }
}
