import config from './config'
import feed from './feed'
import search from './search'
import history from './history'
import local from './local'
import news from './news'
import seasons from './seasons'
import episodes from './episodes'
import localLists from './localLists'
import torrent from './torrent'
import video from './video'
import isOnline from './isOnline'
import vault from './vault'

const services = [
  ...config,
  ...feed,
  ...search,
  ...history,
  ...local,
  ...localLists,
  ...torrent,
  ...vault,
  ...video,
  news,
  seasons,
  episodes,
  isOnline
]

// auto update
/* istanbul ignore next */
if (!['KawAnime-test', 'development'].includes(process.env.NODE_ENV)) {
  const updater = require('./updater').default
  services.push(updater)
}

export default services
