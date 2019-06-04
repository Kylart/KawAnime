import { setupCreds } from '../../vault'
import { CODE_URL, TOKEN_URL, REDIRECT_URI } from '../utils'
import { https } from '../../../utils'
import { eventsList } from '../../../../../vendor'
import sendToWindows from '../../sendToWindows'

const clientId = process.env.VUE_APP_ANILIST_CLIENT_ID
const clientSecret = process.env.VUE_APP_ANILIST_CLIENT_SECRET

const codeUrl = [
  CODE_URL,
  '?',
  `redicrect_uri=${REDIRECT_URI}&`,
  'response_type=code&',
  `client_id=${clientId}`
].join('')

/**
 * Allows the creation / update of an access token.
 *
 * @param {object} args Credentials.
 * @param {string} token Token to use to authenticate the user (refresh token or not).
 * @param {boolean} isRefresh Whether or not to user the refresh_token grant type.
 */
async function getAccessToken ({ token }, isRefresh = false) {
  const data = await https.post(TOKEN_URL, {
    grant_type: isRefresh ? 'refresh_token' : 'authorization_code',
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: REDIRECT_URI,
    [isRefresh ? 'refresh_token' : 'code']: token
  }, [], {}, false)

  const now = (new Date()).getTime()
  const result = {
    expiresIn: data.expires_in * 1000,
    accessToken: data.access_token,
    tokenType: data.token_type,
    refreshToken: data.refresh_token
  }

  await setupCreds('anilist', {
    ...result,
    expiresAt: now + result.expiresIn
  })

  sendToWindows(eventsList.register.isAuthed.success, { service: 'anilist', value: true })

  return result
}

export default {
  getAccessToken,
  codeUrl
}
