<template lang="pug">
  v-container#seasons.pa-0.pt-2(fluid, fill-height)
    loader(v-if='!season[1].items')
    div(v-else)
      v-layout.form-container(row, wrap, justify-center)
        v-flex.season-container(sm3, xs8)
          v-select(
            :items='seasonChoices',
            v-model='$store.state.seasons.season',
            label='Season',
            dark, item-text='name',
            item-value='value'
          )
        v-flex.year-container(offset-sm1, sm3, xs8)
          v-text-field(name='input-year', type='number', min='2010', label='Year', v-model='$store.state.seasons.year', dark)
        v-flex.refresh-button(offset-sm1, sm2, xs8)
          v-btn(color='secondary', block, dark, @click='refreshSeason()') Refresh
      v-tabs#tabs(dark, fixed, centered)
        v-tabs-bar.mablue
          v-tabs-slider.primary
          v-tabs-item(v-for='i in 3', :href="'#' + i", :key='i')
            | {{ season[i].name }}
        v-tabs-items
          v-tabs-content(v-for='i in 3', lazy, :id='`${i}`', :key='i')
            v-text-field.query(v-model='query', label='Search entry', dark)
            v-layout.elems(row, wrap)
              transition-group(name='list')
                v-flex.pa-1(
                  xl3, lg4, md6, xs12,
                  v-for='item in computedSeason[i].items',
                  style='display: inline-block',
                  :key='item.key'
                )
                  v-layout.elem.elevation-3(row, wrap, v-ripple='true')
                    // Header of elem
                    v-flex(xs12)
                      v-tooltip(top)
                        h6.title.ellipsis.white--text(slot='activator') {{ item.title }}
                        span {{ item.title }}
                    v-flex(xs8)
                      v-tooltip(top)
                        p.genres.ellipsis(slot='activator') {{ item.genres.join(' ') }}
                        span {{ item.genres.join(' ') }}
                    v-flex(xs3)
                      v-tooltip(top)
                        p.from-type.ellipsis(slot='activator') {{ item.fromType }}
                        span.text-xs-right {{ item.fromType }}
                    v-flex(xs1)
                    // Picture of elem
                    v-flex.image-container(xs3, lg4)
                      lazy-component
                        img.image(:src='item.picture', onerror="this.src='static/images/error.jpg'")
                    v-flex.bottom-right(xs9, lg8)
                      v-layout(wrap, justify-space-between, align-center)
                        v-flex(xs12)
                          .synopsis {{ item.synopsis }}
                        v-flex.pl-2(xs12)
                          v-layout(wrap, justify-space-between)
                            v-flex.date(xs6) {{ getDate(item.releaseDate) }}
                            v-flex.nb-ep(xs6) {{ episode(item) }}
                          v-layout(wrap, justify-space-between)
                            v-flex.producers(xs8)
                              strong {{ item.producers.join(' ') }}
                            v-flex.pb-1(xs4)
                              v-menu(open-on-hover, transition='slide-x-transition')
                                v-btn(flat, dark, slot='activator') More
                                v-list.dark
                                  v-list-tile(@click='openModal(item.title, item.synopsis)')
                                    v-list-tile-action
                                      v-icon more
                                    v-list-tile-title Check synopsis
                                  v-list-tile(@click='downloadAll(item.title)')
                                    v-list-tile-action
                                      v-icon file_download
                                    v-list-tile-title Download all episodes
                                  v-list-tile(@click="$store.dispatch('search/fromUrl', item)")
                                    v-list-tile-action
                                      v-icon info_outline
                                    v-list-tile-title Information
                                  v-list-tile(@click='showChoices(item.title)')
                                    v-list-tile-action
                                      v-icon add_box
                                    v-list-tile-title Add to
    v-dialog(v-model='modal', max-width='70%', @keydown.esc='modal = false')
      v-card
        v-card-title.headline {{ modalTitle }}
        v-divider
        v-card-text.text {{ modalText }}
        v-card-actions
          v-spacer
          v-btn.blue--text.darken-1(flat, style='width: 100px', v-on:click.native='modal = false')
            | Thanks!
    choice-window(:entry='choiceTitle')
