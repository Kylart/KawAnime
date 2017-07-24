/**
 * Created by Kylart on 03/04/2017.
 */

'use strict'

const fs = require('fs')
const {join} = require('path')
const _ = require('lodash')

const {userInfo} = require('os')
const BASE_PATH = userInfo().homedir
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
        localPath: join(userInfo().homedir, 'Downloads'),
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

const routes = {
  'getConfig.json': (app) => {
    app.get('/getConfig.json', (req, res) => {
      const configPath = join(dir, 'config.json')
      const configFile = JSON.parse(fs.readFileSync(configPath))

      res.type('application/json')
      res.send(configFile)
    })
  },
  'getLatestNyaa': (app) => {
    app.get('/getLatestNyaa', ({query}, res) => {
      nyaa.getLatest(query, res)
    })
  },
  'getLatest.json': (app) => {
    app.get('/getLatest.json', ({query}, res) => {
      horrible.getLatest(query, res)
    })
  },
  'openThis': /* istanbul ignore next */ (app) => {
    app.get('/openThis', ({query}, res) => {
      openExternal(query, res)
    })
  },
  'seasons.json': (app) => {
    app.get('/seasons.json', ({query}, res) => {
      seasons.getSeason(query, res)
    })
  },
  'download': (app) => {
    app.post('/download', (req, res) => {
      nyaa.download(req, res)
    })
  },
  'news.json': (app) => {
    app.get('/news.json', (req, res) => {
      news.getNews(res)
    })
  },
  'local.json': (app) => {
    app.get('/local.json', ({query}, res) => {
      local.searchLocalFiles(query, res)
    })
  },
  'watchList.json': (app) => {
    app.get('/watchList.json', (req, res) => {
      wl.getLists(res)
    })
  },
  'saveWatchList': (app) => {
    app.post('/saveWatchList', (req, res) => {
      wl.saveWatchList(req, res)
    })
  },
  'resetLocal': (app) => {
    app.get('/resetLocal', ({query}, res) => {
      local.resetLocal(query, res)
    })
  },
  'appendHistory': (app) => {
    app.post('/appendHistory', (req, res) => {
      history.appendHistory(req, res)
    })
  },
  'getHistory': (app) => {
    app.get('/getHistory', (req, res) => {
      history.getHistory(res)
    })
  },
  'removeFromHistory': (app) => {
    app.post('/removeFromHistory', (req, res) => {
      history.removeFromHistory(req, res)
    })
  },
  'saveConfig': (app) => {
    app.post('/saveConfig', (req, res) => {
      req.on('data', (chunk) => {
        const data = JSON.parse(chunk)
        fs.writeFileSync(join(dir, 'config.json'), JSON.stringify(data))
        console.log('[Open-External]: Successfully saved config!')
      })
      res.status(200).send()
    })
  },
  'searchTermOnMal': (app) => {
    app.get('/searchTermOnMal', ({query}, res) => {
      search.searchTerm(query, res)
    })
  },
  'getInfoFromMal': (app) => {
    app.get('/getInfoFromMal', ({query}, res) => {
      search.searchOnMal(query, res)
    })
  },
  '_openInBrowser': /* istanbul ignore next */ (app) => {
    app.get('/_openInBrowser', (req, res) => {
      openInBrowser(res)
    })
  },
  '_win': /* istanbul ignore next */ (app) => {
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
  '_getPlatform': (app) => {
    app.get('/_platform', (req, res) => {
      res.status(200).send(process.platform)
    })
  }
}

const setup = (app) => {
  createDir()
  createConfig()
  createLocal()
  createHistory()
  createList()

  _.each(_.keys(routes), (route) => {
    routes[route](app)
  })
}

module.exports = setup
