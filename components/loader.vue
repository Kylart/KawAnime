<template>
	<div class="loading-gif">
		<h3 class="loading-text">少々お待ち下さいね〜</h3>
		<img src="~static/images/loading-gif.gif"/>
	</div>
</template>
<style scoped>
	.loading-text
	{
		width: 100%;
		padding: 0;
		margin: 0 0 15px -20%;
		color: rgba(255, 255, 255, 0.8);
		font-family: "Hiragino Mincho Pro", serif;
	}

	.loading-gif
	{
		position: absolute;
		bottom: 0;
		left: 37%;
	}
</style>
<script>
  export default{}
</script>
