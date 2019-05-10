import { createHash } from 'crypto'

export default function (name) {
  return createHash('md5').update(name).digest('hex')
}
