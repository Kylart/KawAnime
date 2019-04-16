import { getResultsFromSearch, getInfoFromName, getInfoFromURL } from 'mal-scraper'

import { formatInfo } from './helpers'

async function searchTerm (term) {
  return getResultsFromSearch(term)
}

async function fromName (term) {
  try {
    const rawData = await getInfoFromName(term, false)

    return formatInfo(rawData)
  } catch (e) {
    throw e
  }
}

async function fromUrl (url) {
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
