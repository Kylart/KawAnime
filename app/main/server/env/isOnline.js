const isOnline = require('is-online')

const checkOnline = (req, res) => {
  isOnline().then((online) => {
    res.status(online ? 200 : 204).send()
  })
}

module.exports = checkOnline
