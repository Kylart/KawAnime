const {si, pantsu} = require('nyaapi')
const malScraper = require('mal-scraper')
const {removeUnwanted, Logger} = require('../utils')
const logger = new Logger('Nyaa (Releases)')

const makeSearch = (data, res, isPantsu = false) => {
  let counter = 0
  const toReturn = []

  for (let i = 0; i < 18; ++i) {
    const realName = removeUnwanted(data[i].name)
    const name = realName.split(' ').slice(1).join(' ')
    const rawName = name.split(' ').slice(0, -3).join(' ')
    const researchName = rawName.split(' ').join('').toLowerCase()
    const ep = name.split(' ').splice(-2, 1)[0]
    const link = !isPantsu ? data[i].links.magnet : data[i].magnet

    malScraper.getInfoFromName(rawName)
      .then((item) => {
        item.rawName = rawName
        item.researchName = researchName
        item.magnetLink = link
        item.ep = ep

        toReturn[i] = item

        ++counter
        if (counter === 18) {
          logger.info('Sending Latest releases.')
          res.writeHead(200, {'Content-type': 'application/json'})
          res.write(JSON.stringify(toReturn))
          res.end()
        }
      }).catch(/* istanbul ignore next */(err) => {
        logger.error('An error occurred.', err)
        res.status(202).send()
      })
  }
}

const getLatest = ({query}, res) => {
  const {fansub, choice, quality} = query

  if (choice === 'si') {
    si.search(`[${fansub}] ${quality} -unofficial`, 18).then((data) => {
      makeSearch(data, res)
    }).catch(/* istanbul ignore next */(err) => {
      logger.error('An error occurred.', err)
      res.status(204).send()
    })
  } else {
    pantsu.search(`[${fansub}] ${quality}`, 18).then((data) => {
      makeSearch(data, res, true)
    }).catch(/* istanbul ignore next */(err) => {
      logger.error('An error occurred.', err)
      res.status(204).send()
    })
  }
}

module.exports = getLatest
