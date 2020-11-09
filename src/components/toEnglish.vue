<template>
	<!-- 中文背英文 -->
	<div id="toEnglish">
		<!-- 主体框架区域 -->
		<div ref="container" class="container right-panel-active" >
			<!-- 单词详细页 -->
			<div class="container__form container--signup" >
				<div class="form">
					
					<!-- 展示详细区域 -->
					<div class="form_top">
						<!-- 顶头显示单词 -->
						<p class="upWord">{{words[nowIndex].name}}</p>
						<!-- 中间显示词态和翻译 -->
						<p class="downToCn" v-for="(tenseItem, tensekey) in words[nowIndex].tenses" :key="tensekey">
							<span> [	{{tenseItem.tvalue}} ] </span> 
							<span>{{tenseItem.translate}} </span>
						</p>
					</div>
					
					<!-- 记得/忘记按钮区域 -->
					<div class="form_bottom">
						<button class="btn btn1" ref="remember" @click="turnNext">remember</button>
						<button class="btn btn2" ref="forget" @click="turnForget">forget</button>
					</div>
				
					
				</div>
				
			</div>
		
			<!-- 单词背诵页(Logo) -->
			<div class="container__form container--signin" @click.capture="turnShow">
				<div class="form">
					<!-- <h1 class="form__title">{{words[nowIndex].name}}</h1> -->
					<!-- 遍历展示中文词态和翻译 -->
					<div class="wordLeft">
						<p  v-for="(tenseItem, tenseKey)  in words[nowIndex].tenses" :key="tenseKey">
							<span>[{{tenseItem.tvalue}}]</span>
							<span>{{tenseItem.translate}}</span>
						</p>
					</div>
				</div>
			</div>
		
			
		</div>
	</div>
</template>


<script>
	// 单词格式
	// {
	// 		wid: 1,
	// 		name: 'apple',
	// 		level: 1,
	// 		tenses: [{
	// 			// 存放时态
	// 			tvalue: 'n',
	// 			translate: '苹果',
	// 		}]
	// }
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				// 单词区域句柄
				container: null,
				
				// 单词库
				words: [],
				
				// 背诵单词的索引 用于确定当前该背哪个单词
				nowIndex: 0,
				// 记录上一次的单词索引（确保背诵单词随机）
				lastWordIndex: null,
				
			}
		},
		created() {
			// 从单词库中取出数据
			this.words = this.wordStorage
			// 获取要展示单词的索引
			this.nowIndex = this.getWordIndex(this.words)
		},
		mounted() {
			  
			// 挂载完成获取主体区域container的句柄
			this.container = this.$refs.container
		 },
		 methods: {
			 //利用事件委托机制
			 // 当点击了单词框区域 通过移除right-panel-active样式
			 // 展示单词详情页
			 turnShow() {
				// console.log('-----------------')
				// console.log(this.words[this.nowIndex].tense)
				this.container.classList.remove("right-panel-active")
			 },
			 
			
			 
			 // 取得背诵单词索引
			 getWordIndex(words) {
			 	// 过滤出需要背的单词
			 	let needWords = this.needToRecite
			 	// 判断有没有需要背的单词
			 	// 如果没有 直接返回
			 	// if(needWords.length=== 0 ) {
			 	// 	return this.$message.error('没有需要背的单词!')
			 	// }
			 	if(needWords.length === 1){
			 		// 如果只剩下一个单词了
			 		// 则直接通过该单词Id找到索引 直接返回
			 		// 省去随机数的步骤
			 		return words.findIndex(itemWord => itemWord.wid === needWords[0].wid)
			 	}else {
			 		// 取得单词的ID
			 		needWords =  needWords.map(need => need.wid )
			 		// 利用随机数取得单词下标
			 		let randomIndex = Math.floor(Math.random() * needWords.length) 
			 		// 判断是不是第一次生成的索引
			 		if(this.lastWordIndex === null){
			 			this.lastWordIndex = randomIndex
			 		}else {
			 			// 如果不是 再判断这次生成的索引和上次的是不是相同
			 			// 只有两次的索引值不相同 
			 			// 才可以保证出现的单词是随机的
			 			while(this.lastWordIndex === randomIndex){
			 				randomIndex = Math.floor(Math.random() * needWords.length)
			 			}
						// 跳出循环 记录上一次的索引值
			 			this.lastWordIndex = randomIndex
			 		}
					
			 		
					// 找到该随机单词在单词库的下标
			 		let realIndex = words.findIndex(wordItem => {
			 			return wordItem.wid === needWords[randomIndex]
			 		})
			 		return realIndex
			 	}
			 	
			 	
			 },
			 
			 // 点击Remember按钮跳转下一个背诵单词
			 turnNext() {
				console.log(this.nowIndex,'--', this.isAlready)
				// 判断单词是否已经背完了
				// 背完了 则直接提示
				if(this.isAlready){
					return this.$message.success('已经背完了！')
				}
				
				// 获取该单词
				let currentWord =  this.words[this.nowIndex]
				// 1.判断是不是点击过Forget按钮
				// 如果点击过 则意味着是第二次背诵 
				// 则应该减少背诵次数 而不置为true
				if(currentWord.recitationTimes < 3){
					currentWord.recitationTimes--
				}else {
					currentWord.remember = true
				}
				
				
				// 这里再一次判断该单词是不是最后一个单词
				// 如果是的话 停留显示当前单词
				// 并返回提示
				if(this.isAlready){
					return this.$message.success('已经背完了！')
				}
				
				
				// 2.调用获取单词索引方法 切换至下一个单词
				this.nowIndex = this.getWordIndex(this.words) 
				
				// 切回单词LOGO页
				this.container.classList.add("right-panel-active") 
				 
			 },
			 
			 
			 // 点击Forget按钮跳转下一个单词
			 turnForget() {
				 console.log(this.nowIndex,'--', this.isAlready)
				 // 判断单词是否已经背完了
				 // 背完了 则直接提示
				 if(this.isAlready){
				 	return this.$message.success('已经背完了！')
				 }
				 
				 // 1.将该单词的remember标志变为false
				 let currentWord =  this.words[this.nowIndex]
				 currentWord.remember = false
				 // 2.该单词的背诵次数减一
				 currentWord.recitationTimes--
				 
				 // 这里再一次判断该单词是不是最后一个单词
				 // 如果是的话 停留显示当前单词
				 // 并返回提示
				 if(this.isAlready){
				 	return this.$message.success('已经背完了！')
				 }
				 
				 // 3.调用获取单词索引方法 切换至下一个单词
				 this.nowIndex = this.getWordIndex(this.words) 
				 
				 // 切回单词LOGO页
				 this.container.classList.add("right-panel-active") 
			 },
			 
			 
			
		 },
		 computed:{
			 // 检测是否已经背完了
			 isAlready() {
			  // still为true 就意味着还要继续背
			  let still =  this.words.some(wordItem => {
			 		// 单词记得标记位为false
			 		// 单词背诵次数大于0
			 		if(!wordItem.remember && wordItem.recitationTimes > 0){
			 			return true
			 		} 
			 	})
			  // still为false 就意味着已经背完单词了
			 return !still
			 },
			 // 监听需要背的单词
			 needToRecite() {
				return this.words.filter(wordItem => {
				 	if(!wordItem.remember && wordItem.recitationTimes > 0 ){
				 		return true
				 	}
				 })
			 },
			 ...mapState(['wordStorage'])
		 }
	}
 
  

