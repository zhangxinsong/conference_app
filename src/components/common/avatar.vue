<template>
	<div 
		class="avatar" 
		:style="{width: size, height: size}">
	<!-- 带有memberId -->
		<!-- 图片 -->
		<img 
			class="show-img" 
			v-if="!isDefaultImg && memberId"
			v-show="!isError" 
			:src="headUrl"
			@error="isError=true"
			@click.stop="viewUser"/>
		<!-- 文字 -->
		<div 
			class="show-username" 
			v-if="memberId"
			v-show="isError" 
			:style="{background: realBgColor}"
			@click.stop="viewUser">
			<div 
				class="tran"
				:style="{fontSize: fontSize}">
				{{ realName }}
			</div>		
		</div>

	<!-- 不带有memberId -->
		<!-- 图片 -->
		<img 
			class="show-img" 
			v-if="!isDefaultImg && !memberId"
			v-show="!isError" 
			:src="headUrl"
			@error="isError=true"/>
		<!-- 文字 -->
		<div 
			class="show-username"
			v-if="!memberId" 
			v-show="isError" 
			:style="{background: realBgColor}">
			<div 
				class="tran"
				:style="{fontSize: fontSize}">
				{{ realName }}
			</div>		
		</div>
	</div>
</template>
<script type="text/javascript">
	
	const COLOR_LIST = ['#00B8D9', '#1594ff', '#ffa92f', '#b587fa', '#06cf86', '#fa6771', '#73d51c', '#8991ff'];

	export default{
		props:{
			// 传rem 多大自己算
			size:{
				default:'0.96rem'
			},
			// 传rem 多大自己算
			fontSize:{
				default:'0.35rem'
			},
			headUrl:{
				default:''
			},
			userName:{

			},
			memberId:{

			}
		},
		components:{

		},
		data(){
			return {
				isError:false ,
				colorList: COLOR_LIST 
			}
		},
		computed:{
			isDefaultImg(){
				if( this.headUrl.indexOf('default_avatar')==-1 ){
					return false
				}else{
					this.isError=true ;
					return true 
				}
			},
			realName(){
				let str = this.userName || '' ;
				return /[\u4e00-\u9fa5]/.test(str) ? str.substr(-2) : str.substr(0, 2);
			},
			realBgColor(){
				let str = this.userName || '' ;
				let c = G.TOOL.md5(str).charAt(0).toLowerCase();
				let bg = this.colorList['abcdefghijklmnopqrstuvwxyz0123456789'.indexOf(c) % this.colorList.length];
				return bg;
			},
		},

		methods:{
			viewUser(){
				let mid = this.memberId ; 
				G.BRIDGE.viewUser(mid);
			}
		}
	}
</script>
<style lang="less" scoped>
	@import '../../assets/css/var.less';
	.avatar{
		.show-img{
			border-radius: 50%;
			overflow: hidden;
			display: block;
			width: 100%;
			height: 100%;
		}
		.show-username{
			border-radius: 50%;
			overflow: hidden;
			height: 100%;
			width: 100%;
			position: relative;
			float: left;
			.tran{
				line-height: 1;
				text-align: center;
				color: white;
				width: 100%;
				position: absolute;
				top: 50%;
				transform: translateY(-48%);
			}
		}
	}
</style>