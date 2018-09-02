<template lang="pug">
  v-footer.grey.darken-4.pr-2
    v-spacer
    .white--text © 2016 - {{ lastYear }} Kylart
</template>

<script>
export default {
  data: () => ({
    lastYear: (new Date()).getFullYear()
  })
}
</script>
