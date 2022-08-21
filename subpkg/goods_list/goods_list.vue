<template>
	<view class="goods-list">
		<view v-for="(item, index) in goodsList" :key="index" @click="gotoDetail(item)">
			<myGoods :item="item"></myGoods>
		</view>
	</view>
</template>

<script>
	import myGoods from "@/component/my-goods/my-goods.vue"
	export default {
		components: {
			myGoods
		},
		data() {
			return {
				// 请求参数对象
				queryObj: {
					query: '',
					cid: '',
					pagenum: 1,
					pagesize: 10
				},
				goodsList: [],
				total: 0,
				// 节流阀(是否请求数据)
				isloading: false
			};
		},
		onLoad(options) {
			this.queryObj.query = options.query || '';
			this.queryObj.cid = options.cid || '';

			this.getGoodsList()
		},
		methods: {
			// 获取商品列表数据
			async getGoodsList(cb) {
				// 打开节流阀
				this.isloading = true;
				// 只要数据请求完毕，就立即按需调用cb回调函数
				cb && cb()
				let res = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
				if (res.statusCode === 200) {
					// 关闭节流阀
					this.isloading = false
					// 为数据赋值：通过展开运算符的形式，进行新旧数据的拼接---->(上拉加载)
					this.goodsList = [...this.goodsList, ...res.data.message.goods]
					this.total = res.data.message.total
				} else {
					return uni.$showMsg()
				}
			},
			gotoDetail(item) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
				})
			}

		},
		// 上拉加载数据事件
		onReachBottom() {
			const {
				pagenum,
				pagesize
			} = this.queryObj;
			if (pagenum * pagesize >= this.total) return uni.$showMsg('数据加载完毕!');
			if (this.isloading) return
			// 让页码值自增+1
			this.queryObj.pagenum++;
			this.getGoodsList()
		},
		// 下拉刷新数据事件
		onPullDownRefresh() {
			// 重置关键数据
			this.queryObj.pagenum = 1
			this.total = 0
			this.isloading = false
			this.goodsList = []
			// 重新发起数据请求
			this.getGoodsList(() => uni.stopPullDownRefresh())
		}
	}
</script>

<style lang="scss">

</style>
