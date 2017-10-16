<template lang="pug">
  v-dialog(lazy, absolute, max-width='75%', v-model='$store.state.history.modal', @keydown.esc='close()')
    v-btn(color='secondary', dark, @click='refresh()', slot='activator')
      | History
    v-card
      v-card-title.headline History
      v-divider
      v-card-text
        v-layout(row, wrap, justify-center)
          v-expansion-panel(expand, popout, v-if='Object.keys(history).length')
            v-expansion-panel-content(
              ripple, lazy,
              v-for='item in Object.keys(history).reverse()',
              :key='item'
            )
              .day(slot='header') {{ item }}
              v-card
                v-card-text.lighten-3.info-container
                  v-layout(row, wrap)
                    template(v-for='info in history[item]')
                      v-flex.pl-1.time.entry(xs2, :class='isDelete(info.type)')
                        | {{ info.time }}
                      v-flex.type.entry(xs2, :class='isDelete(info.type)')
                        | {{ info.type }}
                      v-flex.ellipsis.text.entry(xs7, :class='isDelete(info.type)')
                        | {{ info.text }}
                      v-flex.entry(xs1, :class='isDelete(info.type)')
                        v-icon.delete-entry(v-ripple='true', @click.stop='clearEntry(info, item)')
                          | clear
          v-flex.empty-history(xs4, v-else) No entry yet, go watch some anime ~
      v-divider
      v-card-actions(style='padding-right: 20px;')
        v-spacer
        v-btn.blue--text.darken-1(
          flat,
          @click="close()"
        ) Close
</template>

<script>
  export default {
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
      refresh () {
        this.$store.dispatch('history/get')
      },
      close () {
        this.$store.commit('history/setModal', false)
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

  .info-container
    background-color: $colors.dark

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
