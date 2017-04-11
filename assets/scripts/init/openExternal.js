/**
 * Created by Kylart on 04/04/2017.
 */

const {join} = require('path')

const shell = require('electron').shell
const qs = require('querystring')

exports.openExternal = (url, res) => {
  const query = qs.parse(url.query.replace('?', ''))

  const type = query.type
  console.log('[Open-External] Got a request for external open: type is ' + type)

  switch (type)
  {
    case 'dummy':
      shell.openExternal('http://hestia.dance')
      break

    case 'video':
      shell.openExternal(query.path)
      break

    case 'link':
      shell.openExternal(query.link)
      res.writeHead(200, {})
      res.end()
      break

    default:
      break
  }

  res.writeHead(200, {})
  res.end()
}