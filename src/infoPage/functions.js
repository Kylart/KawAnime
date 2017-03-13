/**
 * Created by Kylart on 01/03/2017.
 *
 * In this file, all the functions needed by the info page
 * are present. This is for cleaner code.
 *
 */

const self = this

const path = require('path')
const mal = require('malapi').Anime
const renderer = path.join(__dirname, '..', 'renderer.js')
const index = require('./index.js')

exports.searchThisFrom = (lastPage, animeName, callback) => {
  renderer.lastPage = lastPage

  mal.fromName(animeName).then((anime) => {
    index.infoPage.infos.title = anime.title
    index.infoPage.infos.japTitle = anime.alternativeTitles.japanese[0].slice(10)
    index.infoPage.infos.image = anime.image
    index.infoPage.infos.synopsis = anime.synopsis
    index.infoPage.infos.episodes = anime.episodes
    index.infoPage.infos.studios = anime.studios
    index.infoPage.infos.stats = anime.statistics
    index.infoPage.infos.genres = anime.genres
    index.infoPage.infos.type = anime.type.split(' ').slice(0, 3).join(' ')
    index.infoPage.infos.characters = anime.characters
    index.infoPage.infos.staff = anime.staff
    index.infoPage.infos.aired = anime.aired
    index.infoPage.infos.status = anime.status

    index.infoPage.show = true

    callback()
  })
}
