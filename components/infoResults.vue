<template lang="pug">
  v-dialog(max-width='800', v-model='$store.state.search.info.show', lazy, absolute, @keydown.esc='close()')
    v-card
      v-card-title.headline Result for «{{ searchTerm }}»
      v-divider
      v-card-text
        h4(v-if='error') {{ error }}
        div(v-else-if='loading')
          h5.loading-text.white--text Gathering data...
          h5.loading-text.white--text Info should be displayed in a few seconds
        v-card.secondary.pb-3(v-else)
          v-layout(row, wrap)
            v-flex.flex-v-centered.pl-3(xs2)
              v-menu(bottom, transition="slide-y-transition")
                v-btn.blue--text(icon, outline, slot="activator")
                  v-icon add_box
                v-list
                  v-list-tile(v-for="list in lists", :key="list.text", @click="addTo(list.listName)")
                    v-list-tile-action
                      v-icon {{ list.action }}
                    v-list-tile-title {{ list.text }}
              v-spacer
              v-badge(overlap, color='orange')
                v-icon(slot='badge') add
                v-btn.blue--text(icon, outline, @click='showMal()')
                  v-icon web
            v-flex.flex-v-centered(xs7)
              v-card-title.info-title
                | 「{{ info.japaneseTitle }}」ー {{ info.type }}
            v-flex(xs3)
              v-card-title.score-container
                p.info-score {{ info.score }}
                p.info-score ({{ info.scoreStats.split(' ')[2] }} votes)
          v-layout.mb-3(row, wrap)
            v-flex.info-pic-container(xs3)
              img.info-pic(:src='info.picture')
            v-flex.info-synopsis-container(xs9)
              p.info-synopsis {{ info.synopsis }}
          v-layout.top-info
            v-flex.info-text.pl-2(xs9)
              span.genre-title Genres:
              span.info-genres {{ info.genres.join(' / ') }}
            v-flex.info-text.h-centered(xs3) {{ info.episodes }} {{ episodeLabel }}
          v-layout.bottom-info
            v-flex.info-text.pl-2(xs5)
              span.genre-title Studios:
              span.info-genres.pl-4 {{ info.studios.join(' / ') }}
            v-flex.info-text(xs4) {{ info.rating }}
            v-flex.info-text.h-centered(xs3) {{ info.status }} ({{ info.aired.split(' ')[2] }})
      v-card-actions
        v-spacer
        v-btn.blue--text.darken-1.close-button(flat, @click="close()") Thanks!
</template>

<script>
  export default {
    data () {
      return {
        lists: [
          {text: 'Watch List', listName: 'watchList', action: 'watch_later'},
          {text: 'Watching', listName: 'watching', action: 'tv'},
          {text: 'Seen', listName: 'seen', action: 'done_all'},
          {text: 'On Hold', listName: 'onHold', action: 'av_timer'},
          {text: 'Dropped', listName: 'dropped', action: 'visibility_off'}
        ]
      }
    },
    methods: {
      addTo (listName) {
        this.$store.dispatch('watchLists/updateList', {
          listName,
          entry: this.info.title
        })
      },
      close () {
        this.$store.commit('search/showInfo', false)
      },
      showMal () {
        this.$store.commit('mal/setEntry', this.info)
        this.close()
        this.$store.commit('mal/showForm', true)
      }
    },
    computed: {
      info () {
        return this.$store.state.search.info.info
      },
      error () {
        return this.$store.state.search.info.error
      },
      loading () {
        return this.$store.state.search.info.loading
      },
      searchTerm () {
        return this.$store.state.search.info.term
      },
      episodeLabel () {
        return this.info.episodes !== 1
          ? 'episodes'
          : 'episode'
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .flex-v-centered
    display flex
    align-items center

  .h-centered
    text-align center

  .loading-text
    text-align center
    position relative

  .info-title
    width 100%
    padding-left 15% !important
    font-family 'Hiragino Mincho Pro', 'MS PMincho', serif
    font-size 24px
    font-weight 100

  .score-container
    justify-content center
    display inline-block
    text-align center

  .info-score
    margin-bottom 0
    font-size 20px
    font-weight 200
    letter-spacing 1px

  .info-pic-container
    max-width 200px

  .info-pic
    max-width 100%
    max-height 400px

  .info-synopsis-container
    padding 20px

  .info-synopsis
    text-align justify
    font-size 16px
    line-height 22px
    white-space pre-wrap

  .bottom-info
    margin-top 15px
    padding-bottom 15px

  .info-text
    font-weight 100
    font-size 16px

  .genre-title
    padding-left 15px
    letter-spacing 1px
    font-weight 100
    font-style italic

  .info-genres
    padding-left 5%
    letter-spacing 1px
</style>
