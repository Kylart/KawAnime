import { app } from 'electron'
import { join } from 'path'

export default process.env.NODE_ENV !== 'KawAnime-test'
  ? join(app.getPath('userData'), 'appFiles')
  : join(app.getPath('home'), '.KawAnime-test')
