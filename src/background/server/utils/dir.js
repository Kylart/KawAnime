import { app } from 'electron'
import { join } from 'path'

export default process.env.IS_TEST !== 'true'
  ? join(app.getPath('userData'), 'appFiles')
  : join(app.getPath('home'), '.KawAnime-test')
