/**
 * Created by Kylart on 05/03/2017.
 *
 * In this file, all the functions needed by the watchList page
 * are present. This is for cleaner code.
 *
 */

// This will later be set with config file.
const quality = '720p'
const fansub = 'HorribleSubs'

const os = require('os')
const path = require('path')
const fs = require('fs')

const Nyaa = require('node-nyaa-api')
const mal = require('malapi').Anime

const DIR = path.join(os.userInfo().homedir, '.KawAnime')
const listsPath = path.join(DIR, 'lists.json')

const self = this

exports.loadLists = (object) => {
  let lists = fs.readFileSync(listsPath, 'utf-8', (err) => {
    if (err) throw err
  })

  lists = JSON.parse(lists)

  object.seeing = lists.seeing
  object.seen = lists.seen
  object.watchList = lists.watchList
}

exports.saveLists = (object) => {
  let json = JSON.stringify({
    "seeing": object.seeing,
    "seen": object.seen,
    "watchList": object.watchList
  })

  fs.writeFileSync(listsPath, json, 'utf-8', (err) => {
    if (err) throw err
  })
}

exports.alreadyExists = (name, checkList) => {
  for (let i = 0; i < checkList.length; ++i)
    if (checkList[i] === name) return true

  return false
}

exports.addItem = (object, listName) => {
  // Here, the semi are needed!
  switch (listName)
  {
    case 'seeing':
      if (object.seeingEntry !== '' && !self.alreadyExists(object.seeingEntry, object.seeing))
      {
        object.seeing.push(object.seeingEntry);
        object.seeingEntry = '';
      }

      break

    case 'seen':
      if (object.seenEntry !== '' && !self.alreadyExists(object.seenEntry, object.seen))
      {
        object.seen.push(object.seenEntry);
        object.seenEntry = '';
      }

      break

    case 'watchList':
      if (object.watchListEntry !== '' && !self.alreadyExists(object.watchListEntry, object.watchList))
      {
        object.watchList.push(object.watchListEntry);
        object.watchListEntry = '';
      }

      break
  }
}

exports.downloadThis = (name) => {

}

exports.delItem = (object, name, listName) => {
  switch (listName)
  {
    case 'seeing':
      for (let i = 0; i < object.seeing.length; ++i)
        if (object.seeing[i] === name) object.seeing.splice(i, 1)

      break

    case 'seen':
      for (let i = 0; i < object.seen.length; ++i)
        if (object.seen[i] === name) object.seen.splice(i, 1)

      break

    case 'watchList':
      for (let i = 0; i < object.watchList.length; ++i)
        if (object.watchList[i] === name) object.watchList.splice(i, 1)

      break
  }
}

exports.downloadAnime = (name) => {
  mal.fromName(name).then((anime) => {
    Nyaa.search(`[${fansub}] ${quality} ${name}`, (err, animes) => {
      if (err) throw err

      animes.forEach((elem) => {
        window.open(`${elem.link}&magnet=1`)
      })
    })
  })
}