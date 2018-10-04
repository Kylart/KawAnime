/**
 * Created by Kylart on 04/04/2017.
 */

const { dialog, BrowserWindow, shell } = require('electron')
const { Logger } = require('../utils')
const logger = new Logger('Open-External')

const sendEmptyRes = (res) => {
  res.status(200).send()
}

const sendRes = (res, data) => {
  res.type('application/json')
  res.status(200).send(JSON.stringify(data))
}

const openExternal = ({ query }, res) => {
  const type = query.type
  logger.info('Got a request for external open of a ' + type)

  switch (type) {
    case 'video':
      shell.openItem(query.path)
      sendEmptyRes(res)
      break

    case 'link':
      shell.openExternal(query.link)
      sendEmptyRes(res)
      break

    case 'inside':
      sendEmptyRes(res)
      const win = new BrowserWindow({
        webPreferences: {
          nodeIntegration: false
        },
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
      shell.moveItemToTrash(query.path)
      sendEmptyRes(res)
      break

    case 'dialog':
      dialog.showOpenDialog({ properties: ['openDirectory'] }, (dirPath) => {
        if (dirPath !== undefined) {
          const result = {
            path: dirPath[0]
          }

          sendRes(res, result)
        } else {
          sendEmptyRes(res)
        }
      })
      break

    default:
      sendEmptyRes(res)
      break
  }
}

const openInBrowser = (req, res) => {
  shell.openExternal(process.appURL)
  process.win && process.platform === 'darwin'
    ? process.win.hide()
    : process.win.minimize()

  res.status(200).send()
}

module.exports = {
  openInBrowser,
  openExternal
}
