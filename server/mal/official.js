const vault = require('../vault')
const malScraper = require('mal-scraper')
const Api = malScraper.officialApi

let api

const getWatchList = (query, res) => {
  const {user} = query

  console.log('[Mal-Scraper]: Looking for the watch lists of', user + '...')

  malScraper.getWatchListFromUser(user)
    .then((data) => res.send(data))
    .catch((err) => {
      console.log('[Mal-Scraper]: An error occurred while gathring watchLIst from user...', err)
      res.status(204).send()
    })
}

const checkCreds = (res) => {
  api.checkCredentials()
    .then((data) => {
      const isOk = data.includes(api._credentials.username)
      res.status(isOk ? 200 : 206).send()
    })
    .catch((err) => {
      console.log('[Mal-Scraper]: (check): An error occurred...', err)
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

    const {type, opts, id} = chunk

    api.actOnList(type, id, opts)
      .then((data) => {
        console.log('[Mal-Scraper]: (Act on List):', data)
        res.status(typeof data === 'string' ? 200 : 204).send()
      })
      .catch((err) => {
        console.log('[Mal-Scraper]: (Act on List): An error occurrred', err)
        res.status(204).send()
      })
  })
}

module.exports = {
  getWatchList,
  initOfficialApi,
  actOnList
}
