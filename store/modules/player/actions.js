export default {
  setUp ({rootState}) {
    try {
      const sound = rootState.config.config.sound
      document.player = new window.Audio()
      document.player.src = `static/sounds/${sound}.m4a`
      document.player.volume = 0.5
    } catch (e) { void e }
  },
  play () {
    if (!document.player.src.includes('sounds/None.m4a')) {
      document.player.currentTime = 0
      document.player.play()
    }
  }
}
