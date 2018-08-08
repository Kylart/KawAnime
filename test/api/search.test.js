import test from 'ava'
import request from 'supertest'

import { makeApp } from './utils.js'
import clean from '../clean.js'

test.after('Cleaning', clean)

test.beforeEach.cb((t) => {
  setTimeout(t.end, 5 * 1000)
})

test('/searchTermOnMal route exits and return 10 elements', async (t) => {
  try {
    const { body, status } = await request(makeApp())
      .get('/searchTermOnMal')
      .query({
        term: 'sakura trick'
      })

    t.is(status, 200)
    t.is(body.length, 10)
  } catch (e) {
    console.error(e)
    t.fail()
  }
})

test('/getInfoFromMal route exits if given name and return an object with name', async (t) => {
  const { body, status } = await request(makeApp())
    .get('/getInfoFromMal')
    .query({
      term: 'sakura trick'
    })

  t.is(status, 200)
  t.is(body.title, 'Sakura Trick')
})

test('/getInfoFromMal route exits if given url and return an object with name', async (t) => {
  const { body, status } = await request(makeApp())
    .get('/getInfoFromMal')
    .query({
      url: 'https://myanimelist.net/anime/20047/Sakura_Trick'
    })

  t.is(status, 200)
  t.is(body.title, 'Sakura Trick')
})
