import { eventsList } from 'vendor'
import sendToWindows from '../../sendToWindows'
import { setupCreds } from '../../vault'
import { CODE_URL, CLIENT_ID } from '../utils'

const codeUrl = [
  CODE_URL,
  '?',
  'response_type=token&',
  `client_id=${CLIENT_ID}`
].join('')

async function saveToken ({ accessToken, expiresIn, tokenType }) {
  await setupCreds('anilist', {
    accessToken,
    tokenType,
    expiresAt: Date.now() + (expiresIn * 1000)
  })

  sendToWindows(eventsList.register.isAuthed.success, { service: 'anilist', value: true })
}

export default {
  codeUrl,
  saveToken
}
