<template>
  <div id="app">
    <Starships />
  </div>
</template>

<script>
import Starships from './components/Starships.vue'

export default {
  name: 'app',
  components: {
    Starships
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');
@import url('https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
    #app > div {
        min-height: 100vh;
        background: url('./assets/space_ship.jpg') no-repeat 50% 50% /cover;
    }
</style>
