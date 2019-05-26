import retrieveToken from './retrieveToken'
import { graphql } from '../../../utils'
import { GRAPHQL_ENDPOINT } from '../utils'
import { search } from '../queries'
import { setupCreds } from '../../vault'

export default async function () {
  try {
    const { accessToken, tokenType } = await retrieveToken()
    const hasToken = !!accessToken && !!tokenType

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
          refreshToken: '',
          expiresAt: ''
        })
          .catch((e) => {})

        return false
      }
    }

    return hasToken
  } catch (e) {
    return false
  }
}
