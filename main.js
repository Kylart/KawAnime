const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, downloaderWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    titleBarStyle: 'hidden',
    show: false,
    title: 'KawAnime',
    vibrancy: 'dark',
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
