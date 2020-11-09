<template>
		<div id="toAdd">
			<div class="container">

				<!-- 主体区域 -->
				<el-container>

					<!-- 侧边栏展示单词 -->
					<el-aside>
						<!-- 展示单词数量 -->
						<p style="text-align: center;padding: .7rem;font-size: 1.5rem;">{{'目前总共'+wordsLen+'个单词'}}</p>

						<!-- 遍历存储的单词 -->
						<el-card v-for="eachWord in words" :key="eachWord.wid" class="wordCardItem">
							<p>
								<!-- 单词名 -->
								<span style="font-size: 2rem;font-weight: 500; ">{{eachWord.name}}</span>
								<!-- 单词等级 -->
								<el-tag v-if="eachWord.level === 1" type="success" effect="dark">{{eachWord.level}}</el-tag>
								<el-tag v-else-if="eachWord.level === 2" effect="dark"> {{eachWord.level}}</el-tag>
								<el-tag v-else type="danger" effect="dark">{{eachWord.level}}</el-tag>
							</p>

							<!-- 单词词态和翻译 -->
							<p v-for="wordTense in eachWord.tenses" :key="wordTense.tvalue">
								<!-- {{'['+wordTense.tvalue +']'}} -->
								<span style="border-bottom:3px solid #008997;">{{'['+wordTense.tvalue +']'}}</span>
								<span style="margin-left: 7px;">{{wordTense.translate}}</span>
							</p>

							<!-- 鼠标经过单词时展示相应的编辑删除操作 -->
							<div class="showBtn">
								<el-button type="primary" @click="editWord(eachWord)">编辑</el-button>
								<el-button type="danger" @click="delWord(eachWord.wid)">删除</el-button>
							</div>
						</el-card>
					</el-aside>

					<!-- 主体展示单词添加表单 -->
					<el-main>

						<!-- 表单区域 -->
						<el-form :model="addWordForm" ref="addWordFormRef" label-width="100px">
							<!-- 单词框 -->
							<el-form-item label="新单词" prop="name" :rules="addWordRules.name" inline-message>
								<el-input v-model="addWordForm.name" clearable></el-input>
							</el-form-item>

							<!-- 等级框 -->
							<el-form-item label="记忆等级" prop="level" :rules="addWordRules.level">
								<el-select v-model="addWordForm.level">
									<el-option v-for="item in 3" :key="item" :label="item" :value="item">
									</el-option>
								</el-select>

							</el-form-item>

							<!-- 词态和翻译需要循环添加显示 -->
							<div v-for="(item, index) in addWordForm.tenses" :key="index">

								<!-- 词态选择框 -->
								<el-form-item label="词态" :prop="`tenses.${index}.tvalue`" :rules="addWordRules.tense">
									<el-select v-model="item.tvalue" placeholder="词态选择" clearable>
										<el-option v-for="itemTense in optionTense(item.tvalue, addWordForm)" :key="itemTense.value" :value="itemTense.value"></el-option>
									</el-select>

									<!-- 删除词态按钮 -->
									<el-button v-if="tenseLen > 1" class="delTenseBtn" type="danger" size="mini" icon="el-icon-close" circle
									 @click="removeOneTense(index,'add')"></el-button>
								</el-form-item>



								<!-- 翻译框 -->
								<el-form-item label="中文翻译" :prop="`tenses.${index}.translate`" :rules="addWordRules.translate">
									<el-input v-model="item.translate" clearable style="width: 80%;"></el-input>
								</el-form-item>
							</div>




							<!-- 添加更多词态按钮 -->
							<el-form-item>
								<el-button type="info" :disabled="enableAddBtn" icon="el-icon-plus" size="small" circle @click="addTense('add')"></el-button>
							</el-form-item>

						</el-form>

						<el-row type="flex" justify="center" align="middle" style="height: 3.125rem;">
							<el-col :span="6">
								<el-button type="primary" @click="addWord">添加</el-button>
							</el-col>
						</el-row>
					</el-main>
				</el-container>

				<!-- 编辑按钮的修改单词对话框 -->
				<el-dialog class="editDialog" center title="修改单词" :visible.sync="editWordDialogVisible" width="50%">
					<el-form :model="editWordForm" ref="editWordFormRef" label-width="100px">

						<el-form-item label="新单词" prop="name" :rules="addWordRules.editname">
							<el-input v-model="editWordForm.name" clearable></el-input>
						</el-form-item>

						<el-form-item label="记忆等级" prop="level" :rules="addWordRules.level">
							<el-select v-model="editWordForm.level">
								<el-option v-for="item in 3" :key="item" :label="item" :value="item">
								</el-option>
							</el-select>
						</el-form-item>

						
						<div v-for="(item,index) in editWordForm.tenses" :key="index" >
							<!-- 词态选择框 -->
							<el-form-item class="relativeFormItem" label="词态" :prop="`tenses.${index}.tvalue`" :rules="addWordRules.tense">
								<el-select v-model="item.tvalue" placeholder="词态选择">
									<el-option v-for="itemTense in optionTense(item.tvalue, editWordForm)" :key="itemTense.value" :value="itemTense.value"></el-option>
								</el-select>
								
								<!-- 删除词态按钮 -->
								<el-button  v-if="editTenseLen > 1"  type="danger" size="mini" icon="el-icon-close" circle @click="removeOneTense(index,'edit')"></el-button>
							</el-form-item>
							
							<!-- 翻译框 -->
							<el-form-item  label="中文翻译" :prop="`tenses.${index}.translate`" :rules="addWordRules.translate">
								<el-input v-model="item.translate" clearable style="width: 100%;"></el-input>
							</el-form-item>
						</div>


						<el-form-item>
							<el-button style="margin-left: -75px;" :disabled="enableEditBtn" type="primary" icon="el-icon-plus" size="small" circle @click="addTense('edit')"></el-button>
						</el-form-item>

					</el-form>
					<span slot="footer" class="dialog-footer">
						<el-button @click="editWordDialogVisible = false">取 消</el-button>
						<el-button type="primary" @click="editWordFinal">确 定</el-button>
					</span>
				</el-dialog>

			</div>
		</div>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			var checkAddName = (rule, value, callback) => {
				if(value === ''){
					callback(new Error('请输入需要添加的新单词'))
				}else {
					// 判断是否添加了重复的单词
					let wordIndex = this.words.findIndex(wordItem => wordItem.name === value)
					if(wordIndex !== -1){
						callback(new Error('请勿添加重复的单词!'))
					}else {
						callback()
					}
				}
			}
			
			
			return {
				// 单词库
				words: [],

				// 可选择的词态类型
				tenses: [{
					value: 'n',
					// label: '名词'
				}, {
					value: 'v',
					// label: '动词'
				}, {
					value: 'adj'
				}, {
					value: 'adv'
				}],

				// 记录可选择的词态类型数量
				tensesValueLen: 4,

				// 记录添加单词状态下的所需信息
				addWordForm: {
					name: '',
					level: 1,
					tenses: [{
						// 存放时态和翻译
						tvalue: '',
						translate: ''
					}],
					remember: false,
					recitationTimes: 3
				},

				// 添加/修改单词的验证规则
				addWordRules: {
					name: [{
						validator: checkAddName, trigger: ['blur','change']
					}],
					editname: [{
						required: true,
						message: '请输入需要添加的新单词22',
						trigger: 'blur'
					}],
					level: [{
						required: true,
						message: '请选择记忆等级',
						trigger: ['blur', 'change']
					}],
					tense: [{
						required: true,
						message: '请选择相应的词态',
						trigger: ['change', 'blur']
					}],
					translate: [{
						required: true,
						message: '请输入相应的中文翻译',
						trigger: ['blur', 'change']
					}]
				},

				// 修改单词的对话框的显示状态
				editWordDialogVisible: false,

				// 记录修改状态下的单词信息
				editWordForm: {},

				// 使能添加单词状态下添加更多词态按钮
				enableAddBtn: true,
				
				// 使能修改单词状态下的添加更多词态按钮
				enableEditBtn: true,
			}
		},
		created() {
			// 从单词库中取出数据
			this.words = this.wordStorage
		},
		methods: {
			// 删除词态
			removeOneTense(index, mode) {
				// 添加单词状态下
				if (mode === 'add') {
					this.addWordForm.tenses.splice(index, 1)
					// console.log('-----', this.addWordForm.tenses)
				}
				// 编辑单词状态下
				else if (mode === 'edit') {
					this.editWordForm.tenses.splice(index, 1)
					// console.log('-----', this.editWordForm.tenses)
				}

			},

			// 添加更多的词态
			addTense(mode) {

				// 记录新的词态和翻译
				let newTenseObj = {
					tvalue: '',
					translate: ''
				}
				if (mode === "add") {
					this.addWordForm.tenses.push(newTenseObj)

				} else if (mode === "edit") {
					this.editWordForm.tenses.push(newTenseObj)
				}

				// console.log('添加新词态成功')
			},

			// 判断是否是对象类型
			isObject(obj) {
				return typeof obj === 'object' && obj !== null
			},

			// 词态对象数组深拷贝
			deepTensesCopy(sourceTenseArr) {
				// 如果不是对象 则返回该值
				if (!this.isObject(sourceTenseArr)) return sourceTenseArr

				// 初始化结果类型 数组/对象
				let targetObj = Array.isArray(sourceTenseArr) ? [] : {}

				// 遍历
				for (var key in sourceTenseArr) {
					// 是否本身有该属性
					if (sourceTenseArr.hasOwnProperty(key)) {
						// 该属性是否为对象类型 递归遍历
						if (typeof sourceTenseArr[key] === 'object') {
							targetObj[key] = this.deepTensesCopy(sourceTenseArr[key])
						} else {
							targetObj[key] = sourceTenseArr[key]
						}
					}
				}
				return targetObj
			},

			// 添加新单词
			addWord() {
				// 首先进行必要信息的认证
				this.$refs['addWordFormRef'].validate((valid) => {
					// 验证不通过 则提示信息
					if (!valid) return this.$message.warning('请输入正确的单词信息!')

					// 将添加单词表单深拷贝一份
					let newWord = this.deepTensesCopy(this.addWordForm)
					// 为新单词添加唯一性ID
					newWord.wid = Date.now().toString(36)
					// 添加单词
					this.words.unshift(newWord)

					console.log('添加单词成功', this.words)
					// 提示添加单词成功
					this.$message.success('添加单词成功!')
					
					// 添加新单词后清空表单
					this.$refs.addWordFormRef.resetFields()
					// 将词态表单重置为初始默认
					this.addWordForm.tenses = [{
						tvalue: '',
						translate: ''
					}]
				

				})
			},

			// 修改单词展示修改对话框
			editWord(word) {
				// 对编辑的单词进行深拷贝
				// 并记录于修改对象中
				// 这样子 对话框就会显示该单词的信息
				this.editWordForm = this.deepTensesCopy(word)
				// console.log(this.editWordForm)
				// 显示修改单词对话框
				this.editWordDialogVisible = true
			},
			
			// 修改单词最终确定
			editWordFinal() {
				// console.log('触发确定')
				// console.log(this.editWordForm)
				// 验证修改表信息是否有效
				this.$refs.editWordFormRef.validate(valid => {
					if (!valid) return this.$message.warning('请校对所填写信息!')
					// 从现有的存储单词库中查找修改单词的索引值
					const index = this.words.findIndex(item => item.wid === this.editWordForm.wid)
					// 将修改后的单词覆盖到现有存储单词库
					this.words[index] = this.editWordForm
					// 隐藏修改单词会话框
					this.editWordDialogVisible = false
					// 提示修改单词成功
					this.$message.success('修改单词成功!')
				})

			},
			// 删除单词 接收单词ID
			delWord(wordId) {
				// 从现有的存储单词库中查找需要删除的单词索引值
				const index = this.words.findIndex(item => item.wid === wordId)
				// 删除单词
				this.words.splice(index, 1)
				
				// console.log('删除单词', this.words)
				
				// 提示删除单词成功!
				this.$message.success('删除单词成功!')
				
			},
		},
		computed: {


			// 监听添加单词状态下词态数量的变化 
			// 1.控制删除词态按钮的出现
			// 2.控制添加词态的数量
			tenseLen() {
				return this.addWordForm.tenses.length
			},

			// 计算未被选择的词态类型
			optionTense() {
				// 只要词态选择发生改变 就会被触发
				// 第二个参数传入当前的单词记录信息
				// 第二个参数可为添加单词表信息 
				// 或者为修改单词表信息
				return (tenseVal, wordForm) => {
					// 深拷贝可选择的词态类型
					let options = JSON.parse(JSON.stringify(this.tenses))

					// 将已选的词态筛选出来
					let tenseUsed = wordForm.tenses.map(used => {
						// 将词态的值挑出来即可 方便indexOf查找
						// 空值不影响
						// {tvalue: 'n' , translate: 'xxx'} => ['n',' '] 
						return used = used.tvalue
					})

					// 将可选择的词态类型显示出来
					options = options.filter(tenseItem => {
						// 当前下拉框选中的值要进行显示
						if (tenseVal === tenseItem.value) {
							return tenseItem
						} else {
							// 判断已选的词态是否在tenseUsed 
							// 如果存在 则代表被选 否则 需要显示
							if (tenseUsed.indexOf(tenseItem.value) === -1) {
								return tenseItem
							}
						}


					})
					return options
				}
			},

			// 计算存储单词的数量
			wordsLen() {
				return this.words.length
			},
			
			// 监听修改单词状态下词态数量的变化
			// 1.控制删除词态按钮的出现
			// 2.控制添加词态的数量
			editTenseLen() {
				return this.editWordForm.tenses.length
			},
			
			...mapState(['wordStorage'])
			
		},
		watch: {
			// 监听添加单词表信息词态
			'addWordForm.tenses': {
				handler() {
					// 如果添加的词态数量多于可选择的词态类型 则禁用添加词态按钮
					if (this.tenseLen >= this.tensesValueLen) {
						return this.enableAddBtn = true
					}

					// 只要一个词态框为空 就禁用添加词态按钮
					this.enableAddBtn = this.addWordForm.tenses.some(tenseItem => {
						if (tenseItem.tvalue.length === 0) {
							return true
						}
					})
				},
				deep: true
			},
			// 监听编辑单词表信息词态
			'editWordForm.tenses': {
				handler() {
					// 如果修改的词态数量多于可选择的词态类型 则禁用添加词态按钮
					if (this.editTenseLen >= this.tensesValueLen) {
						return this.enableEditBtn = true
					}
			
					// 只要一个词态框为空 就禁用添加词态按钮
					this.enableEditBtn = this.editWordForm.tenses.some(tenseItem => {
						if (tenseItem.tvalue.length === 0) {
							return true
						}
					})
				},
				deep: true
			},
		}






	}
