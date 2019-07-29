import generate from './generate'

const events = [
  'config',
  'local',
  'watchLists'
]

export default events.reduce((acc, evt) => {
  const _update = `${evt}:update`
  const _get = `${evt}:get`

  acc[evt] = {
    update: generate(_update),
    get: generate(_get)
  }

  return acc
}, {})
