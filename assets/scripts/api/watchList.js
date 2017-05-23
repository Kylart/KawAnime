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

exports.saveWatchList = (req, res) => {
  req.on('data', (chunk) => {
    // Saving list
    fs.writeFileSync(wlPath, chunk, 'utf-8')

    console.log('[WatchList] Successfully saved lists.')

    res.writeHead(200, {})
    res.end()
  })
}

// TODO implement this in store, useless here1
const actOnList = (type, list, data) => {
  type === 'append'
    ? list = [...list, ...data] && list.sort()
    : list = list.filter((x) => { return x !== data })

  return list
}

exports.modifyList = (req, res) => {
  req.on('data', (chunk) => {
    chunk = JSON.parse(chunk)

    const wlFile = require(wlPath)
    const listName = chunk.listName

    // Acting accordingly on list
    wlFile[listName] = actOnList(chunk.query, wlFile[listName], chunk.data)

    // Saving list
    fs.writeFileSync(wlPath, JSON.stringify(wlFile), 'utf-8')

    console.log('[WatchList] Successfully saved lists.')

    res.writeHead(200, {})
    res.end()
  })
}
