<template>
	<div class="conference-cloud-list scroll">
		<!-- 数据 -->
		<ul v-if="list.length>0">
			<li class="item" v-for="(v,index) in list" @click="toFirstPage(v)">
				<div 
					v-if="v.image" 
					class="d1 img-wrap">
					<v-img :backgroundUrl="v.image"/>
				</div>
				<div 
					v-else 
					class="empty-bg">
					<img src="~assets/images/gp.png">
				</div>
				<div class="d2">
					{{v.name}}
					<template>
						<div class="status no-start" v-if="v.status=='notstart'">{{$t('agenda.no_start')}}</div>
						<div class="status doing" v-if="v.status=='doing'">{{$t('agenda.doing')}}</div>
						<div class="status finished" v-if="v.status=='done'">{{$t('agenda.finished')}}</div>
						<!-- <img class="status" v-if="v.status=='notstart'" src="~assets/images/notstart.png"/>
						<img class="status" v-if="v.status=='doing'" src="~assets/images/doing.png"/>
						<img class="status" v-if="v.status=='done'" src="~assets/images/done.png"/> -->
					</template>
				</div>
				<div class="d3">
					{{time(v.startTime)}} {{$t("cloud_list.to")}} {{time(v.endTime)}}
				</div>
			</li>
		</ul>
		<!-- 加载状态 -->
		<v-load v-else :loadingStatus="loadingStatus"></v-load>
	</div>
</template>
<script type="text/javascript">
	
	export default{
		data(){
			return {
				loadingStatus:'loading',
				list:[]
			}
		},

		created(){
			G.BRIDGE.configNavBar(this.$t("cloud_list.cloud_conference"));
			this.getList();
		},

		methods:{
			getList(){
				this.$ajax({
					url:`/conference/rest/v1/client/conference/active`,
					success(res){
						res=JSON.parse(res);
						if( res.data && res.data.length ){
							let now = Date.parse( new Date() );
							this.list = res.data.map(v=>{
								if( v.startTime>now ){
									v.status='notstart'
								}else if( v.startTime<=now&&v.endTime>=now){
									v.status='doing'
								}else if( now>v.endTime ){
									v.status='done'
								}
								return v ;
							});
						};
						this.loadingStatus='over';
					},
					error(){
						G.UI.say(this.$t("cloud_list.failed_list"));
						this.loadingStatus='over';
					}
				})
			},
			toFirstPage(v){
				this.$router.push(`/conferenceFirstPage?conferenceId=${v.conferenceId}&conferenceName=${v.name}`);
			},
			time(t){
				return G.TOOL.time(t,'YYYY-MM-DD');
			}
		}
	}
</script>
<style lang="less" scoped>
	.conference-cloud-list{
		width: 100%;
		height: 100%;
		position: relative;
		padding-bottom: 1rem;
		ul{
			padding: 0 12px;
			.item{
				padding: 15px 12px 10px 12px;
				border-radius: 8px;
				background: white;
				margin-top: 10px;
				box-shadow:0px 1px 5px 0.5px rgba(0,0,0,0.08);
				.img-wrap{
					position: relative;
					border-radius: 5px;
					background: #f0f0f0;
					height: 164px;
					overflow: hidden;
				}
				.empty-bg{
					position: relative;
					border-radius: 5px;
					background: #f0f0f0;
					height: 164px;
					overflow: hidden;
					img{
						width: 63px;
						position: absolute;
						left:50%;top: 50%;
						transform: translate(-50%,-50%);
					}
				}
				.d2{
					color: #333;
					font-size: 15px;
					line-height: 21px;
					margin-top: 10px;
					position: relative;
					padding-right: 50px;
					font-weight: 500;
					word-break: break-all;
					text-overflow: ellipsis;
					display: -webkit-box; 
					-webkit-box-orient: vertical; 
					-webkit-line-clamp: 2; 
					overflow: hidden;
					.status{
						position: absolute;
						right: 0px;
						top: 2px;
					}
				}
				.d3{
					font-size: 13px;
					line-height: 19px;
					color: #999;
					margin-top: 9px;
				}
			}
		}
	}
</style>