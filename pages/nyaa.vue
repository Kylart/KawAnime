<template lang="pug">
  v-container(fluid)
    loader(v-if="loading")
</template>

<script>
  export default {
    data () {
      return {
        loading: true
      }
    }
  }
</script>

<style scoped>

</style>