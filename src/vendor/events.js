function generateEvents (name) {
  return {
    main: name,
    error: `${name}-error`,
    success: `${name}-success`
  }
}

const getOnly = [
  // Magnets provider
  'download',
  'latest',

  // Anime info provider
  'episodes',
  'news',
  'seasons',

  // Internal
  'env',
  'isOnline',
  'externalOpen',
  'analytics'
]

const updatable = [
  'config',
  'local',
  'watchLists'
]

const customs = {
  torrent: [ 'add', 'act', 'destroy', 'info', 'play', 'subs' ],
  history: [ 'append', 'remove', 'get' ],
  search: [ 'url', 'name', 'term' ],
  services: [ 'connect', 'act' ],
  vault: [ 'get', 'update', 'check', 'has' ],
  video: [ 'init', 'stop', 'subtitles', 'tracks', 'name' ],
  update: [ 'available', 'installable', 'install', 'progress' ],
  localLists: [ 'get', 'update', 'info' ],
  register: [ 'code', 'token', 'isAuthed', 'cta' ]
}

export default {
  // GET only
  ...getOnly.reduce((acc, evt) => (acc[evt] = generateEvents(evt)) && acc, {}),

  // Updatable
  ...updatable.reduce((acc, evt) => {
    const _update = `${evt}:update`
    const _get = `${evt}:get`

    acc[evt] = {
      update: generateEvents(_update),
      get: generateEvents(_get)
    }

    return acc
  }, {}),

  // Customs
  ...Object.keys(customs).reduce((acc, evt) => {
    const events = customs[evt]

    if (!acc[evt]) acc[evt] = {}

    events.forEach((eventName) => {
      const _key = [evt, eventName].join(':')

      acc[evt][eventName] = generateEvents(_key)
    })

    return acc
  }, {})
}
