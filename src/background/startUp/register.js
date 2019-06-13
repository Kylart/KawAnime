import { app } from 'electron'

const isProduction = process.env.NODE_ENV === 'production'

// Setting up default protocol
if (isProduction) {
  app.setAsDefaultProtocolClient(
    'kawanime-app',
    process.platform === 'darwin'
      ? undefined
      : app.getPath('exe')
  )
}
