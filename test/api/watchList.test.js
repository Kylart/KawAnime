import test from 'ava'
import request from 'supertest'
import { join } from 'path'

import { DIR, makeApp } from './utils.js'

test('/watchList route exits with actual file and returns code 200', async (t) => {
  const { body, status } = await request(makeApp()).get('/watchList.json')

  t.is(status, 200)

  t.not(body, undefined)
  t.true(body.watchList.length >= 0)
  t.true(body.watching.length >= 0)
  t.true(body.seen.length >= 0)
})

test('/saveWatchList exits and returns 200', async (t) => {
  let trueList = require(join(DIR, 'lists.json'))

  trueList.watching.push('Test')

  const { status } = await request(makeApp())
    .post('/saveWatchList')
    .send(trueList)

  t.is(status, 200)

  trueList = require(join(DIR, 'lists.json'))

  t.is(trueList.watching.slice(-1)[0], 'Test')
})
