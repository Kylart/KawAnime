import { BrowserWindow } from 'electron'

import { sendToWindows } from './server/externals'
import { eventsList } from '../vendor'
import { Logger } from './server/utils'

const logger = new Logger('External Open')

export default function (e, args) {
  e && e.preventDefault()

  logger.info('Opening', args)

  sendToWindows(eventsList.externalOpen.success, Array.isArray(args) ? args : [args])

  setTimeout(BrowserWindow.getAllWindows()[0].focus, 100)
}
