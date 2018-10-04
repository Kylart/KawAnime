<template lang="pug">
  v-layout(row, wrap, justify-space-between, align-center)
    v-flex(xs4, sm2, md1)
      span.label(v-show='hasFiles') {{ nbElems }} {{ label }}

    v-flex(xs4, sm2, md2)
      history

    v-flex(xs4, sm2, md5)
      v-switch.mt-0(
        v-show='hasFiles',
        v-model='inside',
        color='primary',
        :label="inside ? 'Inside' : 'Outside'"
        persistent-hint,
        hint='Play in KawAnime?'
      )

    v-flex.right-buttons(xs12, sm5, md4)
      v-btn(icon, large, @click='refresh', :loading='refreshing')
        v-icon(large) refresh
      v-btn(flat, @click='changeDir') Change Dir
      v-btn(v-show='hasFiles', @click='reset', :loading='resetting') Refresh info
</template>

<script>
import History from 'components/history/modal.vue'

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
      const { data: { path } } = await this.$axios.get('openThis', {
        params: {
          type: 'dialog'
        }
      })

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

  .label
    font-size 14px
    letter-spacing 0.03em
    font-weight 500
</style>
