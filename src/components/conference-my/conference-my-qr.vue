<template>
	<div class="conference-my-qr">
		<mt-field label="姓名" placeholder="请输入姓名" v-model="form.name"></mt-field>
		<mt-field label="性别" placeholder="请输入性别" type="text" v-model="form.sex"></mt-field>
		<mt-field label="手机" placeholder="请输入手机号" type="tel" v-model="form.mobile"></mt-field>
		<mt-field label="邮箱" placeholder="请输入邮箱" type="email" v-model="form.email"></mt-field>
		<mt-field label="生日" placeholder="请输入生日" type="date" v-model="form.birthday"></mt-field>
		<div class="save" @click="save">
			保存
		</div>
	</div>
</template>
<script type="text/javascript">

	export default{
		data(){
			return {
				form: {
					name: '',
					sex: '',
					mobile: '',
					email: '',
					birthday: ''
				}
			}
		},

		mounted(){
			this.form = this.$root.userInfo;
		},

		methods:{
		    save(){
				this.$ajax({
					url: `/rest/start/signin/update/${this.$root.memberId}`,
					type: 'put',
					data: {
						birthday: this.form.birthday,
						email: this.form.email,
						mobile: this.form.mobile,
						name: this.form.name,
						sex: this.form.sex,
					},
					contentType: 'json',
					success(res){
						console.log(res);
					}
				})
			}
		}
	}
</script>
<style lang="less" scoped>
	.conference-my-qr{
		position: absolute;
		left: 0;right: 0;
		top: 0;bottom: 0;
		z-index: 1;
		background: #F5F5F5;
		box-shadow:0px 0px 30px 0px rgba(0,0,0,0.03);
		.save{
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