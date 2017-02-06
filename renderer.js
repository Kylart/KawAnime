// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

/* ------------------ IMPORTS ------------------ */

const remote = require('electron').remote
const main = remote.require('./main.js')
const shell = require('electron').shell
const fs = require('fs')
const os = require('os')

// Those are needed to download the torrents
const path = require('path')
const request = require('request')
const findRemoveSync = require('find-remove')

// Mal API
const mal = require('malapi').Anime
// Nyaa API
const Nyaa = require('node-nyaa-api')
// Scraping the news from Mal
const malScraper = require('mal-scraper')

/* ----------------- END IMPORTS ----------------- */

const DIR = path.join(os.userInfo().homedir, '.KawAnime')

const VueMaterial = require('vue-material')

Vue.use(VueMaterial)

Vue.material.theme.register('default', {
  primary: 'white',
  accent: 'indigo',
  warn: 'deep-orange',
  background: 'grey'
})

/* -----------------  FUNCTIONS  ----------------- */

function reduceString(string, wanted) {
  if (string.length > wanted)
    return string.substring(0, wanted) + ('...')
  return string
}

// I like HorribleSubs
function horribleSubsFilter(name) {
  if ('[HorribleSubs]' === name.split(' ')[0]) {
    if ('[720p].mkv' === name.split(' ').reverse()[0])
      return true
  }
  return false
}

function getNameOnly(name) {
  let tmp = name.split(' ')
  tmp.pop()
  tmp.shift()
  return tmp.join(' ')
}

function getNameForResearch(name) {
  let tmp = getNameOnly(name).split(' ')
  tmp.pop()   // Episode number

  return tmp.join(' ')
}

function byProperty(prop) {
  return function (a, b) {
    if (typeof a[prop] == "number") {
      return (a[prop] - b[prop])
    }
    return ((a[prop] < b[prop]) ? -1 : ((a[prop] > b[prop]) ? 1 : 0))
  }
}

// Make the research for the latest animes
function getLatest() {
  let sorted = false

  Nyaa.search('[HorribleSubs]', function (err, animes) {
    // Initialize
    releases.releases = []
    releases.show = false
    loader.show = true
    if (err) throw err

    for (let anime in animes) {
      if (horribleSubsFilter(animes[anime].title)) {
        let tmp = animes[anime].title.split(' ')
        tmp.pop()   // Remove the extension
        tmp.pop()   // Remove the episode number
        tmp.shift() // Remove the Horrible Subs tag

        // Make the actual research
        try {
          mal.fromName(tmp.join(' ')).then(result => {
            releases.releases.push({
              realTitle: animes[anime].title,
              title: getNameOnly(animes[anime].title),
              link: animes[anime].link,
              synopsis: reduceString(result.synopsis, 100),
              picture: result.image,
              published: animes[anime].published
            })
          }).then(() => {
            if (releases.releases.length > 29) {
              releases.releases.sort(byProperty('published'))
              releases.releases.reverse()
              sorted = true
            }
          }).then(() => {
            // 35 elements is too much, reducing to 18
            if (sorted)
              while (releases.releases.length > 18)
                releases.releases.pop()
          }).then(() => {
            setTimeout(() => {
              if (loader.show) {
                loader.show = false
                releases.show = true
              }
            }, 1200)
          })
        }
        catch (e) {
          console.log("There was a 'Too many request' error.")
        }
      }
    }
  })
}

// Set a preference for
// -- Download torrent file (might have a problem when downloading several)
// -- Download magnet
function downloadFile(file_url, name) {
  let req = request({
    method: 'GET',
    uri: file_url
  })

  let out = fs.createWriteStream(path.join(DIR, `${name}.torrent`))
  req.pipe(out)
}

function startTorrent(file_url, name) {
  // Removing old torrents
  findRemoveSync(DIR, {extensions: ['.torrent']})

  // Downloading the new ones
  downloadFile(file_url, name)

  // Opening them
  main.openTorrents()
}

