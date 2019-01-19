<template>
	<div class="conference-help-sign">
		<div class="help-sign-tab">
			<div class="no-sign" :class="{active: showList == 'noSign'}" @click="changeTab('noSign')">{{$t("helpsign.nosign")}}</div>
			<div class="signed" :class="{active: showList == 'signed'}" @click="changeTab('signed')">{{$t("helpsign.signed")}}</div>
		</div>
		<div class="help-sign-content" ref="wrapper" :style="{ height: (wrapperHeight) + 'px' }">
			<div v-if="showList == 'noSign' && noSignList.length > 0">
				<mt-loadmore 
					:bottom-method="loadBottomNosign"
					ref="loadmore"
					:bottomAllLoaded="allLoadedNosign"
					:bottomPullText='$t("helpsign.loadmore")'
					:autoFill="isAutoFill"
					>
					<ul>
						<li v-for="(item,index) in noSignList" :key="index">
							<div class="list-item">
								<avatar 
									class="ava"
									:size="'1.06rem'" 
									:fontSize="'0.45rem'"
									:headUrl="item.inApiUser&&item.inApiUser.avatar||''" 
									:userName="item.inApiUser&&item.inApiUser.name||item.username">	
								</avatar>
								<span class="item-name">{{item.inApiUser&&item.inApiUser.name||item.username}}</span>
								<div class="item-button" @click="helpSign(item.inApiUser&&item.inApiUser.memberId||'',item.username)">{{$t("helpsign.helps")}}</div>
							</div>
						</li>
						<li v-if="allLoadedNosign" class="allload">{{$t("helpsign.allloaded")}}</li>
					</ul>
				</mt-loadmore>
			</div>
			<div v-else-if="showList == 'signed' && signedList.length > 0">
				<mt-loadmore 
					:bottom-method="loadBottomSigned"
					ref="loadmoreone"
					:bottomPullText='$t("helpsign.loadmore")'
					:bottomAllLoaded="allLoadedSigned"
					:autoFill="isAutoFillSigned"
					>
					<ul>
						<li v-for="(item,index) in signedList" :key="index">
							<div class="list-item">
								<avatar 
									class="ava"
									:size="'1.06rem'" 
									:fontSize="'0.45rem'" 
									:headUrl="item.user&&item.user.avatar||''" 
									:userName="item.user&&item.user.name||''">	
								</avatar>
								<span class="item-name">{{item.user&&item.user.name||''}}</span>
								<div class="item-button o">{{$t("helpsign.signed")}}</div>
							</div>
						</li>
						<li v-if="allLoadedSigned" class="allload">{{$t("helpsign.allloaded")}}</li>
					</ul>
				</mt-loadmore>
			</div>
			<v-load v-else :loadingStatus="loadingStatus"></v-load>
		</div>
	</div>
