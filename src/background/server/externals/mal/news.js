import { getNewsNoDetails } from 'mal-scraper'

export default async function (number = 120) {
  return getNewsNoDetails(number)
}
