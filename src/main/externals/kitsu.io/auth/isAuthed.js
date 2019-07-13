import retrieveToken from './retrieveToken'

export default async function () {
  try {
    const { accessToken, tokenType } = await retrieveToken()
    return !!accessToken && !!tokenType
  } catch (e) {
    return false
  }
}
