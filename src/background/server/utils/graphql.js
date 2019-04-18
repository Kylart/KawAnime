import https from './https'

export default async function (url, query) {
  try {
    const response = await https.post(url, {
      query
    })

    if (response.errors) throw new Error(response.errors[0].message)

    return response
  } catch (e) {
    throw e
  }
}
