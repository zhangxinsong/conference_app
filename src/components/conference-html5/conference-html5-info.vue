<template>
	<div class="conference-html5-info">
		<div class="ok" >
			<img v-if="status" src="~assets/images/sign-yes.png"/>
			<img v-else src="~assets/images/sign-no.png"/>
			<div class="message">
				{{$t("html5.successful_registration")}}
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	export default{
		data(){
			return {
				status: true,
			}
		},
		created(){
			G.BRIDGE.configNavBar(this.$t("html5.successful_reg"));
		},
		methods:{
		}
	}
</script>
<style lang="less" scoped>
	.conference-html5-info{
		background: white;
		height: 100%;
		.ok{
			text-align: center;
			padding-top: 35%;
			&>img{
				width: 90px;
			}
			.message{
				color: #666;
				font-size: 16px;
				margin-top: 22px;
				padding: 0 1rem;
			}
		}
	}
</style>