import { search, getInfoFromName, getInfoFromURL } from 'mal-scraper'

import { formatInfo, formatSearch } from './helpers'

async function searchTerm (term) {
  try {
    const data = await search.search('anime', {
      term,
      maxResults: 10
    })

    return formatSearch(data.slice(0, 10))
  } catch (e) {
    throw e
  }
}

async function fromName (term) {
  try {
    const rawData = await getInfoFromName(term, false)

    return formatInfo(rawData)
  } catch (e) {
    throw e
  }
}

async function fromUrl ({ url }) {
  try {
    const rawData = await getInfoFromURL(url)

    return formatInfo(rawData)
  } catch (e) {
    throw e
  }
}

export default {
  searchTerm,
  fromName,
  fromUrl
}
