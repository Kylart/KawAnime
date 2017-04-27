/**
 * Created by Kylart on 03/04/2017.
 */

const fs = require('fs')
const {join} = require('path')
const URL = require('url-parse')

// Initiating files and directory
// Create the .KawAnime directory
const {userInfo} = require('os')
const BASE_PATH = userInfo().homedir
const dir = join(BASE_PATH, '.KawAnime')

if (!fs.existsSync(dir)) fs.mkdirSync(dir)

// Conf file
const confPath = join(dir, 'config.json')

if (!fs.existsSync(confPath))
{
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

// Local file
const animeLocalPath = join(dir, 'locals.json')

if (!fs.existsSync(animeLocalPath))
{
  console.log('No anime local file file detected. Creating...')

  fs.writeFileSync(animeLocalPath, '{}', 'utf-8')
}

// List file
const listPath = join(dir, 'lists.json')

if (!fs.existsSync(listPath))
{
  console.log('No anime list file detected. Creating...')

  const basicLists = {
    watchList: [],
    seen: [],
    watching: []
  }

  fs.writeFileSync(listPath, JSON.stringify(basicLists), 'utf-8')
}

// History file
const historyPath = join(dir, 'history.json')

if (!fs.existsSync(historyPath))
{
  console.log('No watch history file detected. Creating...')

  fs.writeFileSync(historyPath, '{}', 'utf-8')
}

const {openExternal} = require('./openExternal.js')
const releases = require('./releases.js')
const seasons = require('./seasons.js')
const downloader = require('./downloader.js')
const news = require('./news.js')
const local = require('./local.js')
const wl = require('./watchList.js')
const history = require('./history')

exports.route = (nuxt) => {
  return (req, res) => {
    const url = new URL(req.url)

    switch (url.pathname)
    {
      case '/getConf':
        const configPath = join(dir, 'config.json');
        const configFile = JSON.parse(fs.readFileSync(configPath));

        res.writeHead(200, {"Content-Type": "application/json"});
        res.write(JSON.stringify(configFile));
        res.end();
        break

      case '/openThis':
        openExternal(url, res)
        break

      case '/seasons.json':
        seasons.getSeason(url, res)
        break

      case '/releases.json':
        releases.getLatest(url, res)
        break

      case '/download':
        downloader.download(url, res)
        break

      case '/news.json':
        news.getNews(res)
        break

      case '/local.json':
        local.getLocalFiles(url, res)
        break

      case '/watchList.json':
        wl.getLists(url, res)
        break

      case '/resetLocal':
        local.resetLocal(res)
        break

      case '/appendHistory':
        history.appendHistory(url, res)
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
        res.writeHead(200, {});
        res.end();
        break

      default:
        nuxt.render(req, res)
    }
  }
}
