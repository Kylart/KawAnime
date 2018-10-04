const { readFileSync } = require('fs')

const read = (path) => {
  return JSON.parse(readFileSync(path, 'utf-8'))
}

module.exports = read
