const vault = require('../vault')
const malScraper = require('mal-scraper')
const Api = malScraper.officialApi

const { Logger } = require('../utils')
const logger = new Logger('Mal-Scraper')

let api

const checkCreds = (res) => {
  api.checkCredentials()
    .then((data) => {
      const isError = data.includes('error')
      const isOk = data.includes(api._credentials.username)
      res.status(isOk ? 200 : isError ? 204 : 206).send()
    })
    .catch((err) => {
      logger.error('An error occurred while checking credentials.', err)
      res.status(204).send()
    })
}

const initOfficialApi = (req, res) => {
  req.on('data', (chunk) => {
    chunk = JSON.parse(chunk)

    vault.getCreds(chunk.service)
      .then((creds) => {
        api = new Api(creds)
        checkCreds(res)
      })
      .catch(() => res.status(204).send())
  })
}

const actOnList = (req, res) => {
  req.on('data', (chunk) => {
    chunk = JSON.parse(chunk)

    const { type, opts, id } = chunk

    api.actOnList(type, id, opts)
      .then((data) => {
        logger.info('(Act on List):' + data)
        res.status(typeof data === 'string' ? 200 : 204).send()
      })
      .catch((err) => {
        logger.error('(Act on List): An error occurred.', err)
        res.status(204).send()
      })
  })
}

module.exports = {
  initOfficialApi,
  actOnList
}
