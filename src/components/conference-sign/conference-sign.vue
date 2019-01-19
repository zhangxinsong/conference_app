<template>
	<div class="conference-sign">

		<div class="btn" @click="openC">{{$t("sign.click_qr_code")}}</div>

	</div>
</template>
<script type="text/javascript">
	
	export default{
		props:{},
		components:{

		},

		data(){
			return {

			}
		},

		created(){
			G.BRIDGE.configNavBar(this.$t("sign.check_in"));
			this.openC();
		},

		methods:{
			openC(){
				G.BRIDGE.scanQRCode();
			}
		}
	}
</script>
<style lang="less" scoped>
	.conference-sign{
		height: 100%;
		position: relative;
		.btn{
			background: #E14C46;
			width: 250px;
			height: 44px;
			line-height: 44px;
			text-align: center;
			border-radius: 5px;
			font-size: 16px;;
			transform: translate(-50%,-50%);
			position: absolute;
			left: 50%;
			top: 35%;
			color: white;
			letter-spacing: 1px;/*no*/
		}
	}
</style>