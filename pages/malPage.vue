<template lang="pug">
  v-container(fluid, fill-height, grid-list-xs)
    v-card
      v-card-title.headline.pl-4 MyAnimeList
        v-spacer
        v-text-field(
          append-icon='search',
          label='Search',
          single-line,
          hide-details,
          v-model='search'
        )
        v-btn.mt-4.ml-4(@click.stop='showSearch()')
          v-icon add
          span Add
        v-btn.mt-4(icon, @click='refresh()')
          v-icon(large) refresh
      v-data-table(
        no-data-text='No data available, did you register your account and set your MyAnimeList public? If yes, it is possible that the account you entered was wrong.',
        no-results-text='Seems like you haven\'t watched this one ;)',
        rows-per-page-text='Anime per page:',
        :loading='isLoading',
        :headers='headers',
        :items='lists',
        :search='search',
        :rows-per-page-items='rowsPerPage'
      )
        template(slot='items', slot-scope='props')
          td.text-xs-center
            img.entry-image(:src='props.item.image')
          td.text-xs-left
            span.entry-title {{ props.item.title }}
          td.text-xs-center {{ props.item.score }}
          td.text-xs-center {{ props.item.type }}
          td.text-xs-center {{ props.item.progress }}
          td.text-xs-center {{ props.item.status }}
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
            text: 'Priority',
            align: 'center',
            sortable: true,
            value: 'priorityNum'
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
      }
    },
    methods: {
      showInfo (name, url) {
        this.$store.dispatch('search/fromUrl', {
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
        this.$store.commit('search/show', true)
      },
      refresh () {
        this.$store.dispatch('mal/getWatchLists', this.$store.state.config.config.malUsername)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .container
    display inline-block

  .entry-title
    font-size 16px
    letter-spacing 1px
    font-weight 200
    padding-left 2%
    min-width 30vw

  .entry-image
    max-height 60px
    max-width 40px
</style>
