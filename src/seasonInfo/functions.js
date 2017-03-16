/**
 * Created by Kylart on 01/03/2017.
 *
 * In this file, all the functions needed by the season page
 * are present. This is for cleaner code.
 *
 */

const self = this

const path = require('path')
const malScraper = require('mal-scraper')
const index = require('./index.js')
const {searchThisFrom} = require(path.join(__dirname, '..', 'infoPage', 'functions.js'))
const renderer = require(path.join(__dirname, '..', 'renderer.js'))

exports.reduceString = (string, wanted) => {
  if (string.length > wanted)
    return string.substring(0, wanted) + ('...')
  return string
}

exports.getCurrentSeason = () => {
  const date = new Date()

  // Get current year
  const year = 1900 + date.getYear()

  // Get current month
  const month = 1 + date.getMonth()   // I am a weak person that like 1-indexed things

  if (0 < month && month < 4)  // Winter
    return {season: 'winter', year: year}
  else if (3 < month && month < 7)  // Spring
    return {season: 'spring', year: year}
  else if (6 < month && month < 10)  // Summer
    return {season: 'summer', year: year}
  else if (9 < month && month < 13)  // Fall
    return {season: 'fall', year: year}
}

exports.fillSeason = (seasonalInfo) => {
  seasonalInfo.info.forEach((elem) => {
    switch (elem.type)
    {
      case 'TV':
        index.season.TVs.push(elem)
        break

      case 'ONA':
        index.season.ONAs.push(elem)
        break

      case 'OVA':
        index.season.OVAs.push(elem)
        break

      case 'Movie':
        index.season.Movies.push(elem)
        break

      case 'Special':
        index.season.Specials.push(elem)
        break

      default:
        break
    }
  })
}

exports.searchThis = (name) => {
  index.season.show = false
  renderer.loader.loader.show = true
  searchThisFrom("seasonInfo", name, () => {
    renderer.loader.loader.show = false
  })
}

exports.refresh = (year, season) => {
  let tmp = malScraper.getSeason(year, season, () => {
    index.season.TVs = []
    index.season.ONAs = []
    index.season.OVAs = []
    index.season.Specials = []
    index.season.Movies = []

    self.fillSeason(tmp)
    console.log(`Season loaded: ${year}, ${season}.`)
  })
}

// Init
let seasonalInfo = malScraper.getSeason(self.getCurrentSeason().year, self.getCurrentSeason().season, () => {
  self.fillSeason(seasonalInfo)
  console.log(`[INIT] Season loaded: ${self.getCurrentSeason().season} ${self.getCurrentSeason().year}`)
})