import { homedir } from 'os'
import { join } from 'path'

const BASE_PATH = homedir()

export default process.env.NODE_ENV !== 'KawAnime-test'
  ? join(BASE_PATH, '.KawAnime')
  : join(BASE_PATH, '.KawAnime-test')
