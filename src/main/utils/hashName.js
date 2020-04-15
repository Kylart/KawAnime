import { createHash } from 'crypto'

/**
 * Returns the MD5 hash of a given string
 *
 * @param {String} value Value to hash
 * @returns {String}
 */
export default function (value) {
  return createHash('md5').update(value).digest('hex')
}
