<template>
	<v-container fluid>
		<v-row>
			<v-col xs12>
				<v-row>
					<template v-for="item in watchList">
						<v-col xl3 md4 sm6 xs12
						       v-ripple="true"
						       class="elem elevation-3">
							<h6 class="ellipsis">{{ item }}</h6>
						</v-col>
					</template>
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

<style scoped>
	h6
	{
		margin: 0;
		color: rgba(255, 255, 255, 0.8);
	}

	.ellipsis
	{
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.elem
	{
		position: relative;
		color: rgba(255, 255, 255, 0.8);
		margin-bottom: 10px;
	}

	.elem:hover
	{
		box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12) !important;
	}
</style>