/**
 * Created by Kylart on 03/04/2017.
 */

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