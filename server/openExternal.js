/**
 * Created by Kylart on 04/04/2017.
 */

const {join} = require('path')

const {dialog, BrowserWindow, shell} = require('electron')
const fs = require('fs')

const sendEmptyRes = (res) => {
  res.status(200).send()
}

const sendRes = (res, data) => {
  res.type('application/json')
  res.status(200).send(JSON.stringify(data))
}

exports.openExternal = (query, res) => {
  const type = query.type
  console.log('[Open-External] Got a request for external open: type is ' + type)

  switch (type) {
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
        if (dirPath !== undefined) {
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
  if (process.win) process.win.close()

  res.type('application/json')
  res.status(200).send(JSON.stringify({uri: uri}))
}
