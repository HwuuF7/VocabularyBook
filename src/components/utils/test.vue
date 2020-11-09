<template>
	<div id="testContainer" class="canvas">
		<div class="sky" ref='sky'></div>
	</div>
</template>

<script>
	export default {
		methods: {
			getCSS() {
				let cssObj =  {
					'top': Math.random() * 100 + '%',
					'left': Math.random() * 100 + '%',
					'animation': 'blinkAfter 15s infinite ' + Math.random() * 100 + 's ease-out',
					'width': Math.random() * 2 + 27 + 'px',
					'height': Math.random() * 2 + 27 + 'px',
					'opacity': Math.random() * 5 / 10 + 0.5,
				}
				return JSON.stringify(cssObj).replace(/,/g,';').replace(/"/g,'').slice(1,-1)+';'
			}
		},
		mounted() {
			var amount = 800
			var sky = this.$refs.sky
			for(let i = 0; i< amount; i++){
				let s  = document.createElement('div')
				let sSub = document.createElement('div')
				s.appendChild(sSub)
				s.className  = 'star-blink'
				let cssStr = this.getCSS()
				s.style = cssStr
				if(i%8 === 0){
					s.classList.add('red')
				}else if (i% 10 === 6){
					s.classList.add('blue')
				}
				sky.appendChild(s)
			}
		}
	}
</script>

<style lang="scss">
	#testContainer {
		background-color: #000;
		margin: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.canvas {
		overflow: hidden;

		// relative, absolute
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;


		.sky {
			height: 300%;
			width: 300%;
			position: absolute;
			top: -100%;
			left: -100%;
			margin-top: (100% / 2);

			background-color: darkblue;
			background: -webkit-radial-gradient(center, rgba(0, 0, 70, 1) 0%, #000 60%);

			-webkit-animation: rotate 250s infinite linear;
			-webkit-backface-visibility: hidden;
			-webkit-transform-style: preserve-3d;
		}
	}

	.star-blink {
		$Size: 17px;

		position: absolute;
		width: $Size;
		height: $Size;
		background-color: #b6cbd4;
		border-radius: 50%;
		z-index: 0;

		-webkit-transform: rotate(0deg) scale(0.08);
		-webkit-backface-visibility: hidden;
		-webkit-animation: blinkAfter 15s infinite ease-out;

		div {
			width: 100%;
			height: 100%;
			border-radius: 50%;
			-webkit-transform: rotate(45deg) scale(0.75);
			box-shadow: 0 0 2px 8px rgba(0, 0, 0, 0.4),
				0 0 2px 9px rgba(255, 255, 255, 0.07),
				0 0 2px 15px rgba(0, 0, 0, 0.4),
				0 0 2px 16px rgba(255, 255, 255, 0.1);
			-webkit-backface-visibility: hidden;
		}

		// NOT Relevant
		//top: 25%;
		//left: 25%;

		$height: 800%;

		&:after,
		&:before,
		div:after,
		div:before {
			$width: 10%;
			$color: #b6cbd4;

			content: '';
			position: absolute;
			display: block;
			top: -($height / 2 - 50%);
			left: (50% - ($width / 2));
			height: $height;
			width: $width;
			border-radius: 50%;
			background-color: $color;
			background: -webkit-linear-gradient(top,
				rgba(255, 255, 255, 0.1) 0%,
				rgba(255, 255, 255, 0.7) 50%,
				rgba(255, 255, 255, 0.1) 100%);
			z-index: 7;

			box-shadow: 0 0 25px white;
			-webkit-backface-visibility: hidden;
		}

		&:after {}

		&:before,
		div:before {
			-webkit-transform: rotate(90deg);
		}

		&.blue {

			&:after,
			&:before,
			div:after,
			div:before {
				box-shadow: 0 0 25px rgba(0, 0, 255, 1);
			}
		}

		&.red {

			&:after,
			&:before,
			div:after,
			div:before {
				box-shadow: 0 0 25px rgba(255, 0, 0, 1);
			}
		}
	}

	@-webkit-keyframes blinkAfter {
		0% {
			-webkit-transform: rotate(0deg) scale(0.08);
		}

		4% {
			-webkit-transform: rotate(-20deg) scale(0.9);
		}

		8% {
			-webkit-transform: rotate(-40deg) scale(0.08);
		}

		50% {
			-webkit-transform: rotate(-40deg) scale(0.08);
		}

		52% {
			-webkit-transform: rotate(-50deg) scale(0.4);
		}

		54% {
			-webkit-transform: rotate(-60deg) scale(0.08);
		}

		100% {
			-webkit-transform: rotate(0deg) scale(0.08);
		}

	}

	@-webkit-keyframes rotate {
		0% {
			-webkit-transform: rotate(0deg);
		}

		100% {
			-webkit-transform: rotate(360deg);
		}
	}
</style>
