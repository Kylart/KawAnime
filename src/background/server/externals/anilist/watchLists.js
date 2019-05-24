import { graphql } from '../../utils'
import { watchLists } from './queries'
import { GRAPHQL_ENDPOINT } from './utils'
import { formatList } from './helpers'

async function get (username) {
  try {
    const { data } = await graphql(GRAPHQL_ENDPOINT, watchLists.get, { username })

    return formatList(data)
  } catch (e) {
    throw e
  }
}

async function update (opts) {
  return graphql(GRAPHQL_ENDPOINT, watchLists.update, opts)
}

export default {
  get,
  update
}
