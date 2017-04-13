/**
 * Created by Kylart on 04/04/2017.
 */

const {join} = require('path')

const shell = require('electron').shell
const fs = require('fs')
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
      shell.openItem(join(query.dir, query.path))
      break

    case 'link':
      shell.openExternal(query.link)
      break

    case 'delete':
      fs.unlink(join(query.dir, query.path), (err) => {
        if (err) throw err

        console.log('[Open-External] Deleted file successfully.')
      })
      break

    default:
      break
  }

  res.writeHead(200, {})
  res.end()
}