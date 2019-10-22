import generate from './generate'

const customs = {
  torrent: ['add', 'act', 'info'],
  history: ['append', 'remove', 'get'],
  search: ['url', 'name', 'term'],
  services: ['connect', 'act'],
  vault: ['get', 'update', 'check', 'has'],
  video: ['init', 'stop', 'subtitles', 'tracks', 'name'],
  streaming: ['init', 'subs', 'stop'],
  update: ['available', 'installable', 'install', 'progress'],
  localLists: ['get', 'update', 'info'],
  register: ['code', 'token', 'isAuthed', 'cta']
}

export default Object.keys(customs).reduce((acc, evt) => {
  const events = customs[evt]

  if (!acc[evt]) acc[evt] = {}

  events.forEach((eventName) => {
    const _key = [evt, eventName].join(':')

    acc[evt][eventName] = generate(_key)
  })

  return acc
}, {})
