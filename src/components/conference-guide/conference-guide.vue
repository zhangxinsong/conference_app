<template>
	<div class="conference-guide scroll" ref="scroll" v-loading="loadingStatus=='loading'">
		<template v-if="loadingStatus=='nodata'">
			<div style="width:100%;height:100%" v-nodata="true" :nodata-text='this.$t("common.nodata")'></div>
		</template>
		<template v-if="loadingStatus=='success'">
			<div class="part1">
				<!-- Swiper Banner -->
				<div class="swiper-banner-guide">
					<div class="swiper-wrapper">
						<!-- 每一条数据 -->
						<div 
							class="swiper-slide" 
							:style="{width: bannerWidth }"
							v-for="(item , index) in list" 
							v-on:click="changeActiveList(index)">
							<div class="in">
								<div 
									class="img-wrap"
									:class="{notFilter: filterInfex==index }">
									<v-img :backgroundUrl="item.icon"/>
								</div>
								<div class="str elli">
									{{item.name}}
								</div>
							</div>
						</div>
					</div>
					<!-- 分页器 -->
					<div class="swiper-pagination"></div>
				</div>	
			</div>
			<ul class="part2" v-nodata="activeList.length==0" :nodata-text='this.$t("common.nodata")'>
				<li class="item" v-for="(v,k) in activeList">
					<div class="title">
						{{v.title}}
					</div>
					<div class="active-con" style="margin-top:0.32rem" v-html="v.content"></div>
				</li>
				<!-- <li class="item">
					<div class="title">
						大会交通整体介绍
					</div>
					<div class="str">
						移动工作台专项交互设计及视觉设计。手机端至5.7各迭代体验设计支持。diwork个项目设计：1. IM、智能办公助手小友、日程、场景化项目等交互和视觉高保真输出及多次验证体验规范的落地。2. WEB端 IM 设计及小友需求环境设计。集团门户落地设计。
					</div>
					<div class="imgs big" v-if="false">
						<div class="each-img">
							<v-img :backgroundUrl="'/assets/images/cpb.png'"/>
						</div>
					</div>
					<div class="imgs" v-if="true">
						<div class="each-img">
							<v-img :backgroundUrl="'/assets/images/cpb.png'"/>
						</div>
						<div class="each-img">
							<v-img :backgroundUrl="'/assets/images/cpb.png'"/>
						</div>
						<div class="each-img">
							<v-img :backgroundUrl="'/assets/images/cpb.png'"/>
						</div>
						<div class="each-img">
							<v-img :backgroundUrl="'/assets/images/cpb.png'"/>
						</div>
						<div class="each-img">
							<v-img :backgroundUrl="'/assets/images/cpb.png'"/>
						</div>
					</div>
				</li> -->
				<!-- <li class="item">
					<div class="title">
						大会交通整体介绍
					</div>
					<div class="str">
						移动工作台专项交互设计及视觉设计。手机端至5.7各迭代体验设计支持。diwork个项目设计：1. IM、智能办公助手小友、日程、场景化项目等交互和视觉高保真输出及多次验证体验规范的落地。2. WEB端 IM 设计及小友需求环境设计。集团门户落地设计。
					</div>
					<div class="imgs big" v-if="1">
						<div class="each-img">
							<v-img :backgroundUrl="'/assets/images/cpb.png'"/>
						</div>
					</div>
				</li> -->
			</ul>
		</template>
	</div>