function makeResearchOnMal(name) {

  mal.fromName(name).then(anime => {
    info.infos.title = anime.title
    info.infos.japTitle = anime.alternativeTitles.japanese[0].slice(10)
    info.infos.image = anime.image
    info.infos.synopsis = anime.synopsis
    info.infos.episodes = anime.episodes
    info.infos.studios = anime.studios
    info.infos.stats = anime.statistics
    info.infos.genres = anime.genres
    info.infos.type = anime.type.split(' ').slice(0, 3).join(' ')
    info.infos.characters = anime.characters
    info.infos.staff = anime.staff
    info.infos.aired = anime.aired
    info.infos.status = anime.status

    releases.show = false
    loader.show = false
    info.display = 'block'
    info.show = true
  })
}

function getNews() {
  let tmp = malScraper.getNewsNoDetails(() => {
    news.news = tmp
  })
}

function getCurrentSeason() {
  const date = new Date()

  // Get current year
  const year = 1900 + date.getYear()

  // Get current month
  const month = 1 + date.getMonth()   // I am a weak person that like 1-indexed things

  if (0 < month && month < 4)  // Winter
    return {season: 'winter', year: year}
  else if (3 < month && month < 7)  // Spring
    return {season: 'spring', year: year}
  else if (6 < month && month < 10)  // Summer
    return {season: 'summer', year: year}
  else if (9 < month && month < 13)  // Fall
    return {season: 'fall', year: year}
}

function fillSeason(seasonalInfo) {
  seasonalInfo.info.forEach((elem) => {
    switch (elem.type) {
      case 'TV':
        season.TVs.push(elem)
        break

      case 'ONA':
        season.ONAs.push(elem)
        break

      case 'OVA':
        season.OVAs.push(elem)
        break

      case 'Movie':
        season.Movies.push(elem)
        break

      case 'Special':
        season.Specials.push(elem)
        break

      default:
        break
    }
  })
  season.infoWatcher = false
}

function setDownloaderBackground() {
  document.getElementsByClassName('mdl-layout__content')[0].style.backgroundImage = "url('./resources/downloader-back.jpg')"
  document.getElementsByClassName('mdl-layout__content')[0].style.backgroundSize = 'cover'
  document.getElementsByClassName('mdl-layout__content')[0].style.backgroundRepeat = 'no-repeat'
}

function disableDownloaderBackground() {
  document.getElementsByClassName('mdl-layout__content')[0].style.backgroundImage = "url('')"
}

function checkOnlyQuality(quality) {
  switch (quality)
  {
    case '480p':
      document.getElementsByName('720p')[0].click()
      document.getElementsByName('1080p')[0].click()

      break

    case '720p':
      document.getElementsByName('480p')[0].click()
      document.getElementsByName('1080p')[0].click()

      break

    case '1080p':
      document.getElementsByName('720p')[0].click()
      document.getElementsByName('480p')[0].click()

      break

    default:
      break
  }
}

/* -------------------- END FUNCTIONS ----------------- */

// First research at kawAnime's start
// getLatest()

// Getting the news in advance
getNews()

// Getting the current season's information
let seasonalInfo = malScraper.getSeason(getCurrentSeason().year, getCurrentSeason().season, () => {
  fillSeason(seasonalInfo)
})

/* ------------------- VUE.JS OBJECTS ----------------- */

let lastPage = 'release'

let downloader = new Vue({
  el: '.download-container',
  data: {
    show: false,
    display: "none",
    quality: ['720p']
  },
  methods: {
    download: function () {
      console.log(this.quality)
    }
  }
})

let releases = new Vue({
  el: '#releases',
  data: {
    releases: [],
    show: false,
    prefMagnets: true,
    styleButton: {
      minWidth: '0px',
      marginBottom: '0px',
      marginTop: '0px',
      marginLeft: '2px',
      marginRight: '2px'
    }
  },
  methods: {
    download: function (url, name) {
      if (!this.prefMagnets)
        startTorrent(url, name)
    },
    refresh: function () {
      getLatest()
    },
    searchThis: function (arg) {
      info.infos = {}
      this.show = false
      loader.show = true
      makeResearchOnMal(getNameForResearch(arg))

      disableDownloaderBackground()

      lastPage = 'release'
    }
  }
})

let loader = new Vue({
  el: '#loader-container',
  data: {
    show: true
  },
  methods: {
    test: function () {
      this.show = false
      releases.show = true
    }
  }
})

