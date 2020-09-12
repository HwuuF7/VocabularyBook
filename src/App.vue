<template>
  <div id="app">
	  APP
	 <p v-if="age == 18 "> true</p>
	 <p v-else>false</p>
  </div>
</template>

<script>
	


export default {
  name: 'app',
  data() {
	  return {
		  name: 'zhangsan',
		  age: 88
	  }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
