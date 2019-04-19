import { graphql } from '../../utils'
import { GRAPHQL_ENDPOINT } from './utils'
import { formatSeason } from './helpers'
import * as queries from './queries'

export default async function (year, season) {
  try {
    const { data } = await graphql(GRAPHQL_ENDPOINT, queries.seasons(year, season))

    return formatSeason(data)
  } catch (e) {
    throw e
  }
}
