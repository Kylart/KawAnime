/**
 * Created by Kylart on 18/03/2017.
 */

const electron = require('electron')
const { app } = electron

const template = () => {
  let menu = [
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
          click () { electron.shell.openExternal('https://github.com/Kylart/KawAnime') }
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    menu.unshift({
      label: app.getName(),
      submenu: [
        {
          role: 'about'
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
    menu[1].submenu.pop() // Removing preferences from this part.
    menu[1].submenu.push(
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
    menu[3].submenu = [
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'hide'
      },
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
      {
        label: 'Maximize',
        accelerator: 'CmdOrCtrl+Shift+M',
        click: (item, window) => window.setFullScreen(!window.isFullScreen())
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

  return menu
}

exports.menu = template()
