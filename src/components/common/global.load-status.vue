<template>
	<div class="g-load-status" v-if="loadingStatus">

		<div class="ld" v-if="loadingStatus=='loading'" v-loading="true"></div>
		<div class="nd" v-if="loadingStatus=='over'" v-nodata="true" :nodata-text='this.$t("common.nodata")'></div>

	</div>
</template>
<script type="text/javascript">
	
	export default{
		props:{
			loadingStatus:{},
			nodataText:{
				default:''
			}
		}
	}
</script>
<style lang="less">
	.g-load-status{
		width: 100%;
		height: 100%;
		position: relative;
		min-height:9rem;
		&>div{
			position: absolute;
			left: 0;right: 0;top: 0;bottom: 0;
		}
	}
</style>