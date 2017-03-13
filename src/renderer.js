/**
 *
 * This file is the main one in the rendering process. Here we navigate
 * between the vue objects and set up most important functions.
 *
 */

const self = this

/* ------------------ IMPORTS ------------------ */

const remote = require('electron').remote
const main = remote.require('./main.js')
const fs = require('fs')
const os = require('os')
const path = require('path')

exports.lastPage = 'releases'

/* ----------------- END IMPORTS ----------------- */

/* ----------------- VUE CONFIG ----------------- */
const VueMaterial = require('vue-material')

Vue.use(VueMaterial)

Vue.material.registerTheme({
  default: {
    primary: 'white',
    accent: 'indigo',
    warn: 'deep-orange',
    background: 'white'
  },
  radio: {
    primary: 'white',
    accent: 'pink',
    warn: 'deep-orange',
    background: 'grey'
  },
  watchList: {
    primary: 'grey',
    accent: 'pink',
    warn: 'deep-orange',
    background: 'grey'
  }
})

/* -----------------  FUNCTIONS  ----------------- */

exports.setDownloaderBackground = () => {
  document.getElementsByClassName('mdl-layout__content')[0].style.backgroundImage = "url('./resources/downloader-back.jpg')"
  document.getElementsByClassName('mdl-layout__content')[0].style.backgroundSize = 'cover'
  document.getElementsByClassName('mdl-layout__content')[0].style.backgroundRepeat = 'no-repeat'
}

function disableDownloaderBackground() {
  document.getElementsByClassName('mdl-layout__content')[0].style.backgroundImage = "url('')"
}

function shutAllPages() {
  self.downloader.downloader.show = false
  self.info.infoPage.show = false
  self.loader.loader.show = false
  self.localPage.localPage.show = false
  self.news.news.show = false
  self.releases.releases.show = false
  self.season.season.show = false
  self.watchList.watchList.show = false
}

/* -------------------- END FUNCTIONS ----------------- */

/* ------------------- VUE.JS OBJECTS ----------------- */

exports.downloader = require(path.join(__dirname, 'downloader', 'index.js'))
exports.info = require(path.join(__dirname, 'infoPage', 'index.js'))
exports.loader = require(path.join(__dirname, 'loader', 'index.js'))
exports.localPage = require(path.join(__dirname, 'localPage', 'index.js'))
exports.news = require(path.join(__dirname, 'news', 'index.js'))
exports.releases = require(path.join(__dirname, 'releases', 'index.js'))
exports.season = require(path.join(__dirname, 'seasonInfo', 'index.js'))
exports.watchList = require(path.join(__dirname, 'watchList', 'index.js'))

const {searchThisFrom} = require(path.join(__dirname, 'infoPage', 'functions.js'))

// Vue object to open the other pages
new Vue({
  el: '.mdl-navigation',
  methods: {
    getDownloader: function () {
      shutAllPages()

      self.downloader.downloader.show = true

      self.lastPage = "downloader"

      self.setDownloaderBackground()
    },
    getMainPage: function () {
      shutAllPages()

      self.releases.releases.show = true

      self.lastPage = "releases"

      disableDownloaderBackground()
    },
    getLocalPage: function () {
      shutAllPages()

      self.localPage.localPage.show = true

      self.lastPage = "local"

      disableDownloaderBackground()
    },
    getNewsPage: function () {

      shutAllPages()

      self.news.news.show = true

      self.lastPage = "news"

      disableDownloaderBackground()
    },
    getSeasonPage: function () {
      shutAllPages()

      self.season.season.show = true

      self.lastPage = "seasonInfo"

      disableDownloaderBackground()
    },
    getWatchListPage: function () {
      shutAllPages()

      self.watchList.watchList.show = true

      self.lastPage = "watchList"

      disableDownloaderBackground()
    }
  }
})

// For the greeting's message
new Vue({
  el: '.greetings',
  data: {
    username: os.userInfo().username
  }
})

// Research button on top right
let searchButton = document.getElementById('fixed-header-drawer-exp')

searchButton.addEventListener('keydown', (key) => {
  if (key.keyCode === 13)
  {
    if (searchButton.value.length > 3)
    {
      shutAllPages()
      disableDownloaderBackground()
      self.loader.loader.show = true
      searchThisFrom(self.lastPage, searchButton.value.toString(), () => {
        self.loader.loader.show = false
      })
    }
    searchButton.value = ''
  }
})