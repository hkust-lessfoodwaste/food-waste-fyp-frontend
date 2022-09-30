<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Main from './components/Main.vue'
</script>

<template>
  <Main />
</template>

<style>
body {
  margin: 0;
  width: 100%;
  height: 100vh;
}
#app {
  width: 100%;
  height: 100%;
}
@font-face {
  font-family: "Neue-bold";
  src: local("Neue-bold"),
   url(./fonts/BebasNeuePro-Bold.ttf) format("truetype");
}
@font-face {
  font-family: "Neue-regular";
  src: local("Neue-regular"),
   url(./fonts/BebasNeuePro-Regular.ttf) format("truetype");
}
</style>
