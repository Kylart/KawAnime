// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const remote = require('electron').remote
const main = remote.require('./main.js')
const Nyaa = require('node-nyaa-api')
const mal = require('malapi').Anime
const os = require('os')

const classForButton =  "mdl-button mdl-js-button mdl-button--raised mdl-button--colored " +
                        "mdl-js-ripple-effect mdl-button--accent"

let latestReleases = []
let finishedLoad = false
Vue.config.silent = true

function reduceString(string) {
    if (string.length > 100)
        return string.substring(0, 100) + ('...')
    return string
}


function horribleSubsFilter(name) {
    if ('[HorribleSubs]' === name.split(' ')[0])
    {
        if ('[720p].mkv' === name.split(' ').reverse()[0])
            return true
    }
    return false
}

function gatherInfoFromHorrible(article)
{
    let title = article.title.split(' ')
    title.shift()
    title.pop()

    return {
        title: title.join(' '),
        link: article.link,
        image: '',
        synopsis: ''
    }
}

function makeResearchOnMal(name, index)
{
    let tmpName = name.title.split(' ')
    tmpName.pop()
    tmpName.pop()

    mal.fromName(tmpName.join(' ')).then(anime => {
        latestReleases[index].image = anime.image
        latestReleases[index].synopsis = reduceString(anime.synopsis)
        makeElems(index)
    })
    finishedLoad = true
}

// Get the latest releases from Nyaa.
Nyaa.get_latest(function(err, articles) {
    if (err) throw err;

    for (let article in articles)
    {
        if(horribleSubsFilter(articles[article].title))
        {
            if (latestReleases.length < 8)
            {
                latestReleases.push(gatherInfoFromHorrible(articles[article]))
            }
        }
    }
    for (let anime in latestReleases)
    {
        makeResearchOnMal(latestReleases[anime], anime)
    }
})

function makeElems (index) {
    // for (let index in latestRelease) {
        Vue.component('elem' + index.toString(), {
            template: `
                <div class="elem">
                  <p class="anime-title">{{ animeTitle }}</p>
                  <div class="card horizontal">
                    <div class="card-image">
                      <img v-bind:src="picUrl" height="200">
                    </div>
                    <div class="card-stacked">
                      <div class="card-content">
                        <p>{{ synopsis }}</p>
                      </div>
                      <div class="card-action">
                        <a v-bind:href="link" class="download">Download!</a>
                        <a href="#" class="more">More</a>
                      </div>
                    </div>
                  </div>
                </div>`,
            data: function () {
                return {
                    animeTitle: latestReleases[index].title,
                    synopsis: latestReleases[index].synopsis,
                    picUrl: latestReleases[index].image,
                    link: latestReleases[index].link
                }
            }
        })
    // }

    new Vue({
        el: '#grid'
    })
}




let title = new Vue({
    el: '#title',
    data: {
        Title: 'KawAnime',
        show: true
    }
})

let greetings = new Vue({
    el: '#greetings',
    data: {
        Greetings: `Greetings ${os.userInfo().username} ! Here are, for you, the latest anime releases.`,
        title: 'You may click on one of them to download it immediately.'
    }
})

let downloadButton = new Vue({
    el: '#downloader-button',
    methods: {
      open: function () {
          console.log("Downloader Window has been requested.")
          main.openDownloader()
      }
    },
    data: {
        message: "Open Downloader!",
        activeStyle: classForButton
    }
})

let infoButton = new Vue({
    el: '#get-info-button',
    methods: {
        open : function () {
            console.log("Info requested.")
        }
    },
    data: {
        message: 'Get information!',
        activeStyle: classForButton
    }
})

let torrentButton = new Vue({
    el: '#torrent-button',
    methods: {
        open: function () {
            console.log("Torrents requested")
        }
    },
    data: {
        message: 'My torrents',
        activeStyle: classForButton
    }
})
