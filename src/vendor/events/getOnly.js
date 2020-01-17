import generate from './generate'

const events = [
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
  'analytics',
  'parse',
  'preventSleep'
]

export default events
  .reduce(
    (acc, evt) => (acc[evt] = generate(evt)) && acc,
    {}
  )
