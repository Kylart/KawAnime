/**
 * Created by Kylart on 04/03/2017.
 *
 * In this file, all the functions needed by the local page
 * are present. This is for cleaner code.
 *
 */

const self = this

// This will be later set with the config file
const downloadRep = 'Downloads'

const fs = require('fs')
const path = require('path')
const os = require('os')

const mal = require('malapi').Anime

const DIR = path.join(os.userInfo().homedir, downloadRep)

exports.filterFiles = (files, filters) => {
  let filteredFiles = []

  for (let filter in filters)
  {
    files.forEach((file) => {
      if (path.extname(file) === filters[filter])
        filteredFiles.push(file)
    })
  }

  return filteredFiles
}

exports.byProperty = (prop) => {
  return function (a, b) {
    if (typeof a[prop] == "number")
    {
      return (a[prop] - b[prop])
    }
    return ((a[prop] < b[prop]) ? -1 : ((a[prop] > b[prop]) ? 1 : 0))
  }
}

// This function works only if the file is named this way:
// [FANSUB] <NAME> <-> <EP_NUMBER> <EXTENSION_NAME>
exports.searchAnime = (filename, object) => {
  let epNumber = 0

  filename = filename.split(' ')
  for (let i = 0; i < 3; ++i) i === 1 ? epNumber = filename.pop()
                                      : filename.pop()

  filename = filename.slice(1).join(' ')

  let result = {
    title: filename,
    episode: epNumber
  }

  mal.fromName(filename).then((anime) => {
    result.picture = anime.image
    result.synopsis = anime.synopsis.slice(0, 200) + '...'
    result.numberOfEpisodes = anime.episodes.replace('Unknown', 'NC')
    result.status = anime.status
    result.year = anime.aired.split(' ')[2]
    result.genres = anime.genres.join(', ')
    result.classification = anime.classification
    result.mark = anime.statistics.score.value

    object.files.push(result)
    object.files.sort(self.byProperty('title'))
  })
}

exports.findFiles = (object) => {
  const allFiles = fs.readdirSync(DIR)

  const filteredFiles = self.filterFiles(allFiles, ['.mkv', '.mp4'])

  filteredFiles.forEach((file) => {
    self.searchAnime(file, object)
  })
}
