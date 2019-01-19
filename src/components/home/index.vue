<template>
	<div class="">
		{{$t("home.home")}}
	</div>
</template>
<script type="text/javascript">

	export default{
		computed:{
			userInfo(){
				return this.$root.userInfo ;
			}
		},

		created(){
			G.BRIDGE.configNavBar(this.$t("home.my_info"),'#ffffff','#EC5954')
		},

		methods:{
			showRq_fun(){
				this.$router.push('/conferenceMyQr')
			}
		}
	}
</script>
<style lang="less" scoped>
	.conference-my{
		
	}
</style>			
