<template lang="pug">
  v-dialog(v-model='searchShow', max-width='650', lazy, absolute, @keydown.esc='searchShow = false')
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
              :append-icon-cb="clear"
              dark, ref='input'
            )
          v-flex(xs12)
            v-layout(row, wrap, justify-center)
              template(v-if='results.length', v-for='item in results')
                v-flex.elem(xs3, @click='search(item.name)')
                  v-layout.elem-content.elevation-3(
                    wrap,
                    justify-center,
                    v-ripple='true',
                    @click.all='search(item.name)'
                  )
                    v-flex(xs8)
                      img.elem-picture(:src='item.image_url', height='140')
                    v-flex.elem-name(xs10) {{ item.name }}
      v-card-actions
        v-spacer
        v-btn.blue--text.darken-1(flat, @click='searchShow = false') Close
</template>

<script>
  import axios from 'axios'
  import _ from 'lodash'

  export default {
    data () {
      return {
        searchShow: false,
        searchTerm: '',
        results: []
      }
    },
    methods: {
      clear () {
        this.searchTerm = ''
        this.$refs.input.focus()
      },
      async search (name) {
        this.searchTerm = name

        if (this.$store.state.search.info.info.title === name) {
          this.$store.commit('search/showInfo', true)
          this.searchShow = false
        } else {
          this.searchShow = false

          this.$store.dispatch('search/fromName', name)
        }
      },
      quickSearch: _.debounce(
        async function () {
          const term = this.searchTerm

          if (term && term.length > 2) {
            try {
              const {data, status} = await axios.get(`searchTermOnMal?term=${term}`)

              if (status === 200) {
                this.results = data.categories[0].items
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
      searchShow (bool) {
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
