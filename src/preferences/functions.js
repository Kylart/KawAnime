/**
 * Created by Kylart on 18/03/2017.
 */

const self = this

const path = require('path')
const player = require('play-sound')(opts = {})

/** TODO :
 * Preferences for :
 *  -- News inside / outside
 */

exports.playSound = (name) => {
  if (name === 'None') return

  player.play(path.join(__dirname, '..', '..', 'resources', `${name}.m4a`), (err) => {
    if (err) throw err
  })
}