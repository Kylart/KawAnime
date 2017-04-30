<template>
	<v-container fluid>
		<h1>Hello</h1>
		<v-row class="container">
			<template v-for="item in Object.keys(history)">
				<v-col xs12>
					{{ item }}
				</v-col>
			</template>
		</v-row>
	</v-container>
</template>
<style scoped>

</style>
<script>
  import axios from 'axios'

  export default {
    data() {
      return {}
    },
    computed: {
      history: function () {
        return this.$store.state.history
      }
    }
  }
</script>
