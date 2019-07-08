/**
 * We have to do it that way because we don't want to restart the app
 * several times. Restarting would mean spamming the providers and
 * might get us useless 429.
 *
 * Also, the end user will probably only start the app once.
 *
 * We'll make each app test so that it leaves the app in a neutral state,
 * meaning that any action should be possible once any test is done.
 */

describe('KawAnime main test routine', function () {
  this.timeout(30000)

  require('./hooks')()

  require('./container')
  require('./app')
})
