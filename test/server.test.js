/**
 * Created by Kylart on 21/05/2017.
 */

import 'colors'
import test from 'ava'
import Nuxt from 'nuxt'
import axios from 'axios'
import http from 'http'
import {resolve, join} from 'path'
import {readFile, writeFileSync, rmdirSync, unlinkSync, readdirSync} from 'fs'
import {userInfo} from 'os'

process.env.NODE_ENV = 'KawAnime-test'

// We keep the nuxt and server instance
// So we can close them at the end of the test
let nuxt = null
let server = null
const uri = 'http://localhost:4000'

const DIR = join(userInfo().homedir, '.KawAnime-test')
const kawAnimeFilesPath = {
  local: join(DIR, 'locals.json'),
  history: join(DIR, 'history.json'),
  watchList: join(DIR, 'lists.json'),
  config: join(DIR, 'config.json')
}

// Init Nuxt.js and create a server listening on localhost:4000
test.before('Init Nuxt.js', async () => {
  /**
   * Creating .KawAnime-test directory and necessary files
   */
  const initFile = require(join(__dirname, '..', 'assets', 'api', 'main.js'))

  /**
   * Nuxt config
   */
  const rootDir = resolve(__dirname, '..')
  let config = {}
  try { config = require(resolve(rootDir, 'nuxt.config.js')) } catch (e) {}
  config.rootDir = rootDir // project folder
  config.dev = false // production build

  /**
   * Server config
   */
  nuxt = new Nuxt(config)
  const route = initFile.route(nuxt)
  server = http.createServer(route)
  await nuxt.build()
  server.listen(4000)
  console.log(`KawAnime's server is at http://localhost:${server.address().port}`.green)

  const local = require(join(DIR, 'locals.json'))
  local['sakuratrick'] = {
    name: 'Sakura Trick',
    picture: 'Some/link',
    numberOfEpisode: '1',
    status: 'status',
    genres: ['One', 'Or', 'Two', 'Genres'],
    classification: 'PG-13 - Teens 13 or older',
    mark: '7.33',
    synopsis: 'Story blablabla'
  }
  writeFileSync(join(DIR, 'locals.json'), JSON.stringify(local), 'utf-8')

  console.log = (msg) => { void (msg) }
})

test.cb(`KawAnime's local file exists`, t => {
  readFile(`${kawAnimeFilesPath.local}`, t.end)
})

test.cb(`KawAnime's history file exists`, t => {
  readFile(`${kawAnimeFilesPath.history}`, t.end)
})

test.cb(`KawAnime's config file exists`, t => {
  readFile(`${kawAnimeFilesPath.config}`, t.end)
})

test.cb(`KawAnime's lists file exists`, t => {
  readFile(`${kawAnimeFilesPath.watchList}`, t.end)
})

/**
 * API test calls
 */
test('/getConfig.json route exits and returns json with right keys', async t => {
  const { data } = await axios.get(`${uri}/getConfig.json`)

  t.not(data.config, undefined)
  t.not(data.config.fansub, undefined)
  t.not(data.config.quality, undefined)
  t.not(data.config.sound, undefined)
  t.not(data.config.localPath, undefined)
  t.not(data.config.inside, undefined)
  t.not(data.config.magnets, undefined)
})

test('/saveConfig.json route exits and saves config and return 200', async t => {
  let config = require(join(DIR, 'config.json'))
  const saved = config.sound
  config.sound = 'Test'

  const { status } = await axios.post(`${uri}/saveConfig`, JSON.stringify(config))

  t.is(status, 200)

  config = require(join(DIR, 'config.json'))
  t.is(config.sound, 'Test')

  config.sound = saved

  writeFileSync(join(DIR, 'config.json'), JSON.stringify(config), 'utf-8')
})

test('/getLatest.json exits and returns 18 elements with right keys at 720p', async t => {
  const { data, status } = await axios.get(`${uri}/getLatest.json?quality=720p`)

  if (status === 200) {
    t.is(data.length, 18)
    t.not(data[0].name, undefined)
    t.not(data[0].rawName, undefined)
    t.not(data[0].researchName, undefined)
    t.not(data[0].magnetLink, undefined)
    t.not(data[0].picture, undefined)
  } else if (status === 204 || status === 202) {
    console.log('An error occurred while getting latest releases.'.yellow)
    t.is(data.length, 0)
  } else {
    t.fail()
  }
})

test('/download Mahou Shoujo Ikusei Keikaku with HorribleSubs at 720p on nyaa.si exits and returns all' +
  ' magnets', async t => {
  const { data, status } = await axios.post(`${uri}/download`, {
    name: 'Mahou Shoujo Ikusei Keikaku',
    quality: '720p',
    fromEp: 0,
    untilEp: 20000,
    fansub: 'HorribleSubs',
    choice: 'si'
  })


  if (status === 200) {
    t.is(data.length, 12)
    t.not(data[0], '')
  } else if (status === 204) {
    t.is(data.length, 0)
  } else {
    t.fail()
  }
})

