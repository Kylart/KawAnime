const { homedir } = require('os')
const { copyFileSync, existsSync, mkdirSync } = require('fs')
const { join, basename } = require('path')

const IS_CI = process.env.CI || process.env.APPVEYOR

const ROOT_PATH = join(__dirname, '..', '..', '..')

const PUBLIC_DIR = join(ROOT_PATH, 'public')
const DIST_DIR = join(ROOT_PATH, 'dist')
const BINDINGS_BUILD_PATH = join(ROOT_PATH, 'bindings', 'build', 'Release')

function moveToPublic (filepath) {
  try {
    console.log(`[KawAnime] Copying ${filepath} to public directory.`)

    copyFileSync(
      filepath,
      join(PUBLIC_DIR, basename(filepath))
    )
  } catch (e) {
    console.warn(`[KawAnime] Could not find ${filepath}`)
  }
}

function moveToDist (filepath) {
  if (!existsSync(DIST_DIR)) mkdirSync(DIST_DIR)

  try {
    console.log(`[KawAnime] Copying ${filepath} to dist directory.`)

    copyFileSync(
      filepath,
      join(DIST_DIR, basename(filepath))
    )
  } catch (e) {
    console.warn(`[KawAnime] Could not find ${filepath}`)
  }
}

function windows () {
  const sys32Path = IS_CI ? 'C:\\OpenSSL-Win64' : join(homedir().split('\\')[0], 'Windows', 'System32')
  const requiredDlls = [
    IS_CI ? 'libeay32.dll' : 'libcrypto-1_1-x64.dll',
    IS_CI ? 'ssleay32.dll' : 'libssl-1_1-x64.dll'
  ].map((dll) => join(sys32Path, dll))

  requiredDlls.push(join(BINDINGS_BUILD_PATH, 'torrent-rasterbar.dll'))

  requiredDlls.forEach(moveToPublic)
  requiredDlls.forEach(moveToDist)
}

windows()
