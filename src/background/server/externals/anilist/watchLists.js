import { graphql } from '../../utils'
import { watchLists } from './queries'
import { GRAPHQL_ENDPOINT } from './utils'
import { formatList } from './helpers'

export default async function (username) {
  try {
    const { data } = await graphql(GRAPHQL_ENDPOINT, watchLists.get(username))

    return formatList(data)
  } catch (e) {
    throw e
  }
}
