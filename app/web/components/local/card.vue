<template lang="pug">
  v-hover
    v-card(hover, slot-scope='{ hover }')
      v-img(
          :src="picture || ''",
          :lazy-src="picture || ''",
          height='250px'
        )
        transition-group(name='overlay-trans')
          v-container.overlay(
            v-if='hover',
            key='overlay',
            fill-height,
            fluid,
            pa-0
          )
            v-layout(fill-height, align-center row, wrap)
              v-flex.overlay-icon(@click='play', xs6, fill-height)
                v-icon.large play_arrow
              v-flex.pa-0.download-container(xs6, fill-height)
                v-layout.ma-0(fill-height, column)
                  v-flex.overlay-icon(@click='more', xs6, fill-height)
                    v-icon.large more_horiz
                  v-flex.overlay-icon.delete(@click='remove', xs6, fill-height)
                    v-icon.large(color='#EF5350') delete

          v-container(
            v-else,
            key='main'
            fill-height,
            fluid,
            pa-0
          )
            v-layout.text(fill-height, column, justify-space-between)
              v-flex.entry-ep(xs2, v-if='file.episodeOrMovieNumber || file.animeType2')
                span(v-if='file.episodeOrMovieNumber') Ep. {{ file.episodeOrMovieNumber }}
                span(v-else) {{ file.animeType2 }}
              v-flex.text-xs-center(v-if='!picture', xs2)
                v-progress-circular(indeterminate)
              v-flex.entry-title(xs2)
                div {{ file.title }}

      v-card-actions
        v-layout.actions(justify-space-around)
          template(v-for='list in lists')
            v-tooltip(top, lazy)
              v-btn(
                slot='activator',
                @click='_addTo(list.list)',
                icon
              )
                v-icon(:color="_isIn(list.list) ? '#66BB6A' : 'default'") {{ list.icon }}
              span {{ _isIn(list.list) ? 'Remove from' : 'Add to' }} {{ list.name }}
</template>

<script>
import Status from 'mixins/lists/status.js'

export default {
  name: 'Local-Card',

  mixins: [ Status ],

  props: ['file', 'reset'],

  mounted () {
    this.getInfo()
  },

  data: () => ({
    info: null
  }),

  computed: {
    lists: {
      get () {
        return this.$store.state.watchLists.listNames
      },
      set () {}
    },
    inside: {
      get () {
        return this.$store.state.localFiles.inside
      },
      set () {}
    },
    picture () {
      return (this.info && this.info.picture) || null
    },
    name () {
      // Useful for list status mixins
      return this.file.title
    }
  },

  methods: {
    async searchInfo () {
      this.$log(`No local information for ${this.file.title}, retrieving...`)
      await this.$store.dispatch('info/get', this.file.title)

      // Checking if this worked
      const info = this.$store.state.info.info[this.file.title]

      if (info) {
        await this.$axios.post('local/save', {
          title: this.file.title,
          info
        })

        this.info = info
      } else {
        // Retrying in 20 secondes
        setTimeout(this.getInfo, 20 * 1000)
      }
    },
    async getInfo () {
      const { data, status } = await this.$axios.get('local/info', {
        params: { name: this.file.title }
      })

      if (status !== 200) {
        // Means it's time to look for those info
        await this.searchInfo()
        return
      }

      this.info = data
    },
    async remove () {
      await this.$axios.get('openThis', {
        params: {
          type: 'delete',
          path: this.file.path
        }
      })

      this.$store.dispatch('history/append', {
        type: 'Delete',
        text: `${this.file.title} - ${this.file.episodeOrMovieNumber || this.file.animeType2}`
      })

      this.$emit('refresh')
    },
    more () {
      if (this.info) {
        this.$emit('more', this.info, this.file)
      }
    },
    async play () {
      if (this.inside) {
        this.$store.commit('streaming/play', {
          show: true,
          link: {
            link: this.file.path,
            name: `${this.file.title} - ${this.file.episodeOrMovieNumber}`
          }
        })
      } else {
        await this.$axios.get('openThis', {
          params: {
            type: 'video',
            path: this.file.path
          }
        })
      }
    }
  },

  watch: {
    async reset (bool) {
      if (!bool) return

      await this.$axios.delete('local/reset', {
        params: {
          name: this.file.title
        }
      })

      await this.getInfo()

      this.$emit('reset')
    }
  }
}
</script>

<style lang="stylus" scoped>
  // Overlay part
  .overlay-trans-enter, .overlay-trans-leave-to
    opacity 0

  .overlay-trans-enter-active, .overlay-trans-leave
    transition all .5s

  .overlay
    background-color rgba(0, 0, 0, 0.7)

  .overlay-icon
    position relative
    display flex
    justify-content center
    align-items center
    transition all .25s
    cursor pointer

    &:hover
      background-color rgba(255, 255, 255, 0.20)

    .large
      font-size 72px

    &.delete:hover
      background-color rgba(200, 34, 30, 0.2)

  // Not overlay
  .text
    font-size 18px
    letter-spacing 0.07em
    font-weight bold
    color white

  .entry-title
    padding-top 10px
    background linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.01))

    div
      font-size 20px
      padding 8px
      text-align center

  .entry-ep
    text-align right
    font-size 18px
    letter-spacing 0.03em
    padding-top 0 !important

    span
      height 100%
      padding 8px 12px
      border-radius 0 0 0 3px
      background-color rgba(0, 0, 0, 0.6)

  .actions
    padding 4px 16px !important
</style>
