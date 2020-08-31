import { graphql } from '../../utils'
import { watchLists } from './queries'
import { GRAPHQL_ENDPOINT } from './utils'
import { formatList } from './helpers'
import { isAuthed, retrieveToken } from './auth'

async function getHeaders () {
  const hasToken = await isAuthed()

  if (hasToken) {
    const { tokenType, accessToken } = await retrieveToken()

    return {
      Authorization: `${tokenType.charAt(0).toUpperCase()}${tokenType.slice(1).toLowerCase()} ${accessToken}`
    }
  }

  return {}
}

async function get (username) {
  const { data } = await graphql(
    GRAPHQL_ENDPOINT,
    watchLists.get,
    { username },
    await getHeaders(),
    false
  )

  return formatList(data)
}

async function update (opts) {
  return graphql(
    GRAPHQL_ENDPOINT,
    watchLists[opts.isDelete ? 'delete' : 'update'],
    opts,
    await getHeaders(),
    false
  )
}

export default {
  get,
  update
}
