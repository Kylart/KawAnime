/**
 * Created by Kylart on 24/04/2017.
 */

const {join} = require('path')
const {writeFileSync} = require('fs')
const {userInfo} = require('os')
const qs = require('querystring')

const dir = join(userInfo().homedir, '.KawAnime')

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
  res.writeHead(200, {"Content-Type": "application/json"})
  res.write(JSON.stringify(historyFile))
  res.end()
}