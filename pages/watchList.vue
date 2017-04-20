<template>
	<v-container fluid>
		<v-row>
			<v-col xs12>
				<v-row>
					<template v-for="item in watchList"></template>
				</v-row>
			</v-col>
			<v-col md6 xs12>
				<v-row>
					<template v-for="item in seen"></template>
				</v-row>
			</v-col>
			<v-col md6 xs12>
				<v-row>
					<template v-for="item in watching"></template>
				</v-row>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
	  computed: {
      watchList: function () {
	      return this.$store.state.watchList
      },
		  seen: function () {
        return this.$store.state.seen
		  },
		  watching: function () {
        return this.$store.state.watching
      }
	  },
    methods: {}
  }
</script>

<style>

</style>