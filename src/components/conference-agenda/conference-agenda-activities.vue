<template>
	<div class="conference-agenda-activities scroll" v-loading="loadingStatus=='loading'">


		<div v-if="!withAmPmTitle" v-nodata="loadingStatus=='nodata'" :nodata-text='this.$t("common.nodata")'>
			<div
				v-for="(v,k) in list" 
				class="each-active"
				:class="v.status2" 
				:bb="k<list.length-1"
				:key="k">
				<div class="l">
					<h1></h1>
					<h2></h2>
				</div>
				<div class="part1">
					<span>{{v.startTime}} - {{v.endTime}}</span>
					<template>
						<div class="status no-start" v-if="v.status2=='notstart'">{{$t('agenda.no_start')}}</div>
						<div class="status doing" v-if="v.status2=='doingone'">{{$t('agenda.doing')}}</div>
						<div class="status finished" v-if="v.status2=='done'">{{$t('agenda.finished')}}</div>
						<!-- <img class="status" v-if="v.status2=='notstart'" src="~assets/images/notstart.png"/>
						<img class="status" v-if="v.status2=='doing'" src="~assets/images/doing.png"/>
						<img class="status" v-if="v.status2=='done'" src="~assets/images/done.png"/> -->
					</template>
				</div>
				<div class="part2">
					{{v.title}}
				</div>
				<div class="part3" v-html="v.subTitle"></div>
			</div>
		</div>
		<div v-else v-nodata="loadingStatus=='nodata'" :nodata-text='this.$t("common.nodata")'>
			<div class="each-time" v-show="listAM.length">
				<div class="title after" :class="{yinying: amOpen}" @click="openAmFn">
					{{$t("agenda.morning")}}
					<img src="~assets/images/down.png" :class="{open: amOpen }" />
				</div>
				<div class="child-wrap" v-show="amOpen">
					<div
						v-for="(v,k) in listAM" 
						class="each-active"
						:class="v.status2"
						:bb="k<listAM.length-1">
						<div class="l">
							<h1></h1>
							<h2></h2>
						</div>
						<div class="part1">
							<span>{{v.startTime}} - {{v.endTime}}</span>
							<template>
								<div class="status no-start" v-if="v.status2=='notstart'">{{$t('agenda.no_start')}}</div>
								<div class="status doing" v-if="v.status2=='doingone'">{{$t('agenda.doing')}}</div>
								<div class="status finished" v-if="v.status2=='done'">{{$t('agenda.finished')}}</div>
								<!-- <img class="status" v-if="v.status2=='notstart'" src="~assets/images/notstart.png"/>
								<img class="status" v-if="v.status2=='doing'" src="~assets/images/doing.png"/>
								<img class="status" v-if="v.status2=='done'" src="~assets/images/done.png"/> -->
							</template>
						</div>
						<div class="part2">
							{{v.title}}
						</div>
						<div class="part3" v-html="v.subTitle"></div>
					</div>
				</div>
			</div>
			<div class="each-time" v-show="listPM.length">
				<div class="title after" :class="{yinying: pmOpen}" @click="openPmFn">
					{{$t("agenda.afternoon")}}
					<img src="~assets/images/down.png" :class="{open: pmOpen }" />
				</div>
				<div class="child-wrap" v-show="pmOpen">
					<div
						v-for="(v,k) in listPM" 
						class="each-active"
						:class="v.status2"
						:bb="k<listPM.length-1">
						<div class="l">
							<h1></h1>
							<h2></h2>
						</div>
						<div class="part1">
							<span>{{v.startTime}} - {{v.endTime}}</span>
							<template>
								<div class="status no-start" v-if="v.status2=='notstart'">{{$t('agenda.no_start')}}</div>
								<div class="status doing" v-if="v.status2=='doingone'">{{$t('agenda.doing')}}</div>
								<div class="status finished" v-if="v.status2=='done'">{{$t('agenda.finished')}}</div>
								<!-- <img class="status" v-if="v.status2=='notstart'" src="~assets/images/notstart.png"/>
								<img class="status" v-if="v.status2=='doing'" src="~assets/images/doing.png"/>
								<img class="status" v-if="v.status2=='done'" src="~assets/images/done.png"/> -->
							</template>
						</div>
						<div class="part2">
							{{v.title}}
						</div>
						<div class="part3" v-html="v.subTitle"></div>
					</div>
				</div>
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
				withAmPmTitle:false,
				list:[],
				listAM:[],
				listPM:[],
				amOpen:true,
				pmOpen:true,

				loadingStatus:'loading'
			}
		},
		computed:{
			activityId(){
				return this.$route.query.activityId ;
			}
		},

		created(){
			G.BRIDGE.configNavBar(this.$t("agenda.agenda"));
			this.getList();
		},

		methods:{
			time(){

			},
			openAmFn(){
				this.amOpen=!this.amOpen ;
			},
			openPmFn(){
				this.pmOpen=!this.pmOpen ;
			},
			getList(){
				this.$ajax({
					url:`/conference/rest/v1/client/${this.activityId}/agenda`,
					success(res){
						res=JSON.parse(res);
						this.loadingStatus='nodata'
						if( res.agendas ){
							let arr=res.agendas ;
							// 替换/n为<br/>
							arr.map(v=>{
								v.subTitle = (v.subTitle||'').replace(/\n/g,'<br/>');
							})

							let numberTime = function ( str ) {
								str = str.replace(':','.');
								return Number(str);
							}
							// 判断状态 ;
							arr.map( v=>{
								if( v.status=='FUTURE' ){
									v.status2='notstart';
								}else if( v.status=='ON_GOING' ){
									v.status2='doingone';
								}else if( v.status=='PASSED' ){
									v.status2='done';
								}
							});
							// 判断是否区分上下午 ;
							res.withAmPmTitle ? this.withAmPmTitle=res.withAmPmTitle : null ;
							if( this.withAmPmTitle ){
								let mst = numberTime('12:00');
								console.log(mst)
								arr.map(v=>{
									let st = numberTime(v.startTime);
									if( st<=mst ){
										this.listAM.push(v)
									}else{
										this.listPM.push(v)
									}
								});
								
								this.listAM.length + this.listPM.length ? this.loadingStatus=false : null ;
							}else{
								this.list = arr ;

								this.list.length ? this.loadingStatus=false : null ;
							}
						};
					},
					error(){
						G.UI.say(this.$t("agenda.failed_list"));
						this.loadingStatus='nodata'
					}
				})
			}
		}
	}
