import { ipcMain } from 'electron'

import { Logger } from '../utils'

import config from './config'
import feed from './feed'
import search from './search'
import history from './history'
import local from './local'
import news from './news'
import parseName from './parseName'
import preventSleep from './preventSleep'
import seasons from './seasons'
import episodes from './episodes'
import localLists from './localLists'
import torrent from './torrent'
import streaming from './streaming'
import isOnline from './isOnline'
import vault from './vault'
import watchLists from './watchLists'
import registerService from './registerService'
import analytics from './analytics'

const logger = new Logger('Setup')
const isDev = process.env.NODE_ENV === 'development'

const services = [
  ...config,
  ...feed,
  ...search,
  ...history,
  ...local,
  ...localLists,
  ...torrent,
  ...vault,
  ...streaming,
  ...registerService,
  ...watchLists,
  news,
  parseName,
  preventSleep,
  seasons,
  episodes,
  isOnline,
  analytics
]

// auto update
if (!['KawAnime-test', 'development'].includes(process.env.NODE_ENV)) {
  const updater = require('./updater').default
  services.push(updater)
}

for (const { eventName, handler } of services) {
  isDev && logger.info(`Setting up ${eventName} event handler.`)

  ipcMain.on(
    eventName,
    handler
  )
}
