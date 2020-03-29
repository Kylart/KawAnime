const { homedir } = require('os')
const { copyFileSync } = require('fs')
const { join, basename } = require('path')

const PUBLIC_DIR = join(__dirname, '..', 'public')

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
  const sys32Path = join(homedir().split('\\')[0], 'Windows', 'System32')
  const requiredDlls = [
    'libcrypto-1_1-x64.dll',
    'libssl-1_1-x64.dll'
  ].map((dll) => join(sys32Path, dll))

  requiredDlls.forEach(moveToPublic)
}

if (process.platform === 'win32') windows()
else linux()
