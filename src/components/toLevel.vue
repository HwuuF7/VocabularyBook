<template>
		<!-- 按等级背单词（按顺序背） -->
		<div id='toLevel'>
			<!-- 固定按钮选择等级页面 -->
			<div class="fix-container" v-if="isShowFix">
				<!-- 提示区域 -->
				<el-alert title="请选择记忆的单词等级" type="info" center show-icon :closable="false" effect="dark"></el-alert>
				
				<!-- 等级按钮选择区域 -->
				<div class="fix-btns" @click.capture="parentBtn">
					<el-row type="flex" justify="center" align="bottom">
						<el-col :span="6" > 
							<el-button ref="levelOne" class="levelOne" size="mini" type="success">1</el-button>
						</el-col>
						<el-col :span="6" >
							<el-button ref="levelTwo" class="levelTwo" size="small" type="warning">2</el-button>
						</el-col>
						<el-col :span="6" >
							<el-button ref="levelThree" class="levelThree" type="danger">3</el-button>
						</el-col>
					</el-row>
				</div>
			</div>
			
			<!-- 对应等级单词展示区域 -->
			<el-card v-else>
				<div ref="container" :class="['container', rightPanel ? 'right-panel-active' : '']" >
					
					<!-- 单词详细页面 -->
					<div class="container__form container--signup" >
						<div class="form">
							<el-button v-if="already" circle icon="el-icon-d-arrow-left" type="warning" class="gobackBtn" @click='backToChoice'></el-button>
							<div class="form_top">
								<p class="upWord">{{needWords[nowIndex].name}}</p>
								<p class="downToCn" v-for="(tenseItem, tenseKey) in needWords[nowIndex].tenses" :key="tenseKey">
									<span>[	{{tenseItem.tvalue}} ]</span>
									<span>{{ tenseItem.translate }} </span>   
								</p>
							</div>
							<div class="form_bottom">
								<button class="btn btn1" ref="remember" @click="turnNext">remember</button>
								<button class="btn btn2" ref="forget" @click="turnForget">forget</button>
							</div>
						
							
						</div>
						
					</div>
				
					<!-- 单词首页面（Logo） -->
					<div class="container__form container--signin" @click.capture="turnShow">
						<div class="form">
							<h1 class="form__title">{{needWords[nowIndex].name}}</h1>
						</div>
					</div>
				
				</div>
			</el-card>
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
				// 标记 默认为显示等级选择页
				// 用于显示等级选择页还是单词页
				isShowFix: true,
				
				// 展示单词区域句柄
				container: null,
				
				// 单词库
				words: [],
				
				// 记录当前背的单词等级
				needLevel: null,
				// 记录要背的单词
				needWords: [],
				// 记录要背的单词个数
				needWordsSize: 0,
				
				// 背诵单词的索引 用于确定现在该背哪个单词
				nowIndex: 0,
				
				// 详情页orLogo页的标志(控制类)
				rightPanel: true,
				
				// 是否切换至背忘记的单词标志
				// 触发条件为: 1.按顺序背完了一轮 
				//		    2.同时存在忘记的单词
				changeWord: false,
				
				// 忘记单词的默认索引为0
				forgetIndex: 0,
				
				// 是否已经背完了标志
				already: false,
				// 忘记单词的个数
				forgetLen: 0,
				// 记录等级一的单词
				levelOneWords:[],
				// 记录等级二的单词
				levelTwoWords:[],
				// 记录等级三的单词
				levelThreeWords:[],
				
				// 每个Level的背单词次数只有1次 
				// 当再点击进去的时候,
				// 这里是为了将nowIndex置为上一次最后一个单词
				countLevel:[{
					count: 1,
					lastIndex: null
				},{
					count: 1,
					lastIndex: null
				},{
					count: 1,
					lastIndex: null
				},],
			}
		},
		created() {
			// 从单词库中取出数据
			this.words = this.deepCopy(this.wordStorage)
			// 过滤出等级一的单词
			this.levelOneWords = this.filterLevel(this.words,1)
			// 过滤出等级二的单词
			this.levelTwoWords = this.filterLevel(this.words,2)
			// 过滤出等级三的单词
			this.levelThreeWords = this.filterLevel(this.words,3)
		},
		mounted() {
			
			// 为等级按钮里的span标签加上类名 这样点击的时候也会触发到
			this.$refs.levelOne.$el.lastElementChild.className = 'levelOne'
			this.$refs.levelTwo.$el.lastElementChild.className = 'levelTwo'
			this.$refs.levelThree.$el.lastElementChild.className = 'levelThree'
			
			// console.log(this.$route)
		 },
		 
		 methods: {
			 //事件委托 点击单词框可以翻页至详情展示
			turnShow() {
				// console.log('-----------------')
				// console.log(this.words[this.nowIndex].tense)
				this.container.classList.remove("right-panel-active")
			 },
			
			// 抽离出各个等级的单词
			// 第一个参数为 单词库
			// 第二个参数为 单词等级
			filterLevel(originWords,level){
				return originWords.filter((wordItem)=> {
					return wordItem.level === level
				})
			}, 
			
			// 抽离重复代码
			// 参数一 传入的等级单词数组
			// 参数二 单词等级
			level(whichLevelWords,levelNum){
				// 获取当前等级的状态
				let currentLevelState = this.countLevel[levelNum] 
				
				// 将显示等级按钮页隐藏 显示单词页
				this.isShowFix = false
				
				
				
				// 首先判断是第一次点击进来还是第二次以后的点击
				// 如果是第一次点击 则可以正常背单词
				if(currentLevelState.count === 1) {
					// 需要Logo页切换
					this.rightPanel = true
					// DOM更新后获取回调 否则container句柄会丢失
					this.$nextTick(() => {
						// console.log('执行的时机!')
						this.container = this.$refs.container
					})
					// 当前显示的等级单词
					this.needWords = whichLevelWords
					// 记录当前单词个数
					this.needWordsSize  = whichLevelWords.length
					// 将当前等级单词库的背诵状态减一
					currentLevelState.count--
					// console.log('test', this.needWords, this.countLevel)
				}else {
					// console.log('走了ELSE')
					// 否则 则显示需要背单词的最后一个单词详情页
					this.rightPanel = false
					// 首先置位 该等级单词已背完
					this.already = true
					// 将需要背的单词替换为 上一次背的最后一个单词 
					this.needWords.unshift(whichLevelWords[currentLevelState.lastIndex]) 
					// 当前显示索引置为0即可
					this.nowIndex = 0
				}
				
				
			},
			
			// 优化点击事件,由父元素来进行事件执行
			parentBtn(e) {
				// 获取到点击目标的类名
				// className是一个字符串类型
				let classStr = e.target.className
				// console.log('监听到',classStr)
				// 通过检查点击目标对应的类名 
				// 跳转至对应等级单词页面
				if(classStr.includes('levelOne')){
					// 跳转至单词等级一
					console.log('等级一')
					this.needLevel = 0
					this.level(this.levelOneWords,0)
				}else if(classStr.includes('levelTwo')){
					// 跳转至单词等级二
					console.log('等级二')
					this.needLevel = 1
					this.level(this.levelTwoWords,1)
				}else if(classStr.includes('levelThree')){
					// 跳转至单词等级三
					console.log('等级三')
					this.needLevel = 2
					this.level(this.levelThreeWords,2)
				}
				
				
			},
			
			// 点击Remember按钮切换至背下一个单词
			turnNext() {
				
				// 首先判断是否已经处于背完状态下
				// 如果是 则提示已背完
				if(this.already) return this.$message.success('You Have Already Remenbered All~')
				
				// 暂存一下单词索引
				let tempIndex = this.nowIndex
	
				// 判断是不是已经进入了背忘记的单词状态
				// 如果没有 则说明还在按顺序背的第一轮
				if(!this.changeWord){
					// 置当前remember标志位为true
					this.needWords[tempIndex].remember = true
					// 一直往下背
					this.nowIndex++
					
					// 判断是不是按顺序已经背完了第一轮  
					// 如果是  判断有没有忘记的单词
					if(this.nowIndex >= this.needWordsSize) {
						// 如果全部单词都记得 没有忘记的
						// console.log('进来了???????????', this.forgetWords)
						if(this.forgetWords.length === 0){
							// 则认为已经背完了 置already为true
							this.already = true
							// 让nowIndex保持上一个单词内容 不然会越界
							this.nowIndex  = tempIndex
							// 保存最后一个单词索引
							this.countLevel[this.needLevel].lastIndex = tempIndex
							
							// 返回提示
							return this.$message.success('已经背完了！')
						}
						// 否则 存在忘记的单词
						else {
							//置changeWord标志为true 转为背忘记的单词 
							this.changeWord = true
							// 记录当前忘记单词的个数
							this.forgetLen = this.forgetWords.length
							// nowIndex置为忘记单词的第一个
							this.nowIndex = this.needWords.findIndex((wordItem) => {
								//forgetWords里存的是ID， 因此要找出真正的Index
								return wordItem.wid ===  this.forgetWords[this.forgetIndex]
							})
						}
					}
					
				}
				// 否则 现在处于背忘记单词的状态下
				// 忘记单词状态下 点击remember按钮 
				// 跳转的单词为忘记单词里的下一个
				else {
					//将该单词的背诵次数减一
					this.needWords[tempIndex].recitationTimes--
					
					// 背忘记单词
					// 传入参数:当前的tempIndex索引 
					// 作用: 用于显示最后一个单词详情页(防越界)
					// 返回True则代表着 不用再翻页了 停留显示
					if(this.reciteForgetWords(tempIndex)){
						// 返回提示
						return this.$message.success('已经背完了!')
					}
				}
				
				
				
				this.container.classList.add("right-panel-active")
			},
			
			// 点击Forget按钮切换至下一个单词
			turnForget() {
				// console.log('forget now', this.needWords,this.changeWord,this.forgetWords)
				console.log('forget')
				if(this.already) return this.$message.success('You Have Already Remenbered All~')
				
				// 暂存一下单词索引
				let tempIndex = this.nowIndex
				
				//首先该单词默认为false
				// this.needWords[this.nowIndex].remember = false
				
				
				// 将这个单词背诵次数减少一次
				if(this.needWords[tempIndex].recitationTimes > 0){
					this.needWords[tempIndex].recitationTimes--
				}
				
				
				
				// 判断是否按顺序背完了第一轮
				// 如果没有
				if(!this.changeWord){
					//正常的index++ 直到背完所有单词一次
					this.nowIndex++
					// 执行到这 意味着第一轮已经背完了
					if(this.nowIndex >= this.needWordsSize){
						// 置changeWord为true 表示可以开始背忘记的单词了
						this.changeWord = true
						
						// 一趟下来统计出忘记单词的数量
						this.forgetLen = this.forgetWords.length
						
						//index转为忘记单词的第一个
						this.nowIndex = this.needWords.findIndex((wordItem) => {
							//forgetWords里存的是ID， 因此要找出真正的Index
							return wordItem.wid ===  this.forgetWords[this.forgetIndex]
						})
					}
				}
				// 此时已经处于背忘记单词状态下
				else {
					// 返回True则代表着 不用再翻页了 停留显示
					if(this.reciteForgetWords(tempIndex)){
						// 返回提示
						return this.$message.success('已经背完了!')
					}
					
				}
				
				this.container.classList.add("right-panel-active")
			},
			
			// 抽离背忘记的单词
			reciteForgetWords(tempIndex) {
				// 调用计算属性 判断是否还存在忘记的单词
				// 如果没有 则认为已经背完了
				if(this.forgetWords.length === 0) {
					// console.log('zou zhe li !',this.forgetLen)
					// 置背完标志alread为true
					this.already = true
					// 使当前的单词索引为最后一个单词索引
					this.nowIndex = tempIndex
					// 将最后一次的单词索引保存至该等级单词的背诵状态下
					// 则下次点击该等级按钮时 显示的就是该单词
					this.countLevel[this.needLevel].lastIndex = tempIndex
					
					return true
				}
				
				// 忘记的单词逐渐背完
				if(this.forgetLen > this.forgetWords.length){
					this.forgetIndex = 0
				}else{
					// 已经在背忘记单词 再点记得/忘记操作
					//直接跳转下一个
					this.forgetIndex++
					if(this.forgetIndex >= this.forgetLen) {
						this.forgetIndex = 0
					}
				}
				 
				this.nowIndex = this.needWords.findIndex((item) => {
					//forgetWords里存的是ID， 因此要找出真正的Index
					return item.wid ===  this.forgetWords[this.forgetIndex]
				})
			},
			
			
			
			
			
			backToChoice() {
				// 切出来的前提是已经背完了
				console.log('重置')
				// 切回显示选择按钮区域
				this.isShowFix  = true
				// 单词索引为0
				this.nowIndex = 0
				// 是否背完标志为false
				this.already = false
				// 是否切换至背忘记单词为false
				this.changeWord = false
				// 忘记单词索引为0
				this.forgetIndex = 0
				this.$nextTick(() => {
					// 为等级按钮里的span标签加上类名 这样点击的时候也会触发到
					this.$refs.levelOne.$el.lastElementChild.className = 'levelOne'
					this.$refs.levelTwo.$el.lastElementChild.className = 'levelTwo'
					this.$refs.levelThree.$el.lastElementChild.className = 'levelThree'
				})
			}
			
			
		 },
		 computed: {
			// 计算忘记的单词id 返回一个数组
			forgetWords() {
				let temp = this.needWords.filter((itemWord) => {
					// 非0值都被认为是TRUE!!!
					return !itemWord.remember && itemWord.recitationTimes>0
				}).map(item => item.wid)
				return temp
			},
			...mapState(['wordStorage'])
		 },
		
	}
 
  

