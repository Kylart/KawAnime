/**
 * Created by Kylart on 01/03/2017.
 *
 * In this file, all the functions needed by the news page
 * are present. This is for cleaner code.
 *
 */

const self = this

const shell = require('electron').shell
const malScraper = require('mal-scraper')
const index = require('./index.js')

exports.getNews = (object) => {
  let tmp = malScraper.getNewsNoDetails(() => {
    console.log('News loaded.')
    object.news = tmp
  })
}

exports.openLink = (link) => {
  shell.openExternal(link)
}
