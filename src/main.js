import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import myMenu from './components/menu.vue'
import './plugins/element.js'
import './assets/css/global.css'

Vue.config.productionTip = false
Vue.component('myMenu',myMenu)

Vue.prototype.isObject = function(obj) {
	return typeof obj === 'object' && obj !== null
}

Vue.prototype.deepCopy = function(sourceObj) {
	// 如果不是对象 则返回该值
	if (!this.isObject(sourceObj)) return sourceObj
	
	// 初始化结果类型 数组/对象
	let targetObj = Array.isArray(sourceObj) ? [] : {}
	
	// 遍历
	for (var key in sourceObj) {
		// 是否本身有该属性
		if (sourceObj.hasOwnProperty(key)) {
			// 该属性是否为对象类型 递归遍历
			if (typeof sourceObj[key] === 'object') {
				targetObj[key] = this.deepCopy(sourceObj[key])
			} else {
				targetObj[key] = sourceObj[key]
			}
		}
	}
	return targetObj
}


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
