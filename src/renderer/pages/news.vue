<template lang="pug">
  div
    news-form

    transition(name='fade', mode='out-in')
      v-container(
        fluid,
        fill-height,
        v-if='isRefreshing || !entries.length', key='loading'
      )
        loader

      v-container(
        v-else,
        key='news',
        fluid,
      )
        v-row(dense)
          template(v-for='entry in reduced')
            v-col(cols='12', md='6', lg='4', xl='3')
              card(:info='entry')
</template>

<script>
import { mapState } from 'vuex'

import Card from '@/components/news/card.vue'
import NewsForm from '@/components/news/form.vue'
import Loader from '@/components/news/loader.vue'

// Allows fancy lazy loading of entries
import Reduced from '@/mixins/global/reduced.js'

export default {
  name: 'News',

  components: { Card, NewsForm, Loader },

  mixins: [Reduced],

  data: () => ({
    sup: 8,
    initSup: 8
  }),

  computed: {
    ...mapState('news', {
      entries: 'data',
      isRefreshing: 'refreshing'
    })
  }
}
</script>
