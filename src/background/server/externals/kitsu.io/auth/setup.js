import { setupCreds } from '../../vault'
import { TOKEN_URL } from '../utils'
import { https } from '../../../utils'
import { eventsList } from '../../../../../vendor'
import sendToWindows from '../../sendToWindows'

/**
 * Allows the creation / update of an access token.
 *
 * @param {string} token Token to use to get the access token.
 * @param {boolean} isRefresh Whether or not to user the refresh_token grant type.
 */
export default async function getAccessToken (token, isRefresh = false) {
  const data = await https.post(TOKEN_URL, {
    grant_type: isRefresh ? 'refresh_token' : 'password',
    [isRefresh ? 'refresh_token' : 'password']: token
  }, [], {}, false)

  const now = (new Date()).getTime()
  const result = {
    expiresIn: data.expires_in * 1000,
    accessToken: data.access_token,
    tokenType: data.token_type,
    refreshToken: data.refresh_token
  }

  await setupCreds('kitsu', {
    ...result,
    expiresAt: now + result.expiresIn
  })

  sendToWindows(eventsList.register.isAuthed.success, { service: 'anilist', value: true })

  return result
}
