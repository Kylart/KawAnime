/**
 * Created by Kylart on 13/03/2017.
 *
 * In this file, all the functions needed by the releases page
 * are present. This is for cleaner code.
 *
 */

const self = this

const index = require('./index.js')

// Will be set by config
const fansub = 'HorribleSubs'  // I like HorribleSubs
const quality = '720p'

const path = require('path')
const Nyaa = require('node-nyaa-api')
const malScraper = require('mal-scraper')
const {loader} = require(path.join(__dirname, '..', 'renderer.js'))

exports.reduceString = (string, wanted) => {
  if (string.length > wanted)
    return string.substring(0, wanted) + ('...')
  return string
}

exports.byProperty = (prop) => {
  return function (a, b) {
    if (typeof a[prop] == "number")
    {
      return (a[prop] - b[prop])
    }
    return ((a[prop] < b[prop]) ? -1 : ((a[prop] > b[prop]) ? 1 : 0))
  }
}

exports.getLatest = () => {
  Nyaa.search(`[${fansub}] ${quality}`, (err, animes) => {
    if (err) throw err

    const latestReleases = []

    const nyaaReleases = animes
        .sort(self.byProperty("published"))
        .reverse()
        .slice(0, 18)

    let counter = 1

    nyaaReleases.forEach((release) => {
      const link = release.link
      const researchName = release.title.split(' ').slice(1, -3).join(' ')
      const name = release.title.split(' ').slice(1, -1).join(' ')

      let result = {
        title: name,
        researchName: researchName,
        realTitle: release.title,
        link: link,
        magnetLink: `${link}&magnet=1`,
        published: release.published
      }

      malScraper.getResultsFromSearch(researchName).then((items) => {
        return malScraper.getInfoFromURI(malScraper.getBestMatch(name, items))
      }).then((item) => {
        result.synopsis = item.synopsis
        result.reducedSynopsis = item.synopsis.length > 100
            ? item.synopsis.slice(0, 100) + '...'
            : item.synopsis
        result.picture = item.picture

        latestReleases.push(result)
        latestReleases.sort(self.byProperty('published')).reverse()

        ++counter
        if (counter === nyaaReleases.length)
        {
          if (loader.loader.show)
          {
            loader.loader.show = false
            index.releases.show = true
            console.log('Releases updated.')
          }

          index.releases.releases = latestReleases
        }
      })
    })
  })
}

self.getLatest()