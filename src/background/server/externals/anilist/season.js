import { getSeason } from 'mal-scraper'

export default async function (year, season) {
  try {
    const data = await getSeason(year, season)

    const keys = Object.keys(data)

    keys.forEach((key) => {
      data[key].forEach((elem, index) => {
        data[key][index].key = Math.random()
      })
    })

    return data
  } catch (e) {
    throw e
  }
}
