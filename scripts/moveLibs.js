const { readdirSync, copyFileSync } = require('fs')
const { join } = require('path')

const PUBLIC_DIR = join(__dirname, '..', 'public')
const BINDINGS_BUILD_DIR = join(__dirname, '..', 'bindings', 'build', 'Release')

const FILE_NAME = {
  darwin: 'libtorrent-rasterbar.10.dylib',
  win32: 'libtorrent-rasterbar.dll'
}[process.platform] || '.so'

readdirSync(BINDINGS_BUILD_DIR)
  .forEach((file) => {
    if (file !== FILE_NAME) return

    console.log(`[KawAnime] Moving ${file} to public directory.`)

    copyFileSync(
      join(BINDINGS_BUILD_DIR, file),
      join(PUBLIC_DIR, file)
    )
  })
