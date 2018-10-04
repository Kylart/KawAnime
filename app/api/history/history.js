/**
 * Created by Kylart on 24/04/2017.
 */

const { join } = require('path')
const { writeFileSync } = require('fs')

const { Logger, dir } = require('../utils')
const logger = new Logger('History')

const historyPath = join(dir, 'history.json')

const appendHistory = (req, res) => {
  // Date info
  const today = new Date()
  const day = today.toDateString()
  const time = today.toLocaleTimeString()

  // Getting history
  const historyFile = require(historyPath)

  req.on('data', (chunk) => {
    chunk = JSON.parse(chunk)

    // Preparing data to append to file
    const data = {
      time: time,
      type: chunk.type,
      text: chunk.text
    }

    // Checking if date already entered
    /* istanbul ignore next */
    if (!historyFile[day]) historyFile[day] = []

    // Appending data to file
    historyFile[day].unshift(data)

    // Writing file to history.json
    writeFileSync(historyPath, JSON.stringify(historyFile), 'utf-8')

    logger.info('New entry appended to history.')
  })

  res.status(200).send()
}

const getHistory = (req, res) => {
  // Getting history
  const historyFile = require(historyPath)

  res.status(200).json(historyFile)
}

const removeFromHistory = (req, res) => {
  req.on('data', (chunk) => {
    chunk = JSON.parse(chunk)

    // Getting history
    const historyFile = require(historyPath)

    const { date, info } = chunk

    historyFile[date] = historyFile[date].filter((elem) => {
      return elem.time !== info.time
    })

    // Writing file to history.json
    writeFileSync(historyPath, JSON.stringify(historyFile), 'utf-8')

    logger.info(`Removed an entry from the ${date}:`, info)
  })

  res.status(200).send()
}

module.exports = {
  appendHistory,
  getHistory,
  removeFromHistory
}
