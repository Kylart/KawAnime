/**
 * Inspired from https://github.com/avajs/ava/blob/master/docs/recipes/endpoint-testing.md
 *
 * Supertest documentation: https://github.com/visionmedia/supertest
 * Ava documentation: https://github.com/avajs/ava
 */

import request from 'supertest'
import test from 'ava'
import fs from 'fs'
import _ from 'lodash'
import chalk from 'chalk'
import clean from '../clean.js'

import { makeApp, kawAnimeFilesPath } from './utils.js'

test.afterEach.always('Cleaning...', clean)

test('KawAnime\'s needed files are generated if not there.', async (t) => {
  t.plan(5)

  await request(makeApp()).get('/')

  _.each(kawAnimeFilesPath, (path, name) => {
    if (typeof path === 'object') return

    console.log(chalk.blueBright(`> Checking ${chalk.italic.bold(name)} which should be at ${chalk.bold(path)}...`))

    const err = fs.accessSync(path)

    t.is(err, undefined)
  })
})
