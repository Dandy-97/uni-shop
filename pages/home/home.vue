<template>
	<view>
		<!-- 搜索组件 -->
		<view class="search-box">
			<my-search @click="gotoSearch"></my-search>
		</view>
		<!-- 轮播图 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="list in swiperList" :key="list.goods_id">
				<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + list.goods_id">
					<image :src="list.image_src"></image>
				</navigator>
			</swiper-item>
		</swiper>

		<!-- 分类导航 -->
		<view class="nav-list">
			<view class="nav-item" v-for="(nav, index) in navList" :key="index" @click="navClickHandler(nav)">
				<image :src="nav.image_src" class="nav-img"></image>
			</view>
		</view>

		<!-- 楼层区域 -->
		<view class="floor-list">
			<view class="floor-item" v-for="(floor, index) in floorList" :key="index">
				<!-- 标题图片 -->
				<image :src="floor.floor_title.image_src" class="floor-title"></image>
				<!-- 楼层的图片 -->
				<view class="floor-img-box">
					<!-- 左侧图片 -->
					<navigator class="left-img-box" :url="floor.product_list[0].url">
						<image :src="floor.product_list[0].image_src"
							:style="{width: floor.product_list[0].image_width + 'rpx'}" mode="widthFix"
							class="left-img"></image>
					</navigator>
					<!-- 右侧图片 -->
					<view class="right-img-box">
						<navigator class="right-img-item" v-for="(prod, index) in floor.product_list" :key="index"
							v-show="index !== 0" :url="prod.url">
							<image :src="prod.image_src" :style="{width: prod.image_width + 'rpx'}" mode="widthFix"
								class="right-img">
							</image>
						</navigator>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 轮播图的数据列表
				swiperList: [],
				// 分类导航的数据列表
				navList: [],
				// 楼层的数据
				floorList: []
			};
		},
		onLoad() {
			// 调用方法，获取轮播图的数据
			this.getSwiperList();
			this.getnavList()
			this.getFloorList()
		},
		methods: {
			// 获取轮播图的数据列表
			async getSwiperList() {
				let res = await uni.$http.get('/api/public/v1/home/swiperdata')
				// console.log(res);
				// if (res.data.meta.status !== 200) {
				// 	return uni.showToast({
				// 		title: '数据请求失败!',
				// 		duration: 1500,
				// 		icon: 'none'
				// 	})
				// }
				// this.swiperList = res.data.messagea
				if (res.statusCode === 200) {
					this.swiperList = res.data.message
				} else {
					return uni.$showMsg()
				}

			},
			// 获取分类导航的数据列表
			async getnavList() {
				let res = await uni.$http.get('/api/public/v1/home/catitems')
				if (res.statusCode === 200) {
					this.navList = res.data.message
				} else {
					return uni.$showMsg()
				}
			},
			navClickHandler(nav) {
				if (nav.name === "分类") {
					uni.switchTab({
						url: '/pages/cate/cate'
					})
				}
			},
			// 获取楼层的数据
			async getFloorList() {
				let res = await uni.$http.get('/api/public/v1/home/floordata')
				if (res.statusCode === 200) {
					this.floorList = res.data.message;
					// 处理数据
					res.data.message.forEach(floor => {
						floor.product_list.forEach(prod => {
							prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split(
								'?')[1]
						})
					})
				} else {
					return uni.$showMsg()
				}
			},
			gotoSearch() {
				uni.navigateTo({
					url: '/subpkg/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
	swiper {
		height: 330rpx;

		.swiper-item,
		image {
			width: 100%;
			height: 100%;
		}
	}

	.nav-list {
		display: flex;
		justify-content: space-around;
		margin: 15px 0;

		.nav-img {
			width: 128rpx;
			height: 140rpx;
		}
	}

	.floor-title {
		width: 100%;
		height: 60rpx;

	}

	.left-img {
		border-radius: 5%;
	}

	.right-img-box {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}

	.floor-img-box {
		display: flex;
		padding-left: 10px;

		.right-img {
			border-radius: 5%;
		}
	}

	/* 吸顶样式设置 */
	.search-box {
		position: sticky;
		top: 0;
		z-index: 999;
	}
</style>
