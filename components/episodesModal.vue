<template lang="pug">
  v-dialog(v-model='values.show', lazy, absolute, max-width='1000', @keydown.esc='close()')
    v-card.white--text
      v-card-title.pb-2.pt-2
        h2.title.white--text.mb-0.entry-title.ellipsis Episodes for #[strong {{ values.title }}]
      v-divider
      v-card-text.subheading.white--text
        v-container(fluid grid-list-md)
          v-layout(row wrap)
            v-flex(xs4 v-for='episode in Object.keys(episodes)' :key='episode')
              v-card
                v-card-media(:src='values.infos.picture' height='125px')
                  h4.mx-2 {{ episode }}
                v-card-actions
                  v-spacer
                  v-btn(
                    v-for='(data, i) in episodes[episode]',
                    :key='i',
                    flat,
                    small,
                    outline,
                    color='blue',
                    @click='watch(episode, i)') {{ data.quality }}
      v-card-actions
        v-spacer
        v-btn.blue--text.darken-1(flat, @click='close()') Thanks!
</template>

<script>
  export default {
    computed: {
      values () {
        return this.$store.state.videoPlayer.modal
      },
      show () {
        return this.values.show
      },
      episodes () {
        const episodes = {}
        const qualityList = ['480p', '720p', '1080p']

        this.values.magnets.forEach(({ link, name }) => {
          qualityList.forEach(quality => {
            if (name.includes(`[${quality}]`)) {
              const n = /(\d+)/.exec(name)[1]
              if (!(n in episodes)) episodes[n] = []
              episodes[n].push({
                quality,
                link
              })
            }
          })
        })

        this.$_.each(episodes, (data) => {
          data.sort(({ quality: q1 }, { quality: q2 }) => qualityList.indexOf(q1) - qualityList.indexOf(q2))
        })

        return episodes
      }
    },
    watch: {
      show () {
        this.show && this.$store.dispatch('player/play')
      }
    },
    methods: {
      close () {
        this.$store.commit('videoPlayer/closeModal')
      },
      watch (episode, i) {
        this.close()
        this.$store.commit('videoPlayer/play', {
          show: true,
          link: {
            name: `${this.values.title} - ${episode}`,
            link: this.episodes[episode][i].link
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>