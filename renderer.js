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

let latestRelease = []

function horribleSubsFilter(name) {
    if ('[HorribleSubs]' === name.split(' ')[0])
    {
        if ('[720p].mkv' === name.split(' ').reverse()[0])
            return true
    }
    return false
}

function getName(string) {
    let tmp = string.split(' ')
    tmp.pop()
    tmp.pop()
    console.log(tmp.join(' '))
    return { tmp }
}

// Get the latest releases from Nyaa.
Nyaa.get_latest(function(err, articles) {
    if (err) throw err;

    for (let article in articles)
    {
        if(horribleSubsFilter(articles[article].title))
        {
            let name = articles[article].title.split(' ')
            name.shift()
            name.reverse().shift()

            latestRelease.push({ text: name.reverse().join(' ') })
            console.log(name.join(' '))
        }
    }
    let tmp = latestRelease[0].text.split(' ')
    tmp.pop()
    tmp.pop()
    console.log(tmp.join(' '))

    mal.fromName(tmp.join(' ')).then(anime => {
        console.log(anime);
    })
})


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

// let latestRelease = new Vue({
//     el: '#latest-release',
//     data: {
//         releases: [
//
//         ]
//     }
// })

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