</template>

<script>
  export default {
    data () {
      return {
        query: '',
        choiceTitle: '',
        choices: [],
        modalTitle: '',
        modalText: '',
        modal: false,
        seasonChoices: [
          {name: 'Winter', value: 'winter'},
          {name: 'Spring', value: 'spring'},
          {name: 'Summer', value: 'summer'},
          {name: 'Fall', value: 'fall'}
        ]
      }
    },
    computed: {
      seasons () {
        return this.$store.state.seasons.seasons
      },
      stats () {
        return this.$store.state.seasons.seasonsStats
      },
      TVs () {
        return this.seasons.TV
      },
      OVAs () {
        return this.seasons.OVAs
      },
      Movies () {
        return this.seasons.Movies
      },
      season () {
        return [
          '',
          {name: 'TV', items: this.TVs},
          {name: 'OVA', items: this.OVAs},
          {name: 'Movies', items: this.Movies}
        ]
      },
      computedSeason () {
        const query = this.query.toLowerCase()
        return query === ''
          ? this.season
          : this.season.map((list) => {
            if (list.items) {
              return {
                name: list.name,
                items: list.items.filter((elem) => {
                  return elem.title.toLowerCase().indexOf(query) !== -1
                })
              }
            } else return ''
          })
      }
    },
    methods: {
      getDate (string) {
        return string.split(' ').slice(0, 3).join(' ').slice(0, -1)
      },
      episode (item) {
        const nbEp = parseInt(item.nbEp)
        if (nbEp > 0) {
          if (nbEp === 1) return '1 episode'
          else return `${nbEp} episodes`
        } else return ''
      },
      refreshSeason () {
        this.$store.dispatch('seasons/refresh')
      },
      openModal (title, text) {
        console.log(`[${(new Date()).toLocaleTimeString()}]Opening modal for ${title}`)

        this.modalTitle = title
        this.modalText = text

        this.modal = true
      },
      showChoices (name) {
        this.choiceTitle = name
        this.$store.commit('setAddToChoice', true)
      },
      downloadAll (name) {
        console.log(`[${(new Date()).toLocaleTimeString()}]: Sending a request to download all episodes of ${name}.`)

        const {quality, fansub} = this.$store.state.releases.params

        this.$store.dispatch('downloader/download', {
          name,
          quality,
          fansub,
          fromEp: 0,
          untilEp: 20000,
          choice: 'si'
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~stylus/functions'

  #seasons
    display inline

  h6
    margin 0

  div.input-group
    padding-bottom 5px !important
    margin-top 8px !important

  .text
    text-align justify
    text-align-last center
    padding 20px
    font-size 16px
    white-space pre-wrap


  .refresh-button
    display flex
    align-items center

  .query
    margin 30px 0 0
    margin-left 10%
    width 25%

  /* ----------- ELEM ---------- */
  .elems
    padding 0 1% 2% 1%

  .elem
    position relative
    background-color rgb(60, 60, 60)

  .elem:hover
    hover_background()

  .title
    margin-top 10px
    margin-bottom 10px
    padding-left 10px
    padding-right 10px
    line-height 26px

  .from-type
    margin-bottom 5px
    text-align right
    font-weight 700
    font-size 120%

  .genres
    padding-left 10px
    font-weight 600

  .image-container
    padding 0
    height 210px

  .image
    height 210px
    max-width 90%

  .bottom-right
    position relative
    display flex

  .synopsis
    padding-left 5px
    padding-right 5px
    margin-right 15px
    margin-bottom 5px
    text-align justify
    display block
    white-space pre-wrap
    overflow-y auto
    overflow-x hidden
    height 9.3em
    line-height 1.5em

  .nb-ep
    text-align right
    padding-right 20px

  .producers
    margin-top 4%
</style>
