<template>
	<div class="global-img-div">
		<!-- 可以点击 -->
		<img 
			class="img-src" 
			v-if="src&&viewImage" 
		    :src="src"
		    @click.stop="viewImageFun(src)"/>
		<div 
			ref="imgUrlDom"
			:viewImage="viewImage"
			class="img-backgroundUrl" 
			v-if="backgroundUrl&&viewImage" 
		    :style="{
				background:`url(${backgroundUrl})`,
				backgroundPosition:'center',
				backgroundRepeat:'no-repeat',
				backgroundSize:'cover'}"
				@click.stop="viewImageFun(backgroundUrl)"/>

		<!-- 不可点击 -->
		<img 
			class="img-src" 
			v-if="src&&!viewImage"
		    :src="src"/>
		<div 
			ref="imgUrlDom"
			class="img-backgroundUrl" 
			v-if="backgroundUrl&&!viewImage" 
		    :style="{
				background:`url(${backgroundUrl})`,
				backgroundPosition:'center',
				backgroundRepeat:'no-repeat',
				backgroundSize:'cover'}"/>
	</div>
</template>
<script type="text/javascript">
	export default{
		props:{
			src:{
				default:''
			},
			backgroundUrl:{
				default:''
			},
			viewImage:{
				default:false
			}
		},
		watch:{
			backgroundUrl( url ){
				try{
					this.$nextTick(()=>{
						let dom = this.$refs.imgUrlDom ;
						dom.style.backgroundPosition='center';
						dom.style.backgroundRepeat='no-repeat';
						dom.style.backgroundSize='cover';
					})
				}catch(e){}
			}
		},

		methods:{
			viewImageFun(path){
           		let images = [path];
           		G.BRIDGE.viewImage(images , 0 );
			}
		}
	}
</script>
<style lang="less" scoped>
	@import '../../assets/css/var.less';
	.global-img-div{
		width: 100%;height: 100%;
		font-size: 0;
    	background: url('../../assets/images/wait.gif') no-repeat 50% 50%;
    	background-size: 25px 25px;
		.img-src{
			width: 100%;
		}
		.img-backgroundUrl{
			width: 100%;
			height: 100%;
		}
	}

</style>