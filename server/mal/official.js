const malScraper = require('mal-scraper')
const keytar = require('keytar')
const Api = malScraper.officialApi

let api

const getWatchList = (query, res) => {
  const {user} = query

  console.log('[MalScraper]: Looking for the watch lists of', user + '...')

  malScraper.getWatchListFromUser(user)
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      console.log('[MalScraper]: An error occurred while gathring watchLIst from user...', err)
      res.status(204).send()
    })
}

const checkCreds = (res) => {
  api.checkCredentials()
    .then((data) => res.status(data === 'Invalid credentials' ? 204 : 200).send())
    .catch((err) => {
      console.log('[MalScraper] (check): An error occurred...', err)
      res.status(204).send()
    })
}

const initOfficialApi = (req, res) => {
  req.on('data', (chunk) => {
    chunk = JSON.parse(chunk)

    keytar.getPassword('kawanime.mal', chunk.username)
      .then((pwd) => {
        api = new Api({
          username: chunk.username,
          password: pwd
        })

        checkCreds(res)
      })
      .catch(() => res.status(204).send())
  })
}

const resetCreds = (req, res) => {
  req.on('data', (chunk) => {
    chunk = JSON.parse(chunk)

    const {credentials} = chunk

    api.setCredentials(credentials)

    checkCreds(res)
  })
}

const actOnList = (req, res) => {
  req.on('data', (chunk) => {
    chunk = JSON.parse(chunk)

    const {type, opts, id} = chunk

    api.actOnList(type, id, opts)
      .then((data) => {
        console.log('[MalScraper] (Act on List):', data)
        res.status(data === 'Created' ? 200 : 204).send()
      })
      .catch((err) => {
        console.log('[MalScraper] (Act on List): An error occurrred', err)
        res.status(204).send()
      })
  })
}

module.exports = {
  getWatchList,
  initOfficialApi,
  resetCreds,
  actOnList
}
