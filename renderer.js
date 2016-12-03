// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

/* ------------------ IMPORTS ------------------ */

const remote = require('electron').remote
const main = remote.require('./main.js')
const fs = require('fs')
const os = require('os')

// Those are needed to download the torrents
const path = require('path')
const request = require('request')
const exec = require('child_process').exec
const findRemoveSync = require('find-remove')

// Mal API
const mal = require('malapi').Anime
// Nyaa API
const Nyaa = require('node-nyaa-api')

/* ----------------- END IMPORTS ----------------- */

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

// Make the research for the latest animes
function getLatest () {
    Nyaa.get_latest( function (err, animes) {
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
                mal.fromName(tmp.join(' ')).then(result => {
                    releases.releases.push({
                        realTitle: animes[anime].title,
                        title: getNameOnly(animes[anime].title),
                        link: animes[anime].link,
                        synopsis: reduceString(result.synopsis),
                        picture: result.image
                    })
                })
            }
        }
        setTimeout( () => {
            loader.show = false
            releases.show = true
        }, 3000)
    })
}

function downloadFile (file_url, name){
    let req = request({
        method: 'GET',
        uri: file_url
    })

    let out = fs.createWriteStream(path.join(__dirname, 'resources', 'tmp', `${name}.torrent`))
    req.pipe(out)
}

function startTorrent (file_url, name) {
    const torrents = path.join(__dirname, 'resources', 'tmp', `*.torrent`)
    let openCmd

    findRemoveSync(path.join(__dirname, 'resources', 'tmp'), {extensions: ['.torrent']})

    downloadFile(file_url, name)

    switch (process.platform)
    {
        case 'darwin':
            openCmd = 'open '
            break
        case 'linux':
            openCmd = 'xdg-open '
            break
        case 'win32':
            openCmd = 'start '
    }

    exec(openCmd + torrents, (error, stdout, stderr) => {
        if (error)
        {
            console.error(`exec error: ${error}`)
            return
        }
        if (stdout == null && stderr == null)
        {
            console.log(`Starting torrent stdout: ${stdout}`)
            console.log(`Starting torrent stderr: ${stderr}`)
        }

    })
}

function makeResearchOnMal (name) {

    mal.fromName(name).then(anime => {
        info.infos.title = anime.title
        info.infos.japTitle = anime.japaneseTitle
        info.infos.image = anime.image
        info.infos.synopsis = anime.synopsis
        info.infos.episodes = anime.episodes
        info.infos.studios = anime.studios
        info.infos.stats = anime.statistics
        info.infos.genres = anime.genres
        info.infos.type = anime.type.split(' ').slice(0, 3).join(' ')
        info.infos.characters = anime.characters
        info.infos.staff = anime.staff

        releases.show = false
        loader.show = false
        info.display = 'block'
        info.show = true
    })
}

/* -------------------- END FUNCTIONS ----------------- */

// First research at kawAnime's start
getLatest()

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

// Vue object to open the other pages
new Vue({
    el: '.mdl-navigation',
    methods: {
        getDownloader: function () {
            main.openDownloader()
        },
        getInfoPage: function () {
            main.getInfoPage()
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