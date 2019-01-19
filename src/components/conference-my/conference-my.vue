<template>
	<div class="conference-my scroll">
		<div class="part1">
			<div class="avatar-wrap">
				<avatar 
					class="ava"
					:size="'1.7rem'" 
					:fontSize="'0.55rem'" 
					:headUrl="userInfo.avatar" 
					:userName="userInfo.name">	
				</avatar>
				<p class="elli">{{userInfo.name}}</p>
			</div>
		</div>
		<ul class="part2">
			<li>
				<span class="sp">姓名</span>
				<span class="tel">{{userInfo.mobile}}</span>
				<img src="~assets/images/tlf.png"/>
			</li>
			<li>
				<span class="sp">性别</span>
				<span class="tel">{{userInfo.mobile}}</span>
				<img src="~assets/images/tlf.png"/>
			</li>
			<li>
				<span class="sp">生日</span>
				<span class="tel">{{userInfo.mobile}}</span>
				<img src="~assets/images/tlf.png"/>
			</li>
			<li>
				<span class="sp">{{$t("my.mobile")}}</span>
				<span class="tel">{{userInfo.mobile}}</span>
				<img src="~assets/images/tlf.png"/>
			</li>
		</ul>
		<div class="edit" @click="toEdit">
			编辑
		</div>
	</div>
</template>
<script type="text/javascript">

	export default{
		data(){
			return {
			}
		},
		computed:{
			userInfo(){
				return this.$root.userInfo ;
			}
		},

		created(){
		},

		methods:{
			toEdit(){
				this.$router.push({
					path: '/conferenceMyQr'
				})
			}
		}
	}
</script>
<style lang="less" scoped>
	.conference-my{
		position: relative;
		height: 100%;
		.part1{
			height: 130px;
			background: url('~assets/images/mybg2.png') no-repeat;
			background-size: cover;
			.avatar-wrap{
				position: absolute;
				top: 25px;
				left: 50%;
				width: 108px;
				transform: translateX(-50%);
				text-align: center;
				.ava{
					margin: 0 auto;
					border-radius: 50%;
					border: 2px solid white;/*no*/
				}
				p{
					font-size: 19px;
					color: white;
					margin-top: 5px;
				}
			}
		}
		.part2{
			padding-left: 15px;
			background: #fff;
			li{
				height: 50px;
				line-height: 50px;
				border-bottom: 1px solid #E9E9E9;/*no*/
				border-bottom: 0.5px solid #E9E9E9;/*no*/
				padding: 0 15px 0 0;
				background: white;
				position: relative;
				font-size: 0;
				img{
					width: 27px;
					position: absolute;
					right: 15px;
					top: 10px;
				}
				.sp{
					color:#333;
					font-size: 15px;
				}
				.tel{
					color: #999999;
					font-size: 15px;
					margin-left: 15px;
				}
			}
		}
		.edit{
			height: 50px;
            width: 130px;
			border-radius: 8px;
			text-align: center;
            display: block;
			background: #e44c47;
            margin: 40px auto 0 auto;
            font-size: 20px;
            color: #FFF;
            line-height: 50px;
		}
	}
</style>			
