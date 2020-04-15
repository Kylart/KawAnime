import { get } from 'https'

import formUrl from './formUrl'
import Logger from '../logger'
import Cache from '../cache'

const logger = new Logger('Http:Get')
const cache = new Cache()

/**
 * Makes a GET request.
 *
 * @param {String} url Base URL endpoint
 * @param {[{ name: String, value: String }]} [params = []] List of parameter to use
 * @param {import('http').OutgoingHttpHeaders} [headers = {}] Headers to send with the request
 * @param {Boolean} [useCache = true] If you want the request response to be cached
 *
 * @returns {Promise<Object>}
 */
export default function (url, params = [], headers = {}, useCache = true) {
  return new Promise((resolve, reject) => {
    const _url = formUrl(url, params)

    if (useCache && cache.has(_url)) {
      logger.info(`Retrieved info from cache for ${_url}!`)
      resolve(cache.get(_url))

      return
    }

    logger.info(`Retrieving info from ${_url}`)

    get(_url, {
      headers
    }, (res) => {
      let data = ''

      if (res.statusCode >= 400) return reject(new Error(`Request failed with code ${res.statusCode} - ${res.statusMessage}`))

      // TODO: Handle redirection

      res.setEncoding('utf8')

      res.on('data', (chunk) => { data += chunk })

      res.once('end', () => {
        let result = data

        try {
          result = JSON.parse(data)
        } catch (e) {}

        useCache && cache.set(_url, result)
        resolve(result)
      })
    }).on('error', (err) => reject(err))
  })
}
