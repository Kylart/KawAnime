import test from 'ava'
import request from 'supertest'
import { writeFileSync } from 'fs'
import { join } from 'path'

import { makeApp, DIR } from './utils.js'
import clean from '../clean.js'

test.after.cb('Cleaning', clean)

test.before((t) => {
  makeApp()

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
})

test('/local.json route exists and returns three files and code 200', async (t) => {
  const { body, status } = await request(makeApp())
    .get('/local.json')
    .query({
      dir: join(__dirname, '..', 'resources')
    })

  t.is(status, 200)

  t.is(body.length, 3)

  t.is(body[1].name, 'Sakura Trick')
  t.is(body[1].ep, 1)
  t.is(body[0].name, 'Rewrite')
  t.is(body[2].name, 'Rewrite')
  t.is(body[0].ep, 1)
  t.is(body[2].ep, 2)
})

test('/local.json route exits and returns empty array on empty directory', async (t) => {
  const { body, status } = await request(makeApp())
    .get('/local.json')
    .query({ dir: __dirname })

  t.is(status, 200)

  t.is(body.length, 0)
})

test('/resetLocal route exits and deletes some body', async (t) => {
  const { body, status } = await request(makeApp())
    .get('/resetLocal')
    .query({
      dir: join(__dirname, '..', 'resources')
    })

  t.is(status, 200)

  t.is(body[1].name, 'Sakura Trick')
  t.is(body[1].ep, 1)
  t.is(body[0].name, 'Rewrite')
  t.is(body[2].name, 'Rewrite')
  t.is(body[0].ep, 1)
  t.is(body[2].ep, 2)
})
