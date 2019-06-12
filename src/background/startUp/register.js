import { app } from 'electron'

const isProduction = process.env.NODE_ENV === 'production'

// Setting up default protocol
if (isProduction) {
  if (process.platform === 'win32') {
    app.setAsDefaultProtocolClient('kawanime-app', app.getPath('exe'))
  } else {
    app.setAsDefaultProtocolClient('kawanime-app')
  }
}
