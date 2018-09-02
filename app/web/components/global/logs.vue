<template lang="pug">
  v-dialog(lazy, absolute, max-width='70%', v-model='show', @keydown.esc='close()')
    v-btn(icon, flat, slot='activator')
      v-icon fiber_new
    v-card#logs
      v-card-title
        span.headline What's new in this version?
        v-spacer
        v-btn.blue--text.darken-1(flat, @click="close()") Close
      v-divider
      v-card-text
        vue-markdown(:anchorAttributes="{target: '_blank'}") {{ logs }}
      v-card-actions
        v-spacer
        v-btn.blue--text.darken-1(flat, @click="close()") Close
</template>

<script>
export default {
  computed: {
    show: {
      get () {
        return this.$store.state.logs.show
      },
      set (val) {
        this.$store.commit('logs/show', val)
      }
    },
    logs () {
      return this.$store.state.logs.logs
    }
  },
  methods: {
    close () {
      this.$store.commit('logs/show', false)
    }
  },
  watch: {
    logs () {
      this.$nextTick(() => {
        const aTags = document.querySelectorAll('#logs a')

        this.$_.each(aTags, (a) => {
          a.onclick = (e) => {
            e.preventDefault()

            this.$axios.get('openThis', {
              params: {
                type: 'link',
                link: a.href
              }
            })
          }
        })
      })
    }
  }
}
</script>

<style lang="stylus">
  #logs h2
    font-size 32px
    font-weight 300
    letter-spacing 1px
    padding-left 10px

  #logs h3
    font-size 24px
    font-weight 300
    letter-spacing 1px
    padding-left 10px
    margin-top 15px
    margin-bottom 5px

  #logs blockquote
    padding-bottom 5px
    padding-top 5px

  #logs code
    background-color rgba(0, 0, 0, 0)
    color white
    display inline
    font-size 14px
    font-weight 400 !important

  #logs p
    text-indent 20px
    letter-spacing 0.05em
    font-weight 400

  #logs ul
    padding-left 10%

  #logs li
    margin-bottom 4px
    letter-spacing 0.05em
    font-weight 400
</style>
