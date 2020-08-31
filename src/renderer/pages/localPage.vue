<template lang="pug">
  div
    transition(name='fade', mode='out-in')
      InfoDisplayer(
        v-if='current', key='info',
        :current='current', :return-cb='resetCurrent'
      )

      v-container.py-0(v-else, fluid, key='tools')
        tools(:nb-elems='files.length', :resetting='resetting', @reset='reset', ref='tools')

        transition(name='list')
          empty(v-if='!files.length', key='empty')

        transition-group(
          v-if='files.length',
          ref='files',
          :key='filesKey',
          class='trans row row--dense justify-space-around',
          name='list',
          tag='div'
        )
          template(v-for='file in groupedFiles')
            v-col(cols='12', sm='6', md='3', lg='3', xl='2', :key='`${file.title} - ${file.ep || ""}`')
              card(:reset='resetting', :file='file', @more='setCurrent', @refresh='refresh')
</template>

<script>
import Tools from '@/components/local/tools.vue'
import Card from '@/components/local/card.vue'
import Empty from '@/components/local/empty.vue'

import InfoDisplayer from '@/components/info/layout.vue'

export default {
  name: 'Local',

  components: { Tools, Card, Empty, InfoDisplayer },

  mounted () {
    this.refresh()
  },

  data: () => ({
    current: null,
    resetting: false,
    resetIndex: 0,
    filesKey: Math.random()
  }),

  computed: {
    files: {
      get () {
        return this.$store.state.localFiles.files
      },
      set () {}
    },
    groupedFiles () {
      const { files = [] } = this

      return files
        .reduce((acc, file) => {
          if (!file.ep) {
            acc.push(file)
            return acc
          }

          const isIn = acc.find((f) => f.title === file.title)
          const epInfo = {
            ep: file.ep,
            path: file.path
          }

          if (isIn) {
            isIn.eps.push(epInfo)
          } else {
            acc.push({
              ...file,
              eps: [epInfo]
            })
          }

          return acc
        }, [])
        .map((file) => {
          file.eps && file.eps.length && file.eps.sort((a, b) => +a.ep - +b.ep)

          return file
        })
    }
  },

  methods: {
    setCurrent (info, file) {
      this.current = {
        isLocal: true,
        title: file.title,
        releaseGroup: file.releaseGroup
      }
    },
    resetCurrent () {
      this.current = null
    },
    refresh () {
      this.$refs.tools.refresh()
    },
    sanitize (value) {
      return value.replace(':', '')
    },
    reset () {
      this.resetting = true

      // Is Sync
      this.$store.dispatch(
        'localFiles/reset',
        this.files.reduce((acc, { title }) => acc.includes(title) ? acc : [...acc, title], [])
      )

      this.filesKey = Math.random()
      this.resetting = false
    }
  }
}
</script>

<style lang="stylus" scoped>
  .trans
    width 100%
</style>
