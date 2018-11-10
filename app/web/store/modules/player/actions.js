export default {
  setUp ({ rootState }) {
    try {
      const sound = rootState.config.config.sound
      const volume = rootState.config.config.notificationVolume
      document.player = new window.Audio()
      document.player.src = `static/sounds/${sound}.mp3`
      document.player.volume = volume
    } catch (e) { void e }
  },
  play () {
    if (!document.player.src.includes('sounds/None.mp3')) {
      document.player.currentTime = 0
      document.player.play()
    }
  }
}
