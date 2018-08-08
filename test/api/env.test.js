import test from 'ava'
import request from 'supertest'

import { makeApp } from './utils.js'
import clean from '../clean.js'

test.after('Cleaning', clean)

test('/_env route exits and return string containing platform\'s name', async (t) => {
  const { body, status } = await request(makeApp()).get('/_env')

  t.is(status, 200)
  t.is(typeof body.platform, 'string')
})
