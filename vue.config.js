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

module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: 'KawAnime',
        productName: 'KawAnime',
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
        linux: {
          category: 'Network'
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
        ]
      },
      chainWebpackMainProcess: (config) => {
        // Chain webpack config for electron main process only
      },
      chainWebpackRendererProcess: (config) => {
        // Chain webpack config for electron renderer process only
        // The following example will set IS_ELECTRON to true in your app
        config.plugin('define').tap((args) => {
          args[0]['IS_ELECTRON'] = true
          return args
        })
      },
      // Use this to change the entrypoint of your app's main process
      mainProcessFile: 'src/background/index.js',
      // Provide an array of files that, when changed, will recompile the main process and restart Electron
      // Your main process file will be added by default
      mainProcessWatch: getAllFiles('src/background'),
      // [1.0.0-rc.4+] Provide a list of arguments that Electron will be launched with during 'electron:serve',
      // which can be accessed from the main process (src/background.js).
      // Note that it is ignored when --debug flag is used with 'electron:serve', as you must launch Electron yourself
      // Command line args (excluding --debug, --dashboard, and --headless) are passed to Electron as well
      // mainProcessArgs: ['--arg-name', 'arg-value']
      outputDir: 'dist'
    }
  }
}
