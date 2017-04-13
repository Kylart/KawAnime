<template>
	<div>
		<h1>This is the local page !</h1>
	</div>
</template>

<script>
	import axios from 'axios'

  export default {
	  data() {
	    return {}
	  },
	  computed: {
	    files: function () {
		    return this.$store.state.localFiles
      }
	  }
  }
</script>

<style>

</style>