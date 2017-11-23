const axios = require('axios')

const isOnline = async (req, res) => {
  try {
    const {status} = await axios.get('https://myanimelist.net')

    res.status(status === 200 ? 200 : 204).send()
  } catch (e) {
    res.status(204).send()
  }
}

module.exports = isOnline