test('/download Mahou Shoujo Ikusei Keikaku with HorribleSubs at 720p on nyaa.pantsu.cat exits and returns' +
  ' all magnets', async t => {
  const { data, status } = await axios.post(`${uri}/download`, {
    name: 'Mahou Shoujo Ikusei Keikaku',
    quality: '720p',
    fromEp: 0,
    untilEp: 20000,
    fansub: 'HorribleSubs',
    choice: 'pantsu'
  })

  if (status === 200) {
    t.is(data.length, 12)
    t.not(data[0], '')
  } else if (status === 204) {
    t.is(data.length, 0)
  } else {
    t.fail()
  }
})

test('/getLatestNyaa exits and returns 18 elements with right keys at 720p on nyaa.pantsu.cat', async t => {
  const { data, status } = await axios.get(`${uri}/getLatestNyaa?quality=720p&choice=pantsu&fansub=HorribleSubs`)

  if (status === 200) {
    t.is(data.length, 18)
    t.not(data[0].name, undefined)
    t.not(data[0].rawName, undefined)
    t.not(data[0].researchName, undefined)
    t.not(data[0].magnetLink, undefined)
    t.not(data[0].picture, undefined)
  } else if (status === 204 || status === 202) {
    console.log('An error occurred while getting latest releases.'.yellow)
    t.is(data.length, 0)
  } else {
    t.fail()
  }
})

test('/download Mahou Shoujo Ikusei Keikaku with HorribleSubs at 720p from ep 3 to 9 on nyaa.si exits and' +
  ' returns 7 magnets', async t => {
  const { data, status } = await axios.post(`${uri}/download`, {
    name: 'Mahou Shoujo Ikusei Keikaku',
    quality: '720p',
    fromEp: 3,
    untilEp: 9,
    fansub: 'HorribleSubs',
    choice: 'si'
  })

  if (status === 200) {
    t.is(data.length, 7)
    t.not(data[0], '')
  } else if (status === 204) {
    t.is(data.length, 0)
  } else {
    t.fail()
  }
})

test('/download Mahou Shoujo Ikusei Keikaku with HorribleSubs at 720p from ep 3 to 9 on nyaa.pantsu.cat' +
  ' exits and returns' +
  ' all magnets', async t => {
  const { data, status } = await axios.post(`${uri}/download`, {
    name: 'Mahou Shoujo Ikusei Keikaku',
    quality: '720p',
    fromEp: 3,
    untilEp: 9,
    fansub: 'HorribleSubs',
    choice: 'pantsu'
  })

  if (status === 200) {
    t.is(data.length, 7)
    t.not(data[0], '')
  } else if (status === 204) {
    t.is(data.length, 0)
  } else {
    t.fail()
  }
})

test('/getLatest.json exits and returns 204 status at 30p', async t => {
  const { status } = await axios.get(`${uri}/getLatest.json?quality=30p`)

  t.is(status, 204)
})

test('/getLatestNyaa exits and returns 18 elements with right keys at 720p on nyaa.si', async t => {
  const { data, status } = await axios.get(`${uri}/getLatestNyaa?quality=720p&choice=si&fansub=HorribleSubs`)

  if (status === 200) {
    t.is(data.length, 18)
    t.not(data[0].name, undefined)
    t.not(data[0].rawName, undefined)
    t.not(data[0].researchName, undefined)
    t.not(data[0].magnetLink, undefined)
    t.not(data[0].picture, undefined)
  } else if (status === 204 || status === 202) {
    console.log('An error occurred while getting latest releases.'.yellow)
    t.is(data.length, 0)
  } else {
    t.fail()
  }
})

test('/seasons.json route exits and returns elements on Spring 2017', async t => {
  const { data } = await axios.get(`${uri}/seasons.json?year=2017&season=spring`)
  t.true(data.info.TV.length > 1)
  t.true(data.info.OVAs.length > 1)
  t.true(data.info.Movies.length > 1)
})

test('/seasons.json route exits and returns elements on Fall 2016', async t => {
  const { data } = await axios.get(`${uri}/seasons.json?year=2016&season=fall`)
  t.true(data.info.TV.length > 1)
  t.true(data.info.OVAs.length > 1)
  t.true(data.info.Movies.length > 1)
})

test('/seasons.json route exits and returns and log a error message on Fall 201', async t => {
  const { status } = await axios.get(`${uri}/seasons.json?year=201&season=fall`)

  t.is(status, 204)
})

test('/local.json route exists and returns three files and code 200', async t => {
  const { data, status } = await axios.get(`${uri}/local.json?dir=${join(__dirname, 'resources')}`)

  t.is(status, 200)

  t.is(data.length, 3)

  t.is(data[1].name, 'Sakura Trick')
  t.is(data[1].ep, 1)
  t.is(data[0].name, 'Rewrite')
  t.is(data[2].name, 'Rewrite')
  t.is(data[0].ep, 1)
  t.is(data[2].ep, 2)
})

