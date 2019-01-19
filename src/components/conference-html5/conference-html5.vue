<template>
	<!-- conference-html5 -->
	<div class="conference-html5 scroll" :style="bgimg">
        <div class="conference-html5-title">
            <h1>{{ title }}</h1>
        </div>
        <div class="conference-html5-form">
			<div v-for="(item,index) in formList" :key="index">
				<label v-if="item.selected"><span v-if="item.required">*</span>{{ item.label }}</label>
				<input class="form-input" type="text" v-if="item.formFieldId == '__name'" v-model="item.value" :placeholder="$t('html5.please_enter')+item.label">
				<div v-if="item.formFieldId == '__mobile'" class="mobile-box">
					<input class="form-input mobile-input" type="text" v-model="item.value" :placeholder="$t('html5.please_enter')+item.label">
					<div class="area-code" @click="areaCode">
						<div class="select-code">{{countryCode.code}}<img src="../../assets/images/fh.png"></div>
					</div>
				</div>	
				<div v-if="item.formFieldId == '__identify_code'" class="yzm-box">
					<input class="form-yzm" type="text" v-model="item.value" :placeholder="$t('html5.please_enter')+item.label">
					<button class="btn-yzm" :disabled="eachClick" @click="yzmClick(formList[1].value)" type="button">{{ yzm }}</button>
				</div>
				<div v-if="item.order>=4&&item.selected" class="">
					<Input class="form-input" type="text" :placeholder="$t('html5.please_enter')+item.label" @change="changeinput($event,index)"/>
				</div>
			</div>
			<button class="btn-bm" @click="submitForm" type="button">{{$t("html5.submit")}}</button>
        </div>
		<fs-share rangs="5,6,3,4"
            :rangeData="rangeData"
            v-if="isShare" 
            :showBoard="showShareBoard"
            @shareBoardState="shareBoardState" />
		<country-code-mobile 
			v-model="isDisplay" 
			:on-select="handleSelect"
			class="country-code">
		</country-code-mobile>
	</div>
</template>
<script type="text/javascript">
	import FsShare from "../common/share";
	import { parseNumber } from 'libphonenumber-js'
	import { CountryCodeMobile, CountryCodeWeb } from 'yyzone'
	import lang from 'src/languages'
	export default{
		props:{
			
		},
		components:{
			FsShare,
			CountryCodeMobile
		},
		data(){
			return {
                title: "",
				bgimg: { //背景设置
					backgroundColor: "gray",
                    backgroundImage: "url() ",
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "100% 100%",
				},
				formList: [],
				fields: [],
				conferenceId: '',
				rangeData: {},
				showShareBoard: false,
				isShare: false,  //是否可分享
				eachClick: false,  //验证码是否可点
				yzm: this.$t("html5.verification_code"),  //验证码按钮内容
				yzmTimer: 60, //验证码倒计时
				isDisplay: false,
				countryCode: {country: "china", code: "+86", value: "中国"},
				language: 'zh'
			}
        },
		mounted(){
			this.language = lang.getLang();
			this.getConferenceId();
			this.configNavBar();
			this.getList();
		},
		methods:{
			changeinput(e,i){
				this.formList[i].value = e.target.value;
			},
			handleSelect(item) {
				this.countryCode = item;
			},
			getConferenceId(){  //获取大会ID与是否可分享
				this.conferenceId = this.$route.query.conferenceId;
				this.isShare = this.$route.query.isShare === "false" ? false :true;
			},
			getList(){  //获取报名列表
				this.$ajax({
					url:`/rest/v1/client/${this.conferenceId}/signup?language=${this.language}`,
					type: 'get',
					success(res){
						res=JSON.parse( res );
						this.formList = res.fields;
						this.bgimg.backgroundImage = 'url(' + res.backgroundImage + ')' ;
						this.title= res.formTitle;
					},
					error(err){
						G.UI.say(this.$t("html5.failed_list"));
					}
				})
			},
			yzmClick(){
				let mobile = this.formList[1].value
				let countryMobile = this.countryCode.code+mobile;
				let rightNumber = parseNumber(countryMobile);
				if(JSON.stringify(rightNumber) != "{}"){
					this.$ajax({
						url:`/rest/v1/client/sms/${this.conferenceId}?language=${this.language}`,
						type: 'get',
						data: {'mobile': countryMobile},
						success(res){
							this.yzmTimerUpdate();
						},
						error(err){
							err = JSON.parse(err.response);
							if(err.code == 50050){
								G.UI.say(this.$t("html5.correct_mobile_number"));
								return false;
							}else if(err.code == 40310){
								G.UI.say(err.msg);
								return false;
							}
						}
					})
				}
				else{
					G.UI.say(this.$t("html5.correct_mobile_number"))
					return false;
				}	
			},
			yzmTimerUpdate(){  //验证码倒计时
				if(!this.eachClick){
					this.eachClick = true;
					this.yzm = this.$t("html5.sent")+'('+ this.yzmTimer + 's)';
					let timer = setInterval(()=>{
						if(this.yzmTimer > 0){
							this.yzmTimer--;
							this.yzm = this.$t("html5.sent")+'('+ this.yzmTimer + 's)';
						}else{
							this.eachClick = false;
							this.yzmTimer = 60;
							this.yzm = this.$t("html5.verification_code");
							clearInterval(timer);
						}
					},1000);
				}else{
					return
				}
			},
			valueCheck(){  //所有值为空检测
				for(var i = 0; i < this.fields.length; i++){
					if(this.formList[i].required && this.formList[i].selected){
						if(!this.fields[i].value.length){
							G.UI.say(this.formList[i].label+this.$t("html5.cannot_blank"));
							return false;
						}
					}
				}
				return true;
			},
			getFieldsList(){
				for(var i = 0; i < this.formList.length; i++){
					if(this.formList[i].selected){
						this.fields[i] = {};
						this.fields[i].fieldName = this.formList[i].label;
						this.fields[i].fieldId = this.formList[i].formFieldId;
						this.fields[i].value = this.formList[i].value ? this.formList[i].value : '';
					}else{
						this.fields[i] = {};
						this.fields[i].fieldName = this.formList[i].label;
						this.fields[i].fieldId = this.formList[i].formFieldId;
					}
				}
				this.fields[1].value = this.countryCode.code+this.fields[1].value;
			},
			submitForm(){  //提交验证
				this.getFieldsList();
				this.valueCheck();
				if(this.valueCheck()){
					if(JSON.stringify(parseNumber(this.fields[1].value)) == "{}"){
						G.UI.say(this.$t("html5.correct_mobile_number"))
						return false;
					}
					else if(JSON.stringify(parseNumber(this.fields[1].value)) != "{}"){
						this.$ajax({
							url:`/rest/v1/client/${this.conferenceId}/signup`,
							type: 'post',
							contentType: "json",
							data: {
								fields: this.fields
							}, 
							success(res){
								this.$router.push({
									path: '/conferenceHtml5Info'
								})
							},
							error(err){
								err = JSON.parse(err.response);
								if(err.code == 40300){
									G.UI.say(this.$t("html5.wrong_code"));
									return false;
								}
								else if(err.code == 40301){
									G.UI.say(this.$t("html5.wrong_verification"));
									return false;
								}
								else if(err.code == 40302){
									G.UI.say(this.$t("html5.registered"));
									return false;
								}else if(err.code == 40303){
									G.UI.say(this.$t("html5.not_started"));
									return false;
								}else if(err.code == 40304){
									G.UI.say(this.$t("html5.registration_finished"));
									return false;
								}
								else{
									G.UI.say(this.$t("html5.failed_register"));
									return false;
								}
							}
						})
					}
				}
			},
			share() { // 分享
				this.showShareBoard = true;
				this.rangeData = {
					title: this.title+this.$t("html5.conference_registration"),
					zoneTitle: this.title+this.$t("html5.conference_registration"),
					content: this.title+this.$t("html5.register_now"),
					url: window.location.href,
					imgUrl: "https://ykj-yyim-test.oss-cn-beijing.aliyuncs.com/conference/2018/08/31/16/39/a56ab240-d353-4e59-be3b-9585406cfad6.png",
				};
			},
			shareBoardState(params) {
				this.showShareBoard = params;
			},
			configNavBar() { // 配置导航栏
					let	rightItems = this.isShare ? {
                        title: this.$t("html5.share"),
                        call: () => {
							this.share();
                        }
                    } : {};
				G.BRIDGE.changeTitle({
					centerItems: {
                        title: this.$t("html5.conference_registration")
                    },
                    rightItems: rightItems
				});
			},
			areaCode(){
				this.isDisplay = !this.isDisplay;
			}
		}
	}
