<template>
	
	<div id="homeContainer">
		<div class="main-container">
			<div class="text">Keep Going</div>
			<div class="inner-text">Vocabulary Book</div>
			<div class="text">Keep Going</div>
		</div>
	</div>

	
</template>

<script>
	
	export default {
		name:'home'
	}
</script>

<style scoped>
	#homeContainer {
		background-color: lightcoral;
	}
	.main-container {
	  width: 100%;
	  height: 120px;
	  text-align: center;
	  position: relative;
	  transition: .5s;
	}
	
	.main-container .text {
	  font-weight: 800;
	  font-size: 120px;
	  line-height: 120px;
	  height: 120px;
	  text-transform: uppercase;
	  position: absolute;
	  top: 0;
	  text-align: center;
	  width: 100%;
	}
	
	.main-container .text:nth-child(1) {
	  clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
	}
	
	.main-container .text:nth-child(3) {
	  clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%);
	  transition: .5s;
	}
	
	.main-container .inner-text {
	  height: 0px;
	  overflow: hidden;
	  font-family: 'Ubuntu', sans-serif;
	  transform: scale(1,0);
	
	  position: absolute;
	  top: 60px;
	  width: 100%;
	  font-size: 60px;
	  line-height: 75px;
	  transition: .5s;
	  text-align: center;
	}
	
	.main-container:hover {
	  height: 190px;
	  cursor: pointer;
	}
	
	.main-container:hover .inner-text {
	  height: 75px;
	  transform: scale(1,1);
	}
	
	.main-container:hover .text:nth-child(3) {
	  top: 80px;
	}
</style>
