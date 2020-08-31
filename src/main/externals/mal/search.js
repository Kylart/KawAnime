import { search, getInfoFromName, getInfoFromURL } from 'mal-scraper'

import { formatInfo, formatSearch } from './helpers'

async function searchTerm (term) {
  const data = await search.search('anime', {
    term,
    maxResults: 10
  })

  return formatSearch(data.slice(0, 10))
}

async function fromName ({ name }) {
  const rawData = await getInfoFromName(name, false)

  return formatInfo(rawData)
}

async function fromUrl ({ url }) {
  const rawData = await getInfoFromURL(url)

  return formatInfo(rawData)
}

export default {
  searchTerm,
  fromName,
  fromUrl
}
