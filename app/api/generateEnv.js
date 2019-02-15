const fs = require('fs')
const { join } = require('path')
const _ = require('lodash')
const randomString = require('randomstring')

const { dir, Logger } = require('./utils')

const logger = new Logger('Env')

const BASE_PATH = require('os').homedir()

// Initiating files and directory
// Create the .KawAnime directory
const createDir = () => {
  /* istanbul ignore next */
  if (!fs.existsSync(dir)) fs.mkdirSync(dir)
}

const createConfig = () => {
  // Conf file
  const confPath = join(dir, 'config.json')

  const basicConf = {
    config: {
      fansub: 'HorribleSubs',
      quality: '720p',
      feed: 'si',
      localPath: join(BASE_PATH, 'Downloads'),
      sound: 'Nyanpasu',
      notificationVolume: 0.5,
      inside: true,
      system: {
        darkTheme: true,
        autoStart: false,
        toTray: false,
        center: true
      },
      bounds: {
        height: null,
        width: null,
        x: null,
        y: null
      },
      version: '0.0.0',
      video: {
        inside: true,
        autoplay: true,
        fullscreen: false,
        preferredLanguage: 'en',
        quality: '720p'
      },
      torrentClient: {
        defaultPath: join(BASE_PATH, 'Downloads')
      }
    }
  }

  /* istanbul ignore next */
  if (!fs.existsSync(confPath)) {
    logger.info('No configuration file detected. Creating...')

    fs.writeFileSync(confPath, JSON.stringify(basicConf), 'utf-8')
  } else {
    // Checking if no key is missing. Careful, works only up to 2 levels inside config
    const currentConf = require(confPath)
    let changed = false

    _.each(basicConf.config, (elem, key) => {
      /* istanbul ignore next */
      if (typeof currentConf.config[key] === 'undefined') {
        currentConf.config[key] = elem
        changed = true
      }

      if (typeof elem === 'object') {
        _.each(elem, (value, subKey) => {
          // We need to check if the subKey is in elem
          if (!(subKey in currentConf.config[key])) {
            currentConf.config[key][subKey] = value
            changed = true
          }
        })
      }
    })

    changed && fs.writeFileSync(confPath, JSON.stringify(currentConf), 'utf-8')
  }
}

// Local file
const createLocal = () => {
  const animeLocalPath = join(dir, 'locals.json')

  /* istanbul ignore next */
  if (!fs.existsSync(animeLocalPath)) {
    logger.info('No anime local file detected. Creating...')

    fs.writeFileSync(animeLocalPath, '{}', 'utf-8')
  }
}

// List file
const createList = () => {
  const listPath = join(dir, 'lists.json')

  /* istanbul ignore next */
  if (!fs.existsSync(listPath)) {
    logger.info('No anime list file detected. Creating...')

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
    logger.info('No watch history file detected. Creating...')

    fs.writeFileSync(historyPath, '{}', 'utf-8')
  }
}

const createToken = () => {
  const tokenPath = join(dir, '_token')

  /* istanbul ignore next */
  if (!fs.existsSync(tokenPath)) {
    logger.info('No token file detected. Creating...')

    fs.writeFileSync(tokenPath, randomString.generate(40), 'utf-8')
  }
}

module.exports = function generateEnv () {
  createDir()
  createConfig()
  createLocal()
  createHistory()
  createList()
  createToken()
}
