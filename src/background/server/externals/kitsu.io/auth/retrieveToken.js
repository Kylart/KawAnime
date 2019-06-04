import setup from './setup'
import { getCreds } from '../../vault'

const properties = [
  'expiresAt',
  'accessToken',
  'tokenType',
  'refreshToken',
  'userId'
]

export default async function () {
  let {
    expiresAt,
    accessToken,
    tokenType,
    refreshToken,
    userId
  } = await getCreds('kitsu', properties)
  const now = (new Date()).getTime()

  // We refresh the token only when the expire date is
  // less than a day away.
  if (expiresAt - now < 24 * 60 * 60 * 1000) {
    const newData = await setup.getAccessToken({ token: refreshToken }, true)

    accessToken = newData.accessToken
    tokenType = newData.tokenType
  }

  return {
    accessToken,
    tokenType,
    userId
  }
}
