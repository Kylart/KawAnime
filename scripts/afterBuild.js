const { resolve, extname } = require('path')
const { copyFileSync, readdirSync } = require('fs')

const NATIVE_ADDON_RELEASE_PATH = resolve(__dirname, '..', 'bindings', 'build', 'Release')
const BUNDLE_PATH = resolve(__dirname, '..', 'dist', 'bundled')

const actions = {
  win32: windows
}

function windows () {
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

(
  actions[process.platform] || (() => {})
)()
