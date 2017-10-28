<template lang="pug">
  div
    v-dialog(v-model='values.show', lazy, absolute, persistent, max-width='800', @keydown.esc='close()')
      v-card.white--text
        v-card-title.pb-2.pt-2
          h2.title.white--text.mb-0.entry-title.ellipsis Results for #[strong {{ values.title }}]
          v-spacer
          v-tooltip(left)
            v-btn(
              flat, icon,
              v-if='magnets.length',
              @click='openSelected()',
              slot='activator'
            )
              v-icon open_in_new
            span Open all selected magnets
          v-tooltip(left)
            v-btn(
              flat, icon,
              v-if='magnets.length',
              v-clipboard="selected.join(eol)",
              @success='snack = true',
              slot='activator'
            )
              v-icon.copy-icon content_copy
            span Copy all selected magnets
        v-divider
        v-card-text.subheading.white--text
          v-expansion-panel(popout, expand)
            v-expansion-panel-content(
              v-for='(name, index) in filteredNames',
              :key='name',
              :value='index === 0',
              ripple
            )
              v-layout.entry-name(slot='header', justify-space-between)
                span.vertical-centered {{ name }}
                v-tooltip(left)
                  v-btn.ma-0(
                    icon,
                    @click.stop='selectAll(name)',
                    slot='activator'
                  )
                    v-icon select_all
                  span (un)select these magnets
              v-layout.pt-2.pl-3.pr-3(wrap)
                template(v-for='link in getLinks(name)')
                  v-flex(xs11).mt-1.pa-0.ep-name {{ link.name }}
                  v-flex(xs1)
                    v-checkbox.pt-0.primary--text(v-model='selected', :value='link.link', label='', hide-details)
                  v-flex.mt-1.mb-2.pa-0.ep-magnet #[a.white--text(:href='link.link') {{ link.link }}]
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
    data () {
      return {
        snack: false,
        selected: []
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
      magnets () {
        return this.values.magnets.map((magnet) => {
          return magnet.link
        })
      },
      filteredNames () {
        return this.$_.uniq(this.values.magnets.map((magnet) => {
          return magnet.name.split(' ').slice(1, -3).join(' ')
        }))
      }
    },
    watch: {
      show () {
        this.show && this.$store.dispatch('player/play')
        this.selected = this.magnets
      }
    },
    methods: {
      close () {
        this.$store.commit('downloader/closeModal')
      },
      getLinks (name) {
        return this.values.magnets.map((magnet) => {
          if (magnet.name.includes(name)) return magnet
        }).filter((e) => typeof e !== 'undefined' && e)
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
        this.$_.each(this.selected, (l) => window.open(l))
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .vertical-centered
    display flex
    align-items center

  .copy-icon
    display inline-block
    cursor copy

  .entry-title
    max-width 85%

  .entry-name
    font-size 18px
    letter-spacing 2px
    overflow hidden
    text-overflow ellipsis
    font-weight 300

  .ep-name
    font-size 16px
    letter-spacing 1px
    overflow hidden
    text-overflow ellipsis

  .ep-magnet
    font-size 16px
    letter-spacing 1px
    overflow hidden
    text-overflow ellipsis
    text-align right
    width 100%
</style>

