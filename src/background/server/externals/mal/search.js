import { getResultsFromSearch, getInfoFromName, getInfoFromURL } from 'mal-scraper'

async function searchTerm (term) {
  return getResultsFromSearch(term)
}

async function fromName (term) {
  return getInfoFromName(term, false)
}

async function fromUrl (url) {
  return getInfoFromURL(url)
}

export default {
  searchTerm,
  fromName,
  fromUrl
}
