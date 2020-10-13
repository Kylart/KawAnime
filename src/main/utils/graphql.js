import { request, gql } from 'graphql-request'

export default async function (url, query, variables, headers = {}, useCache = false) {
  try {
    const data = await request(url, gql`${query}`, variables)

    return { data }
  } catch (e) {
    e.query = query
    e.variables = variables
    e.headers = headers
    e.url = url

    throw e
  }
}
