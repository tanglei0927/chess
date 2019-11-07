import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

/*
 *TODO:是否打包APP模式，即是否引入html5plus
 * (需要使用html5plus的原生功能时为true)
 * (需要在普通浏览器【即非webview浏览器】打开时必须为false)
 *TIPS:这个变量配置也起到了类似加密的作用。
 *因为html5plus只会存在于打包为app的webview中，如果用户从安装包里解压出打包的dist文件，
 *会因为是在普通浏览器中打开的此web文件，而不处于webview中，从而找不到html5plus从而导致页面空白没有渲染Vue（main.js最底部的代码），起到加密的作用。
*/
let isApp = false

Vue.config.productionTip = false
import '@/styles/resetm.css'

import ajax from "./untils/axios.js";
Vue.prototype.$axios = ajax ;  // this.$axios 指向 axios 

import vant from "vant";
Vue.use(vant)


//移动设备上的浏览器默认会在用户点击屏幕大约延迟300毫秒后才会触发点击事件，这里用fastclick去掉点击延迟300毫秒
const FastClick = require('fastclick')
FastClick.attach(document.body);

//清空浏览器缓存数据（除了user信息）。因为webview之间通信用的“localStorage”，得清理掉。
let user = localStorage.getItem('user');
localStorage.clear();
if (user !== '' && user !== null && user !== undefined) {
	localStorage.setItem('user', user);
}
	
//打包APP模式
if(isApp){
	//引入html5plus(HBuilder/HBuilderX打包APP自带)
	if(window.plus){
		initVue();
	}else{
		document.addEventListener('plusready', function(){
			initVue();
		},false);
	}
}else{
	//非打包APP模式
	initVue();
}

function initVue(){
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}

