<template>
  <div id="container">
    <span class="text white--text">Development mode</span>
  </div>
</template>

<style scoped>
  #container
  {
    height: 24px;
    width: 100%;
    position: fixed;
    top: 0;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .text
  {
    font-size: 12px;
    font-style: italic;
    font-weight: 300;
    letter-spacing: 1px;
  }
</style>
