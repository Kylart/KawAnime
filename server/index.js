/**
 * Created by Kylart on 03/04/2017.
 */

'use strict'

const fs = require('fs')
const {join} = require('path')
const _ = require('lodash')
const axios = require('axios')

const {homedir} = require('os')
const BASE_PATH = homedir()
/* istanbul ignore next */
const dir = process.env.NODE_ENV !== 'KawAnime-test'
  ? join(BASE_PATH, '.KawAnime')
  : join(BASE_PATH, '.KawAnime-test')

// Initiating files and directory
// Create the .KawAnime directory
const createDir = () => {
  /* istanbul ignore next */
  if (!fs.existsSync(dir)) fs.mkdirSync(dir)
}

const createConfig = () => {
  // Conf file
  const confPath = join(dir, 'config.json')

  /* istanbul ignore next */
  if (!fs.existsSync(confPath)) {
    console.log('No configuration file detected. Creating...')

    const basicConf = {
      config: {
        fansub: 'HorribleSubs',
        quality: '720p',
        localPath: join(BASE_PATH, 'Downloads'),
        sound: 'Nyanpasu',
        inside: true,
        magnets: false
      }
    }

    fs.writeFileSync(confPath, JSON.stringify(basicConf), 'utf-8')
  }
}

// Local file
const createLocal = () => {
  const animeLocalPath = join(dir, 'locals.json')

  /* istanbul ignore next */
  if (!fs.existsSync(animeLocalPath)) {
    console.log('No anime local file detected. Creating...')

    fs.writeFileSync(animeLocalPath, '{}', 'utf-8')
  }
}

// List file
const createList = () => {
  const listPath = join(dir, 'lists.json')

  /* istanbul ignore next */
  if (!fs.existsSync(listPath)) {
    console.log('No anime list file detected. Creating...')

    const basicLists = {
      watchList: [],
      seen: [],
      watching: [],
      dropped: [],
      onHold: []
    }

    fs.writeFileSync(listPath, JSON.stringify(basicLists), 'utf-8')
  }
}

// History file
const createHistory = () => {
  const historyPath = join(dir, 'history.json')

  /* istanbul ignore next */
  if (!fs.existsSync(historyPath)) {
    console.log('No watch history file detected. Creating...')

    fs.writeFileSync(historyPath, '{}', 'utf-8')
  }
}

const {openExternal, openInBrowser} = require('./openExternal.js')
const seasons = require('./seasons.js')
const news = require('./news.js')
const local = require('./local.js')
const wl = require('./watchList.js')
const history = require('./history')
const horrible = require('./horrible.js')
const nyaa = require('./nyaa.js')
const search = require('./search.js')

let routes = [
  (app) => {
    app.get('/getConfig.json', (req, res) => {
      const configPath = join(dir, 'config.json')
      const configFile = JSON.parse(fs.readFileSync(configPath))

      res.type('application/json')
      res.send(configFile)
    })
  },
  (app) => {
    app.get('/getLatestNyaa', ({query}, res) => {
      nyaa.getLatest(query, res)
    })
  },
  (app) => {
    app.get('/getLatest.json', ({query}, res) => {
      horrible.getLatest(query, res)
    })
  },
  /* istanbul ignore next */ (app) => {
    app.get('/openThis', ({query}, res) => {
      openExternal(query, res)
    })
  },
  (app) => {
    app.get('/seasons.json', ({query}, res) => {
      seasons.getSeason(query, res)
    })
  },
  (app) => {
    app.post('/download', (req, res) => {
      nyaa.download(req, res)
    })
  },
  (app) => {
    app.get('/news.json', (req, res) => {
      news.getNews(res)
    })
  },
  (app) => {
    app.get('/local.json', ({query}, res) => {
      local.searchLocalFiles(query, res)
    })
  },
  (app) => {
    app.get('/watchList.json', (req, res) => {
      wl.getLists(res)
    })
  },
  (app) => {
    app.post('/saveWatchList', (req, res) => {
      wl.saveWatchList(req, res)
    })
  },
  (app) => {
    app.get('/resetLocal', ({query}, res) => {
      local.resetLocal(query, res)
    })
  },
  (app) => {
    app.post('/appendHistory', (req, res) => {
      history.appendHistory(req, res)
    })
  },
  (app) => {
    app.get('/getHistory', (req, res) => {
      history.getHistory(res)
    })
  },
  (app) => {
    app.post('/removeFromHistory', (req, res) => {
      history.removeFromHistory(req, res)
    })
  },
  (app) => {
    app.post('/saveConfig', (req, res) => {
      req.on('data', (chunk) => {
        const data = JSON.parse(chunk)
        fs.writeFileSync(join(dir, 'config.json'), JSON.stringify(data))
        console.log('[Open-External]: Successfully saved config!')
      })
      res.status(200).send()
    })
  },
  (app) => {
    app.get('/searchTermOnMal', ({query}, res) => {
      search.searchTerm(query, res)
    })
  },
  (app) => {
    app.get('/getInfoFromMal', ({query}, res) => {
      search.searchOnMal(query, res)
    })
  },
  /* istanbul ignore next */ (app) => {
    app.get('/_openInBrowser', (req, res) => {
      openInBrowser(res)
    })
  },
  /* istanbul ignore next */ (app) => {
    app.get('/_win', ({query}, res) => {
      const action = query.action

      if (action === 'minimize') {
        process.win.minimize()
      } else if (action === 'maximize') {
        process.win.maximize()
      } else if (action === 'close') {
        process.win.close()
      }

      res.status(200).send()
    })
  },
  (app) => {
    app.get('/_env', (req, res) => {
      res.status(200).send({
        platform: process.platform,
        NODE_ENV: process.env.NODE_ENV
      })
    })
  },
  /* istanbul ignore next */ (app) => {
    app.get('/_isOnline', async (req, res) => {
      try {
        const {status} = await axios.get('https://myanimelist.net')

        res.status(status === 200 ? 200 : 204).send()
      } catch (e) {
        res.status(204).send()
      }
    })
  }
]

const setup = (app) => {
  createDir()
  createConfig()
  createLocal()
  createHistory()
  createList()

  // auto update
  /* istanbul ignore next */
  if (!['KawAnime-test', 'development'].includes(process.env.NODE_ENV)) {
    routes = require('./updater.js')(app, routes)
  }

  _.each(routes, (route) => route(app))
}

module.exports = setup
