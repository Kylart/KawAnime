import { app } from 'electron'
import { join } from 'path'

/**
 * @type {String} Absolute path to the app's directory
 */
export default process.env.IS_TEST !== 'true'
  ? join(process.env.PORTABLE_EXECUTABLE_DIR || app.getPath('userData'), 'appFiles')
  : join(app.getPath('home'), '.KawAnime-test')
