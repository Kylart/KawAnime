const axios = require('axios')

const targets = [
  'myanimelist.net',
  'nyaa.si',
  'google.com'
]

const checkOnline = (req, res) => {
  targets.forEach((target) => {
    axios.get(`https://${target}`)
      .then(({ status }) => {
        if (res) {
          if (status === 200) {
            res.send()
            res = null
          }
        }
      })
      .catch(() => {
        if (res) res.status(204).send()
      })
  })
}

module.exports = checkOnline
