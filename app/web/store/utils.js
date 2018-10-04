/**
 * Created by Kylart on 26/07/2017.
 */

export { default as axios } from 'axios'
export { default as moment } from 'moment'
export { default as _ } from 'lodash'

export const log = (...messages) => {
  console.log(`[${(new Date()).toLocaleTimeString()}]:`, ...messages)
}

export const isRoot = {
  root: true
}
