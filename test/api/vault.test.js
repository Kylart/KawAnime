import test from 'ava'
import request from 'supertest'
import { statSync } from 'fs'
import { join } from 'path'

import clean from '../clean.js'
import { makeApp, kawAnimeFilesPath } from './utils.js'

test.afterEach.always.cb('Cleaning', clean)

test('/_setupCreds route exits and creates a bcup file along the master key which are retrievable', async (t) => {
  t.plan(3)

  const { status } = await request(makeApp())
    .post('/_setupAccount')
    .send({
      service: 'mal',
      credentials: {
        username: 'Hello',
        password: 'world'
      }
    })

  t.is(status, 200)

  try {
    statSync(kawAnimeFilesPath.vault.base)
    statSync(kawAnimeFilesPath.vault.key)
    statSync(kawAnimeFilesPath.vault.mal)
  } catch (e) {
    t.fail(e)
  }

  // Gettting those credentials
  const { getCreds } = require(join(__dirname, '..', '..', 'app', 'api', 'vault'))
  const credentials = await getCreds('mal')

  t.is(credentials.username, 'Hello')
  t.is(credentials.password, 'world')
})
