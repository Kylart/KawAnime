import { https } from '../../utils'
import { BASE_URL } from './utils'

import { formatInfo } from './helpers'

async function searchTerm (term) {
  try {
    const data = await https.get(BASE_URL, [{ name: 'filter[text]', value: term }])

    return data
  } catch (e) {
    throw e
  }
}

async function fromName (term) {
  try {
    const { data } = await https.get(BASE_URL, [{ name: 'filter[text]', value: term }])
    const info = await formatInfo(data[0])

    return info
  } catch (e) {
    throw e
  }
}

export default {
  searchTerm,
  fromName
}
