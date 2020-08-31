<template lang="pug">
  //- We need feed, fansub and quality choice.
  v-card.elevation-12
    v-card-title.section-title Feed configuration
    v-divider
    v-card-text
      v-container(grid-list-lg, pa-0)
        v-row(justify='center')
          v-col(cols='12', sm='6', md='4')
            v-select(
              label='Feed',
              :items='feeds',
              v-model='feed',
              item-text='text',
              item-value='value',
              persistent-hint,
              hint='What torrent feed should be used?'
            )
          v-col(cols='12', sm='6', md='4')
            v-combobox(
              label='Fansub',
              :items='fansubs',
              v-model='fansub'
              persistent-hint,
              hint='What fansub do you want to check first?'
            )
          v-col(cols='12', sm='6', md='4')
            v-select(
              label='Quality',
              :items='order(qualities)',
              v-model='quality'
              persistent-hint,
              hint='What quality should the files have?'
            )

    v-card-actions.pr-3.pl-3
      v-spacer
      .conditions * All changes will be applied after restart
</template>

<script>
// Mixins
import Order from '@/mixins/config/order.js'
import Update from '@/mixins/config/update.js'

export default {
  name: 'Feed-Section',

  mixins: [Order, Update],

  computed: {
    qualities: {
      get () {
        return this.$store.state.config.qualities
      },
      set () {}
    },
    fansubs: {
      get () {
        return ['None', ...this.$store.state.config.fansubs]
      },
      set () {}
    },
    feeds: {
      get () {
        return this.$store.state.config.feeds
      },
      set () {}
    },

    quality: {
      get () {
        return this.$store.state.config.config.quality
      },
      set (val) {
        this.setValue('quality', val)
      }
    },
    feed: {
      get () {
        return this.$store.state.config.config.feed
      },
      set (val) {
        this.setValue('feed', val)
      }
    },
    fansub: {
      get () {
        return this.$store.state.config.config.fansub
      },
      set (val) {
        this.setValue('fansub', val)
      }
    }
  }
}
</script>
