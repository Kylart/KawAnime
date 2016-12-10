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

/* -----------------  FUNCTIONS  ----------------- */

function reduceString(string) {
    if (string.length > 100)
        return string.substring(0, 100) + ('...')
    return string
}

// I like HorribleSubs
function horribleSubsFilter(name) {
    if ('[HorribleSubs]' === name.split(' ')[0])
    {
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
    return function(a, b) {
        if (typeof a[prop] == "number") {
            return (a[prop] - b[prop])
        }
        return ((a[prop] < b[prop]) ? -1 : ((a[prop] > b[prop]) ? 1 : 0))
    }
}

// Make the research for the latest animes
function getLatest () {
    let sorted = false

    Nyaa.search('[HorribleSubs]', function (err, animes) {
        // Initialize
        releases.releases = []
        releases.show = false
        loader.show = true
        if (err) throw err

        for(let anime in animes)
        {
            if (horribleSubsFilter(animes[anime].title))
            {
                let tmp = animes[anime].title.split(' ')
                tmp.pop()   // Remove the extension
                tmp.pop()   // Remove the episode number
                tmp.shift() // Remove the Horrible Subs tag

                // Make the actual research
                try
                {
                    mal.fromName(tmp.join(' ')).then(result => {
                        releases.releases.push({
                            realTitle: animes[anime].title,
                            title: getNameOnly(animes[anime].title),
                            link: animes[anime].link,
                            synopsis: reduceString(result.synopsis),
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
                            if (!news.show) {
                                loader.show = false
                                releases.show = true
                            }
                        }, 1200)
                    })
                }
                catch (e)
                {
                    console.log("There was a 'Too many request' error.")
                }
            }
        }
    })
}

function downloadFile (file_url, name){
    let req = request({
        method: 'GET',
        uri: file_url
    })

    let out = fs.createWriteStream(path.join(DIR, `${name}.torrent`))
    req.pipe(out)
}

function startTorrent (file_url, name) {
    // Removing old torrents
    findRemoveSync(DIR, {extensions: ['.torrent']})

    // Downloading the new ones
    downloadFile(file_url, name)

    // Opening them
    main.openTorrents()
}

function makeResearchOnMal (name) {

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
    let tmp = malScraper.getNewsNoDetails( () => {
        news.news = tmp
    })
}

/* -------------------- END FUNCTIONS ----------------- */

// First research at kawAnime's start
getLatest()

// Getting the news in advance
getNews()

/* ------------------- VUE.JS OBJECTS ----------------- */

let releases = new Vue({
    el: '#releases',
    data: {
        releases: [],
        show: false
    },
    watch: {
        releases: function () {  // Whenever releases changes, this function will run
            // Code
        }
    },
    methods: {
        download: function (url, name) {
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
        backToMain: function () {
            this.hide()
            releases.show = true
        }
    },
    watch: {
        infos: function () {

        }
    }
})

let news = new Vue({
    el: '#news-container',
    data: {
        show: false,
        news: [],
        display: 'none'
    },
    methods: {
        openLink: function (link) {
            event.preventDefault()
            shell.openExternal(link)
        }
    }
})

// Vue object to open the other pages
new Vue({
    el: '.mdl-navigation',
    methods: {
        getDownloader: function () {
            main.openDownloader()
        },
        getMainPage: function () {
            if (!loader.show)
            {
                releases.show = true
                news.show = false
            }
        },
        getNewsPage: function () {
            // For first time
            if (news.display === 'none')
                news.display = 'block'

            releases.show = false
            news.show = true
            loader.show = false
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
        info.show = false
        if (searchButton.value.length > 3)
        {
            releases.show = false
            loader.show = true
            makeResearchOnMal(searchButton.value.toString())
        }
        searchButton.value = ''
    }
})