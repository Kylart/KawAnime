/**
 * Created by Kylart on 04/04/2017.
 */

const {join} = require('path')

const {dialog, BrowserWindow, shell} = require('electron')

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
      sendEmptyRes(res)
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
      shell.moveItemToTrash(join(query.dir, query.path))
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

exports.openInBrowser = (res) => {
  shell.openExternal(process.appURL)
  process.win && process.platform === 'darwin'
    ? process.win.close()
    : process.win.minimize()

  res.status(200).send()
}
