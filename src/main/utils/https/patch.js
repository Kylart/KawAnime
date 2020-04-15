import { request } from 'https'

import formUrl from './formUrl'
import Logger from '../logger'

const logger = new Logger('Http:Patch')

/**
 * Makes a PATCH request.
 *
 * @param {String} url Base URL endpoint
 * @param {Object | String} data Data to send along. Can be a JSON string
 * @param {[{ name: String, value: String }]} [params = []] List of parameter to use
 * @param {import('http').OutgoingHttpHeaders} [headers = {}] Headers to send with the request
 *
 * @returns {Promise<Object>}
 */
export default function (url, data, params = [], headers = {}) {
  return new Promise((resolve, reject) => {
    const _url = formUrl(url, params)
    const _data = typeof data === 'string' ? data : JSON.stringify(data)

    logger.info(`Sending to ${_url}`)

    const req = request(_url, {
      method: 'PATCH',
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

        resolve(result)
      })
    })

    req.on('error', (err) => reject(err))

    req.write(_data)
    req.end()
  })
}
