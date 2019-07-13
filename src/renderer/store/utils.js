/**
 * Created by Kylart on 26/07/2017.
 */

export { ipcRenderer } from 'electron'
export { default as moment } from 'moment'
export { default as _ } from 'lodash'

export const log = (...messages) => {
  console.log(`[${(new Date()).toLocaleTimeString()}]:`, ...messages) // eslint-disable-line no-console
}

export const isRoot = {
  root: true
}
