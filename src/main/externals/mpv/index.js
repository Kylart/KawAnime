/* global __static */

import { join, dirname, relative, sep } from 'path'

/**
 * The MIME type associated with mpv.js plugin.
 * This is coming straight from mpvjs lib
 */
const PLUGIN_MIME_TYPE = 'application/x-mpvjs'

function containsNonASCII (str) {
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 255) {
      return true
    }
  }

  return false
}

/**
 * Return value to be passed to `register-pepper-plugins` switch.
 * This is coming straight from mpvjs lib
 *
 * @param {string} pluginDir - Plugin directory
 * @param {string} [pluginName=mpvjs.node] - Plugin name
 * @throws {Error} Resulting path contains non-ASCII characters.
 */
function getPluginEntry (pluginDir, pluginName = 'mpvjs.node') {
  const fullPluginPath = join(pluginDir, pluginName)

  // Try relative path to workaround ASCII-only path restriction.
  let pluginPath = relative(process.cwd(), fullPluginPath)

  if (dirname(pluginPath) === '.') {
    // "./plugin" is required only on Linux.
    if (process.platform === 'linux') {
      pluginPath = `.${sep}${pluginPath}`
    }
  } else {
    // Relative plugin paths doesn't work reliably on Windows, see
    // <https://github.com/Kagami/mpv.js/issues/9>.
    if (process.platform === 'win32') {
      pluginPath = fullPluginPath
    }
  }

  if (containsNonASCII(pluginPath)) {
    if (containsNonASCII(fullPluginPath)) {
      throw new Error('Non-ASCII plugin path is not supported')
    } else {
      pluginPath = fullPluginPath
    }
  }

  return `${pluginPath};${PLUGIN_MIME_TYPE}`
}

/**
 * Configure app to use MPV player.
 *
 * @param {import('electron').App} app
 */
export default function (app) {
  // Absolute path to the plugin directory.
  const pluginDir = join(__static, 'mpv')

  // See pitfalls section for details.
  if (process.platform !== 'linux') process.chdir(pluginDir)

  // To support a broader number of systems.
  app.commandLine.appendSwitch('ignore-gpu-blacklist')
  app.commandLine.appendSwitch('register-pepper-plugins', getPluginEntry(pluginDir))
}
