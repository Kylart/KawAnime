import { getCreds } from '../../vault'

const properties = [
  'expiresAt',
  'accessToken',
  'tokenType'
]

export default async function () {
  return getCreds('anilist', properties)
}
