import { request } from 'https'

import formUrl from './formUrl'
import Logger from '../logger'
import Cache from '../cache'

const logger = new Logger('Http:Post')
const cache = new Cache()

/**
 * Makes a POST request.
 *
 * @param {String} url Base URL endpoint
 * @param {Object | String} data Data to send along. Can be a JSON string
 * @param {[{ name: String, value: String }]} [params = []] List of parameter to use
 * @param {import('http').OutgoingHttpHeaders} [headers = {}] Headers to send with the request
 * @param {Boolean} [useCache = true] If you want the request response to be cached
 *
 * @returns {Promise<Object>}
 */
export default function (url, data, params = [], headers = {}, useCache = true) {
  return new Promise((resolve, reject) => {
    const _url = formUrl(url, params)
    const _data = typeof data === 'string' ? data : JSON.stringify(data)
    const cacheKey = [ _url, _data ].join('|')

    if (useCache && cache.has(cacheKey)) {
      logger.info('Retrieved info from cache!')
      resolve(cache.get(cacheKey))

      return
    }

    logger.info(`Sending to ${_url}`)

    const req = request(_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': _data.length,
        ...headers
      }
    }, (res) => {
      let response = ''

      res.setEncoding('utf8')

      res.on('data', (chunk) => { response += chunk })

      res.on('end', () => {
        if (res.statusCode >= 400) {
          return reject(new Error(`Request failed with code ${res.statusCode} - ${res.statusMessage}, ${response}`))
        }

        let result = response

        try {
          result = JSON.parse(response)
        } catch (e) {}

        // TODO: Handle redirections

        useCache && cache.set(cacheKey, result)
        resolve(result)
      })
    })

    req.on('error', (err) => reject(err))

    req.write(_data)
    req.end()
  })
}
