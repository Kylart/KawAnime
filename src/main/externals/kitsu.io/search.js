import { https } from '../../utils'
import { BASE_URL } from './utils'

import { formatInfo, formatSearch } from './helpers'

async function searchTerm (term) {
  const { data } = await https.get(BASE_URL, [
    { name: 'filter[text]', value: term },
    { name: 'page[limit]', value: 10 }
  ])

  return formatSearch(data)
}

async function fromName ({ name }) {
  const { data } = await https.get(BASE_URL, [
    { name: 'filter[text]', value: name },
    { name: 'page[limit]', value: 1 }
  ])
  const info = await formatInfo(data)

  return info
}

export default {
  searchTerm,
  fromName
}
