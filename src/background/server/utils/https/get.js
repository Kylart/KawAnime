import { get } from 'https'

import formUrl from './formUrl'
import Logger from '../logger'

const logger = new Logger('Http:Get')

export default function (url, params = [], headers = {}) {
  return new Promise((resolve, reject) => {
    const _url = formUrl(url, params)

    logger.info(`Retrieving info from ${_url}`)

    get(_url, {
      headers
    }, (res) => {
      let data = ''

      if (res.statusCode >= 400) return reject(new Error(`Request failed with code ${res.statusCode} - ${res.statusMessage}`))

      res.setEncoding('utf8')

      res.on('data', (chunk) => { data += chunk })

      res.once('end', () => resolve(JSON.parse(data)))
    }).on('error', (err) => reject(err))
  })
}
