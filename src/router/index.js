import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../components/home.vue'
import addWord from '../components/addWord.vue'
import toEnglish from '../components/toEnglish.vue'
import toChinese from '../components/toChinese.vue'
import toLevel from '../components/toLevel.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		redirect: '/home'
	},
	{
		path:'/home',
		component: home
	},
  {
	path: '/toAdd',
	component: addWord
  },
  {
	  path:'/toEnglish',
	  component: toEnglish
  },
  {
	  path: '/toChinese',
	  component: toChinese
  },
  {
	  path: '/toLevel',
	  component: toLevel
  }
]

const router = new VueRouter({
  routes
})

export default router
