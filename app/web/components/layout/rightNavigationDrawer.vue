<template lang="pug">
  v-navigation-drawer(
    app,
    right, v-model='show') Helo
</template>

<script>
export default {
  name: 'Right-Drawer',

  data: () => ({

  }),

  computed: {
    show: {
      get () {
        return this.$store.state.drawer.right
      },
      set (val) {
        this.$store.commit('setRightDrawer', val)
      }
    }
  }
}
</script>
