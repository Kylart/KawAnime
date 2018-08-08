import test from 'ava'
import request from 'supertest'

import { makeApp } from './utils.js'

test('/seasons.json route exits and returns elements on Spring 2017', async (t) => {
  const { body } = await request(makeApp())
    .get('/seasons.json')
    .query({
      season: 'spring',
      year: 2017
    })

  t.true(body.TV.length > 1)
  t.true(body.OVAs.length > 1)
  t.true(body.Movies.length > 1)
})

test('/seasons.json route exits and returns elements on Fall 2016', async (t) => {
  const { body } = await request(makeApp())
    .get('/seasons.json')
    .query({
      season: 'fall',
      year: 2016
    })

  t.true(body.TV.length > 1)
  t.true(body.OVAs.length > 1)
  t.true(body.Movies.length > 1)
})

test('/seasons.json route exits and returns and log a error message on Fall 201', async (t) => {
  const { status } = await request(makeApp())
    .get('/seasons.json')
    .query({
      season: 'fall',
      year: 201
    })

  t.is(status, 204)
})
