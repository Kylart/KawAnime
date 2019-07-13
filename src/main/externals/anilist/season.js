import { graphql } from '../../utils'
import { GRAPHQL_ENDPOINT } from './utils'
import { formatSeason } from './helpers'
import { seasons as query } from './queries'

export default async function (year, season) {
  try {
    const { data } = await graphql(
      GRAPHQL_ENDPOINT,
      query,
      { year, season: season.toUpperCase() }
    )

    return formatSeason(data)
  } catch (e) {
    throw e
  }
}
