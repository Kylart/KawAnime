const { homedir } = require('os')
const { copyFileSync } = require('fs')
const { join, basename } = require('path')

const IS_CI = process.env.CI || process.env.APPVEYOR

const PUBLIC_DIR = join(__dirname, '..', 'public')
const BINDINGS_BUILD_PATH = join(__dirname, '..', 'bindings', 'build', 'Release')

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

function linux () {
  // TODO
}

function windows () {
  const sys32Path = IS_CI ? 'C:\\OpenSSL-Win64' : join(homedir().split('\\')[0], 'Windows', 'System32')
  const requiredDlls = [
    IS_CI ? 'libeay32.dll' : 'libcrypto-1_1-x64.dll',
    IS_CI ? 'ssleay32.dll' : 'libssl-1_1-x64.dll'
  ].map((dll) => join(sys32Path, dll))

  requiredDlls.push(join(BINDINGS_BUILD_PATH, 'torrent-rasterbar.dll'))

  requiredDlls.forEach(moveToPublic)
}

if (process.platform === 'win32') windows()
else linux()
