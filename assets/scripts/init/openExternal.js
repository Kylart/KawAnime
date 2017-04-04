/**
 * Created by Kylart on 04/04/2017.
 */

const shell = require('electron').shell
const qs = require('querystring')

exports.openExternal = (url, res) => {
  const query = qs.parse(url.query.replace('?', ''))

  const type = query.type
  console.log('Got a request for external open: type is ' + type)

  switch (type)
  {
    case 'dummy':
      shell.openExternal('http://hestia.dance')
      break

    case 'video':
      shell.openExternal(query.path)
      break

    default:
      break
  }

  res.writeHead(200, {})
  res.end()
}