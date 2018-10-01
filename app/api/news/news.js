/**
 * Created by Kylart on 11/04/2017.
 */

const { getNewsNoDetails } = require('mal-scraper')
const { Logger } = require('../utils')
const logger = new Logger('Mal-Scraper (News)')

const engines = {
  'mal': getNewsNoDetails
}

const getNews = ({ query: { feed } }, res) => {
  const engine = engines[feed]

  engine(120).then((news) => {
    logger.info('Successfully retrieved the news.')

    res.status(200).json(news)
  }).catch((err) => {
    logger.error('A problem occurred while gathering news.', err)

    res.status(204).send()
  })
}

module.exports = {
  getNews
}
