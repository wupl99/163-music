<template>
  <div id="app">
    <router-view :key="key"/>
    <app-player></app-player>
  </div>
</template>

<script>
import appPlayer from '@/components/app-player';

export default {
  name: 'App',

  components: {
  	appPlayer,
  },
  computed: {
  	key(){
  		return this.$route.name ? this.$route.name+ +new Date() : this.$route+ +new Date();
  	},
  },
}
</script>

<style lang="scss">

</style>
