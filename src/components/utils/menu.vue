<template>
	<div id="menuContainer" ref="menuContainer">
		<header class="cd-header">
				<div class="header-wrapper">
					<!-- 左边的LOGO区 -->
					<div class="logo-wrap">
						<h2 data-spotlight='vocabulary book'>Vocabulary book</h2>
					</div>
					<!-- 右边菜单栏 -->
					<div class="nav-but-wrap">
						<div class="menu-icon hover-target" @click="toggleClass(menuBody,'nav-active')">
							<span class="menu-icon__line menu-icon__line-left"></span>
							<span class="menu-icon__line"></span>
							<span class="menu-icon__line menu-icon__line-right"></span>
						</div>					
					</div>					
				</div>				
		</header>
		
		
		
		<div class="nav">
				<div class="nav__content">
					<ul class="nav__list" @click.capture="toggleClass(menuBody,'nav-active')">														
						<!-- 四个页面的导航条 -->
						<li v-for="eachHash in toHash" :key="eachHash" :class="['nav__list-item', nowHash===eachHash ? 'active-nav': '']">
							<router-link :to='eachHash' class="hover-target">{{eachHash | hashOff}}</router-link>
						</li>
					</ul>
				</div>
		</div>
		
	</div>
</template>

<script>
	

	export default{
		name: 'myMenu',
		data() {
			return {
				// 四个导航条
				toHash:['/toAdd', '/toEnglish', '/toChinese', '/toLevel'],
				// 现在的路径
				nowHash: '',
				// 主体句柄
				menuBody: null,
				
			}
		},
		mounted() {
			this.nowHash = this.$route.path
			this.menuBody = this.$refs.menuContainer
		},
		methods:{
			// 切换类 显示菜单隐藏菜单
			toggleClass(element, stringClass) {
				if (element.classList.contains(stringClass)) element.classList.remove(stringClass);
				else element.classList.add(stringClass);
			}
		},
		watch: {
			'$route.path'(newHash) {
				this.nowHash = newHash
			}
		},
		filters: {
			// 格式化跳转的显示
			hashOff(orginVal) {
				return orginVal.substr(1)
			}
		}
	}
</script>

