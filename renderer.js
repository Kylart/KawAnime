// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const remote = require('electron').remote
const main = remote.require('./main.js')

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
                    title: getNameOnly(animes[anime].title),
                    link: animes[anime].link,
                    synopsis: reduceString(result.synopsis),
                    picture: result.image
                })
            })
        }
    }
})

let releases = new Vue({
    el: '#releases',
    data: {
        releases: []
    },
    watch: {
        releases: function () {  // Whenever releases changes, this function will run
            if (this.releases.length > 9)  // I want only the 12 latest releases
            {
                let tmp = this.releases
                tmp.pop()
                this.releases = tmp
            }
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
