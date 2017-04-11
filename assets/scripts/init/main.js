/**
 * Created by Kylart on 03/04/2017.
 */

const path = require('path')
const URL = require('url-parse')

const {openExternal} = require('./openExternal.js')
const releases = require('./releases.js')
const seasons = require('./seasons.js')
const downloader = require('./downloader.js')

exports.route = (nuxt) => {
  return (req, res) => {
    const url = new URL(req.url)

    switch (url.pathname)
    {
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

      default:
        nuxt.render(req, res)
    }
  }
}

// Initiating files and directory
// Create the .KawAnime directory
const {userInfo} = require('os')
const BASE_PATH = userInfo().homedir
const dir = path.join(BASE_PATH, '.KawAnime')

if (!fs.existsSync(dir)) fs.mkdirSync(dir)

// Conf file
const confPath = path.join(dir, 'config.json')

const basicConf = {
  config: {
    fansub: 'HorribleSubs',
  quality: '720p',
  sound: 'Nyanpasu',
  localPath: join(userInfo().homedir, '.Download'),
  inside: true,
  magnets: false
  }
}

fs.writeFileSync(confPath, JSON.stringify(basicConf), 'utf-8')

// Local file
const animeLocalPath = path.join(dir, 'anime.json')
fs.writeFileSync(animeLocalPath, '', 'utf-8')

// List file
const listPath = path.join(dir, 'lists.json')
fs.writeFileSync(listPath, '', 'utf-8')
