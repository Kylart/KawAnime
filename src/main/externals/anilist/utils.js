import { config } from 'vendor'

export const GRAPHQL_ENDPOINT = 'https://graphql.anilist.co'
export const CODE_URL = 'https://anilist.co/api/v2/oauth/authorize'
export const TOKEN_URL = 'https://anilist.co/api/v2/oauth/token'
export const REDIRECT_URI = 'kawanime-app://services?service=anilist'
export const CLIENT_ID = config.anilist.clientId

/**
 * Remove parenthesis groups from a string.
 * Because Anilist cannot handle them...
 *
 * @param {String} term
 */
export function removeParenthesis (term) {
  return term
    // Removes parenthesis groups
    .replace(/\s*\([^)]*\)\s*/g, '')
    .trim()
}
