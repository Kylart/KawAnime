import { https } from '../../utils'
import { USERS_URL, LIST_URL } from './utils'
import { retrieveToken, isAuthed } from './auth'

import { formatList } from './helpers'

async function get (username) {
  const userData = await https.get(USERS_URL, [
    { name: 'filter[slug]', value: username }
  ])

  const { id: userId } = userData.data[0] // Hopefully we won't run into doubles

  const data = await https.get(LIST_URL, [
    { name: 'filter[user_id]', value: userId },
    { name: 'include', value: 'anime' },
    { name: 'page[limit]', value: '500' }
  ], {}, false)

  return formatList(data)
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
    await https.patch(`${LIST_URL}/${id}`, {
      data: {
        type: 'library-entries',
        id,
        attributes: data
      }
    }, [], headers)
  } else {
    await https.post(LIST_URL, {
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
