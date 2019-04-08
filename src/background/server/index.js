import { ipcMain } from 'electron'

import services from './services'
import { Logger } from './utils'

const logger = new Logger('Setup')
const isDev = process.env.NODE_ENV === 'development'

for (const { eventName, handler } of services) {
  isDev && logger.info(`Setting up ${eventName} event handler.`)

  ipcMain.on(
    eventName,
    handler
  )
}