test('/local.json route exits and returns empty array on empty directory', async t => {
  const { data, status } = await axios.get(`${uri}/local.json?dir=${__dirname}`)

  t.is(status, 200)

  t.is(data.length, 0)
})

test('/resetLocal route exits and deletes some data', async t => {
  const { data, status } = await axios.get(`${uri}/resetLocal?dir=${join(__dirname, 'resources')}`)

  t.is(status, 200)

  t.is(data[1].name, 'Sakura Trick')
  t.is(data[1].ep, 1)
  t.is(data[0].name, 'Rewrite')
  t.is(data[2].name, 'Rewrite')
  t.is(data[0].ep, 1)
  t.is(data[2].ep, 2)
})

test('/getHistory route exits and returns history file', async t => {
  const { data, status } = await axios.get(`${uri}/getHistory`)

  t.is(status, 200)
  t.not(data, undefined)
})

test('/appendHistory route exits and returns code 200 on play', async t => {
  const { status } = await axios.post(`${uri}/appendHistory`, {
    type: 'Play',
    text: 'Test'
  })

  t.is(status, 200)

  const day = (new Date()).toDateString()
  const json = require(join(DIR, 'history.json'))

  t.pass(json[day][0])

  const entry = json[day][0]

  t.is(entry.text, 'Test')
  t.is(entry.type, 'Play')
})

test('/appendHistory route exits and returns code 200 on delete', async t => {
  const { status } = await axios.post(`${uri}/appendHistory`, {
    type: 'Delete',
    text: 'Test'
  })

  t.is(status, 200)

  const day = (new Date()).toDateString()
  const json = require(join(DIR, 'history.json'))

  t.pass(json[day][0])

  const entry = json[day][0]

  t.is(entry.text, 'Test')
  t.is(entry.type, 'Delete')
})

test('/watchList route exits with actual file and returns code 200', async t => {
  const { data, status } = await axios.get(`${uri}/watchList.json`)

  t.is(status, 200)

  t.not(data, undefined)
  t.true(data.watchList.length >= 0)
  t.true(data.watching.length >= 0)
  t.true(data.seen.length >= 0)
})

test('/saveWatchList exits and returns 200', async t => {
  let trueList = require(join(DIR, 'lists.json'))

  trueList.watching.push('Test')

  const { status } = await axios.post(`${uri}/saveWatchList`, JSON.stringify(trueList))

  t.is(status, 200)

  trueList = require(join(DIR, 'lists.json'))

  t.is(trueList.watching.slice(-1)[0], 'Test')
})

test('/news.json route exits and returns 160 elements', async t => {
  const { data, status } = await axios.get(`${uri}/news.json`)

  status === 200
    ? t.is(data.length, 160)
    : status === 204
      ? t.is(data.length, 0)
      : t.fail()
})

/**
 * Front test calls
 *
 * Very basic tests. Front is tested with nightwatch anyway
 */

test('/downloader exits and render HTML', async t => {
  let context = {}
  const { html } = await nuxt.renderRoute('/downloader', context)

  t.true(html.includes('Download!'))
})

test('/ exits and returns HTML (axios)', async t => {
  const { data, status } = await axios.get(`${uri}/`)

  t.is(status, 200)

  t.true(data.includes('かわニメ'))
  t.true(data.includes('少々お待ち下さいね〜'))
})

test('/seasons exits and render HTML', async t => {
  let context = {}
  const { html } = await nuxt.renderRoute('/seasons', context)

  t.true(html.includes('かわニメ'))
  t.true(html.includes('少々お待ち下さいね〜'))
})

test('/news exits and render HTML', async t => {
  let context = {}
  const { html } = await nuxt.renderRoute('/news', context)

  t.true(html.includes('かわニメ'))
  t.true(html.includes('少々お待ち下さいね〜'))
})

test('/localPage exits and render HTML', async t => {
  let context = {}
  const { html } = await nuxt.renderRoute('/news', context)

  t.true(html.includes('refresh'))
})

test('/watchList exits and render HTML', async t => {
  let context = {}
  const { html } = await nuxt.renderRoute('/watchList', context)

  t.true(html.includes('Move to'))
})

// Close server and ask nuxt to stop listening to file changes
test.after('Closing server and server.test.js', () => {
  server.close()
  nuxt.close()

  /**
   * Removing temporary .KawAnime directory
   */
  console.info('Removing temporary info'.yellow)
  const files = readdirSync(DIR)

  files.forEach((file) => {
    unlinkSync(`${DIR}/${file}`)
  })

  try {
    rmdirSync(DIR)
  } catch (err) {
    throw err
  }

  console.info('All clear!'.green)
})
