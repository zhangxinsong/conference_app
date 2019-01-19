<template>
	<div class="conference-agenda scroll">
		<div v-if="list.length>0">
			<div class="each-day" v-for="(item,index) in this.list">
				<div class="title" @click="toggleShow(item)">
					{{item.day}}
					<img src="~assets/images/down.png" :class="{open: item.open }" />
				</div>
				<ul class="child-wrap" v-show="item.open && item.children.length">
					<li 
						v-for="(v,k) in item.children"
						class="each-agenda" 
						:class="v.status" 
						@click="toActivites(v)">
						<template>
							<div class="status no-start" v-if="v.status=='notstart'">{{$t('agenda.no_start')}}</div>
							<div class="status doing" v-if="v.status=='doingone'">{{$t('agenda.doing')}}</div>
							<div class="status finished" v-if="v.status=='done'">{{$t('agenda.finished')}}</div>
						</template>
						<h1 class="lp"></h1>
						<div class="part1">
							{{v.name}}
						</div>
						<div class="part2">
							<span class="sp1">{{$t("agenda.time")}}：</span>
							<span class="sp2">{{time2(v.startTime)+' - '+time2(v.endTime)}}</span>
						</div>
					</li>
				</ul>
			</div>
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
			G.BRIDGE.configNavBar(this.$t("agenda.conference_agenda"));
			this.getDays();
		},

		methods:{
			toggleShow(item){
				item.open=!item.open ;
			},
			toActivites(v){
				let activityId = v.id ;
				this.$router.push(`/conferenceAgendaActivities?activityId=${activityId}`);
			},
			time(t){
				return G.TOOL.time(t,'YYYY-MM-DD');
			},
			time2(t){
				return G.TOOL.time(t,'HH:mm')
			},
			// 请求天数
			getDays(){
				this.$ajax({
					url:`/conference/rest/v1/client/conference/${this.conferenceId}/days`,
					success(res){
						res=JSON.parse(res);
						if( res.days ){
							// 排序
							res.days.sort((a,b)=>{
								return G.TOOL.time(a.day) - G.TOOL.time(b.day) ;
							})
							// 赋值
							this.list = res.days.map(item=>{
								item.children=[];
								item.open=true;
								return item;
							});
							// 便利请求子集
							this.$nextTick(()=>{
								this.list.map(item=>{
									this.getListByDay( item );
								})
							})
						};
						this.loadingStatus='over';
					},
					error(){
						G.UI.say(this.$t("agenda.failed_days"));
						this.loadingStatus='over';
					}
				})
			},
			// 根据天数请求列表
			getListByDay( item ){
				this.$ajax({
					url:`/conference/rest/v1/client/conference/${this.conferenceId}/days/${item.day}/activities`,
					success(res){
						res=JSON.parse(res);
						if( res.activities ){
							// 时间升序
							// res.activities.sort((a,b)=>{
							// 	if(a.startTime>=b.startTime){
							// 		return 1
							// 	}else{
							// 		return 0
							// 	}
							// });
							let now = Date.parse( new Date() );
							item.children = res.activities.map( v=>{
								if( v.startTime>now ){
									v.status='notstart'
								}else if( v.startTime<=now&&v.endTime>=now){
									v.status='doingone'
								}else if( now>v.endTime ){
									v.status='done'
								}
								return v ;
							})
						}
					},
					error(){
						G.UI.say($t("agenda.failed_days_two"))
					}
				})
			}
		}
	}
</script>
<style lang="less" scoped>
	.conference-agenda{
		width: 100%;height: 100%;
		position: relative;
		padding-top: 10px;
		.each-day{
			.title{
				height: 50px;
				line-height: 50px;
				padding: 0 12px;
				font-size: 15px;
				color: #333;
				background: white;
				position: relative;
				&>img{
					position: absolute;
					top: 10px;
					right: 12px;
					width: 23px;
				}
				&>img.open{
					top: 11px;
					transform: rotate(180deg);
				}
				&::after{
					content: '';
					display: inline-block;
					height: 1px;/*no*/
					transform: scaleY(0.5);
					transform-origin: center bottom;
					position: absolute;
					left: 12px;right: 0;
					bottom: 0;
					background:#E9E9E9;
				};
			}
			.child-wrap{
				padding: 10px 12px 11px 12px;
				.each-agenda{
					height: 110px;
					border-radius: 8px;
					background: white;
					margin-bottom: 10px;
					position: relative;
					overflow: hidden;
					padding-left: 20px;
					padding-top: 15px;
					padding-bottom: 15px;
					/*box-shadow: 0px 0px 10px #d8d8d8;*/
					.status{
						position: absolute;
						right: 15px;top: 18px;
					}
					.lp{
						width: 5px;
						position: absolute;
						left: 0;top: 0;bottom: 0;
					}
					.part1{
						font-size: 15px;
						line-height: 21px;
						color: #333;
						width: 261px;
						/*position: absolute;
						left: 20px;
						top: 15px;*/
						/*多文本换行*/
					    word-break: break-all;
					    text-overflow: ellipsis;
					    display: -webkit-box; 
					    -webkit-box-orient: vertical; 
					    -webkit-line-clamp: 2; 
					    overflow: hidden;
					}
					.part2{
						position: absolute;
						bottom: 15px;
						.sp1{
							font-size: 14px;
							color: #999;
						}
						.sp2{
							font-size: 14px;
							color: #666;
						}	
					}
				}
				.each-agenda.doingone{
					.lp{
						background-color: #2BA497
					}
				}
				.each-agenda.notstart{
					.lp{
						background-color: #FFAB00
					}
				}
				.each-agenda.done{
					.lp{
						background-color: #999
					}
					.part1{
						color: #ccc;
					}
					.part2{
						.sp1,.sp2{
							color: #ccc;
						}
					}
				}
				.each-agenda:nth-last-of-type(1){
					margin-bottom: 0;
				}
			}
		}
		.each-day:nth-last-of-type(1){
			.title{
				&::after{
					display:none;
				}
			}
		}
	}
</style>