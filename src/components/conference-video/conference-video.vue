<template>
	<div class="conference-video scroll">
		<div v-if="list.length>0">
			<div v-if="list.length>0">
				<div class="video-item" 
					v-if="v.enable" 
					v-for="(v,k) in list"
					@click="toPlay(v)">
					<div class="img-wrap">
						<v-img :backgroundUrl="v.thumbBackground||v.background"/>
						<div class="vdo">{{ $t("common.watch_live") }}</div>
					</div>
					<p class="p1">
						{{v.liveTheme}}
					</p>
					<p class="p2">
						{{time(v.startTime)}}
					</p>
				</div>
			</div>
			<div v-else v-nodata="true" :nodata-text="$t('common.nodata')"></div>
		</div>
		<!-- 加载状态 -->
		<v-load v-else :loadingStatus="loadingStatus"></v-load>
	</div>
</template>
<script type="text/javascript">
	
	export default{
		props:{},
		components:{

		},

		data(){
			return {
				loadingStatus:'loading',
				list:[]
			}
		},
		computed:{
			conferenceId(){
				return this.$route.query.conferenceId ;
			}
		},

		created(){
			G.BRIDGE.configNavBar(this.$t("video.live_stream"));
			this.getList();
		},

		methods:{
			getList(){
				this.$ajax({
					url:`/conference/rest/v1/client/${this.conferenceId}/live/list`,
					success(res){
						res=JSON.parse( res );
						if( res.lives ){
							this.list = res.lives ;
						};
						this.loadingStatus='over';
					},
					error(){
						G.UI.say(this.$t("video.failed_list"));
						this.loadingStatus='over';
					}
				})
			},
			time(t){
				return G.TOOL.time(t,'YYYY-MM-DD HH:mm')
			},
			toPlay(v){
				G.BRIDGE.openWindow( v.liveUrl );
			}
		}	
	}
</script>
<style lang="less" scoped>
	.conference-video{
		width: 100%;height: 100%;
		position: relative;
		padding-bottom: 0.3rem;
		.video-item{
			margin-bottom: 10px;
			min-height: 255px;
			overflow: hidden;
			background: white;
			padding-top: 12px;
			padding-left: 12px;
			padding-right: 12px;
			padding-bottom: 9px;
			.img-wrap{
				height: 176px;
				border-radius: 4px;
				background: #f5f5f5;
				position: relative;
				overflow: hidden;
				.vdo{
					position: absolute;
					width: 100px;
					height: 30px;
					left: 50%;
					top: 50%;
					transform: translate(-50%,-50%);
					text-align: center;
					border: 2px #fff solid;
					border-radius: 15px;
					background: rgba(255,255,255,0.2);
					font-size: 15px;
					line-height: 30px;
					color:#fff;
				}
			}
			.p1{
				color: #333;
				font-size: 15px;
				line-height: 21px;
				margin-top: 10px;
				font-weight: 500;
			}
			.p2{
				font-size: 13px;
				color: #999;
				line-height: 19px;
				margin-top: 7px;
			}
		}
	}
</style>