import { app } from 'electron'
import { Registry } from 'rage-edit'

const isProduction = process.env.NODE_ENV === 'production'
const appName = 'KawAnime'

// Setting up default protocol
if (isProduction) {
  if (process.platform === 'win32') {
    Promise.all([
      Registry.set(`HKCU\\Software\\${appName}\\Capabilities`, 'ApplicationName', `${appName}`),
      Registry.set(`HKCU\\Software\\${appName}\\Capabilities`, 'ApplicationDescription', `${appName}`),
      Registry.set(`HKCU\\Software\\${appName}\\Capabilities\\URLAssociations`, `kawanime-app`, `${appName}.kawanime-app`),
      Registry.set(`HKCU\\Software\\Classes\\${appName}.kawanime-app\\DefaultIcon`, ``, process.execPath),
      Registry.set(`HKCU\\Software\\Classes\\${appName}.kawanime-app\\shell\\open\\command`, ``, `"${process.execPath}" "%1"`),
      Registry.set(`HKCU\\Software\\RegisteredApplications`, `${appName}`, `Software\\${appName}\\Capabilities`)
    ])
      .catch(() => {})
  } else {
    app.setAsDefaultProtocolClient('kawanime-app')
  }
}
