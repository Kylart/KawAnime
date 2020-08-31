const fs = require('fs')
const path = require('path')

/**
 * Taken from https://gist.github.com/kethinov/6658166#gistcomment-2389484
 *
 * Find all files inside a dir, recursively.
 * @function getAllFiles
 * @param  {string} dir Dir path string.
 * @return {string[]} Array with all file names that are inside the directory.
 */
const getAllFiles = (dir) =>
  fs.readdirSync(dir).reduce((files, file) => {
    const name = path.join(dir, file)
    const isDirectory = fs.statSync(name).isDirectory()
    return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name]
  }, [])

const VERSION = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'))).version
const VENDOR_PATH = path.join(__dirname, 'src', 'vendor')
const BIDNINGS_PATH = path.join(__dirname, 'bindings')

process.env.VUE_APP_KAWANIME_VERSION = VERSION

module.exports = {
  configureWebpack: {
    devtool: 'source-map',
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src', 'renderer'),
        vendor: VENDOR_PATH
      }
    },
    entry: {
      app: './src/renderer/main.js'
    }
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: 'KawAnime',
        productName: 'KawAnime',

        // See https://github.com/electron-userland/electron-builder/issues/2738#issuecomment-378837434
        // Not needed anyway
        asar: false,

        dmg: {
          contents: [
            {
              x: 150,
              y: 90
            },
            {
              x: 150,
              y: 275,
              type: 'link',
              path: '/Applications'
            }
          ]
        },
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true
        },
        fileAssociations: [
          {
            ext: 'torrent',
            name: 'Torrent files'
          }
        ],
        protocols: [{
          name: 'kawanime-app-external',
          schemes: [
            'kawanime-app'
          ]
        }],
        linux: {
          category: 'Network'
        },
        mac: {
          identity: null // Disables Signing, no money
        }
      },
      chainWebpackMainProcess: (config) => {
        // Chain webpack config for electron main process only
        config
          .module
          .rule('node')
          .test(/\.node$/)
          .use('native-ext-loader')
          .loader('native-ext-loader')
          .end()

        config
          .resolve
          .alias
          .set('vendor', VENDOR_PATH)
          .set('kawabinds', BIDNINGS_PATH)
          .set('plugin', process.env.NODE_ENV === 'development' ? path.join(__dirname, 'public') : __dirname)
      },
      chainWebpackRendererProcess: (config) => {
        // Chain webpack config for electron renderer process only
        // The following example will set IS_ELECTRON to true in your app
        config.plugin('define').tap((args) => {
          args[0].IS_ELECTRON = true
          return args
        })
      },
      // Use this to change the entrypoint of your app's main process
      mainProcessFile: 'src/main/index.js',
      // Provide an array of files that, when changed, will recompile the main process and restart Electron
      // Your main process file will be added by default
      mainProcessWatch: getAllFiles('src/main'),
      outputDir: 'dist'
    }
  }
}
