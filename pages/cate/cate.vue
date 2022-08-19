<template>
	<view>
		<view class="scroll-view-container">
			<!-- 左侧 -->
			<scroll-view class="left-scroll-view" scroll-y="true" :style="{height: wh + 'px'}">
				<template v-for="(item, index) in cateList" :key="item.cat_id">
					<view :class="['left-scroll-view-item', index === active ? 'active' : '']"
						@click="activeChange(index)">{{item.cat_name}}</view>
				</template>
			</scroll-view>
			<!-- 右侧 -->
			<scroll-view scroll-y="true" :style="{height: wh + 'px'}" :scroll-top="scrollTop">
				<view class="cate-lv2" v-for="item2 in cateLevel2" :key="item2.cat_id">
					<!-- 二级分类标题 -->
					<view class="cate-lv2-title">/{{item2.cat_name}}/</view>
					<!-- 三级分类列表 -->
					<view class="cate-lv3-list">
						<view class="cate-lv3-item" v-for="item3 in item2.children" :key="item3.cat_id"
							@click="gotoGoodsList(item3)">
							<!-- 三级分类的图片 -->
							<image :src="item3.cat_icon"></image>
							<!-- 三级分类的文字 -->
							<text>{{item3.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 当前设备可用的高度
				wh: 0,
				// 分类列表数据
				cateList: [],
				// 默认激活状态
				active: 0,
				// 二级分类列表
				cateLevel2: [],
				// 切换滚动条置顶
				scrollTop: 0
			};
		},
		onLoad() {
			// 调用小程序api获取手机相关信息
			const sysInfo = uni.getSystemInfoSync();
			this.wh = sysInfo.windowHeight;
			this.getCateList()
		},
		methods: {
			async getCateList() {
				let res = await uni.$http.get('/api/public/v1/categories')
				// console.log(res);
				if (res.statusCode === 200) {
					this.cateList = res.data.message
					// 二级分类列表(默认渲染)
					this.cateLevel2 = res.data.message[0].children
				} else {
					return uni.$showMsg()
				}
			},
			// 点击添加active类
			activeChange(index) {
				this.active = index;
				// 二级分类
				this.cateLevel2 = this.cateList[index].children;
				// 重置滚动条置顶
				this.scrollTop = this.scrollTop === 0 ? 1 : 0;
			},
			// 跳转到商品列表页面
			gotoGoodsList(item) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?cid=' + item.cat_id
				})
			}
		},
	}
</script>

<style lang="scss">
	.scroll-view-container {
		display: flex;

		.left-scroll-view {
			width: 120px;

			.left-scroll-view-item {
				background-color: #f7f7f7;
				line-height: 60px;
				text-align: center;
				font-size: 12px;

				&.active {
					background-color: #FFFFFF;
					position: relative;

					&::before {
						content: '';
						display: block;
						width: 3px;
						height: 30px;
						background-color: #C00000;
						position: absolute;
						top: 50%;
						left: 0%;
						transform: translateY(-50%);
					}
				}
			}
		}
	}

	.cate-lv2-title {
		font-size: 12px;
		font-weight: bold;
		text-align: center;
		padding: 15px 0;
	}

	.cate-lv3-list {
		display: flex;
		flex-wrap: wrap;

		.cate-lv3-item {
			width: 33.33%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin-bottom: 10px;

			image {
				width: 60px;
				height: 60px;
			}

			text {
				font-size: 12px;
			}
		}
	}
</style>