</script>
<style lang="less" scoped>
	.conference-html5{
		height: 100%;
		padding: 15px;
		position: relative;
		-webkit-user-select:text !important;
		h1{
			text-align: center;
			color: #fff;
			font-size: 21px;
			margin-bottom: 5px;
		}
		label{
			color: #fff;
			font-size: 14px;
			display: block;
			line-height: 20px;
			padding: 10px 0 4px 0;
			span{
				color: #fff;
			}
		}
		input{
			border-radius: 4px;
			border:1px solid rgba(204,204,204,1);
			height: 38px;
			font-size: 14px;
			color: #999999;
			background-color: #ffffff;
			padding: 0;
			text-indent: 5px;
			inline-size: none;
		}
		.form-input{
			width: 343px;
			display: block;
		}
		.mobile-box{
			width: 100%;
			height: 40px;
			.area-code{
				display: block;
				position: relative;
				top: -40px;
				width: 72px;
				height: 40px;
				padding-top: 10px;
				padding-bottom: 10px;
				.select-code{
					height: 20px;
					font-size: 14px;
					color: #333333;
					-webkit-line-height: 20px;
					line-height: 20px;
					padding-left: 10px;
					padding-right: 8px;
					border-right: 1px solid #cccccc;
					img{
						width: 10px;
						height: 10px;
						margin-left: 8px;
					}
				}
			}
			.mobile-input{
				text-indent: 77px;
			}
		}
		.yzm-box{
			width: 100%;
			height: 40px;
			.form-yzm{
				float: left;
				width: 235px;
			}
			.btn-yzm{
				float: right;
				border-radius: 4px;
				background-color: #E14C46;
				color: #fff;
				border: none;
				height: 40px;
				width: 100px;
				font-size: 14px;
				line-height: 40px;
				overflow: hidden;
			}
			.btn-yzm[disabled]{
				background-color: gainsboro;
			}
		}
		.btn-bm{
			margin-top: 30px;
			width: 345px;
			display: block;
			border-radius: 4px;
			background-color: #E14C46;
			color: #fff;
			border: 1px #E14C46 solid;
			height: 44px;
			font-size: 16px;
		}
		button:focus{
			outline: none;
		}
	}
</style>
<style  lang="less">
	.yy-country-code-mobile {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		transition: .4s ease all;
		z-index: 999;
		.country-code-bg {
			width: 100%;
			height: 100%;
			background-color: white;
		}
		.country-code-content {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			height: 100%;
			li {
				border-bottom: 1px solid #cccccc;
				font-size: 14px;
				color: #333333;
				padding: 10px 10px;
				&:active {
					background-color: #cccccc;;
				}
			}
		}
	}
</style>