</template>
<script type="text/javascript">
import { MessageBox } from 'mint-ui';
	export default{
		components:{
		},
		data(){
			return {
				loadingStatus: 'loading',
				showList: 'noSign',
				noSignList: [],
				signedList: [],
				conferenceId: null,
				activityId: null,
				wrapperHeight: 0,
				noSignStart: 0,
				signedStart: 0,
				allLoadedNosign: false,
				allLoadedSigned: false,
				isAutoFill: false,
				isAutoFillSigned: false,
				activityName: null
			}
		},
		methods:{
			getNoSignList(){  //刷新与首次进入请求获取未签到
				this.noSignStart = 0;
				this.$ajax({
					url:`/conference/rest/v1/client/${this.conferenceId}/help/signin/not/list?size=12&start=${this.noSignStart*12}`,
					success(res){
						res=JSON.parse(res);
						this.activityId = res.activityId;
						G.BRIDGE.configNavBar(res.activityName);
						this.noSignList = res.list;
						if(res.list.length < 12){
							this.allLoadedNosign = true;
						}else{
							this.allLoadedNosign = false;
						}
						this.loadingStatus = 'over';
					},
					error(){
						G.UI.say(this.$t("prize.failed_list"));
						this.loadingStatus = 'over';
					}
				})
			},
			loadNoSignList(){  //下拉加载未签到
				this.$ajax({
					url:`/conference/rest/v1/client/${this.conferenceId}/help/signin/not/list?size=12&start=${this.noSignStart*12}`,
					success(res){
						res=JSON.parse(res);
						this.activityId = res.activityId;
						this.noSignList.push(...res.list);
						if(res.list.length < 12){
							this.allLoadedNosign = true;
						}else{
							this.allLoadedNosign = false;
						}
					},
					error(){
						G.UI.say(this.$t("prize.failed_list"));
					}
				})
			},
			getSignedList(){  //刷新与首次进入请求获取已签到
				this.signedStart = 0;
				this.$ajax({
					url:`/conference/rest/v1/client/${this.conferenceId}/help/signin/${this.activityId}/list?size=12&start=${this.signedStart*12}`,
					success(res){
						res=JSON.parse(res);
						this.signedList = res.list;
						if(res.list.length < 12){
							this.allLoadedSigned = true;
						}else{
							this.allLoadedNosign = false;
						}
						this.loadingStatus = 'over';
					},
					error(){
						G.UI.say(this.$t("prize.failed_list"));
						this.loadingStatus = 'over';
					}
				})
			},
			loadSignedList(){  //下拉加载已签到
				this.$ajax({
					url:`/conference/rest/v1/client/${this.conferenceId}/help/signin/${this.activityId}/list?size=12&start=${this.signedStart*12}`,
					success(res){
						res=JSON.parse(res);
						this.signedList.push(...res);
						if(res.list.length < 12){
							this.allLoadedSigned = true;	
						}else{
							this.allLoadedNosign = false;
						}
					},
					error(){
						G.UI.say(this.$t("prize.failed_list"));
					}
				})
			},
			helpSign(i,n){
				if(i){
					MessageBox.confirm('', { 
						message: this.$t("helpsign.confirm") + n + this.$t("helpsign.sign"), 
						title: this.$t("helpsign.tip"), 
						confirmButtonText: this.$t("helpsign.ok"), 
						cancelButtonText: this.$t("helpsign.cancel") 
					}).then(action => { 
						if (action == 'confirm') {     //确认的回调
							this.$ajax({
								type: 'POST',
								url:`/conference/rest/v1/client/${this.activityId}/signin/help?memberId=${i}`,
								success(res){
									this.getNoSignList();
									G.UI.say(this.$t("helpsign.helpsuccess"));
								},
								error(){
									G.UI.say(this.$t("helpsign.helpfail"));
								}
							})
						}
					}).catch(err => { 
						if (err == 'cancel') {     //取消的回调
						} 
					});
				}else{
					G.UI.say(n + this.$t("helpsign.notjoin"));
				}
			},
			changeTab(i){
				this.showList = i;
				this.loadingStatus = 'loading';
				this.allLoadedNosign = false;
				this.allLoadedSigned = false;
				if(i == 'noSign'){
					this.getNoSignList();
				}else{
					this.getSignedList();
				}
			},
			loadBottomNosign(){
				if(!this.allLoadedNosign){
					this.noSignStart++;
					this.loadNoSignList();
					this.$refs.loadmore.onBottomLoaded();
				}else{
					return false;
				}
			},
			loadBottomSigned(){
				if(!this.allLoadedSigned){
					this.signedStart++;
					this.loadSignedList();
					this.$refs.loadmore.onBottomLoaded();
				}else{
					return false;
				}	
			}
		},
		mounted(){
			this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
			this.conferenceId = this.$route.query.conferenceId;
			this.getNoSignList();
		}
	}
</script>
<style lang="less" scoped>
	.conference-help-sign{
		width: 100%;
		.help-sign-tab{
			width: 100%;
			height: 44px;
			background: #fff;
			padding: 0 50px;
			color: #555555;
			.no-sign{
				float: left;
				font-size: 15px;
				width: 50%;
				padding: 12px 0;
				text-align: center;
			}
			.signed{
				float: right;
				font-size: 15px;
				width: 50%;
				padding: 12px 0;
				text-align: center;
			}
			.active{
				color: #E14C46;
				position: relative;
			}
			.active::after{
				content: "";
				position: absolute;
				bottom: 2px;
				left: 57.5px;right: 57.5px;
				height: 3px;
				width: 22.5px;
				background: #E14C46;
				border-radius:1.5px;
			}
		}
		.help-sign-content{
			margin-top: 10px;
			overflow: scroll;
			ul{
				width: 100%;
				li{
					width: 100%;
					height: 60px;
					background: #fff;
					padding: 0 12px;
					.list-item{
						padding: 10px 0;
						height: 60px;
						border-bottom: 0.5px  #E9E9E9 solid;
						width: 100%;
						position: relative;
						.ava{
							position: absolute;
							left: 0;
							top: 10px;
						}
						.item-name{
							position: absolute;
							left: 53px;
							top: 19px;
							font-size: 16px;
							color: #333;
						}
						.item-button{
							position: absolute;
							right: 0;
							top: 15px;
							padding: 6px 15px;
							color: #E14C46;
							border: 0.5px #E14C46 solid;
							border-radius:5px;
							font-size: 14px;
						}
						.o{
							opacity: 0.5;
						}
					}
				}
				.allload{
					text-align: center;
					font-size: 12px;
					height: 40px;
					line-height: 40px;
				}
			}
		}
		.mint-loadmore-text{
			font-size: 12px;
		}
	}
</style>
<style lang="less">
.mint-loadmore-text{
	font-size: 12px;
}
</style>