</script>

<style scoped>
	#toLevel {
		background: linear-gradient(to right bottom, #89c9b8 16%, rgba(145,209,139, 0.4) 23%);
		background-attachment: fixed;
		background-position: center;
	}
	
	.fix-container {
		width: 70%;
		max-width: var(--max-width);
		height: var(--max-height);
		position: fixed;
		/* border: 3px solid blue; */
		/* height: 3rem; */
		transition: all ease-out 1s;
	}
	
	.fix-btns {
		height: 60%;
		margin-top: 2rem;
		padding: 4rem;
		/* border: 1px solid red; */
	}
	
	.el-row {
		height: 100%;
		/* border: 1px solid #42B983; */
	}
	
	.levelOne{
		width: 2rem;
		height: 2.5rem;
		padding: 7px 8px;
	}
	
	.levelTwo{
		width: 3rem;
		height: 5.5rem;
	}
	
	.levelThree{
		width: 4rem;
		height: 9.5rem;
	}
	
	.levelOne,.levelTwo,.levelThree {
		font-size: 1.5rem;
		transition: all .4s ease-out ; 
	}
	
	.levelOne:hover,.levelTwo:hover,.levelThree:hover {
		transform: scale(.95);
	}
	
	.el-card {
		max-width: 400px;
		width: 100%;
	}
	
	.container {
		/* border: 1px solid red; */
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
	
	.form__title {
		/* font-weight: 300; */
		font-weight: bolder;
		margin: 0;
		margin-bottom: 1.25rem;
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
	
	.form > .btn {
		margin-top: 1.5rem;
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
	
	.gobackBtn {
		position: absolute;
		top: 1rem;
		right: 1rem;
		animation: downBackBTN .4s ease-in;
		/* transition: all .4s ease-in; */
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
	
	@keyframes downBackBTN{
		from{
			top:-5%;
		}
		to{
			top:1rem;
			right: 1rem;
		}
	}
</style>
