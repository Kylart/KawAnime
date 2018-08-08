import test from 'ava'
import request from 'supertest'
import { join } from 'path'
import { readFileSync } from 'fs'

import { DIR, makeApp } from './utils.js'
import clean from '../clean.js'

test.after.cb('Cleaning', clean)

test('/getConfig.json route exits and returns json with right keys', async (t) => {
  const { body: data } = await request(makeApp())
    .get('/getConfig.json')

  t.not(data, undefined)
  t.not(data.config, undefined)
  t.not(data.config.fansub, undefined)
  t.not(data.config.quality, undefined)
  t.not(data.config.localPath, undefined)
  t.not(data.config.inside, undefined)
  t.not(data.config.magnets, undefined)
})

test('/saveConfig route saves config and return 200', async (t) => {
  const dummyConf = {
    fansub: 'Blabla',
    quality: '564p'
  }

  const { status } = await request(makeApp())
    .post(`/saveConfig`)
    .send(dummyConf)

  t.is(status, 200)

  const config = readFileSync(join(DIR, 'config.json'), 'utf-8')

  t.is(config, JSON.stringify(dummyConf))
})
