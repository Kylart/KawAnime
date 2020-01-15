/* global __static */

import { join } from 'path'
/**
 * Configure app to use MPV player.
 *
 * @param {import('electron').App} app
 */
export default function (app) {
  // Absolute path to the plugin directory.
  const pluginDir = process.env.NODE_ENV === 'development'
    ? join(__static, 'mpv')
    : join(__static, '..', 'mpv')

  const pluginPath = join(pluginDir, 'mpvjs.node;application/x-mpvjs')

  // See pitfalls section for details.
  if (process.platform !== 'linux') process.chdir(pluginDir)

  // To support a broader number of systems.
  app.commandLine.appendSwitch('ignore-gpu-blacklist')
  app.commandLine.appendSwitch('register-pepper-plugins', pluginPath)
}
