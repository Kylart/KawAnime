/**
 * Created by Kylart on 21/05/2017.
 */

import test from 'ava'
import Nuxt from 'nuxt'
import axios from 'axios'
import initFile from '../assets/scripts/init/main.js'
import http from 'http'
import colors from 'colors' // eslint-disable-line
import {resolve, join} from 'path'
import {readFile} from 'fs'
import {userInfo} from 'os'

// We keep the nuxt and server instance
// So we can close them at the end of the test
let nuxt = null
let server = null
const uri = 'http://localhost:4000'

const DIR = join(userInfo().homedir, '.KawAnime')
let kawAnimeFilesPath = {
  local: join(DIR, 'locals.json'),
  history: join(DIR, 'history.json'),
  watchList: join(DIR, 'lists.json'),
  config: join(DIR, 'config.json')
}

// Init Nuxt.js and create a server listening on localhost:4000
test.before('Init Nuxt.js', async () => {
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

test('/getAllShows.json exits and returns a list of names', async t => {
  const { data } = await axios.get(`${uri}/getAllShows.json`)

  t.true(data.length > 1)
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
  } else if (status === 204) {
    console.log('An error occurred while getting latest releases.'.yellow)
    t.is(data.length, 0)
  } else {
    t.fail()
  }
})

test('/download Mahou Shoujo Ikusei Keikaku at 720p exits and returns all magnets', async t => {
  const { data } = await axios.post(`${uri}/download`, {
    name: 'Mahou Shoujo Ikusei Keikaku',
    quality: '720p',
    fromEp: 0,
    untilEp: 20000
  })

  t.is(data.length, 12)
  t.not(data[0], '')
})

test('/download Akame ga Kill! at 1080p exits and returns only 4 eps', async t => {
  const { data } = await axios.post(`${uri}/download`, {
    name: 'Akame ga Kill!',
    quality: '720p',
    fromEp: 3,
    untilEp: 6
  })

  t.is(data.length, 4)
  t.not(data[0], '')
})

test('/download with wrong entries exits and returns 204', async t => {
  const { status } = await axios.post(`${uri}/download`, {
    name: 'Non-existent anime',
    quality: '30p',
    fromEp: 3,
    untilEp: 6
  })

  t.is(status, 204)
})

test('/getLatest.json exits and returns 204 status at 30p', async t => {
  const { status } = await axios.get(`${uri}/getLatest.json?quality=30p`)

  t.is(status, 204)
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

test('/news.json route exits and returns 200 elements', async t => {
  const { data } = await axios.get(`${uri}/news.json`)

  t.is(data.length, 200)
})

test('/getHistory', async t => {
  const { data, status } = await axios.get(`${uri}/getHistory`)

  t.is(status, 200)
  t.not(data, undefined)
})

// Close server and ask nuxt to stop listening to file changes
test.after('Closing server and server.test.js', () => {
  server.close()
  nuxt.close()
})
