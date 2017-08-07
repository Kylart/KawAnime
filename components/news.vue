<template lang="pug">
  v-flex(xs12 v-ripple="true").elevation-3.elem
    v-layout(row wrap)
      v-flex(xs12)
        h3.white--text.title {{ item.title }}
      v-flex(md2 xs3 style="height: 220px;")
        lazy-component
          img(:src="item.image" onerror="this.src='static/images/error.jpg'").image
      v-flex(md10 xs9)
        v-layout(row wrap)
          v-flex(xs12)
            p.synopsis {{ item.text }}
          v-flex(xs12).link
            div.button-container
              v-btn(secondary block @click="open(item.link)") Open
</template>

<script>
  export default {
    props: {
      item: Object
    },
    methods: {
      open (link) {
        this.$store.dispatch('openNewsLink', link)
      }
    }
  }
</script>

<style scoped>
  .elem
  {
    position: relative;
    margin-bottom: 15px;
    padding: 0;
    background-color: rgb(60, 60, 60);
  }

  .elem:hover
  {
    transition: all 0.25s;
    box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
    0 8px 10px 1px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12) !important;
  }

  .title
  {
    line-height: 24px;
    margin-top: 10px;
    padding-left: 2%;
    padding-right: 2%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .image
  {
    height: 220px;
    max-width: 100%;
  }

  .synopsis
  {
    padding-top: 2%;
    height: 150px;
  }

  .link
  {
    height: 50%;
    width: 100%;
    text-align: right;
    display: inline-block;
    padding: 0 5% 0 10%;
  }

  .button-container
  {
    display: inline-block;
    width: 15%;
  }
</style>
