<template>
	<div class="conference-helpsign-info" v-loading="loading">
		<div 
			class="ok" 
			v-if="message">
			<img 
				v-if="status" 
				src="~assets/images/sign-yes.png"/>
			<img 
				v-else 
				src="~assets/images/sign-no.png"/>
			<div class="message">
				{{message}}
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	
	export default{
		components:{

		},

		data(){
			return {
				loading:true,
				status:false,
				message:''
			}
		},
		computed:{
			openByYouZone(){
				let ua = navigator.userAgent ;
				if( ua.indexOf('QYZone')>-1 ){
					return true 
				}else{
					return false
				}
			},
			activityId(){
				return this.$route.query.activityId;
            },
            memberId(){
                return this.$route.query.memberId;
            }
		},
		created(){
			G.BRIDGE.configNavBar(this.$t("sign.check_in_details"));
			this.init();
		},
		methods:{
			init(){
				if( !this.openByYouZone ){
					window.location.href='http://t.cn/RjUCdt8';
				}else{
					this.loading=true;
					G.BRIDGE.getAccessToken( accessToken=>{
						if( accessToken ){
							this.$ajax({
								type: 'POST',
								url:`/conference/rest/v1/client/${this.activityId}/signin/staff?memberId=${this.memberId}&ts=${(new Date()).getTime()}&accessToken=${accessToken}`,
								success(res){
									res=JSON.parse(res);
									this.status = true;
									this.message = res.message;
								},
								error(){
									this.status = false;
									this.message = this.$t("sign.failed_check_in");
								}
							})
						}else{
							G.UI.say(this.$t("sign.failed_accessToken"));
						}
						this.loading=false;
					})
				}
			},
		}
	}
</script>
<style lang="less" scoped>
	.conference-helpsign-info{
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
				margin-top: 40px;
				padding: 0 1rem;
			}
		}
	}
</style>