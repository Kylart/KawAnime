import { https } from '../../utils'
import { LIST_URL } from './utils'

import { formatList } from './helpers'

export default async function (username) {
  try {
    const data = await https.get(LIST_URL, [
      { name: 'filter[name]', value: username },
      { name: 'include', value: 'libraryEntries,libraryEntries.anime' }
    ])

    return formatList(data)
  } catch (e) {
    throw e
  }
}