let info = new Vue({
  el: '#info-container',
  data: {
    infos: {
      stats: {
        score: {value: ''},
        ranking: ''
      }
    },
    display: 'none',
    show: false
  },
  methods: {
    downlaodThis: function () {

    },
    show: function () {
      this.display = 'block'
      this.show = true
    },
    hide: function () {
      this.show = false
    },
    back: function () {
      this.hide()
      switch (lastPage) {
        case 'release':
          releases.show = true
          break

        case 'season':
          season.show = true
          break

        default:
          break
      }

    }
  }
})

let news = new Vue({
  el: '#news-container',
  data: {
    show: false,
    news: [],
    display: 'none',
    buttonStyle: {
      position: 'absolute'
    }
  },
  methods: {
    openLink: function (link) {
      event.preventDefault()
      shell.openExternal(link)
    }
  }
})

let season = new Vue({
  el: '#season-info-container',
  data: {
    display: 'none',
    show: false,
    searching: false,
    season: getCurrentSeason().season,
    year: getCurrentSeason().year,
    infoWatcher: false,
    TVs: [],
    ONAs: [],
    OVAs: [],
    Movies: [],
    Specials: [],
    link: {
      marginTop: 0,
      marginBottom: 0,
      float: 'right'
    },
    scoreStyle: {
      margin: '0 0 0 0',
    },
    textStyle: {
      marginLeft: '35%',
      height: '50%'
    },
    synopsisStyle: {
      paddingRight: '0',
      textAlign: 'justify',
      paddingTop: '5px',
      height: '123.5px'
    },
    pictureStyle: {
      position: 'absolute',
      bottom: 0
    }
  },
  watch: {
    infoWatcher: function (bool) {
      if (bool) {
        this.TVs = []
        this.ONAs = []
        this.OVAs = []
        this.Movies = []
        this.Specials = []
        console.log("ERASED", this.TVs.length)
      }
    }
  },
  methods: {
    reduced: function (text, nb) {
      return reduceString(text, nb)
    },
    getGenres: function (genres) {
      let result = ''

      genres.forEach((elem) => {
        result += `${elem}, `
      })

      return result.slice(0, -2)
    },
    searchThis: function (arg) {
      info.infos = {}
      this.show = false
      loader.show = true
      makeResearchOnMal(arg)
      lastPage = 'season'

      disableDownloaderBackground()
    },
    getThisSeason: function (year, season) {
      this.infoWatcher = true
      console.log(`Looking for season ${season} ${year}.`)
      let newSeasonalInfo = malScraper.getSeason(year, season, function () {
        fillSeason(newSeasonalInfo)
      })
    }
  },
})

// Vue object to open the other pages
new Vue({
  el: '.mdl-navigation',
  methods: {
    getDownloader: function () {
      // Could be set in preferences ?
      // main.openDownloader()

      // First time
      if (downloader.display === "none")
        downloader.display = "block"

      setDownloaderBackground()

      setTimeout(() => {
        checkOnlyQuality(downloader.quality[0])
      }, 70)

      downloader.show = true
      releases.show = false
      news.show = false
      info.show = false
      season.show = false
      loader.show = false
    },
    getMainPage: function () {
      if (!loader.show) {
        releases.show = true
        news.show = false
        info.show = false
        season.show = false
        downloader.show = false
      }
    },
    getNewsPage: function () {
      // For first time
      if (news.display === 'none')
        news.display = 'block'

      releases.show = false
      news.show = true
      loader.show = false
      season.show = false
      info.show = false
      downloader.show = false

      disableDownloaderBackground()
    },
    getSeasonPage: function () {
      // For first time
      if (season.display === 'none')
        season.display = 'block'

      releases.show = false
      news.show = false
      loader.show = false
      season.show = true
      info.show = false
      downloader.show = false

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
  if (key.keyCode === 13) {
    info.show = false
    if (searchButton.value.length > 3) {
      releases.show = false
      news.show = false
      season.show = false
      downloader.show = false
      loader.show = true
      makeResearchOnMal(searchButton.value.toString())
    }
    searchButton.value = ''
  }
})