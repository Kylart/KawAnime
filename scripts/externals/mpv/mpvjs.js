/**
 * Our purpose here is to download the mpv.js node binary from the latest stable release
 * of this repository: https://github.com/Kagami/mpv.js
 *
 * We need to place it to public/mpv/mpvjs.node
 */

const { createWriteStream, renameSync, unlinkSync, copyFileSync } = require('fs')
const { join } = require('path')
const https = require('https')
const { URL } = require('url')

const targz = require('targz')
const rimraf = require('rimraf')

const LATEST_RELEASE_VERSION = 'v0.3.0'

const BASE_URL = 'https://github.com/Kagami/mpv.js/releases/download'

const BINARY_NAME = 'mpvjs.node'

const TARGET_DIR = join(__dirname, '..', '..', '..', 'public', 'mpv')
const TARGET_PATH = join(TARGET_DIR, BINARY_NAME)

// Forming name of the release zip file according to the platform and arch.
const downloadBinary = `mpv.js-${LATEST_RELEASE_VERSION}-node-v42-${process.platform}-${process.arch}.tar.gz`
const url = `${BASE_URL}/${LATEST_RELEASE_VERSION}/${downloadBinary}`

// It seems we have to download the file before decompressing it...
const tmpPath = join(__dirname, `tmp-${BINARY_NAME}.tar.gz`)

/**
 * Moves the wanted binary file to the right place and cleans up the temporary
 * files and directories
 */
function cleanUp () {
  renameSync(
    join(TARGET_DIR, 'build', 'Release', BINARY_NAME),
    TARGET_PATH
  )

  rimraf(join(TARGET_DIR, 'build'), (err) => {
    if (err) throw err
  })

  unlinkSync(tmpPath)

  console.log('KawAnime [PostInstall] -- Retrieved mpv.js binary.')
}

/**
 * Uncompress tar.gz file to the targeted firectory
 */
function decompress () {
  targz.decompress({
    src: tmpPath,
    dest: TARGET_DIR
  }, (err) => {
    if (err) throw err

    cleanUp()
  })
}

/**
 * Download and save the zip file to a temporary location
 *
 * @param {import('http').ServerResponse} response
 */
function saveFile (response) {
  // Creating temporary .tar.gz file
  response.pipe(createWriteStream(tmpPath))

  // We can decompress only when fully saved
  response.on('end', decompress)
}

if (process.platform === 'darwin') {
  copyFileSync(
    join(TARGET_DIR, 'macos', BINARY_NAME),
    join(TARGET_DIR, BINARY_NAME)
  )
} else {
  https.get(url, function (response) {
    // Following redirect
    if (response.statusCode > 300 && response.statusCode < 400 && response.headers.location) {
      const { hostname } = new URL(response.headers.location)

      if (hostname) {
        https.get(response.headers.location, saveFile)
      } else {
        throw new Error('Error while redirecting.')
      }
    } else {
      saveFile(response)
    }
  })
}
