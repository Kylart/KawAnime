/**
 * Created by Kylart on 21/05/2017.
 */

import test from 'ava'
import Nuxt from 'nuxt'
import initFile from '../assets/scripts/init/main.js'
import http from 'http'
import colors from 'colors'
import {resolve, join} from 'path'
import {readFile} from 'fs'
import {userInfo} from 'os'

// We keep the nuxt and server instance
// So we can close them at the end of the test
let nuxt = null
let server = null

const DIR = join(userInfo().homedir, '.KawAnime')
let kawAnimeFilesPath = {
  local: join(DIR, 'locals.json'),
  history: join(DIR, 'history.json'),
  watchList: join(DIR, 'lists.json'),
  config: join(DIR, 'config.json')
}

// Init Nuxt.js and create a server listening on localhost:4000
test.before('Init Nuxt.js', async t => {
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
  server = new http.createServer(route)
  await nuxt.build()
  server.listen(4000)
  console.log(`KawAnime's server is at http://localhost:${server.address().port}`.green)
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

// Example of testing only generated html
test('Route / exits and renders title', async t => {
  let context = {}
  const { html } = await nuxt.renderRoute('/', context)
  t.true(html.includes('かわニメ'))
})

test('Route / exits and render loader', async t => {
  let context = {}
  const { html } = await nuxt.renderRoute('/', context)
  t.true(html.includes('少々お待ち下さいね〜'))
})

// Might be temporary only
test('Route /downloader exits and renders magnet switch', async t => {
  let context = {}
  const { html } = await nuxt.renderRoute('/downloader', context)
  t.true(html.includes('Get Magnets'))
})

test('Route /downloader exits and renders download button', async t => {
  let context = {}
  const { html } = await nuxt.renderRoute('/downloader', context)
  t.true(html.includes('Download!'))
})

// Needs fix from nuxt
// test('Route /downloader', async t => {
//   const window = await nuxt.renderAndGetWindow()
//   let element = window.document.querySelector('div.form-container')
//   t.not(element, null)
//   t.is(element.className, 'form-container')
//   t.is(element.children[0].className, '.row')
// })



// Close server and ask nuxt to stop listening to file changes
test.after('Closing server and nuxt.test.js', t => {
  server.close()
  nuxt.close()
})