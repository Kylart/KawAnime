/**
 * Created by Kylart on 26/07/2017.
 */

export {default as axios} from 'axios'

export const log = (message) => {
  console.log(`[${(new Date()).toLocaleTimeString()}]: ${message}`)
}

export const isRoot = {
  root: true
}
