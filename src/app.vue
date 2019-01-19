<template>
	<div id="app" v-loading="loading">

		<!-- <transition name="fade" mode="out-in" appear></transition> -->

		<!-- 默认router-view -->
		<router-view v-if="userInfo" class="router-view default"></router-view>

		<!-- 缓存的router-view -->
		<keep-alive>
			<router-view v-if="userInfo" class="router-view keep-alive" name="keepAlive"></router-view>
		</keep-alive>

		<!-- 向外暴露的路由 , 不需要经过code验证 -->
		<router-view class="router-view" name="public"></router-view>

	</div>
</template>
<script type="text/javascript">
	export default{
		data(){
			return {
				loading:false,
				// 用户信息
				userInfo:{
					name: '1111',
					sex: '男',
					mobile: '123123123',
					email: '打算打算打算',
					birthday: '0123-03-13'
				},
				memberId: ""
			}
		},

		created(){
			document.title = this.$t("activity.conference");
			if(window.localStorage.getItem('memberId')){
				this.memberId = window.localStorage.getItem('memberId');
			}else{
				this.$router.push({
					path: '/login'
				})
			}
		},

		methods:{
		}
	};


</script>
<style lang="less" scoped>
	@import './assets/css/var.less';
	#app{
		position: absolute;
		left: 0;top: 0;right: 0;bottom: 0;
		overflow:hidden;
		background: #F5F5F5;
		.router-view{
			transition: all 0.6s ease-in-out;
		}
	}
</style>