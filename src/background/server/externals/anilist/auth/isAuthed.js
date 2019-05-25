import retrieveToken from './retrieveToken'

export default async function () {
  const data = await retrieveToken()

  return data.accessToken && data.tokenType
}
