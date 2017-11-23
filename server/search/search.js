/**
 * Created by Kylart on 27/06/2017.
 */

const malScraper = require('mal-scraper')
const {Logger} = require('../utils')
const logger = new Logger('Search')

const searchTerm = ({query}, res) => {
  malScraper.getResultsFromSearch(query.term)
    .then((data) => res.send(data))
    .catch(/* istanbul ignore next */(err) => {
      logger.error('An error occurred', err)
      res.status(204).send()
    })
}

const fromName = (query, res) => {
  malScraper.getInfoFromName(query.term).then((data) => {
    res.type('application/json')
    res.status(200).send(JSON.stringify(data))
  }).catch(/* istanbul ignore next */(err) => {
    logger.error('An error occurred', err)
    res.status(204).send()
  })
}

const fromUrl = (query, res) => {
  malScraper.getInfoFromURL(query.url).then((data) => {
    res.type('application/json')
    res.status(200).send(JSON.stringify(data))
  }).catch(/* istanbul ignore next */(err) => {
    logger.error('An error occurred', err)
    res.status(204).send()
  })
}

module.exports = {
  searchTerm,
  fromName,
  fromUrl
}
