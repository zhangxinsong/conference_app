<template>
	<div class="conference-prize">
		<!-- 数据 -->
		<div class="activity-tab" v-if="this.list.length>0">
			<div class="ul-out">
				<ul>
					<li 
						v-for="(item,index) in list" 
						:key="index"
						:class="{activeli: active == index}"
						@click="changeTab($event,index)">
						{{item.activityName}}
					</li>
				</ul>
			</div>
		</div>
		<div class="prize-box" v-if="this.list.length>0">
			<div class="prize-item"  v-for="(item,index) in prizeList" :key="index">
				<div class="prize-img" :style="{background:'url(' + item.image + ') center center / cover no-repeat content-box'}">
					<!-- <img :src="item.image"> -->
				</div>
				<div class="prize-content">
					<div class="prize-name">{{item.prizeName}}</div>
					<div class="prize-count">{{$t("prize.total")}}{{item.amount}}{{$t("prize.ge")}}</div>
				</div>
				<span class="prize-title">{{item.prize}}</span>
			</div>
		</div>
		<v-load v-else :loadingStatus="loadingStatus"></v-load>
	</div>
</template>
<script type="text/javascript">
	export default{
		data(){
			return {
				loadingStatus: 'loading',
				active: 0,
				list:[],
				prizeList: []
			}
		},
		computed:{
			conferenceId(){
				return this.$route.query.conferenceId ;
			}
		},

		created(){
			G.BRIDGE.configNavBar(this.$t("prize.prize"));
			this.getList();
		},

		methods:{
			changeTab(e,i){
				console.log(e);
				this.active = i;
				this.prizeList = this.list[i].prizes;
			},
			getList(){
				this.$ajax({
					url:`/conference/rest/v1/client/${this.conferenceId}/lottery/list`,
					success(res){
						res=JSON.parse(res);
						this.list = res.lotteries;
						if(res.lotteries.length){
							this.prizeList = this.list[0].prizes;
						}else{
							this.loadingStatus='over';
						}
					},
					error(){
						G.UI.say(this.$t("prize.failed_list"));
						this.loadingStatus='over';
					}
				})
			}
		}
	}
</script>
<style lang="less" scoped>
	.conference-prize{
		height: 100%;
		position: relative;
		.activity-tab{
			position: absolute;
			top: 0;
			left: 0;right:0;
			width: 100%;
			height: 44px;
			background: #fff;
			.ul-out{
				height: 40px;
				width: 100%;
				overflow: hidden;
				ul{
					width: 100%;
					height: 46px;
					float: left;
					overflow-x: scroll;
					white-space: nowrap;
					li{
						background: #fff;
						display: inline-block;
						line-height: 44px;
						font-size: 15px;
						padding: 0 15px;
						position: relative;
						color: #555555;
						vertical-align: top;	
					}
					.activeli{
						color: #E14C46;	
						font-weight: 500;
						transition:all .3s ease;
					}
					.activeli:after{
						content: '';
						position: absolute;
						bottom: 4px;
						left: 15px;right: 15px;
						height: 3px;
						background: #E14C46;		
						border-radius: 1.5px;
						transform: scaleX(0.5);
					}
				}
			}
		}
		.prize-box{
			position: absolute;
			top: 44px;bottom: 0;
			width: 100%;
			left: 0;right:0;
			padding: 10px 7.5px;
			overflow: auto;
			.prize-item{
				width: 171px;
				height: 278px;
				border-radius: 6px;
				background: #fff;
				position: relative;
				display: inline-block;
				margin: 0 4.5px 3px 4.5px;
				overflow: hidden;
				.prize-img{
					position: absolute;
					top: 0;
					left: 0;right: 0;
					width: 171px;
					height: 171px;
				}
				.prize-content{
					position: absolute;
					top: 178px;
					left: 12px;right: 12px;
					.prize-name{
						color: #111;
						line-height: 20px;
						font-size: 14px;
						overflow:hidden; 
						text-overflow:ellipsis;
						display:-webkit-box; 
						-webkit-box-orient:vertical;
						-webkit-line-clamp:2;
					}
					.prize-count{
						margin-top: 3px;
						font-size: 12px;
						color: #888;
						line-height: 16px;
					}
				}
				.prize-title{
					position: absolute;
					left: 12px;
					bottom: 10px;
					font-size: 15px;
					font-weight: 500;
					color: #111;
				}
			}
		}
	}
</style>