</script>

<style scoped>
	#toAdd {
		background-image: linear-gradient(to right top, rgba(163, 216, 244, .8) 18%,20%, #fff,80%, rgba(163, 216, 244, .8) 82%);
	}

	.container {
		width: 60%;
		height: 60%;
	}


	.el-container {
		width: 100%;
		height: 100%;
	}



	.el-container .el-aside {
		width: 50% !important;
		max-width: 380px;
		height: 100%;
		/* border: 1px solid blue; */
	}

	.el-container .el-main {

		margin-left: 20px;
		max-width: 380px;
		padding-top: 60px;
		/* border: 1px solid red; */
	}

	.el-container .el-aside .el-card {
		margin: 1rem;
		margin-top: 0;
	}

	.el-container .el-input,.el-container .el-select {
		width: 55%;
	}

	.editDialog .el-form {
		/* border: 1px solid red; */
		display: flex;
		flex-direction:  column;
		align-items: center;
	}
	
	.editDialog .el-form .el-input,.editDialog .el-form .el-select{
		width: 80%;
	}
	
	.relativeFormItem {
		position: relative;
	}
	
	.relativeFormItem .el-button {
		position: absolute;
		right: 0;
		margin-top: 7px;
	}

	.delTenseBtn {
		margin-left: 1rem;
	}

	.lastFormItem {
		margin-bottom: 1rem;
	}

	.wordCardItem {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.el-card:hover {
		background-color: #f8f8f8;
		transition: all .4s ease-in;
	}

	.el-card .showBtn {
		display: none;
	}

	.el-card:hover .showBtn {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
	}


	.el-card p {
		margin-bottom: 7px;
	}

	.el-card p:first-child {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-end;
	}

	
</style>
