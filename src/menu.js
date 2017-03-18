/**
 * Created by Kylart on 18/03/2017.
 */

const self = this

const path = require('path')
const electron = require('electron')
const app = require('electron').app
const url = require('url')
const BrowserWindow = electron.BrowserWindow

let preferencesWindow

let template = [
  {
    label: 'Edit',
    submenu: [
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'delete'
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        role: 'reload'
      },
      {
        role: 'forcereload'
      },
      {
        type: 'separator'
      },
      {
        role: 'resetzoom'
      },
      {
        role: 'zoomin'
      },
      {
        role: 'zoomout'
      },
      {
        type: 'separator'
      },
      {
        role: 'togglefullscreen'
      },
      {
        type: 'separator'
      },
      {
        label: 'Developpers',
        submenu: [
          {
            role: 'toggledevtools'
          }
        ]
      }
    ]
  },
  {
    role: 'window',
    submenu: [
      {
        role: 'minimize'
      },
      {
        role: 'close'
      }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { require('electron').shell.openExternal('https://github.com/Kylart/KawAnime') }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        label: 'Preferences',
        accelerator: 'Cmd+,',
        click: function () {
          self.openPreferences()
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  })
  // Edit menu.
  template[1].submenu.push(
      {
        type: 'separator'
      },
      {
        label: 'Speech',
        submenu: [
          {
            role: 'startspeaking'
          },
          {
            role: 'stopspeaking'
          }
        ]
      }
  )
  // Window menu.
  template[3].submenu = [
    {
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    },
    {
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    },
    {
      label: 'Zoom',
      role: 'zoom'
    },
    {
      type: 'separator'
    },
    {
      label: 'Bring All to Front',
      role: 'front'
    }
  ]
}

exports.template = template

// Preferences window
exports.openPreferences = () => {
  // Create the browser window.
  preferencesWindow = new BrowserWindow({
    x: 50,
    y: 50,
    width: 800,
    height: 500,
    minimizable: false,
    maximizable: false,
    frame: 'none',
    titleBarStyle: 'hidden'
  })

  // and load the index.html of the src.
  preferencesWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'preferences', 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  preferencesWindow.once('ready-to-show', () => {
    preferencesWindow.show()
  })

  // Emitted when the window is closed.
  preferencesWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your src supports multi windows, this is the time
    // when you should delete the corresponding element.
    preferencesWindow = null
  })
}