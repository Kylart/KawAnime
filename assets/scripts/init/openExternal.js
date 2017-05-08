/**
 * Created by Kylart on 04/04/2017.
 */

const {join} = require('path')

const shell = require('electron').shell
const {dialog, BrowserWindow} = require('electron')
const fs = require('fs')
const qs = require('querystring')

const sendEmptyRes = (res) => {
  res.writeHead(200, {})
  res.end()
}

const sendRes = (res, data) => {
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.write(JSON.stringify(data))
  res.end()
}

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
      sendEmptyRes(res)
      break

    case 'link':
      shell.openExternal(query.link)
      sendEmptyRes(res)
      break

    case 'insideLink':
      const win = new BrowserWindow({
        parent: process.win,
        x: 50,
        y: 50,
        minimizable: false,
        maximizable: false,
        resizable: false
      })

      win.loadURL(query.link)
      break

    case 'delete':
      fs.unlink(join(query.dir, query.path), (err) => {
        if (err) throw err

        console.log('[Open-External] Deleted file successfully.')
      })
      sendEmptyRes(res)
      break

    case 'dialog':
      dialog.showOpenDialog({properties: ['openDirectory']}, (dirPath) => {
        if (dirPath !== undefined)
        {
          const result = {
            path: dirPath[0]
          }

          sendRes(res, result)
        }
      })
      break

    default:
      break
  }
}

exports.openInBrowser = (uri, res) => {
  shell.openExternal(uri)

  res.writeHead(200, {'Content-Type': 'application/json'})
  res.write(JSON.stringify({uri: uri}))
  res.end()
}
