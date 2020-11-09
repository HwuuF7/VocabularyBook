import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
	  wordStorage: [{
	  	wid: 0,
	  	level: 1,
	  	name: 'apple',
	  	tenses: [{
	  		tvalue: 'n',
	  		translate: '苹果'
	  	}],
	  	remember:false,
	  	recitationTimes: 3
	  },{
	  	wid: 1,
	  	level: 1,
	  	name: 'zoo',
	  	tenses: [{
	  		tvalue: 'n',
	  		translate: '动物园'
	  	}],
	  	remember:false,
	  	recitationTimes: 3,
	  },{
	  	wid: 2,
	  	level: 2,
	  	name: 'scrap',
	  	tenses: [{
	  		tvalue: 'v',
	  		translate: '废弃，取消，争吵'
	  	}, {
	  		tvalue: 'n',
	  		translate:'名词解释'
	  	}],
	  	remember:false,
	  	recitationTimes: 3,
	  },{
	  	wid: 3,
	  	level: 2,
	  	name: 'why',
	  	tenses: [{
	  		tvalue: 'adv',
	  		translate: '为什么'
	  	},{
	  		tvalue:'v',
	  		translate:'动词解释'
	  	}],
	  	remember:false,
	  	recitationTimes: 3,
	  },{
	  	wid: 4,
	  	level: 3,
	  	name: 'space',
	  	tenses: [{
	  		tvalue: 'n',
	  		translate: '太空'
	  	},{
	  		tvalue: 'adj',
	  		translate:'广阔'
	  	}],
	  	remember:false,
	  	recitationTimes: 3,
	  }],
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  },
})
