<template lang="pug">
  v-row(dense, justify='space-between', align='center')
    v-col(cols='2')
      .subtitle-2.pl-2.overline {{ episode.aired || 'N/A' }}

    v-col(cols='6')
      v-tooltip(top)
        template(v-slot:activator='{ on }')
          .name.ellipsis(v-on='on') {{ episode.title || 'Unknown title' }}

        span {{ episode.title || 'Unknown title' }}

    v-col
      .subtitle-2.text-center Ep. {{ episode.epNumber }}

    template(v-if='hasLinks')
      v-col
        v-select(
          v-model='quality',
          :items='qualities',
          label='Quality',
          hide-details
        )

    template(v-if='hasLinks || episode.discussionLink')
      v-col.d-flex.justify-space-around
        template(v-if='hasLinks')
          v-btn(
            @click='watch',
            icon
          )
            v-icon play_circle_outline
          v-btn(
            @click='download',
            icon
          )
            v-icon file_download

        template(v-if='episode.discussionLink')
          v-btn(
            @click='openLink(episode.discussionLink)',
            icon
          )
            v-icon forum
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Episode',

  props: {
    episode: {
      type: Object,
      required: true
    }
  },

  mounted () {
    this.quality = this.videoSettings.quality || this.qualities[0]
  },

  data: () => ({
    quality: null
  }),

  computed: {
    ...mapGetters('config', ['videoSettings']),

    hasLinks () {
      return !!this.episode.links
    },
    qualities () {
      if (this.hasLinks) {
        return this.episode.links
          .map(({ quality }) => quality)
          .sort((a, b) => parseInt(a.replace('p')) - parseInt(b.replace('p'))).reverse()
      }

      return []
    }
  },

  methods: {
    getCurrentMagnet () {
      return this.episode.links.find(({ quality }) => quality === this.quality)
    },
    openLink (link) {
      if (link) this.$electron.shell.openExternal(link)
    },

    watch () {
      const magnet = this.getCurrentMagnet()

      this.$store.dispatch('streaming/play', {
        isTorrent: true,
        link: magnet.link,
        name: `${magnet.name} - ${this.episode.epNumber}`
      })
    },
    download () {
      const magnet = this.getCurrentMagnet()

      this.openLink(magnet.link)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .name
    font-size 16px
    font-style italic
    letter-spacing 0.03em
    font-weight 300
</style>
