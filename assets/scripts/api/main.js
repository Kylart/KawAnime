/**
 * Created by Kylart on 03/04/2017.
 */

const fs = require('fs')
const {join} = require('path')
const URL = require('url-parse')

const {userInfo} = require('os')
const BASE_PATH = userInfo().homedir
/* istanbul ignore next */
const dir = process.env.NODE_ENV !== 'KawAnime-test'
  ? join(BASE_PATH, '.KawAnime')
  : join(BASE_PATH, '.KawAnime-test')

// Initiating files and directory
// Create the .KawAnime directory
const createDir = () => {
  /* istanbul ignore next */
  if (!fs.existsSync(dir)) fs.mkdirSync(dir)
}

const createConfig = () => {
  // Conf file
  const confPath = join(dir, 'config.json')

  /* istanbul ignore next */
  if (!fs.existsSync(confPath)) {
    console.log('No configuration file detected. Creating...')

    const basicConf = {
      config: {
        fansub: 'HorribleSubs',
        quality: '720p',
        sound: 'Nyanpasu',
        localPath: join(userInfo().homedir, 'Downloads'),
        inside: true,
        magnets: false
      }
    }

    fs.writeFileSync(confPath, JSON.stringify(basicConf), 'utf-8')
  }
}

// Local file
const createLocal = () => {
  const animeLocalPath = join(dir, 'locals.json')

  /* istanbul ignore next */
  if (!fs.existsSync(animeLocalPath)) {
    console.log('No anime local file detected. Creating...')

    fs.writeFileSync(animeLocalPath, '{}', 'utf-8')
  }
}

// List file
const createList = () => {
  const listPath = join(dir, 'lists.json')

  /* istanbul ignore next */
  if (!fs.existsSync(listPath)) {
    console.log('No anime list file detected. Creating...')

    const basicLists = {
      watchList: [],
      seen: [],
      watching: []
    }

    fs.writeFileSync(listPath, JSON.stringify(basicLists), 'utf-8')
  }
}

// History file
const createHistory = () => {
  const historyPath = join(dir, 'history.json')

  /* istanbul ignore next */
  if (!fs.existsSync(historyPath)) {
    console.log('No watch history file detected. Creating...')

    fs.writeFileSync(historyPath, '{}', 'utf-8')
  }
}

const {openExternal, openInBrowser} = require('./openExternal.js')
const seasons = require('./seasons.js')
const news = require('./news.js')
const local = require('./local.js')
const wl = require('./watchList.js')
const history = require('./history')
const horrible = require('./horrible.js')
const nyaa = require('./nyaa.js')

const route = (nuxt) => {
  createDir()
  createConfig()
  createLocal()
  createHistory()
  createList()

  return (req, res) => {
    const url = new URL(req.url)

    switch (url.pathname) {
      case '/getConfig.json':
        const configPath = join(dir, 'config.json')
        const configFile = JSON.parse(fs.readFileSync(configPath))

        res.writeHead(200, {'Content-Type': 'application/json'})
        res.write(JSON.stringify(configFile))
        res.end()
        break

      case '/getLatestNyaa':
        nyaa.getLatest(url, res)
        break

      case '/downloadNyaa':
        nyaa.download(url, res)
        break

      case '/getLatest.json':
        horrible.getLatest(url, res)
        break

      case '/getAllShows.json':
        horrible.getShowsList(res)
        break

      /* istanbul ignore next */
      case '/openThis':
        openExternal(url, res)
        break

      case '/seasons.json':
        seasons.getSeason(url, res)
        break

      case '/download':
        horrible.download(req, res)
        break

      case '/news.json':
        news.getNews(res)
        break

      case '/local.json':
        local.searchLocalFiles(url, res)
        break

      case '/watchList.json':
        wl.getLists(res)
        break

      case '/saveWatchList':
        wl.saveWatchList(req, res)
        break

      case '/resetLocal':
        local.resetLocal(url, res)
        break

      case '/appendHistory':
        history.appendHistory(url, res, req)
        break

      case '/getHistory':
        history.getHistory(res)
        break

      case '/saveConfig':
        req.on('data', (chunk) => {
          const data = JSON.parse(chunk)
          fs.writeFileSync(join(dir, 'config.json'), JSON.stringify(data))
          console.log('[Open-External]: Successfully saved config!')
        })
        res.writeHead(200, {})
        res.end()
        break

      /* istanbul ignore next */
      case '/_openInBrowser':
        openInBrowser(process.nuxtURL, res)
        break

      default:
        nuxt.render(req, res)
        break
    }
  }
}

module.exports = {
  route
}
