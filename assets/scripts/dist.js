/**
 * Created by Kylart on 16/04/2017.
 */

/**
 * First check electron-packager api:
 *     https://github.com/electron-userland/electron-packager/blob/master/docs/api.md
 *
 * Then electron-installer dmg:
 *     https://github.com/mongodb-js/electron-installer-dmg
 *
 * Then windows-installer
 *     https://github.com/electron/windows-installer
 *
 * Then maybe ? (Linux)
 *     https://github.com/unindented/electron-installer-debian
 */

const {join} = require('path')

// packages
const packager = require('electron-packager')
const materialPath = join(__dirname, '..', 'build', 'material')

// Installers
const createDMG = require('electron-installer-dmg')

const colors = require('colors')

const packOptions = {
  name: 'KawAnime',
  dir: join(__dirname, '..', '..'),
  out: join(__dirname, '..', 'build', 'dists'),
  appCopyright: `© 2016 - ${(new Date()).getYear() + 1900} Kylart`,
  all: true,
  icon: join(materialPath, 'icon'),
  overwrite: true
  // Check for signing app
}

const dmgOptions = {
  appPath: join(materialPath, '..', 'dists', 'KawAnime-darwin-x64', 'KawAnime.app'),
  name: 'KawAnime',
  background: join(materialPath, 'background.png'),
  icon: join(materialPath, 'icon.icns'),
  overwrite: true,
  out: join(materialPath, '..', 'dists'),
  "icon-size": 80
}

const makeDMG = () => {
  console.log('[Builder]: Creating DMG...'.yellow)

  createDMG(dmgOptions, function done(err) {
    if (err)
    {
      console.log('[Builder]: An error occurred while creating DMG.'.red)
      throw err
    }

    console.log('[Builder]: Successfully built DMG!'.green)
  })
}

const buildDists = () => {
  makeDMG()
}

const pack = () => {
  packager(packOptions, function done_callback(err, appPaths) {
    if (err)
    {
      console.log('[Builder]: An occurred while packaging KawAnime!'.red)
      throw err
    }

    appPaths.forEach((path) => {
      console.log(`[Builder]: Successfully built ${path}!`.green)
    })

    buildDists()
  })
}

(() => pack())()