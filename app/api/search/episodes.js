const { getEpisodesList } = require('mal-scraper')

const getEps = ({ query }, res) => {
  const { id, name } = query

  getEpisodesList({ name, id })
    .then((data) => res.json(data))
    .catch(() => res.status(204).send())
}

module.exports = {
  getEps
}
