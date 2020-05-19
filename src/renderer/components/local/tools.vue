<template lang="pug">
  v-row(justify='space-between', align='center')
    v-col.left(cols='12', sm='6', md='5', lg='4', xl='3', d-flex, justify='space-around', align='center')
      v-row(justify='space-around', align='center')
        span.label(v-show='hasFiles') {{ nbElems }} {{ label }}

        history

        v-switch.mt-0(
          v-show='hasFiles',
          v-model='inside',
          color='primary',
          :label="inside ? 'Inside' : 'Outside'"
          persistent-hint,
          hint='Play in KawAnime?'
        )

        v-switch.mt-0(
          v-model='recursiveSearch',
          color='primary',
          :label="recursiveSearch ? 'Recursive' : 'Folder only'"
          persistent-hint,
          hint='Search for files recursively?'
        )

    v-col.right-buttons(cols='12', sm='5', md='4')
      v-btn(icon, large, @click='refresh', :loading='refreshing')
        v-icon(large) refresh
      v-btn(text, @click='changeDir') Change Dir
      v-btn(v-show='hasFiles', @click='reset', :loading='resetting') Refresh info
</template>

<script>
import History from '@/components/history/modal.vue'

export default {
  name: 'Local-Tools',

  components: { History },

  props: ['nbElems', 'resetting'],

  data: () => ({
    refreshing: false
  }),

  computed: {
    inside: {
      get () {
        return this.$store.state.localFiles.inside
      },
      set (bool) {
        this.$store.commit('localFiles/setInside', bool)
      }
    },
    recursiveSearch: {
      get () {
        return this.$store.state.localFiles.recursiveSearch
      },
      set (bool) {
        this.$store.commit('localFiles/setRecursiveSearch', bool)
        this.refresh()
      }
    },
    hasFiles () {
      return this.nbElems !== 0
    },
    label () {
      return this.nbElems === 1
        ? 'episode'
        : 'episodes'
    }
  },

  methods: {
    async refresh () {
      this.refreshing = true

      await this.$store.dispatch('localFiles/update')

      this.refreshing = false
    },
    async changeDir () {
      const path = await this.$openDialog()

      if (!path) return

      this.$store.commit('localFiles/setDir', path)
      this.refresh()
    },
    reset () {
      this.$log('Refreshing local information.')
      this.$emit('reset')
    }
  }
}
</script>

<style lang="stylus" scoped>
  .right-buttons
    display flex
    justify-content space-around
    align-items center

  .left

    & > *
      display flex !important
      justify-content center

  .label
    font-size 14px
    letter-spacing 0.03em
    font-weight 500
</style>
