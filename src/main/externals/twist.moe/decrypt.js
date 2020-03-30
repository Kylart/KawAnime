import { AES, enc } from 'crypto-js'

import { DECRYPT_KEY } from './utils'

/**
 * Decrypts base64 encoded source.
 *
 * @param {String} toDecrypt
 */
export default function (toDecrypt) {
  try {
    return AES.decrypt(toDecrypt, DECRYPT_KEY).toString(enc.Utf8)
  } catch (e) {
    return null
  }
}
