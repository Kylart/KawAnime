import { graphql } from '../../utils'
import { GRAPHQL_ENDPOINT, removeParenthesis } from './utils'
import * as queries from './queries'

import { formatSearch, formatInfo } from './helpers'

async function searchTerm (term) {
  const { data } = await graphql(GRAPHQL_ENDPOINT, queries.search, { term: removeParenthesis(term) })

  return formatSearch(data)
}

async function fromName ({ name }) {
  const { data } = await graphql(GRAPHQL_ENDPOINT, queries.info, { name: removeParenthesis(name) })

  return formatInfo(data)
}

export default {
  searchTerm,
  fromName
}
