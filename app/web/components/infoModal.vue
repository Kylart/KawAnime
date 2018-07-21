<template lang="pug">
  v-dialog(v-model='show', max-width='650', lazy, absolute, @keydown.esc='close()')
    v-btn(icon, slot='activator')
      v-icon search
    v-card.pr-4
      v-card-title.headline Which anime are you looking for?
      v-card-text
        v-layout(wrap, justify-center)
          v-flex(xs6)
            v-text-field(
              name='search-name',
              label='Anime name',
              v-model='searchTerm',
              append-icon='close',
              :append-icon-cb='clear'
              dark, ref='input'
            )
          v-flex(xs12)
            v-layout(row, wrap, justify-center)
              template(v-if='results.length', v-for='item in results')
                v-flex.elem(xs3, @click='actOnThis(item)')
                  v-layout.elem-content.elevation-3(
                    wrap,
                    justify-center,
                    v-ripple='true'
                  )
                    v-flex(xs8)
                      img.elem-picture(:src='item.image_url', height='140')
                    v-flex.elem-name(xs10) {{ item.name }}
      v-card-actions
        v-spacer
        v-btn.blue--text.darken-1(flat, @click='close()') Close
</template>

<script>
import _ from 'lodash'

export default {
  data () {
    return {
      searchTerm: '',
      results: []
    }
  },
  computed: {
    show: {
      get () {
        return this.$store.state.search.search
      },
      set (bool) {
        this.$store.commit('search/show', bool)
        if (!bool) this.$store.commit('mal/isAdding', bool)
      }
    },
    isSearch () {
      return !this.$store.state.mal.isAdding
    }
  },
  methods: {
    close () {
      this.$store.commit('search/show', false)
      this.$store.commit('mal/isAdding', false)
    },
    clear () {
      this.searchTerm = ''
      this.$refs.input.focus()
    },
    actOnThis (item) {
      if (this.isSearch) {
        this.search(item)
      } else {
        this.close()
        // This might change when I'll work with Kitsu etc...
        // MAL specific
        this.$store.commit('mal/setEntry', item)
        this.$store.commit('mal/showForm', true)
      }
    },
    async search (item) {
      this.searchTerm = item.name

      if (this.$store.state.search.info.info.title === item.name) {
        this.$store.commit('search/showInfo', true)
        this.close()
      } else {
        this.close()

        this.$store.dispatch('search/fromUrl', item)
      }
    },
    quickSearch: _.debounce(
      async function () {
        const term = this.searchTerm

        if (term && term.length > 2) {
          try {
            const {data, status} = await this.$axios.get(`searchTermOnMal`, {
              params: {term}
            })

            if (status === 200) {
              this.results = data
            } else {
              throw new Error('Error while searching.')
            }
          } catch (e) {
            console.log((new Date()).toLocaleTimeString(), e.message)
            this.$store.commit('setInfoSnackbar', e.message)
          }
        } else {
          this.results = []
        }
      },
      300)
  },
  watch: {
    async searchTerm () {
      this.quickSearch()
    },
    show (bool) {
      if (bool) {
        this.$nextTick(() => {
          this.$refs.input.focus()
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .elem
    margin-top 10px
    padding-left 10px

  .elem-content
    margin 0
    height 100%
    position relative
    margin-left 10%
    width 100%
    background-color rgb(60, 60, 60)
    padding-bottom 5px

  .elem-name
    font-size 16px
    text-align center

  .elem-picture
    max-width 90%
</style>