<style scoped>
	#menuContainer {
		width: 100%;
		/* height: 100%; */
		color: #c4c3ca;
		background-color: #1f2029;
		-webkit-transition: all 300ms linear;
		transition: all 300ms linear;
	}
	a {
		cursor: pointer;
		text-decoration: none;
	}
	a:hover {
		text-decoration: none;
	}
	.cd-header{
	    position: fixed;
		width:100%;
		top:0;
		left:0;
		z-index:100;
	} 
	.header-wrapper{
	    position: relative;
		width: calc(100% - 100px);
		margin-left: 50px;
	} 
	.logo-wrap {
		position: absolute;
		display:block;
		left:0;
		top: 40px;
		cursor: pointer;
	}
	.logo-wrap a {
		cursor: pointer;
		font-family: 'Montserrat', sans-serif;
		font-weight: 900;
		font-size: 20px;
		line-height: 20px;
		text-transform: uppercase;
		letter-spacing: 2px;
		color: #fff;
		transition : all 0.3s ease-out;
	}
	.logo-wrap h2 {
		cursor: pointer;
		font-family: 'Montserrat', sans-serif;
		font-weight: 900;
		font-size: 25px;
		line-height: 20px;
		text-transform: uppercase;
		letter-spacing: 2px;
		color: #eee;
		transition : all 0.3s ease-out;
		position: relative;
	}
	.logo-wrap h2::after {
		content: attr(data-spotlight);
		color: transparent;
		position: absolute;
		top: 0;
		left: 0;
		clip-path: ellipse(20px 20px at 0% 50%);
		-webkit-clip-path: ellipse(20px 20px at 0% 50%);
		animation: spotlight 5s infinite;
		background-image: url('../../assets/imgs/light.jpg');
		background-size: 100%;
		background-position: center center; 
		background-clip: text;
		-webkit-background-clip: text;
	}
	@keyframes spotlight{
		0% {
			clip-path: ellipse(20px 20px at 0% 50%);
			-webkit-clip-path: ellipse(20px 20px at 0% 50%);
		}
		50% {
			clip-path: ellipse(20px 20px at 100% 50%);
			-webkit-clip-path: ellipse(20px 20px at 100% 50%);
		}
		100% {
			clip-path: ellipse(20px 20px at 0% 50%);
			-webkit-clip-path: ellipse(20px 20px at 0% 50%);
		}
	}
	
	.logo-wrap a span{ 
		color: #8167a9;
	}
	.logo-wrap a:hover {
		opacity: 0.7;
	}
	.nav-but-wrap{ 
		position: relative;
		display: inline-block;
		float: right;
		padding-left: 15px;
		padding-top: 15px;
		margin-top: 26px;
		transition : all 0.3s ease-out;
	}
	.menu-icon {
		height: 30px;
		width: 30px;
		position: relative;
		z-index: 2;
		cursor: pointer;
		display: block;
	}
	.menu-icon__line {
		height: 5px;
		width: 30px;
		display: block;
		background-color: #7579e7;
		margin-bottom: 7px;
		cursor: pointer;
		-webkit-transition: background-color .5s ease, -webkit-transform .2s ease;
		transition: background-color .5s ease, -webkit-transform .2s ease;
		transition: transform .2s ease, background-color .5s ease;
		transition: transform .2s ease, background-color .5s ease, -webkit-transform .2s ease;
	}
	.menu-icon__line-left {
		width: 16.5px;
		-webkit-transition: all 200ms linear;
		transition: all 200ms linear;
	}
	.menu-icon__line-right {
		width: 16.5px;
		float: right;
		-webkit-transition: all 200ms linear;
		-moz-transition: all 200ms linear;
		-o-transition: all 200ms linear;
		-ms-transition: all 200ms linear;
		transition: all 200ms linear;
	}
	.menu-icon:hover .menu-icon__line-left,
	.menu-icon:hover .menu-icon__line-right {
		width: 30px;
	}
	
	.nav {
		position: fixed;
		z-index: 98;
	}
	.nav:before, .nav:after {
		content: "";
		position: fixed;
		width: 100vw;
		height: 100vh;
		background: rgba(20, 21, 26,0.6);
		border-bottom-left-radius: 200%;
		z-index: -1;
		-webkit-transition: -webkit-transform cubic-bezier(0.77, 0, 0.175, 1) 0.6s, border-radius linear 0.8s;
		transition: -webkit-transform cubic-bezier(0.77, 0, 0.175, 1) 0.6s, border-radius linear 0.8s;
		transition: transform cubic-bezier(0.77, 0, 0.175, 1) 0.6s, border-radius linear 0.8s;
		transition: transform cubic-bezier(0.77, 0, 0.175, 1) 0.6s, -webkit-transform cubic-bezier(0.77, 0, 0.175, 1) 0.6s, border-radius linear 0.8s;
		-webkit-transform: translateX(100%) translateY(-100%);
	          transform: translateX(100%) translateY(-100%);
	}
	.nav:after {
		background: rgba(9,9,12,1);
		-webkit-transition-delay: 0s;
	          transition-delay: 0s;
	}
	.nav:before {
		-webkit-transition-delay: .2s;
	          transition-delay: .2s;
	}
	.nav__content {
		position: fixed;
		visibility: hidden;
		top: 50%;
		margin-top: 20px;
		-webkit-transform: translate(0%, -50%);
	          transform: translate(0%, -50%);
		width: 100%;
		text-align: center;
	}
	.nav__list {
		position: relative;
		padding: 0;
		margin: 0;
		z-index: 2;
	}
	.nav__list-item {
		position: relative;
		display: block;
		-webkit-transition-delay: 0.8s;
	          transition-delay: 0.8s;
		opacity: 0;
		text-align: center;
		color: #fff;
		overflow: hidden; 
		font-family: 'Montserrat', sans-serif;
		font-size: 8vh;
		font-weight: 900;
		line-height: 1.15;
		letter-spacing: 3px;
		-webkit-transform: translate(100px, 0%);
	          transform: translate(100px, 0%);
		-webkit-transition: opacity .2s ease, -webkit-transform .3s ease;
		transition: opacity .2s ease, -webkit-transform .3s ease;
		transition: opacity .2s ease, transform .3s ease;
		transition: opacity .2s ease, transform .3s ease, -webkit-transform .3s ease;
		margin-top: 0;
		margin-bottom: 0;
	}
	.nav__list-item a{ 
		position: relative;
		text-decoration: none;
		color: rgba(255,255,255,0.6);
		overflow: hidden; 
		cursor: pointer;
		padding-left: 5px;
		padding-right: 5px;
		font-weight: 900;
		z-index: 2;
		display: inline-block;
		text-transform: uppercase;
	    -webkit-transition: all 200ms linear;
	    transition: all 200ms linear; 
	}
	.nav__list-item a:after{ 
		position: absolute;
		content: '';
		top: 50%;
		margin-top: -2px;
		left: 50%;
		width: 0;
		height: 0;
		opacity: 0;
		background-color: #8167a9;
		z-index: 1;
	    -webkit-transition: all 200ms linear;
	    transition: all 200ms linear; 
	}
	.nav__list-item a:hover:after{ 
		height: 4px;
		opacity: 1;
		left: 0;
		width: 100%;
	}
	.nav__list-item a:hover{
		color: rgba(255,255,255,1);
	}
	.nav__list-item.active-nav a{
		color: rgba(255,255,255,1);
	}
	.nav__list-item.active-nav a:after{ 
		height: 4px;
		opacity: 1;
		left: 0;
		width: 100%;
	}
	#menuContainer.nav-active .nav__content {
		visibility: visible;
	}
	#menuContainer.nav-active .menu-icon__line {
		background-color: #fff;
		-webkit-transform: translate(0px, 0px) rotate(-45deg);
	          transform: translate(0px, 0px) rotate(-45deg);
	}
	#menuContainer.nav-active .menu-icon__line-left {
		width: 15px;
		-webkit-transform: translate(2px, 10px) rotate(45deg);
	          transform: translate(2px, 10px) rotate(45deg);
	}
	#menuContainer.nav-active .menu-icon__line-right {
		width: 15px;
		float: right;
		-webkit-transform: translate(-3px, -3.5px) rotate(45deg);
	          transform: translate(-3px, -3.5px) rotate(45deg);
	}
	#menuContainer.nav-active .menu-icon:hover .menu-icon__line-left,
	#menuContainer.nav-active .menu-icon:hover .menu-icon__line-right {
		width: 15px;
	}
	#menuContainer.nav-active .nav {
		visibility: visible;
	}
	#menuContainer.nav-active .nav:before, #menuContainer.nav-active .nav:after {
		-webkit-transform: translateX(0%) translateY(0%);
	          transform: translateX(0%) translateY(0%);
		border-radius: 0;
	}
	#menuContainer.nav-active .nav:after {
		-webkit-transition-delay: .1s;
	          transition-delay: .1s;
	}
	#menuContainer.nav-active .nav:before {
		-webkit-transition-delay: 0s;
	          transition-delay: 0s;
	}
	#menuContainer.nav-active .nav__list-item {
		opacity: 1;
		-webkit-transform: translateX(0%);
	          transform: translateX(0%);
		-webkit-transition: opacity .3s ease, color .3s ease, -webkit-transform .3s ease;
		transition: opacity .3s ease, color .3s ease, -webkit-transform .3s ease;
		transition: opacity .3s ease, transform .3s ease, color .3s ease;
		transition: opacity .3s ease, transform .3s ease, color .3s ease, -webkit-transform .3s ease;
	}
	#menuContainer.nav-active .nav__list-item:nth-child(0) {
		-webkit-transition-delay: 0.7s;
	          transition-delay: 0.7s;
	}
	#menuContainer.nav-active .nav__list-item:nth-child(1) {
		-webkit-transition-delay: 0.8s;
	          transition-delay: 0.8s;
	}
	#menuContainer.nav-active .nav__list-item:nth-child(2) {
		-webkit-transition-delay: 0.9s;
	          transition-delay: 0.9s;
	}
	#menuContainer.nav-active .nav__list-item:nth-child(3) {
		-webkit-transition-delay: 1s;
	          transition-delay: 1s;
	}
	#menuContainer.nav-active .nav__list-item:nth-child(4) {
		-webkit-transition-delay: 1.1s;
	          transition-delay: 1.1s;
	}
	
</style>