</script>


<style scoped>
	
	
	
	
	.form__title {
		/* font-weight: 300; */
		font-weight: bolder;
		margin: 0;
		margin-bottom: 1.25rem;
	}
	
	
	
	.container {
		/* background-color: var(--white); */
		background: #eee;
		background: linear-gradient(120deg, rgba(50, 150, 100, 0.9) , rgba(0, 0, 100, 0.9) );
		border-radius: var(--button-radius);
		box-shadow: 0.9rem 0.9rem 1.7rem rgba(255, 199, 199, 0.55),
			-0.7rem 0.7rem 0.7rem rgba(255, 199, 199, 0.45);
		/* height: var(--max-height);
		max-width: var(--max-width); */
		max-width: 400px;
		height: 500px;
		overflow: hidden;
		position: relative;
		width: 100%;
	}
	
	.container__form {
		height: 100%;
		position: absolute;
		top: 0;
		transition: all 0.6s ease-in-out;
	}
	
	.container--signin {
		left: 100%;
		width: 100%;
		z-index: 2;
	}
	
	.container.right-panel-active .container--signin {
		transform: translateX(-100%);
	}
	
	.container--signup {
		left: 0;
		opacity: 1;
		width: 100%;
		z-index: 5;
		/* animation: show 0.6s; */
	}
	
	.container.right-panel-active .container--signup {
		animation: show 0.6s;
		opacity: 0;
		transform: translateX(100%);
		z-index: 1;
	}
	
	
	.btn {
		background-color: var(--blue);
		background-image: linear-gradient(90deg, var(--blue) 0%, var(--lightblue) 74%);
		border-radius: 20px;
		border: 1px solid var(--blue);
		color: var(--white);
		cursor: pointer;
		font-size: 0.8rem;
		font-weight: bold;
		letter-spacing: 0.1rem;
		padding: 0.9rem 2rem;
		text-transform: uppercase;
		transition: transform 80ms ease-in;
		flex: 0 1 175px;
	}
	
	.btn:active {
		transform: scale(0.95);
	}
	
	.btn:focus {
		outline: none;
	}
	
	.form {
		/* background-color: var(--white); */
		background: #eee;
		/* background: linear-gradient(120deg, rgba(50, 150, 100, 0.9) , rgba(0, 0, 100, 0.9) ); */
		background: linear-gradient(240deg, rgba(150, 50, 50, 0.3) , rgba(0, 0, 200, 0) );
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding: 0 3rem;
		height: 100%;
		text-align: center;
		color: #fff;
		position: relative;
	}
	
	.form_top {
		width: 100%;
		position: absolute;
		top: 10%;
	}

	
	.upWord {
		font-size: 4rem;
		padding: 1.5rem;
		line-height: 7rem;
	}
	
	.downToCn {
		text-align:left;
		padding: 0 4rem;
		margin-top: 3px;
	}
	
	
	.form_bottom {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		align-items: center;
		position: absolute;
		bottom: 18%;
	}
	
	.form>.wordLeft p{
		/* border: 1px solid red; */
		margin-bottom: 1rem;
		text-align: left;
		font-size: 1.5rem;
		padding: 7px;
		font-weight: bold;
	}
	.form>.wordLeft p span:first-child{
		margin-right: 3px;
	}
	
	@keyframes show {
		0%,
		70% {
			opacity: 0;
			z-index: 1;
		}
	
		80%,
		100% {
			opacity: 1;
			z-index: 5;
		}
	}

</style>