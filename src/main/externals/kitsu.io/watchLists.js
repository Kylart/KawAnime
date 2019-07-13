import { https } from '../../utils'
import { LIST_URL, UPDATE_LIST_URL } from './utils'
import { retrieveToken, isAuthed } from './auth'

import { formatList } from './helpers'

async function get (username) {
  try {
    const data = await https.get(LIST_URL, [
      { name: 'filter[name]', value: username },
      { name: 'include', value: 'libraryEntries,libraryEntries.anime' }
    ], {}, false)

    return formatList(data)
  } catch (e) {
    throw e
  }
}

async function update (opts) {
  const hasToken = await isAuthed()

  if (!hasToken) throw new Error('Unauthorized.')

  const { accessToken, tokenType, userId } = await retrieveToken()
  const { isEdit, id, data } = opts

  const headers = {
    Authorization: `${tokenType.charAt(0).toUpperCase()}${tokenType.slice(1).toLowerCase()} ${accessToken}`,
    'Content-Type': 'application/vnd.api+json'
  }

  if (isEdit) {
    await https.patch(`${UPDATE_LIST_URL}/${id}`, {
      data: {
        type: 'library-entries',
        id,
        attributes: data
      }
    }, [], headers)
  } else {
    await https.post(UPDATE_LIST_URL, {
      data: {
        type: 'library-entries',
        attributes: data,
        relationships: {
          anime: {
            data: {
              type: 'anime',
              id
            }
          },
          user: {
            data: {
              type: 'users',
              id: userId
            }
          }
        }
      }
    }, [], headers, false)
  }
}

export default {
  get, update
}
