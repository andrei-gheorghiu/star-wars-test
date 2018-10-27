<template>
  <div id="app">
    <Starships />
  </div>
</template>

<script>
import Starships from './components/Starships.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/one-page.css';

export default {
  name: 'app',
  components: {
    Starships
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');
    #app > div {
        min-height: 100vh;
        background: url('./assets/space_ship.jpg') no-repeat 50% 50% /cover;
    }
</style>
