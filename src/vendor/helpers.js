import _ from 'lodash'
import electron from 'electron'

import eventsList from './events'

const { ipcRenderer: ipc, remote } = electron

ipc.setMaxListeners(200)

function log (...args) {
  console.log(`[${(new Date()).toLocaleTimeString()}]:`, ...args) // eslint-disable-line no-console
}

function setFullScreen (bool) {
  const win = remote.getCurrentWindow()

  win.setFullScreen(bool)
}

function openDialog (opts = {}) {
  return new Promise((resolve) => {
    remote.dialog.showOpenDialog({
      properties: opts.properties || ['openDirectory'],
      filters: opts.filters
    }, (dirPath) => {
      if (dirPath !== undefined) {
        const result = {
          path: dirPath.length === 1
            ? dirPath[0]
            : dirPath
        }

        resolve(result.path)
      } else {
        resolve(null)
      }
    })
  })
}

export default function (Vue) {
  Vue.prototype.$_ = _
  Vue.prototype.$ipc = ipc
  Vue.prototype.$electron = electron
  Vue.prototype.$eventsList = eventsList
  Vue.prototype.$log = log
  Vue.prototype.$setFullScreen = setFullScreen
  Vue.prototype.$openDialog = openDialog
}
