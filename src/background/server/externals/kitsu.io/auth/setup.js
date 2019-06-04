import { setupCreds } from '../../vault'
import { TOKEN_URL } from '../utils'
import { https } from '../../../utils'
import { eventsList } from '../../../../../vendor'
import sendToWindows from '../../sendToWindows'

/**
 * Allows the creation / update of an access token.
 *
 * @param {object} args Credentials.
 * @param {string} token Needs to be given if `isRefresh` is `true`. This is the refresh token.
 * @param {string} username Username for the user to authenticate (email).
 * @param {string} password Password to authenticate the user.
 * @param {boolean} isRefresh Whether or not to user the refresh_token grant type.
 */
async function getAccessToken ({ token, username, password }, isRefresh = false) {
  const data = await https.post(TOKEN_URL, {
    grant_type: isRefresh ? 'refresh_token' : 'password',
    ...(
      isRefresh
        ? { refresh_token: token }
        : { username, password }
    )
  }, [], {}, false)

  const result = {
    expiresIn: data.expires_in * 1000,
    accessToken: data.access_token,
    tokenType: data.token_type,
    refreshToken: data.refresh_token
  }

  await setupCreds('kitsu', {
    ...result,
    expiresAt: (data.created_at * 1000) + result.expiresIn
  })

  sendToWindows(eventsList.register.isAuthed.success, { service: 'kitsu', value: true })

  return result
}

export default {
  getAccessToken
}
