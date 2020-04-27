<template lang="pug">
  v-dialog#history(
    absolute,
    max-width='75%',
    v-model='$store.state.history.modal',
    @keydown.esc='close()'
  )
    template(v-slot:activator='{ on }')
      v-btn(color='secondary', dark, @click='refresh', v-on='on')
        | History
    v-card
      v-card-title.headline History
      v-divider
      v-card-text
        v-row(justify='center')
          v-expansion-panels(popout, v-if='Object.keys(elems).length')
            v-expansion-panel.history-elem(
              ripple, lazy,
              v-for='item in Object.keys(elems)',
              :key='item'
            )
              v-expansion-panel-header
                .day {{ item }}
              v-expansion-panel-content
                v-container.py-0
                  v-row
                    template(v-for='info in history[item]')
                      v-col.pl-1.time.entry(cols='2', :class='isDelete(info.type)')
                        | {{ info.time }}
                      v-col.type.entry(cols='2', :class='isDelete(info.type)')
                        | {{ info.type }}
                      v-col.ellipsis.text.entry(cols='7', :class='isDelete(info.type)')
                        | {{ info.text }}
                      v-col.entry(cols='1', :class='isDelete(info.type)')
                        v-icon.delete-entry(@click.stop='clearEntry(info, item)')
                          | clear
          v-col.empty-history(cols='4', v-else) No entry yet, go watch some anime ~
      v-divider
      v-card-actions(style='padding-right: 20px;')
        v-spacer
        v-btn.blue--text.darken-1(
          text,
          @click="close"
        ) Close
</template>

<script>
export default {
  name: 'History',

  mounted () {
    this.generateHistory()
  },

  data () {
    return {
      nbElems: 30,
      elems: {}
    }
  },

  computed: {
    history () {
      return this.$store.state.history.entries
    },
    modal: {
      get () {
        return this.$store.state.history.modal
      },
      set (bool) {
        this.$store.commit('history/setModal', bool)
      }
    }
  },

  methods: {
    handleScroll () {
      const elem = document.getElementsByClassName('v-dialog--active')[0]

      const modalHeight = elem.clientHeight
      const cardHeight = document.querySelector('.v-dialog--active .v-card').clientHeight

      const scroll = elem.scrollTop
      const maxScroll = cardHeight - modalHeight

      const scrollPercent = scroll / maxScroll

      if (scrollPercent > 0.65) {
        this.nbElems += 5
        this.generateHistory()
      }
    },
    isDelete (type) {
      return type === 'Delete'
        ? 'delete'
        : 'not-delete'
    },
    clearEntry (info, item) {
      this.$store.dispatch('history/remove', {
        date: item,
        info
      })
    },
    async refresh () {
      await this.$store.dispatch('history/get')
      this.generateHistory()
    },
    close () {
      this.$store.commit('history/setModal', false)
    },
    generateHistory () {
      // This is still improvable
      const keys = Object.keys(this.history).sort((a, b) => (new Date(b)) - (new Date(a)))
      this.elems = {}

      for (let i = 0, l = this.nbElems; i < l; ++i) {
        if (this.history[keys[i]] !== undefined) this.elems[keys[i]] = this.history[keys[i]]
      }
    }
  },

  watch: {
    modal (bool) {
      if (bool) {
        this.$nextTick(() => {
          this.elem = document.getElementsByClassName('v-dialog--active')[0]
          this.elem.addEventListener('scroll', this.handleScroll)
        })
      } else {
        this.elem = document.getElementsByClassName('v-dialog--active')[0]
        this.elem.removeEventListener('scroll', this.handleScroll)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  $font_size = 16px
  $colors = {
    play: {
      back: rgba(119, 221, 119, 0.62),
      border: rgba(119, 221, 119, 0.62)
    },
    delete: {
      back: rgba(216, 24, 24, 0.55),
      border: rgba(235, 26, 26, 0.20)
    },
    dark: rgb(50, 50, 50)
  }

  colored(background, border)
    background-color background
    border-bottom 1px solid border
    border-top 1px solid border

  .not-delete
    colored($colors.play.back, $colors.play.border)

  .delete
    colored($colors.delete.back, $colors.delete.border)

  .day
    position relative
    font-size $font_size
    font-weight 700
    padding-left 15px

  .entry
    height 27px
    padding-top 1px

  .time
    font-size $font_size
    font-weight 600

  .type
    font-size $font_size
    font-style italic

  .text
    font-size $font_size
    font-weight 700

  .delete-entry
    cursor pointer
    position relative

  .empty-history
    font-size $font_size
</style>
