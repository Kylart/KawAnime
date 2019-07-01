import { app } from 'electron'

const isProduction = process.env.NODE_ENV === 'production'
const isTest = process.env.IS_TEST === 'true'

// Setting up default protocol
if (isProduction && !isTest) {
  app.setAsDefaultProtocolClient(
    'kawanime-app',
    process.platform === 'darwin'
      ? undefined
      : app.getPath('exe')
  )
}
