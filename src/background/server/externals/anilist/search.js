import { graphql } from '../../utils'
import { GRAPHQL_ENDPOINT } from './utils'
import * as queries from './queries'

import { formatSearch } from './helpers'

async function searchTerm (term) {
  try {
    const { data } = await graphql(GRAPHQL_ENDPOINT, queries.search(term))

    return formatSearch(data)
  } catch (e) {
    throw e
  }
}

async function fromName ({ name }) {
  try {

  } catch (e) {
    throw e
  }
}

export default {
  searchTerm,
  fromName
}
