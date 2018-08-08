import test from 'ava'
import request from 'supertest'

import { makeApp } from './utils.js'

test('/news.json route exits and returns 160 elements', async t => {
  const { body, status } = await request(makeApp()).get('/news.json')

  status === 200
    ? t.is(body.length, 160)
    : status === 204
      ? t.is(body.length, 0)
      : t.fail()
})
