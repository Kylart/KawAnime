/* global __static */

// import bindings from './build/Release/kawabinds.node'
import { join } from 'path'

const bindings = process.env.NODE_ENV === 'development'
  ? './build/Release/kawabinds.node'
  : join(__static, 'kawabinds', 'kawabinds.node')

export default bindings
