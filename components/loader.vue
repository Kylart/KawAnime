<template>
  <transition name="fade">
    <div class="loading-gif">
      <h3 class="loading-text">少々お待ち下さいね〜</h3>
      <img v-if="number === 1" src="~static/images/loading-gif1.gif" height="500"/>
      <img v-else-if="number === 2" src="~static/images/loading-gif2.gif" height="500"/>
    </div>
  </transition>
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
  export default{
    data: function () {
      return {
        number: this.ran()
      }
    },
    methods: {
      ran () {
        return parseInt(Math.random() * 2 + 1)
      }
    },
    mounted () {
      this.number = this.ran()
    }
  }
</script>
