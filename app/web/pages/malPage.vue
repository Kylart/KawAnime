<template lang="pug">
  v-card.fill-height
    v-layout.pa-2(row, wrap, justify-center)
      v-flex.centered(xs12, sm2)
        .headline.pl-4 MyAnimeList
      v-flex.centered.pr-2(xs10, sm3, md3, offset-sm1)
        v-select(
          v-model='tagsFilter',
          :items='customTags',
          label='Tags',
          persistent-hint,
          hint='Looking for special tags?',
          single-line,
          clearable, dense, chips, tags
        )
      v-flex.centered.pl-2(xs8, sm3, md3, offset-md1)
        v-text-field(
          append-icon='search',
          label='Search',
          single-line,
          v-model='search'
        )
      v-flex.centered.pt-3.pl-3(xs4, sm3, md2)
        v-btn(@click.stop='showSearch()')
          v-icon add
          span Add
        v-btn(icon, @click='refresh()')
          v-icon(large) refresh
    v-data-table(
      no-data-text='No data available, did you register your account and set your MyAnimeList public? If yes, it is possible that the account you entered was wrong.',
      no-results-text='Seems like you haven\'t watched this one ;)',
      rows-per-page-text='Anime per page:',
      :disable-initial-sort='true',
      :loading='isLoading',
      :headers='headers',
      :items='lists',
      :search='search',
      :rows-per-page-items='rowsPerPage'
    )
      template(slot='items', slot-scope='props')
        td.text-xs-center
          img.entry-image(:src='props.item.image')
        td.text-xs-left.entry-title
          span.pl-3 {{ props.item.title }}
        td.text-xs-center {{ props.item.score }}
        td.text-xs-center {{ props.item.type }}
        td.text-xs-center {{ props.item.progress }}
        td.text-xs-center {{ props.item.status }}
        td.text-xs-center.ellipsis.entry-tags
          v-tooltip(top)
            span(slot='activator') {{ props.item.tags }}
            span {{ props.item.tags }}
        td
          v-btn.blue--text.darken-1(icon, flat, @click.stop='showForm(props.item.id)')
            v-icon edit
          v-btn.blue--text.darken-1(icon, flat, @click.stop='showInfo(props.item.title, props.item.link)')
            v-icon info_outline
</template>

<script>
import Vuex from 'vuex'

export default {
  data () {
    return {
      search: '',
      rowsPerPage: [10, 15, 25, 50, 100, { text: 'All', value: -1 }],
      headers: [
        {
          text: 'Image',
          align: 'center',
          sortable: false,
          value: 'image'
        }, {
          text: 'Title',
          align: 'left',
          sortable: true,
          value: 'title'
        }, {
          text: 'Score',
          align: 'center',
          sortable: true,
          value: 'score'
        }, {
          text: 'Type',
          align: 'center',
          sortable: true,
          value: 'type'
        }, {
          text: 'Progress',
          align: 'center',
          sortable: true,
          value: 'progressDec'
        }, {
          text: 'Status',
          align: 'center',
          sortable: true,
          value: 'status'
        }, {
          text: 'Tags',
          align: 'center',
          sortable: false,
          value: 'tags'
        }
      ]
    }
  },
  computed: {
    ...Vuex.mapGetters('mal', [
      'lists'
    ]),
    isLoading () {
      return this.$store.state.mal.isLoading
    },
    tagsFilter: {
      get () {
        return this.$store.state.mal.tagsFilter
      },
      set (tags) {
        this.$store.commit('mal/setTagsFilter', tags)
      }
    },
    customTags: {
      get () {
        return this.$store.state.mal.customTags
      },
      set () {}
    }
  },
  methods: {
    showInfo (name, url) {
      this.$store.dispatch('info/get', {
        name,
        url
      })
    },
    showForm (id) {
      this.$store.commit('mal/setEntry', id)
      this.$store.commit('mal/showForm', true)
    },
    showSearch () {
      this.$store.commit('mal/isAdding', true)
      // this.$store.commit('search/show', true)
    },
    refresh () {
      this.$store.dispatch('mal/getWatchLists', this.$store.state.config.config.malUsername)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .centered
    display flex
    align-items center
    justify-content center

  .entry-title
    font-size 16px
    letter-spacing 1px
    font-weight 200
    min-width 30vw

  .entry-image
    max-height 60px
    max-width 40px

  .entry-tags
    max-width 100px
</style>
