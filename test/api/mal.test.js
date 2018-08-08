import test from 'ava'
import request from 'supertest'

import { makeApp } from './utils.js'
import clean from '../clean.js'

test.after('Cleaning', clean)

test.skip('/getWatchList route exits and return an array containing entries', async t => {
  const { body, status } = await request(makeApp())
    .get('/getWatchList')
    .query('user', 'Kylart')

  t.is(status, 200)
  t.is(typeof body, 'object')
  t.not(body.length, 0)
  t.not(body[0].status, undefined)
  t.not(body[0].id, undefined)
})
