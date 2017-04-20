/**
 * Created by Kylart on 20/04/2017.
 */

const fs = require('fs')
const {userInfo} = require('os')
const {join} = require('path')

exports.getLists = (url, res) => {
  const wlFile = require(join(userInfo().homedir, '.KawAnime', 'lists.json'))

  console.log(`[WatchList] Gathered lists from local.`)
  console.log(wlFile)

  res.writeHead(200, {"Content-Type": "application/json"})
  res.write(JSON.stringify(wlFile))
  res.end()
}