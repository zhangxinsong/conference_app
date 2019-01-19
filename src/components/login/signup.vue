<template>
    <div class="signup">
        <h1>注册</h1>
        <div>
            <span>用户名</span><input type="text" v-model="loginName"><br>
            <span>密码</span><input type="password" v-model="password"><br>
            <span>确认密码</span><input type="password" v-model="password1">
        </div>
        <div class="zhuce" @click="signup">注册</div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            loginName: '',
            password: '',
            password1: ''
        }
    },
    methods: {
        signup(){
            if(this.loginName == ''){
                G.UI.say("用户名不能为空")
            }
            else if(this.password == ''){
                G.UI.say("密码不能为空")
            }
            else if(this.password1 == ''){
                G.UI.say("确认密码不能为空")
            }
            else if(this.password != this.password1){
                G.UI.say("两次密码不一样")
            }else{
                this.$ajax({
                    type: 'post',
                    url:`/rest/start/signup`,
                    contentType: 'json',
                    data: {
                        loginName: this.loginName,
                        password: this.password
                    },
					success(res){
						res=JSON.parse(res);
                        G.UI.say( "注册成功");
                        this.$router.push({
                            path: '/login'
                        })
					},
					error(){
						G.UI.say("用户名已存在")
					}
				})
            }
        }
    },
    mounted(){

    }
}
</script>
<style lang="less" scoped>
    .signup{
        height: 100%;
        width: 100%;
        background-image: url("~assets/images/bg_1.jpg");
        text-align: center;
        input{
            width: 70%;
            height: 40px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 6px;
            border: 1px solid #f3f3f3;
            margin-top: 20px;
            font-size: 16px;
            text-indent: 5px;
        }
        span{
            display: inline-block;
            width: 80px;
            font-size: 16px;
        }
        h1{
            text-align: left;
            padding: 10px 20px;
            font-size: 24px;
            border-bottom: 1px solid gray;
            margin: 0 10px;
        }
        .zhuce{
            height: 50px;
            width: 130px;
            border-radius: 8px;
            display: inline-block;
            background: #f3f3f3;
            margin-top: 60px;
            font-size: 20px;
            color: gray;
            line-height: 50px;
        }
    }
</style>