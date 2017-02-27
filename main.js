const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const shell = require('electron').shell
const path = require('path')
const url = require('url')
const fs = require('fs')
const os = require('os')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, downloaderWindow
const BASE_PATH = os.userInfo().homedir

function createWindow () {
  // Create the directory to download files
  const dir = path.join(BASE_PATH, '.KawAnime')

  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir)
  }

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 820,
    titleBarStyle: 'hidden',
    show: false,
    title: 'KawAnime',
    preload: 'https://unpkg.com/vue/dist/vue.js',
    scrollBounce: true
  })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

exports.openDownloader = () => {
  if(downloaderWindow != null)
    downloaderWindow.destroy()

  downloaderWindow = new BrowserWindow({
    width: 360,
    height: 480,
    x: 0, y: 0,
    resizable: false,
    maximizable: false,
    titleBarStyle: 'hidden',
    show: false,
    parent: mainWindow
  })

  downloaderWindow.once('ready-to-show', () => {
    downloaderWindow.show()
  })

  downloaderWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app', 'Downloader', 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  downloaderWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    downloaderWindow = null
  })
}

exports.getInfoPage = () => {
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app', 'InformationPage', 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
}

exports.getMainPage = () => {
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
}

exports.openTorrents = () => {
  const TORRENT_PATH = path.join(BASE_PATH, '.KawAnime')

  const tmpFiles = fs.readdirSync(TORRENT_PATH)

  tmpFiles.forEach( (elem) => {
    if (elem.split('.').pop() === 'torrent')
      shell.openItem(path.join(TORRENT_PATH, elem))
  })
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
