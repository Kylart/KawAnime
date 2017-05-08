/**
 * Created by Kylart on 20/04/2017.
 */

const fs = require('fs')
const {userInfo} = require('os')
const {join} = require('path')

const wlPath = join(userInfo().homedir, '.KawAnime', 'lists.json')

exports.getLists = (url, res) => {
  const wlFile = require(wlPath)

  console.log(`[WatchList] Gathered lists from local.`)

  res.writeHead(200, {'Content-Type': 'application/json'})
  res.write(JSON.stringify(wlFile))
  res.end()
}

exports.modifyWatchList = (req, res) => {
  req.on('data', (chunk) => {
    const wlFile = require(wlPath)

    if (chunk.query === 'append')
    {
      wlFile.watchList.push(chunk)

      fs.writeFileSync(wlPath, JSON.stringify(wlFile), 'utf-8')
    }
    else if (chunk.query === 'delete')
    {
      // TODO
    }

    res.writeHead(200, {})
    res.end()
  })
}

exports.modifySeen = (req, res) => {
  req.on('data', (chunk) => {
    const wlFile = require(wlPath)

    if (chunk.query === 'append')
    {
      wlFile.seen.push(chunk)

      fs.writeFileSync(wlPath, JSON.stringify(wlFile), 'utf-8')
    }
    else if (chunk.query === 'delete')
    {
      // TODO
    }

    res.writeHead(200, {})
    res.end()
  })
}

exports.modifyWatching = (req, res) => {
  req.on('data', (chunk) => {
    const wlFile = require(wlPath)

    if (chunk.query === 'append')
    {
      wlFile.watching.push(chunk)

      fs.writeFileSync(wlPath, JSON.stringify(wlFile), 'utf-8')
    }
    else if (chunk.query === 'delete')
    {
      // TODO
    }

    res.writeHead(200, {})
    res.end()
  })
}
