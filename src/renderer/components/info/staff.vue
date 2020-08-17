<template lang="pug">
  v-container(fluid)
    v-card(flat)
      v-card-text.pa-0.staff(v-if='staff.length')
        v-row(dense, justify='center')
          template(v-for='person in staff')
            v-col(cols='3')
              v-card
                v-container.pa-0(fluid)
                  v-row(dense)
                    v-col.d-flex.justify-center.align-center(cols='6')
                      v-img(:src='sanitize(person.img)', contain, height='100', max-width='80', position='center top')

                    v-col.d-flex.flex-column.justify-space-between(cols='6')
                      .subtitle-2.text-center.link(@click='openLink(person.link)') {{ person.name }}
                      .caption.text-center {{ person.role }}

      v-card-text(v-else)
        h6 No character information :(
</template>

<script>
// Mixins
import Info from '@/mixins/info/info.js'
import Sanitize from '@/mixins/info/sanitize.js'

export default {
  name: 'Staff',

  mixins: [
    // Brings `info` props
    Info,

    // Brings `sanitize` method
    Sanitize
  ],

  computed: {
    staff () {
      return this.info.staff
    }
  },

  methods: {
    openLink (link) {
      if (link) this.$electron.shell.openExternal(link)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .staff
    max-height 115px
    overflow-x hidden
    overflow-y auto

    .link
      cursor pointer
</style>
