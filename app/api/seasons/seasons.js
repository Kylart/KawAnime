/**
 * Created by Kylart on 03/04/2017.
 */

const { getSeason } = require('mal-scraper')

const { Logger } = require('../utils')
const logger = new Logger('Mal-Scraper (Seasons)')

exports.getSeason = ({ query }, res) => {
  getSeason(query.year, query.season).then((data) => {
    logger.info(`Now having ${query.season} ${query.year}.`)

    const keys = Object.keys(data)

    keys.forEach((key) => {
      data[key].forEach((elem, index) => {
        data[key][index].key = Math.random()
      })
    })

    res.status(200).json(data)
  }).catch((err) => {
    logger.error('An error occurred.', err)
    res.status(204).send()
  })
}
