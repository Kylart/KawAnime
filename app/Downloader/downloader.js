/**
 * Created by Kylart on 20/11/16.
 */
const request = require('request');
const fs = require('fs')
const path = require('path')
const PythonShell = require('python-shell')
const Nyaa = require('node-nyaa-api')

let animes = []

let name = new Vue({
    el: '#name-button',
    data: {
        message: "Name of the anime",
        anime: ''
    },
    methods: {
        next : function () {
            document.getElementById('anime-start').focus()
        }
    }
})

let fromEp = new Vue({
    el: '#from-ep-button',
    data: {
        message: "From episode...",
        ep: ''
    },
    methods: {
        next : function () {
            document.getElementById('anime-end').focus()
        },
        previous: function () {
            if (!document.getElementById('anime-start').value)
                document.getElementById('anime-name').focus()
        }
    }
})

let untilEp = new Vue({
    el: '#until-ep-button',
    data: {
        message: "Until episode...",
        ep: ''
    },
    methods: {
        download : function () {
            document.getElementById('download-button').click()
            document.getElementById('anime-name').focus()
        },
        previous: function () {
            if (!document.getElementById('anime-end').value)
                document.getElementById('anime-start').focus()
        }
    }
})

function execPython(file)
{
    let options = {
        mode: 'text',
        pythonPath: '/usr/bin/python',  //TODO: get python path automatically
        scriptPath: __dirname,
        args: [path.join(__dirname, '..', '..', 'resources', 'tmp/')]
    };

    PythonShell.run(`${file}.py`, options, function (err, results) {
        if (err) throw err
        // results is an array consisting of messages collected during execution
        console.log('Python says: ', results)
    });
}

// Inspired by
// http://ourcodeworld.com/articles/read/228/how-to-download-a-webfile-with-electron-save-it-and-show-download-progress
function downloadFile(file_url , targetPath){
    let req = request({
        method: 'GET',
        uri: file_url
    });

    let out = fs.createWriteStream(targetPath);
    req.pipe(out);
}

let downloadButton = new Vue({
    el: '#button-container',
    data: {
        msg : 'Download!'
    },
    methods: {
        download: function () {
            execPython('remover')
            console.log(`Retrieving ${name.anime} from ${fromEp.ep} to ${untilEp.ep}...`)

            // Get the right torrents
            Nyaa.search('[HorribleSubs] [720p]' + name.anime, function(err, articles) {
                if (err) throw err;


                for (let article in articles)
                    animes.push(articles[article])


                for (let anime in animes)
                {
                    let name = animes[anime].title
                    let url = animes[anime].link
                    let epNumber = parseInt(name.split(' ').reverse()[1])

                    if (epNumber >= fromEp.ep && epNumber <= untilEp.ep) {
                        console.log(name + "\n" + url)
                        downloadFile(url, `${__dirname}/../../resources/tmp/${name}.torrent`);
                    }
                }
            })
        }
    }
})