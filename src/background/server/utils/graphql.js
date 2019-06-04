import https from './https'

export default async function (url, query, variables, headers = {}, useCache = false) {
  try {
    const response = await https.post(url, {
      query,
      variables
    }, [], headers, useCache)

    if (response.errors) throw new Error(response.errors[0].message)

    return response
  } catch (e) {
    console.log('FAILED QUERY', query, variables, headers)
    throw e
  }
}
