import https from './https'
import Logger from './logger'

const logger = new Logger('Http:GraphQL')

/**
 * Makes a GraphQL request.
 *
 * @param {String} url Base URL endpoint
 * @param {String} query Query to send
 * @param {Object} variables Variables to send with the query
 * @param {[{ name: String, value: String }]} [params = []] List of parameter to use
 * @param {import('http').OutgoingHttpHeaders} [headers = {}] Headers to send with the request
 * @param {Boolean} [useCache = true] If you want the request response to be cached
 *
 * @returns {Promise<Object>}
 */
export default async function (url, query, variables, headers = {}, useCache = false) {
  try {
    const response = await https.post(url, {
      query,
      variables
    }, [], headers, useCache)

    if (response.errors) throw new Error(response.errors[0].message)

    return response
  } catch (e) {
    logger.error('Failed query', e)
    throw e
  }
}
