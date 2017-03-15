/**
 * Created by Kylart on 01/03/2017.
 *
 * In this file, all the functions needed by the news page
 * are present. This is for cleaner code.
 *
 */

const self = this

// Will be set via configuration file.
const inside = true

const path = require('path')
const shell = require('electron').shell
const remote = require('electron').remote
const malScraper = require('mal-scraper')
const index = require('./index.js')
const {openANewsWindow} = remote.require(path.join(__dirname, '..', '..', 'main.js'))

exports.getNews = (object) => {
  let tmp = malScraper.getNewsNoDetails(() => {
    console.log('News loaded.')
    object.news = tmp
  })
}

exports.openLink = (link) => {
  inside ? openANewsWindow(link) : shell.openExternal(link)
}
