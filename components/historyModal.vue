<template lang="pug">
  v-dialog(lazy, absolute, width='75%', v-model='$store.state.history.modal')
    v-btn(secondary, dark, @click='refresh()', slot='activator')
      | History
    v-card
      v-card-title.headline History
      v-divider
      v-card-text
        v-layout(row, wrap, justify-center)
          v-expansion-panel(expand, popout, v-if='Object.keys(history).length')
            v-expansion-panel-content.item-container(
              ripple, lazy,
              v-for='item in Object.keys(history).reverse()',
              :key='item'
            )
              .day(slot='header')
                | {{ item }}
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
      v-card-actions(style=' padding-right: 20px;')
        v-spacer
        v-btn.blue--text.darken-1(
          flat,
          style='width: 100px;',
          @click="$store.commit('history/setModal', false)"
        ) Close
</template>

<script>
  export default {
    data () {
      return {}
    },
    computed: {
      history () {
        return this.$store.state.history.entries
      },
      modal () {
        return this.$store.state.history.modal
      }
    },
    watch: {
      modal () {
        console.log(`[${(new Date()).toLocaleTimeString()}]: Refreshing history.`)
        this.$store.dispatch('history/get')
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
      }
    }
  }
</script>

<style scoped>
  h6, p
  {
    margin: 0;
  }

  .ellipsis
  {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .item-container
  {
    background-color: rgb(50, 50, 50);
    border-bottom: 0 !important;
  }

  .info-container
  {
    background-color: rgb(50, 50, 50);
  }

  .day
  {
    position: relative;
    font-size: 17px;
    font-weight: 700;
    padding-left: 15px;
    background-color: #424242 !important;
  }

  .entry
  {
    height: 27px;
    padding-top: 1px;
  }

  .not-delete
  {
    background-color: rgba(119, 221, 119, 0.62);
    border-bottom: 1px solid rgba(119, 221, 119, 0.62);
    border-top: 1px solid rgba(119, 221, 119, 0.62);
  }

  .delete
  {
    background-color: rgba(216, 24, 24, 0.55);
    border-bottom: 1px solid rgba(235, 26, 26, 0.20);
    border-top: 1px solid rgba(235, 26, 26, 0.20);
  }

  .time
  {
    font-size: 16px;
    font-weight: 600;
  }

  .type
  {
    font-size: 16px;
    font-style: italic;
  }

  .text
  {
    font-size: 16px;
    font-weight: 700;
  }

  .delete-entry
  {
    cursor: pointer;
    position: relative;
  }

  .empty-history
  {
    font-size: 16px;
  }
</style>
