export default {
  setUp ({ rootState }) {
    try {
      const sound = rootState.config.config.sound
      document.player = new window.Audio()
      document.player.src = `static/sounds/${sound}.mp3`
      document.player.volume = 0.5
    } catch (e) { void e }
  },
  play () {
    if (!document.player.src.includes('sounds/None.mp3')) {
      document.player.currentTime = 0
      document.player.play()
    }
  },
  testSound ({ rootState }) {
    const { sound } = rootState.config.config

    if (sound !== 'None') {
      if (sound !== 'None') {
        const back = document.player.src

        document.player.src = `static/sounds/${sound}.mp3`
        document.player.currentTime = 0

        document.player.play()
          .then(() => {
            setTimeout(() => {
              document.player.src = back
            }, 2500)
          })
      }
    }
  }
}
