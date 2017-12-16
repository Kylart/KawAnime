<template lang="pug">
  v-container#local-page.pa-0(fluid)
    div(v-if='nbEps')
      v-layout(row, wrap, style='margin: 0 1%;')
        v-flex.menubar(xs12)
          v-layout(row, wrap)
            v-flex(hidden-sm-and-up, xs2)
            v-flex.menu-eps(xs4, sm3, md2)
              p.menu-eps-text {{ nbEps }} {{ episodeLabel }}
            v-flex(xs4, sm2, md2)
              history-modal
            v-flex.menu-buttons(xs12, sm7, offset-md3, md5, offset-lg4, lg4, offset-xl5, xl3)
              v-btn.refresh-button(icon, v-if='!this.$store.state.localFiles.refreshing', @click='refresh()')
                v-icon(large) refresh
              v-btn.refresh-button(v-else, icon, loading)
              v-btn.change-dir-button(flat, dark, @click='changePath()')
                | Change dir
              v-btn.reset-cache-button(color='secondary', dark, @click='resetLocal()', v-if='!this.$store.state.localFiles.resetting')
                | Refresh local info
              v-btn.reset-cache-button(color='secondary', dark, loading, v-else)
        transition-group(name='list')
          template(v-for='item in files')
            v-flex.elem(:key='item.path', xs12, sm6, md4, xl3)
              v-card.elem-content.elevation-3(ripple)
                v-layout.elem-container.ma-0(row, wrap)
                  v-flex(xs7)
                    v-tooltip(top)
                      h6.elem-title.ellipsis(slot='activator') {{ item.name }}
                      span {{ item.name }}
                  v-flex.elem-ep.text-xs-right(xs2)
                    v-tooltip(top)
                      p.ellipsis.ep(slot='activator') {{ item.ep }} / {{ item.numberOfEpisode }}
                      span {{ 'Episode ' + item.ep }}
                  v-flex.buttons-container(xs3)
                    v-btn.ma-0(large, icon, @click='playThis(item)')
                      v-icon(large) play_circle_outline
                    v-menu(open-on-hover, transition='slide-x-transition')
                      v-btn.ml-0(icon, medium, slot='activator')
                        v-icon more_vert
                      v-list.dark
                        v-list-tile(@click='showChoices(item.name)')
                          v-list-tile-action
                            v-icon add_box
                          v-list-tile-title
                            | Add to
                        v-list-tile(@click='delThis(item)')
                          v-list-tile-action
                            v-icon.primary--text(medium) delete_forever
                          v-list-tile-title.primary--text Delete
                  v-flex(xs8)
                    v-tooltip(top)
                      p.ellipsis.genres(slot='activator')
                        | {{ item.genres.length ? item.genres.join(', ') : 'No specified genre' }}
                      span {{ item.genres.length ? item.genres.join(', ') : 'No specified genre' }}
                  v-flex(xs4)
                    v-tooltip(top)
                      p.ellipsis.classification(slot='activator')
                        | {{ item.classification.replace('None', 'No restriction') }}
                      span {{ item.classification.replace('None', 'No restriction') }}
                  v-flex.picture-container(xl5, lg4, md5, xs4)
                    lazy-component
                      img.picture(:src='item.picture', onerror="this.src='static/images/error.jpg'")
                  v-flex.bottom-right-container(xl7, lg8, md7, xs8)
                    v-layout.pl-2.pr-2.pb-2(row, wrap, justify-space-between)
                      v-flex(xs12)
                        .synopsis {{ item.synopsis }}
                      v-flex(xs12, style='display: flex')
                        v-layout(align-center, justify-space-between, style='min-width: 100%')
                          v-flex(xs2)
                            p.year {{ item.year }}
                          v-flex(xs7)
                            p.status {{ item.status }}
                          v-flex(xs3)
                            p.mark {{ item.mark }}
    v-container#empty(fluid, v-else)
      transition(name='fade')
        img.empty-bg(v-if='emptyBg', height='400', src='~static/images/empty-bg.png')
      v-layout(row, wrap)
        v-flex.menubar(xs12)
          v-layout(row, wrap)
            v-flex(offset-xs2, xs2)
              history-modal
            v-flex(xs5)
            v-flex.menu-buttons(xs3)
              v-btn.refresh-button(icon, v-if='!this.$store.state.localFiles.refreshing', @click='refresh()')
                v-icon(large) refresh
              v-btn.refresh-button(v-else, icon, loading)
              v-btn.change-dir-button(flat, dark, @click='changePath()')
                | Change dir
        v-flex.empty-message(xs12)
          h3 Wow such empty!
          h4
            | Start downloading anime&nbsp;
            router-link.green--text(to='/downloader') here
            | &nbsp;or&nbsp;
            router-link.cyan--text(to='/') here!
