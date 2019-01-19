<template>
	<div class="conference-barrage">

		<img class="img1" src="https://mz.yonyoucloud.com/html/activities/Lottery/images/header-bg.png"/>

		<div class="img2-wrap">
			<p class="p1">
				{{$t("barrage.interactions")}}</br>
				{{$t("barrage.write_something")}}
			</p>
			<div class="text-wrap">
				<textarea rows="4" maxlength="30" v-model="content"></textarea>
				<span class="f">{{content.length}}/30</span>
			</div>
			<div class="btn" @click="sendContent">
				<span>{{$t("barrage.send")}}</span>
			</div>
			<p class="p2">1. {{$t("barrage.send_happiness")}}</p>
			<p class="p3">2. {{$t("barrage.more_barrage")}}</p>
		</div>
		<!-- <div class="text-wrap">

			<textarea rows="4" maxlength="30" v-model="content"></textarea>
			<span class="f">{{content.length}}/30</span>
		</div>
		<div class="btn" @click="sendContent">
			发送弹幕
		</div> -->

	</div>
</template>
<script type="text/javascript">
	
	export default{
		data(){
			return {
				content:'',
				allow:true
			}
		},
		computed:{
			conferenceId(){
				return this.$route.query.conferenceId ;
			}
		},
		created(){
			G.BRIDGE.configNavBar(this.$t("barrage.barrage"));
		},

		methods:{
			sendContent(){
				this.allow = false ;
				if(this.content.trim()){
					this.$ajax({
						url:`/rest/v1/conference/${this.conferenceId}/barrage/record?memberId=${this.$root.memberId}`,
						type:'post',
						contentType:'json',
						data:{
							content:this.content.trim()
						},
						success(){
							G.UI.say(this.$t("barrage.sent_success"));
							this.content='';;

							this.allow = true ;
						},
						error(){
							G.UI.say(this.$t("barrage.failed_barrage"));

							this.allow = true ;
						}
					})
				}
			}
		}
	}
</script>
<style lang="less" scoped>
	.conference-barrage{
		height: 100%;
		position: relative;
		background: rgb(179,7,28);
		text-align: center;
		.img1{
			pointer-events: none;
			width: 90%;
		}
		.img2-wrap{
			width: 90%;
			position: absolute;
			left: 5%;
			top: 180px;
			height: 360px;
			padding-top: 60px;
			background: url('https://mz.yonyoucloud.com/html/activities/Lottery/images/danmu-icon.png') no-repeat;
			background-size: contain;
			.p1{
				color: rgb(254,223,150);
				font-size: 14px;
				line-height: 25px;
			}
			.text-wrap{
				position: absolute;
				left: 12px;right: 12px;
				top: 121px;
				height: 130px;
				background: rgb(253,236,195);
				border-radius: 5px;
				overflow: hidden;
				padding: 5px;
				box-sizing: border-box;
				textarea{
					width: 100%;
					box-sizing: border-box;
					background: none;
					border: none;
					outline: none;
					resize:none;
					color: #333333;
					font-size: 15px;
					line-height: 1.5;
				}
				.f{
			    	font-size: 15px;
			    	color: #999;
			    	position: absolute;
			    	right: 0.3rem;
			    	bottom: 0.3rem;
				}
		    }
			.btn{
				width: 130px;
				height: 40px;
				line-height: 40px;
				position: absolute;
				bottom: 59px;
				left: 50%;
				margin-left: -65px;
				background: blue;
				background: url('https://mz.yonyoucloud.com/html/activities/Lottery/images/button.png') no-repeat 100%;
				background-size: contain;
				color: rgb(162,32,35);
				font-size: 18px;
			}
			.p2{
				text-align: left;
				color: rgb(254,223,150);
				font-size:12px;
				position: absolute;
				bottom: 20px;
			}
			.p3{
				text-align: left;
				color: rgb(254,223,150);
				font-size:12px;
				position: absolute;
				bottom: 0;
			}
		}
		.img1{
			pointer-events: none;
			width: 100%;
			position: absolute;
			top: 0.3rem;
			left: 0;
		}
		.img2{
			pointer-events: none;
			position: absolute;
			width: 100%;
			left: 0;top: 0;
		}
/*		.text-wrap{
		    width: 342px;
		    height: 138px;
		    border-radius: 0.2rem;
		    background-color: #FFFFFF;
		    position: absolute;
		    top: 4.1rem;
		    left: 50%;
		    transform: translateX(-50%);
		    padding: 0.25rem 0.3rem 0 0.3rem;
		    line-height: 0.42rem;
		    box-sizing: border-box;
		    &>textarea{
				width: 100%;
				background: none;
				border: none;
				outline: none;
				color: #333333;
				font-size: 15px;
				line-height: 1.5;
		    }
		    .f{
		    	font-size: 15px;
		    	color: #999;
		    	position: absolute;
		    	right: 0.3rem;
		    	bottom: 0.3rem;
		    }
		}
		.btn{
			width: 342px;
			height: 44px;
			line-height: 44px;
			font-size: 15px;
			background: #FFCC52;
			text-align: center;
			color:#7C3730;
			border-radius: 0.2rem;
			letter-spacing: 1px;
			position: absolute;
		    top: 8.3rem;
		    left: 50%;
		    transform: translateX(-50%);
		}*/
	}
</style>