const get = (req, res) => {
  res.status(200).send({
    platform: process.platform,
    NODE_ENV: process.env.NODE_ENV
  })
}

module.exports = get
