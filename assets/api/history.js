/**
 * Created by Kylart on 24/04/2017.
 */

const {join} = require('path')
const {writeFileSync} = require('fs')
const {userInfo} = require('os')

const dir = process.env.NODE_ENV !== 'KawAnime-test'
  /* istanbul ignore next */
  ? join(userInfo().homedir, '.KawAnime')
  : join(userInfo().homedir, '.KawAnime-test')

const historyPath = join(dir, 'history.json')

exports.appendHistory = (url, res, req) => {
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

    console.log(`[History]: New entry appended to history.`)
  })

  res.writeHead(200, {})
  res.end()
}

exports.getHistory = (res) => {
  // Getting history
  const historyFile = require(historyPath)

  // Sending response
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.write(JSON.stringify(historyFile))
  res.end()
}

exports.removeFromHistory = (req, res) => {
  req.on('data', (chunk) => {
    chunk = JSON.parse(chunk)

    // Getting history
    const historyFile = require(historyPath)

    const date = chunk.date
    const info = chunk.info

    historyFile[date] = historyFile[date].filter((elem) => {
      return elem.time !== info.time
    })

    // Writing file to history.json
    writeFileSync(historyPath, JSON.stringify(historyFile), 'utf-8')

    console.log(`[History]: Removed an entry from the ${date}:`, info)
  })

  res.writeHead(200)
  res.end()
}
