import retrieveToken from './retrieveToken'
import { graphql } from '../../../utils'
import { GRAPHQL_ENDPOINT } from '../utils'
import { search } from '../queries'
import { setupCreds } from '../../vault'
import sendToWindows from '../../sendToWindows'
import { eventsList } from 'vendor'

const ONE_DAY = 1 * 24 * 60 * 60 * 1000

export default async function () {
  try {
    const { accessToken, tokenType, expiresAt = 0 } = await retrieveToken()
    const hasToken = !!accessToken && !!tokenType

    if (Date.now() + ONE_DAY > expiresAt) {
      // Token is expired, we'll ask the user to refresh it.
      sendToWindows(
        eventsList.register.cta.main,
        'Anilist account needs to be refreshed. Please register in the settings to re-enable Anilist!'
      )

      return
    }

    // Checking if that token if valid
    if (hasToken) {
      try {
        // Obviously we look for Sakura Trick since it's the best anime ever.
        await graphql(GRAPHQL_ENDPOINT, search, { term: 'Sakura Trick' }, {
          Authorization: `${tokenType.charAt(0).toUpperCase()}${tokenType.slice(1).toLowerCase()} ${accessToken}`
        })
      } catch (e) {
        // Means that the token is no longer valid, we'll just remove it.
        setupCreds('anilist', {
          accessToken: '',
          tokenType: '',
          expiresAt: 0
        })
          .catch((e) => {})

        sendToWindows(eventsList.register.isAuthed.success, { service: 'anilist', value: false })

        return false
      }
    }

    return hasToken
  } catch (e) {
    return false
  }
}
