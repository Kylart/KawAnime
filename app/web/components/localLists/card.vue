<template lang="pug">
  v-card(hover, ripple, :class="{ 'green darken-1': selected }")
    v-container(fluid, fill-height, pt-0, pb-0)
      v-layout.pa-1(justify-space-between)
        .checkbox(@click='handleClick')
          v-checkbox(v-model='selected', hide-details, disabled, height='10')
        .name(@click='handleClick')
          v-tooltip.ellipsis(top, lazy)
            span(slot='activator') {{ name }}
            span {{ name }}
        .menu
          v-menu(transition='slide-x-transition')
            v-btn(slot='activator', icon)
              v-icon more_vert
            v-list
              v-list-tile(
                v-for='option in menus'
                :key='option.icon'
                @click='option.method'
              )
                v-list-tile-avatar
                  v-icon {{ option.icon }}
                v-list-tile-title {{ option.text }}
</template>

<script>
export default {
  name: 'List-Card',

  props: ['name', 'selected'],

  data () {
    return {
      menus: [
        {
          icon: 'file_download',
          text: 'Download',
          method: () => this.download()
        }, {
          icon: 'tv',
          text: 'Watch',
          method: () => this.watch()
        }, {
          icon: 'info_outline',
          text: 'Information',
          method: () => this.search()
        }, {
          icon: 'delete_sweep',
          text: 'Delete this entry',
          method: () => this.$emit('delete')
        }
      ]
    }
  },

  methods: {
    handleClick () {
      this.$emit('clicked')
    },
    download () {

    },
    watch () {

    },
    search () {

    }
  }
}
</script>

<style lang="stylus" scoped>
  .checkbox, .menu
    width 15%

  .name
    width 70%
    display flex
    justify-content flex-start
    align-items center

    line-height 22px
    font-size 20px
    letter-spacing 0.03em
    font-weight 500

</style>
