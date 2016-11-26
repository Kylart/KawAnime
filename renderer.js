// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

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

// Make the research for the latest animes
Nyaa.get_latest( function (err, animes) {
    if (err) throw err

    for(let anime in animes)
    {
        if (horribleSubsFilter(animes[anime].title))
        {
            let tmp = animes[anime].title.split(' ')
            tmp.pop()   // Remove the episode number
            tmp.pop()   // Remove the annoying '-'

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
        }
    }
})

let loader = new Vue({
    el: '#loader-container',
    data: {
        show: true,
        gif: path.join(__dirname, 'resources', 'totoro-hoola-hoop.gif')
    },
    methods: {
        test: function () {
            this.show = false
            releases.show = true
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
            openCmd = ''
    }

    exec(openCmd + torrents, (error, stdout, stderr) => {
        if (error)
        {
            console.error(`exec error: ${error}`)
            return
        }
        console.log(`stdout: ${stdout}`)
        console.log(`stderr: ${stderr}`)
    })
}
