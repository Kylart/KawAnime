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
      localPath: join(userInfo().homedir, '.Download'),
      inside: true,
      magnets: false
      }
    }

  fs.writeFileSync(confPath, JSON.stringify(basicConf), 'utf-8')
}

// Local file
const animeLocalPath = join(dir, 'anime.json')

if (!fs.existsSync(animeLocalPath))
{
    console.log('No anime local file file detected. Creating...')

    fs.writeFileSync(animeLocalPath, '', 'utf-8')
}

// List file
const listPath = join(dir, 'lists.json')

if (!fs.existsSync(listPath))
{
  console.log('No anime list file detected. Creating...')

  fs.writeFileSync(listPath, '', 'utf-8')
}

const {openExternal} = require('./openExternal.js')
const releases = require('./releases.js')
const seasons = require('./seasons.js')
const downloader = require('./downloader.js')
const news = require('./news.js')

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

      case '/news.json':
        news.getNews(res)
        break

      default:
        nuxt.render(req, res)
    }
  }
}
