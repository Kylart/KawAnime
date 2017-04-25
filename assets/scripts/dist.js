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

const packager = require('electron-packager')

const colors = require('colors')

const packOptions = {
  name: 'KawAnime',
  dir: join(__dirname, '..', '..'),
  out: join(__dirname, '..', 'build', 'dists'),
  appCopyright: `© 2016 - ${(new Date()).getYear() + 1900} Kylart`,
  all: true,
  icon: join(__dirname, '..', 'build', 'material', 'icon'),
  overwrite: true
  // Check for signing app
}

const buildDists = () => {

}

const pack = () => {
  packager(packOptions, function done_callback(err, appPaths) {
    if (err) throw err

    appPaths.forEach((path) => {
      console.log(`[Builder]: Successfully built ${path}!`.green)
    })

    buildDists()
  })
}

(() => pack())()