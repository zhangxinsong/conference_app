<template>
	<div class="conference-first-page scroll">
		<div class="part1"></div>
		<div class="part2">
			<ul v-if="conferenceList">
				<li class="firstLi">大会列表</li>
				<li class="cList" v-for="(v,k) in conList" @click="getList(v.id)" :key="k">
					{{v.name}}<br>
					<span>{{time(v.startTime)}}--{{time(v.endTime)}}</span>
				</li>
			</ul>
			<!-- 数据 -->
			<ul v-else-if="list.length>0&&!conferenceList">
				<li v-for="(v,k) in list" @click="toPage(v)" :key="k">
					<img :src="v.icon">
					<p>{{v.name}}</p>
				</li>
			</ul>
			<!-- 加载状态 -->
			<v-load v-else :loadingStatus="loadingStatus"></v-load>
		</div>
	</div>
</template>
<script type="text/javascript">
	var firstIn = true ;
	export default{
		data(){
			return {
				loadingStatus:'loading',
				list:[],
				conferenceList: true,
				conList: []
			}
		},
		activated(){
			this.getuserInfo();
			this.getActiveList_takeConferenceId();
		},
		methods:{
			getuserInfo(){
				this.$ajax({
					url: `/rest/v1/client/user/info?memberId=${this.$root.memberId}`,
					success(res){
						res=JSON.parse(res);
						this.$root.userInfo = res.inAPIUser;
					}
				})
			},
			time(t){
				return G.TOOL.time(t,'YYYY-MM-DD');
			},
			// 获取活动的大会列表 , 当地址没有conferenceId拿第一个 ;
			getActiveList_takeConferenceId() {
				this.$ajax({
					url:`/rest/v1/client/conference/active?memberId=${this.$root.memberId}`,
					success(res){
						res=JSON.parse(res);
						this.conList = res.data;
						this.loadingStatus = 'over';
					},
					error(){
						G.UI.say(this.$t("first_page.failed_conference"))
					}
				})
			},
			// 根据id 获取列表 ;
			getList( conferenceId ){
				this.loadingStatus = 'loading';
				this.$ajax({
					url:`/rest/v1/client/conference/${conferenceId}/app?memberId=${this.$root.memberId}`,
					success(res){
						res=JSON.parse(res);
						if( res.apps ){
							this.list = res.apps ;
							this.conferenceList = false;
						};
						this.loadingStatus='over';
					},
					error(){
						G.UI.say(this.$t("first_page.failed_ID"));
						this.loadingStatus='over';
					}
				})
			},
			toPage(v){
				let token = sessionStorage.getItem('conferenceToken');
				let lang = sessionStorage.getItem('lang');
				let qzId = this.$root.userInfo.qzId;
				if( v.url.indexOf('/conferenceSign')>0 ){
					G.BRIDGE.scanQRCode();
					return ;
				}
				if( v.url[0]=='#' ){
					let p = v.url.split('#')[1];
					this.$router.push( p );
				}else if( v.url.indexOf('http://')>-1||v.url.indexOf('https://')>-1 ){
					location.href = v.url + '&qzId=' + qzId + '&lang=' + lang;
				}
			},
			
		}
	}
</script>
<style lang="less" scoped>
	.conference-first-page{
		width: 100%;height: 100%;
		position: relative;
		.part1{
			height: 218px;
			background: url('~assets/images/sy8.png') no-repeat;
			background-size: cover;
			background-position: 0 -1rem;
		}
		.part2{
			position: absolute;
			top: 150px;
			left: 15px;
			right: 15px;
			background: white;
			border-radius: 8px;
			overflow: hidden;
			box-shadow:0px 1px 5px 0.5px rgba(0,0,0,0.08);
			ul{
				padding-top: 35px;
				overflow: hidden;
				.firstLi{
					width: 100%;
					height: 60px;
					text-align: center;
					font-size: 30px;
				}
				.cList{
					width: 80%;
					border-radius: 8px;
					text-align: center;
					margin: 0 10% 20px 10%;
					padding: 10px 20px;
					background: #e44c47;
					color: #fff;
					display: block;
					span{
						font-size: 16px;
					}
				}
				li{
					height: 115px;
					width: 33.3%;
					float: left;
					text-align: center;
					img{
						width: 45px;
					}
					p{
						font-size: 12px;
						color: #666;
						margin-top: 11px;
					}
				}
			}
		}
	}
</style>