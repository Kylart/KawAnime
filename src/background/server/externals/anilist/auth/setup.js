import { CODE_URL, TOKEN_URL, REDIRECT_URI } from '../utils'
import { https } from '../../../utils'

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
 * @param {string} token Token to use to get the access token.
 * @param {boolean} isRefresh Whether or not to user the refresh_token grant type.
 */
async function getAccessToken (token, isRefresh = false) {
  const data = await https.post(TOKEN_URL, {
    grant_type: isRefresh ? 'refresh_token' : 'authorization_code',
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: REDIRECT_URI,
    [isRefresh ? 'refresh_token' : 'code']: token
  }, [], {}, false)

  return {
    expiresIn: data.expires_in * 1000,
    accessToken: data.access_token,
    tokenType: data.token_type,
    refreshToken: data.refresh_token
  }
}

export default {
  getAccessToken,
  codeUrl
}
