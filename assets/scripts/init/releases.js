/**
 * Created by Kylart on 03/04/2017.
 */

const malScraper = require('mal-scraper')
const nyaa = require('nyaapi')

const {userInfo} = require('os')
const {join} = require('path')

const config = require(join(userInfo().homedir, '.KawAnime', 'config.json')).config

const fansub = config.fansub
const quality = config.quality

exports.byProperty = (prop) => {
  return function (a, b) {
    if (typeof a[prop] == "number")
    {
      return (a[prop] - b[prop])
    }
    return ((a[prop] < b[prop]) ? -1 : ((a[prop] > b[prop]) ? 1 : 0))
  }
}

exports.getLatest = (url, res) => {
  nyaa.searchTerm(`[${fansub}] ${quality}`, 18).then((result) => {
    console.log(`[Releases]: Fansub for research: ${fansub}. Quality is ${quality}.`)
    console.log(result.statMsg)

    let toReturn = []
    let counter = 0

    const releases = result.items

    for (let i = 0; i < 18; ++i)
    {
      const release = releases[i]

      const ep = release.title[0].split(' ').splice(-2)[0]
      const name = release.title[0].split(' ').slice(1, -3).join(' ')
      const researchName = name.split(' ').join('')
      const torrentLink = release.link[0]
      const magnetLink = torrentLink + '&magnet=1'
      const id = torrentLink.split('=')[2]
      const pubDate = release.pubDate[0]

      malScraper.getResultsFromSearch(name).then((items) => {
        return malScraper.getInfoFromURI(malScraper.getBestMatch(researchName, items))
      }).then((item) => {
        const picture = item.picture
        const fullSynopsis = item.synopsis
        const synopsis = item.synopsis.length > 170
            ? item.synopsis.slice(0, 175) + '...'
            : fullSynopsis

        toReturn[i] = {
          name: name,
          researchName: researchName,
          ep: ep,
          id: parseInt(id.replace(' ', '')),
          torrentLink: torrentLink,
          magnetLink: magnetLink,
          pubDate: pubDate,
          picture: picture,
          synopsis: synopsis,
          fullSynopsis: fullSynopsis
        }

        ++counter
        if (counter === 18)
        {
          toReturn.sort(toReturn.sort((a, b) => {
            return (a - b)
          }))

          // For some reason, first and second elements are not sorted. Swapping
          let tmp = toReturn[0]
          toReturn[0] = toReturn[1]
          toReturn[1] = tmp

          res.writeHead(200, {"Content-Type": "application/json"})
          res.write(JSON.stringify(toReturn))
          res.end()
        }
      }).catch((err) => {
          console.log(`[Releases]: An error occurred: ${err}.`)
      })
    }
  })
}