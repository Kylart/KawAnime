<template lang="pug">
  v-container(fluid)
    v-card(flat)
      v-card-text.pa-0.characters(
        v-if='!loading'
      )
        template(v-for='(episode, index) in Object.values(episodes).reverse()')
          v-container.py-0(fluid)
            episode(
              :key='index',
              :episode='episode'
            )

            v-divider

      v-card-text.text-center(v-else)
        v-progress-circular(indeterminate)
</template>

<script>
import { mapState } from 'vuex'
import { merge } from 'lodash'

// Components
import Episode from '@/components/info/episode.vue'

// Mixins
import Info from '@/mixins/info/info.js'

export default {
  name: 'Episodes',

  components: { Episode },

  mixins: [
    // Brings `info` prop
    Info
  ],

  props: {
    current: {
      type: Object,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },

  data: () => ({
    loading: true
  }),

  mounted () {
    if (this.hasInfo || this.hasLinks) {
      this.loading = false
      return
    }

    // We need to get the episode info to be here beforehand
    this.$ipc.once(this.$eventsList.episodes.success, this.getLinks)

    if (!this.hasInfo) {
      this.$store.dispatch('info/getEps', {
        name: this.title || this.info.title.en,
        id: this.info.id,
        malId: this.info.malId
      })
    }
  },

  computed: {
    ...mapState('releases', {
      config: 'params'
    }),

    episodesInfo () {
      return this.info.episodesInfo
    },
    episodesLinks () {
      return this.info.episodesLinks
    },

    hasLinks () {
      return !!this.episodesLinks &&
        !!this.episodesLinks.magnets &&
        !!this.episodesLinks.magnets.length
    },
    links () {
      if (!this.hasLinks) return {}

      return this.episodesLinks.magnets.reduce((acc, link) => {
        if (!acc[link.nb]) acc[link.nb] = []

        acc[link.nb].push(link)

        return acc
      }, {})
    },
    formattedLinks () {
      if (this.hasLinks) {
        return Object.keys(this.links).reduce((acc, epNumber) => ({
          [epNumber]: {
            links: this.links[epNumber],
            epNumber
          },
          ...acc
        }), {})
      }

      return {}
    },

    hasInfo () {
      return !!this.episodesInfo && !!this.episodesInfo.length
    },
    episodes () {
      if (this.hasInfo) {
        return merge(
          this.episodesInfo.reduce((acc, info) => ({
            [info.epNumber]: {
              ...info,
              links: this.hasLinks && this.links[info.epNumber]
            },
            ...acc
          }), {}),
          this.formattedLinks
        )
      }

      if (this.hasLinks) return this.formattedLinks

      return {}
    }
  },

  methods: {
    refresh () {
      this.$emit('refresh')
    },
    getLinks (e, { name }) {
      if (name === this.title && !this.hasLinks) {
        this.$ipc.once(this.$eventsList.download.error, () => { this.refresh() })
        this.$ipc.once(this.$eventsList.download.success, (e, { magnets }) => {
          this.$store.commit('info/addEpsLinks', { name, data: magnets })

          this.refresh()
        })

        this.$store.dispatch('info/getEpsLinks', {
          name: this.title,
          config: {
            fansub: this.current.releaseGroup || this.config.fansub,
            feed: this.config.feed
          }
        })
      }
    }
  }
}
</script>