</script>
<style lang="less">
	.conference-agenda-activities{
		width: 100%;height: 100%;position: relative;
		padding-top: 10px;
		.each-active{
			min-height: 80px;
			position: relative;
			padding-left: 36px;
			background: white;
			padding-top: 15px;
			padding-bottom: 15px;
			padding-right: 13px;
			.l{
				position: absolute;
				left: 0;top: 0;bottom: 0;
				width: 36px;
				h1{
					width: 6px;/*no*/
					height: 6px;/*no*/
					border-radius: 50%;
					background: #ededed;
					position: absolute;
					left: 10px;
					top: 16px;
					z-index: 1;
				}
				h2{
					width: 1px;/*no*/
					position: absolute;
					top: 0;bottom: 0;
					left: 12px;
					background: #D8D8D8;
				}
			}
			.part1{
				font-size: 0;
				position: relative;
				.status{
					position: absolute;
					top: 0;
					left: 100px;
				}
				span{
					font-size: 14px;
					vertical-align: middle;
					color: #ccc;
				}
				img{
					width: 45px;
					vertical-align: middle;
					margin-left: 15px;
					position: relative;
					top: -1px;
				}
			}
			.part2{
				color: #ccc;
				font-size: 16px;
				line-height: 24px;
				margin-top: 7px;
			}
			.part3{
				color: #ccc;
				font-size: 14px;
				margin-top: 5px;
				line-height: 20px;
			}
		}
		.each-active.done{
			h1{
				background: #CCCCCC
			}
		}
		.each-active.doingone{
			.part1{
				span{
					color: #666666
				}
			}
			.part2{
				color: #333333
			}
			.part3{
				color: #999999
			}
			h1{
				background: #2BA497
			}
		}
		.each-active.notstart{
			.part1{
				span{
					color: #666666
				}
			}
			.part2{
				color: #333333
			}
			.part3{
				color: #999999
			}
			h1{
				background: #FFAB00
			}
		}
		.each-active.last{
			&::after{
				display: none;
			}
		}
		[bb]::after{
			content: '';
			display: inline-block;
			position: absolute;
			bottom: 0;
			right: 0;left: 35px;
			background: #E9E9E9;
			height: 1px;/*no*/
			transform-origin: center bottom;
		};

		.each-time{
			.yinying{
				box-shadow: 0px 2px 4px #f3f3f3;
			}
			.title{
				height: 50px;
				line-height: 50px;
				padding: 0 12px;
				font-size: 15px;
				color: #333;
				background: white;
				position: relative;
				z-index: 1;
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
				&.after::after{
					content: '';
					display: inline-block;
					height: 1px;/*no*/
					height: 0.5px;/*no*/
					position: absolute;
					left: 12px;right: 12px;
					bottom: 0;
					background:#E9E9E9;
				};
			}
		}
	}
</style>