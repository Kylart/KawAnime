<template lang="pug">
  div
    v-dialog(v-model='values.show', lazy, absolute, max-width='800', @keydown.esc='close()')
      v-card
        v-card-title.pb-2.pt-2
          h2.mb-0.main-title.ellipsis Results for #[strong {{ values.title }}]
          v-spacer
          v-tooltip(left)
            v-btn(
              flat, icon,
              @click='openSelected()',
              v-if='selected',
              slot='activator'
            )
              v-icon open_in_new
            span Open all selected magnets
          v-tooltip(left)
            v-btn(
              flat, icon,
              v-clipboard='selected.join(eol)',
              v-if='selected',
              @success='snack = true',
              slot='activator'
            )
              v-icon.copy-icon content_copy
            span Copy all selected magnets
        v-divider
        v-card-text.subheading
          v-expansion-panel(popout, v-model='panels')
            v-expansion-panel-content(
              v-for='(name, index) in filteredNames',
              :key='index',
              :value='index === 0'
              ripple, lazy
            )
              .entry-title(slot='header')
                span {{ name }}
                v-tooltip(left)
                  v-btn.ma-0.mr-3(
                    icon,
                    @click.stop='selectAll(name)',
                    slot='activator'
                  )
                    v-icon select_all
                  span (un)select these magnets
              v-divider
              v-layout.ep-container(
                row, wrap,
                v-for='(magnet, subIndex) in getLinks(name)', :key='magnet.link'
              )
                v-flex.pt-0.pb-0(xs11, d-flex, align-center, :class='{ bordered: subIndex > 0 }')
                  .episode {{ magnet.name }} - Ep. {{ magnet.nb }}
                v-flex.pt-2.pb-0(xs1, d-flex, justify-center, align-center, :class='{ bordered: subIndex > 0 }')
                  v-checkbox.mt-0(v-model='selected', :value='magnet.link', hide-details, color='primary')
                v-flex.pt-0.pb-2.magnet(xs9, offset-xs3, d-flex, justify-end)
                  a.ellipsis(:href='magnet.link') {{ magnet.link}}
        v-card-actions
          v-spacer
          v-btn.blue--text.darken-1(flat, @click='close()') Thanks!
    v-snackbar(
      :timeout='2500',
      top,
      v-model='snack'
    ) All selected magnets were copied to clipboard!
      v-btn.pink--text(flat, @click='snack = false') Thanks!
</template>

<script>
export default {
  name: 'Magnets-Modal',

  data () {
    return {
      snack: false,
      selected: [],
      panels: []
    }
  },

  computed: {
    values () {
      return this.$store.state.downloader.modal
    },
    show () {
      return this.values.show
    },
    eol () {
      if (this.$store.state.platform === 'win32') {
        return '\r\n'
      } else {
        return '\n'
      }
    },
    filteredNames () {
      return this.$_.uniq(this.values.magnets.map((magnet) => {
        return magnet.name
      }))
    }
  },

  methods: {
    close () {
      this.$store.commit('downloader/closeModal')
    },
    getLinks (name) {
      return this.values.magnets.filter((magnet) => magnet.name === name)
    },
    selectAll (name) {
      // Find all magnets with that name
      const magnets = this.$_.map(this.values.magnets, (e) => {
        if (e.name.includes(name)) return e.link
      }).filter((e) => typeof e !== 'undefined' && e)

      // Checking if some of them are present in current selected array
      let allSelected = false
      let counter = 0
      this.$_.each(magnets, (magnet) => {
        if (this.$_.find(this.selected, (o) => o === magnet)) {
          ++counter
          if (counter === magnets.length) allSelected = true
        }
      })

      // Selecting or unselecting accordingly
      this.$_.each(magnets, (magnet) => {
        allSelected
          ? this.selected = this.selected.filter((link) => link !== magnet)
          : !this.selected.includes(magnet) && this.selected.push(magnet)
      })
    },
    openSelected () {
      this.$_.each(this.selected, (l) => {
        this.$axios.get('openThis', {
          params: {
            type: 'link',
            link: l
          }
        })
      })
    }
  },

  watch: {
    show () {
      this.show && this.$store.dispatch('player/play')
      this.selected = this.magnets
    }
  }
}
</script>

<style lang="stylus" scoped>
  .copy-icon
    display inline-block
    cursor copy

  .main-title
    padding 8px
    font-size 24px
    font-weight 300
    letter-spacing 0.05em

  .entry-title
    display flex
    justify-content space-between

    span
      font-size 22px
      font-weight 400
      letter-spacing 0.04em

  .ep-container
    padding 0 3%

    .bordered
      border-top 0.02em solid rgba(255, 255, 255, 0.4)

    .episode
      padding 8px
      font-size 18px
      letter-spacing 1px

    .magnet
      font-size 16px
      letter-spacing 1px
      text-align right
</style>
