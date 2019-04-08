'use strict'

import { join } from 'path'
import { stat, unlinkSync } from 'fs'
import { app, protocol, BrowserWindow, dialog, Menu, Tray } from 'electron'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'

import './startUp'
import './server'
import { dir } from './server/utils'
import { localFiles } from './server/externals'
import menuTemplate from './menu'

const isDevelopment = process.env.NODE_ENV !== 'production'
const baseConfig = localFiles.getFile('config.json')
const userConfig = baseConfig.config

const menu = Menu.buildFromTemplate(menuTemplate.menu)
const gotTheLock = app.requestSingleInstanceLock()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let tray

// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(['app'], { secure: true })

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: userConfig.bounds.width || 1200,
    height: userConfig.bounds.height || 800,
    x: userConfig.system.center
      ? null
      : userConfig.bounds.x,
    y: userConfig.system.center
      ? null
      : userConfig.bounds.y,
    center: userConfig.system.center || false,
    titleBarStyle: 'hidden',
    frame: process.platform === 'darwin',
    show: false
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.once('ready-to-show', () => {
    win.show()
  })

  win.on('close', () => {
    const bounds = win.getBounds()
    const config = localFiles.getFile('config.json')

    config.config.bounds = bounds

    localFiles.writeFile(config, 'config.json')
  })

  win.on('closed', () => {
    win = null
  })
}

// Disable error dialogs by overriding
dialog.showErrorBox = (title, content) => {
  console.log(`${title}\n${content}`)
}

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })

  app.on('ready', async () => {
    const currentSettings = app.getLoginItemSettings()
    Menu.setApplicationMenu(menu)

    if (userConfig.system.toTray) {
      if (process.platform === 'darwin') {
        app.dock.hide()
      }
      tray = new Tray('../assets/images/tray.png')
      const contextMenu = Menu.buildFromTemplate([
        {
          label: 'New window',
          click: () => {
            win === null
              ? createWindow()
              : win.show()
          },
          accelerator: 'CommandOrControl+N'
        },
        { label: 'Show current window', click: win.show },
        { label: 'Close current window', role: 'close', accelerator: 'CommandOrControl+W' },
        { type: 'separator' },
        { label: 'Quit', role: 'quit', accelerator: 'CommandOrControl+Q' }
      ])
      tray.setToolTip('The ultimate otaku software.')
      tray.setContextMenu(contextMenu)
    }

    if (userConfig.system.autoStart) {
      app.setLoginItemSettings({
        openAtLogin: true
      })
    } else {
      if (currentSettings.openAtLogin) {
        app.setLoginItemSettings({
          openAtLogin: false
        })
      }
    }

    if (isDevelopment && !process.env.IS_TEST) {
      // Install Vue Devtools
      try {
        await installVueDevtools()
      } catch (e) {
        console.error('Vue Devtools failed to install:', e.toString())
      }
    }

    createWindow()
  })

  // Quit when all windows are closed.
  app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      if (!tray) {
        app.quit()
      }
    }
  })
}

app.on('quit', () => {
  // We remove logs files every once in a while
  const filesToCheck = ['logs.log', 'error.log']

  filesToCheck.forEach((file) => {
    const filePath = join(dir, file)

    stat(filePath, (err, stats) => {
      if (!err) {
        const size = stats.size / 1000000.0

        if (size > 5) {
          unlinkSync(filePath)
        }
      }
    })
  })
})

app.on('activate', () => {
  win === null
    ? createWindow()
    : win.show()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
