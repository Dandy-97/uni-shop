// #ifndef VUE3
import Vue from 'vue'
import App from './App'

// 引入网络请求
import {
	$http
} from "@escook/request-miniprogram"
uni.$http = $http

// 请求的根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net'

// 请求拦截器
$http.beforeRequest = function(otions) {
	uni.showLoading({
		title: '数据加载中...'
	})
}
// 响应拦截器
$http.afterRequest = function() {
	uni.hideLoading()
}

// 封装弹框的方法
uni.$showMsg = function(title = '数据请求失败！', duration = 1500) {
	uni.showToast({
		title,
		duration,
		icon: 'icon'
	})
}

// 引入组件
import mysearch from "@/component/my-search/my-search.vue"
// 注册全局组件
Vue.component('my-search', mysearch)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import App from './App.vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
