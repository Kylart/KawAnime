const malScraper = require('mal-scraper')
const { Logger } = require('../utils')
const logger = new Logger('Mal-Scraper')

const getWatchList = ({ query }, res) => {
  const { user } = query

  logger.info('Looking for the watch lists of ' + user + '...')

  malScraper.getWatchListFromUser(user)
    .then((data) => res.send(data.lists))
    .catch(/* istanbul ignore next */ (err) => {
      logger.error('An error occurred while gathering watchList from user.', err.message)
      res.status(204).send()
    })
}

module.exports = {
  getWatchList
}
