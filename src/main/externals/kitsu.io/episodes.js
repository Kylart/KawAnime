import { https } from '../../utils'
import { BASE_URL } from './utils'
import { formatEps } from './helpers'

export default async function ({ name }) {
  const { included = [] } = await https.get(BASE_URL, [
    { name: 'filter[text]', value: name },
    { name: 'page[limit]', value: '1' },
    { name: 'include', value: 'episodes' }
  ])

  return formatEps(included.filter(({ type }) => type === 'episodes'))
}