</template>
<script type="text/javascript">

	export default{
		data(){
			let bannerWidth = (window.innerWidth/4) + 'px';
			return {
				bannerWidth:bannerWidth ,
				loadingStatus:'loading',
				list:[],
				activeList:[],
				filterInfex:0
			}
		},
		computed:{
			conferenceId(){
				return this.$route.query.conferenceId ;
			}
		},

		created(){
			G.BRIDGE.configNavBar(this.$t("guide.guideline"));
			this.getList();
		},
		methods:{
			initSwiper(){
				var obj ;
				if( this.list.length<=4){
					obj = {
						slidesPerView:4
					}
				}else{
					obj = {
						slidesPerView:4,
						pagination: {
							el:'.swiper-pagination',
						}
					}
				}
				this.banner = new G.TOOL.swiper('.swiper-banner-guide',obj);
			},
			getList(){
				this.$ajax({
					url:`/rest/v1/client/conference/${this.conferenceId}/guide/list`,
					success(res){
						this.loadingStatus='nodata';
						res=JSON.parse( res );
						if( res.guides ){
							this.list = res.guides ;
							if(this.list.length>0){
								this.loadingStatus='success';
								this.$nextTick(()=>{
									this.initSwiper();
								})
								setTimeout(()=>{
									this.activeList = this.list[0].items ;
								},100);
							}
						}
					},
					error(){
						this.loadingStatus='nodata';
						G.UI.say(this.$t("guide.failed_list"))
					}
				})
			},
			changeActiveList(index){
				this.filterInfex = index ;

				var loading=new G.UI.loading();
					loading.open();
				setTimeout(()=>{
					loading.close();
				},300)
				try{
					this.$refs.scroll.scrollTop=0;
				}catch(e){};
				this.activeList = this.list[index].items ;
			}
		}
	}
</script>
<style lang="less" scoped>
	.conference-guide{
		width: 100%;
		height: 100%;
		position: relative;
		.part1{
			height: 125px;
			background: white;
			position: relative;
			.swiper-banner-guide{
				overflow: hidden;
				.swiper-slide{
					.in{
						width: 70px;
						height: 125px;
						margin: 0 auto ;
						padding-top: 20px;
						.img-wrap{
							width: 46px;
							height: 46px;
							margin: 0 auto;
							border-radius: 50%;
							background: #f5f5f5;
							overflow: hidden;
							/*filter: grayscale(100%);*/
							position: relative;
							&::after{
								content:'';
								display: inline-block;
								position: absolute;
								width: 100%;height: 100%;
								left: 0; top: 0;
								background: rgba(255,255,255,0.75);
							};
						}
						.img-wrap.notFilter{
							/*filter: none;*/
							&::after{
								display:none;
							}
						}
						.str{
							font-size: 12px;
							line-height: 16px;
							color: #666;
							margin-top: 8px;
							text-align: center;
						}
					}
				}
			}
		}
		.part2{
			margin-top: 12px;
			position: relative;
			min-height: calc(100% - 3.3rem);
			.item{
				padding: 15px 12px;
				padding-bottom: 9px;
				background: white;
				margin-bottom: 10px;
				.title{
					color: #333;
					font-size: 16px;
					line-height: 23px;
				}
				.str{
					color: #666;
					font-size: 14px;
					line-height: 23px;
					margin-top: 6px;
				}
				.imgs{
					margin-top: 11px;
					overflow: hidden;
					.each-img{
						width: 100px;
						height: 100px;
						float: left;
						margin-right: 5px;
						margin-bottom: 5px;
						border-radius: 4px;
						overflow: hidden;
					}
				}
				.imgs.big{
					.each-img{
						width: 205px;
						height: 205px;
						border-radius: 7px;
					}
				}
			}
		}
	}
</style>
<style lang="less">
	.conference-guide{
		.swiper-pagination-bullet-active{
			background: #E14C46
		}
		.swiper-pagination-bullets{
			white-space: nowrap;
			bottom: 0.2rem!important;
			.swiper-pagination-bullet{
				width: 6px;/*no*/
				height: 6px;/*no*/
				&.swiper-pagination-bullet-active{
					width: 10px;/*no*/
					height: 6px;/*no*/
					border-radius: 50px;/*no*/
				}
			}
		}
		.active-con{
			font-size: 14px;
			color: #888;
			line-height: 22px;
			i, cite, em, var, address, dfn {
			    font-style: italic;
			}
			strong, b {
				font-weight: bold;
			}
			img,video{
				max-width: 100% !important;
			}
		}
	}
</style>