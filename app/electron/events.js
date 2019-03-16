const axios = require('axios')
const SERVER_PORT = require('../config').port

const onOpen = (e, torrentId) => {
  e.preventDefault()

  const { win } = process

  if (process.platform !== 'darwin') {
    torrentId = process.argv[1]
  }

  if (win) {
    axios.post(`http://localhost:${SERVER_PORT}/external`, {
      torrents: [ torrentId ]
    })
      .then(() => {
        setTimeout(() => {
          win.focus()
        }, 100)
      })
      .catch(() => {}) // Fail silently
  } else {
    process.startUp = {
      torrent: torrentId
    }
  }
}

module.exports = {
  onOpen
}
