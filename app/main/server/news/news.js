/**
 * Created by Kylart on 11/04/2017.
 */

const {getNewsNoDetails} = require('mal-scraper')
const {Logger} = require('../utils')
const logger = new Logger('Mal-Scraper (News)')

/* istanbul ignore next */
const getNews = (req, res) => {
  getNewsNoDetails().then((news) => {
    logger.info('Finished gathering the news.')

    res.type('application/json')
    res.status(200).send(JSON.stringify(news))
  }).catch((err) => {
    logger.error('A problem occurred while gathering news.', err)

    res.type('application/json')
    res.status(204).send(JSON.stringify([]))
  })
}

module.exports = {
  getNews
}
