import chalk from 'chalk'
import test from 'ava'
import request from 'supertest'

import { makeApp } from './utils.js'

test.beforeEach.cb((t) => {
  setTimeout(t.end, 5 * 1000)
})

test('/getLatestNyaa exits and returns 18 elements with right keys at 720p on nyaa.si', async (t) => {
  const { body, status } = await request(makeApp())
    .get('/getLatestNyaa')
    .query({
      quality: '720p',
      choice: 'si',
      fansub: 'HorribleSubs'
    })

  if (status === 200) {
    t.is(body.length, 18)
    t.not(body[0].rawName, undefined)
    t.not(body[0].researchName, undefined)
    t.not(body[0].magnetLink, undefined)
    t.not(body[0].picture, undefined)
  } else if (status === 204 || status === 202) {
    t.is(body.length, undefined)
  } else {
    t.fail()
  }
})

test('/download Mahou Shoujo Ikusei Keikaku with HorribleSubs at 720p on nyaa.pantsu.cat exits and returns all magnets', async (t) => {
  const { body, status } = await request(makeApp())
    .post('/download')
    .send({
      name: 'Mahou Shoujo Ikusei Keikaku',
      quality: '720p',
      fromEp: 0,
      untilEp: 20000,
      fansub: 'HorribleSubs',
      choice: 'pantsu'
    })

  if (status === 200) {
    t.is(body.magnets.length, 12)
    t.not(body.magnets[0], '')
  } else {
    t.is(status, 204)
  }
})

test(
  '/download Mahou Shoujo Ikusei Keikaku with HorribleSubs at 720p on nyaa.si exits and returns all magnets',
  async (t) => {
    const { body, status } = await request(makeApp())
      .post('/download')
      .send({
        name: 'Mahou Shoujo Ikusei Keikaku',
        quality: '720p',
        fromEp: 0,
        untilEp: 20000,
        fansub: 'HorribleSubs',
        choice: 'si'
      })

    if (status === 200) {
      t.is(body.magnets.length, 12)
      t.not(body.magnets[0], '')
    } else {
      t.fail()
    }
  })

test(
  '/download Mahou Shoujo Ikusei Keikaku with HorribleSubs at 720p from ep 3 to 9 on nyaa.si exits and returns 7 magnets',
  async (t) => {
    const { body, status } = await request(makeApp())
      .post('/download')
      .send({
        name: 'Mahou Shoujo Ikusei Keikaku',
        quality: '720p',
        fromEp: 3,
        untilEp: 9,
        fansub: 'HorribleSubs',
        choice: 'si'
      })

    if (status === 200) {
      t.is(body.magnets.length, 7)
      t.not(body.magnets[0], '')
    } else if (status === 204) {
      t.is(body.magnets.length, 0)
    } else {
      t.fail()
    }
  })

test(
  '/download Mahou Shoujo Ikusei Keikaku with HorribleSubs at 720p from ep 3 to 9 on nyaa.pantsu.cat exits and returns all magnets',
  async (t) => {
    const { body, status } = await request(makeApp())
      .post('/download')
      .send({
        name: 'Mahou Shoujo Ikusei Keikaku',
        quality: '720p',
        fromEp: 3,
        untilEp: 9,
        fansub: 'HorribleSubs',
        choice: 'pantsu'
      })

    if (status === 200) {
      t.is(body.magnets.length, 7)
      t.not(body.magnets[0], '')
    } else if (status === 204) {
      console.info('An error occurred.')
      t.pass()
    } else {
      t.fail()
    }
  })

test('/getLatestNyaa exits and returns 18 elements with right keys at 720p on nyaa.pantsu.cat', async (t) => {
  const { body, status } = await request(makeApp())
    .get('/getLatestNyaa')
    .query('quality', '720p')
    .query('choice', 'pantsu')
    .query('fansub', 'HorribleSubs')

  if (status === 200) {
    t.is(body.length, 18)
    t.not(body[0].rawName, undefined)
    t.not(body[0].researchName, undefined)
    t.not(body[0].magnetLink, undefined)
    t.not(body[0].picture, undefined)
  } else if (status === 204 || status === 202) {
    console.info(chalk.yellow('> An error occurred while getting latest releases.'))
    t.is(body.length, undefined)
  } else {
    t.fail()
  }
})
