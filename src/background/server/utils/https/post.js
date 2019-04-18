import { request } from 'https'

import formUrl from './formUrl'
import Logger from '../logger'

const logger = new Logger('Http:Post')

export default function (url, data, params = []) {
  return new Promise((resolve, reject) => {
    const _url = formUrl(url, params)
    const _data = typeof data === 'string' ? data : JSON.stringify(data)

    logger.info(`Sending to ${_url}`)

    const req = request(_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': _data.length
      }
    }, (res) => {
      let response = ''

      res.on('data', (chunk) => { response += chunk })

      res.on('end', () => {
        resolve(JSON.parse(response))
      })
    })

    req.on('error', (err) => reject(err))

    req.write(_data)
    req.end()
  })
}