</template>

<script>
  import axios from 'axios'

  export default {
    mounted () {
      setTimeout(() => { this.emptyBg = true }, 300)

      this.refresh()
    },
    beforeDestroy () {
      this.emptyBg = false
    },
    data () {
      return {
        emptyBg: false
      }
    },
    computed: {
      files () {
        return this.$store.state.localFiles.files
      },
      nbEps () {
        return this.files.length
      },
      episodeLabel () {
        return this.nbEps === 1
          ? 'episode'
          : 'episodes'
      }
    },
    methods: {
      playThis (item) {
        console.log(`[${(new Date()).toLocaleTimeString()}]: Requested to play ${item.name} - ${item.ep}. Sending...`)

        // No need to get through store.
        axios.get(`openThis`, {
          params: {
            type: 'video',
            path: item.path,
            dir: this.$store.state.localFiles.dir
          }
        }).then((res) => {
          if (res.status !== 200) { console.log('An error occurred: request to open file ended with a status ' + res.status + '.') }

          this.$store.dispatch('history/append', {
            type: 'Play',
            text: `${item.name} - ${item.ep}`
          }).catch(err => { void (err) })
        })
      },
      delThis (item) {
        console.log(`[${(new Date()).toLocaleTimeString()}]: Requested to delete ${item.path} - ${item.ep}. Sending...`)

        this.$store.commit('localFiles/updateFiles', {
          type: 'delete',
          path: item.path
        })

        axios.get(`openThis`, {
          params: {
            type: 'delete',
            path: item.path,
            dir: this.$store.state.localFiles.dir
          }
        }).then((res) => {
          this.$store.commit('setInfoSnackbar', `${item.name} ${item.ep} was successfully sent to Trash.`)
          this.$store.dispatch('history/append', {
            type: 'Delete',
            text: `${item.name} - ${item.ep}`
          }).catch(err => { void (err) })
        }).catch(() => {
          this.$store.commit('setInfoSnackbar', `Error while trying to delete ${item.name} ${item.ep}. Please try again later.`)
        })
      },
      refresh () {
        this.$store.dispatch('localFiles/refresh')
      },
      changePath () {
        this.$store.dispatch('localFiles/changePath')
      },
      resetLocal () {
        this.$store.dispatch('localFiles/reset')
      },
      showChoices (name) {
        this.$store.commit('setAddToChoiceTitle', name)
        this.$store.commit('setAddToChoice', true)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~stylus/functions'

  .fade-enter-active, .fade-leave-active
    transition opacity .5s

  .fade-enter, .fade-leave-to
    opacity 0

  #empty
    height calc(100vh - 48px - 24px)

  h6
    margin-top 0.7rem
    margin-bottom 0

  span
    max-width 100%
    width 100%

  /* ------------- MENUBAR ------------- */
  .menubar
    margin-top 2px

  .menu-eps-text
    font-size 16px
    font-weight 800
    margin-top 12px
    padding-left 8%

  .refresh-button, .change-dir-button
    display inline-block

  .reset-cache-button:hover
    border-color #ff9800 !important
    background-color #ff9800 !important

  .menu-buttons
    display flex
    justify-content center

  /* -------------- ELEMS -------------- */
  .elem
    margin-bottom 10px
    padding 0 4px !important
    display inline-block

  .elem-content
    background-color rgb(60, 60, 60)
    cursor default

  .elem-content:hover
    hover_background()

  .elem-title
    padding-left 10px
    line-height 30px

  .elem-ep
    display flex
    justify-content center
    align-items center

  .ep
    margin 0
    font-size 15px
    font-weight 800

  .buttons-container
    display flex
    justify-content flex-end
    align-items space-around
    padding 0

  .genres
    padding-left 15px
    padding-right 5px
    font-weight 600

  .classification
    padding-right 10px

  .picture-container
    height 220px
    max-width 100%

  .picture
    max-width 100%
    height 220px

  .bottom-right-container
    position relative
    display flex

  .synopsis
    padding 2px 5px 5px 5px
    text-align justify
    display block
    white-space pre-wrap
    overflow-y auto
    overflow-x hidden
    height 10.8em
    line-height 1.5em

  p.year, p.status, p.mark
    margin-bottom 0

  .year
    padding-left 5px
    font-weight 600

  .status
    text-align center
    font-weight 600

  .mark
    font-size large
    font-weight 900

  .empty-message
    margin-top 5%
    text-align center

  .empty-bg
    position absolute
    bottom 0
    left 5%
</style>
