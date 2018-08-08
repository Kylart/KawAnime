import test from 'ava'
import request from 'supertest'
import { join } from 'path'

import { makeApp, DIR } from './utils.js'
import clean from '../clean.js'

test.after.cb('Cleaning', clean)

test('/getHistory route exits and returns history file', async (t) => {
  const { body, status } = await request(makeApp()).get('/getHistory')

  t.is(status, 200)
  t.not(body, undefined)
})

test('/appendHistory route exits and returns code 200 on play', async (t) => {
  const { status } = await request(makeApp())
    .post('/appendHistory')
    .send({
      type: 'Play',
      text: 'Test'
    })

  t.is(status, 200)

  const day = (new Date()).toDateString()
  const json = require(join(DIR, 'history.json'))

  t.pass(json[day][0])

  const entry = json[day][0]

  t.is(entry.text, 'Test')
  t.is(entry.type, 'Play')
})

test('/appendHistory route exits and returns code 200 on delete', async (t) => {
  const { status } = await request(makeApp())
    .post('/appendHistory')
    .send({
      type: 'Delete',
      text: 'Test'
    })

  t.is(status, 200)

  const day = (new Date()).toDateString()
  const json = require(join(DIR, 'history.json'))

  t.pass(json[day][0])

  const entry = json[day][0]

  t.is(entry.text, 'Test')
  t.is(entry.type, 'Delete')
})

test('/removeFromHistory route exits and returns code 200', async (t) => {
  const { body } = await request(makeApp()).get('/getHistory')

  const date = (new Date()).toDateString()
  const time = body[date].time

  const { status } = await request(makeApp())
    .post('/removeFromHistory')
    .send({
      date: date,
      info: {
        time: time,
        text: 'Test',
        type: 'Delete'
      }
    })

  t.is(status, 200)
})
