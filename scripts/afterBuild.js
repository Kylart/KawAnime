const { resolve, extname } = require('path')
const { copyFileSync, readdirSync, mkdirSync, existsSync } = require('fs')

const NATIVE_ADDON_RELEASE_PATH = resolve(__dirname, '..', 'bindings', 'build', 'Release')
const BUNDLE_PATH = resolve(__dirname, '..', 'dist', 'bundled')

const MPV_PUBLIC_PATH = resolve(__dirname, '..', 'public', 'mpv')
const MPV_PATH = resolve(__dirname, '..', 'dist', 'mpv')

const actions = {
  win32: windows
}

function moveNativeAddonFiles () {
  const nativeFiles = readdirSync(NATIVE_ADDON_RELEASE_PATH)

  nativeFiles.forEach((filename) => {
    if (['.dll', '.lib'].includes(extname(filename))) {
      console.log(`Moving ${filename} to ${BUNDLE_PATH}`)

      copyFileSync(
        resolve(NATIVE_ADDON_RELEASE_PATH, filename),
        resolve(BUNDLE_PATH, filename)
      )
    }
  })
}

function moveMPVFiles () {
  const mpvFiles = readdirSync(MPV_PUBLIC_PATH)

  if (!existsSync(MPV_PATH)) mkdirSync(MPV_PATH)

  mpvFiles.forEach((filename) => {
    if (['.dll', '.node'].includes(extname(filename))) {
      console.log(`Moving ${filename} to ${MPV_PATH}`)

      copyFileSync(
        resolve(MPV_PUBLIC_PATH, filename),
        resolve(MPV_PATH, filename)
      )
    }
  })
}

function windows () {
  moveNativeAddonFiles()
  moveMPVFiles()
}

(
  actions[process.platform] || (() => {})
)()
