import { https } from '../../utils'
import { EPISODES_URL } from './utils'
import { formatEps } from './helpers'

export default async function ({ id }) {
  try {
    const { data } = await https.get(EPISODES_URL, [
      { name: 'filter[media_id]', value: id }
    ])

    return formatEps(data)
  } catch (e) {
    throw e
  }
}
