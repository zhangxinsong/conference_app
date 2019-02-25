<template>
    <div class="login">
        <div class="touxiang">
            <img src="~assets/images/star-on.png">
        </div>
        <div class="input-box">
            <span class="mobile">用户名</span><input type="text" v-model="loginName"><br>
            <span class="password">密码</span><input type="password" v-model="password"> 
        </div>
        <div class="zhuce"><span @click="toSignup">注册</span></div>
        <div class="signin" @click="submit">登录</div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            loginName: '',
            password: ''
        }
    },
    methods: {
        toSignup(){
            this.$router.push({
                path: '/signup'
            })
        },
        submit(){
            if(this.loginName == ''){
                G.UI.say("用户名不能为空")
            }
            else if(this.password == ''){
                G.UI.say("密码不能为空")
            }
            else{
                this.$ajax({
                    type: 'get',
                    url:`/rest/start/signin?loginName=${this.loginName}&password=${this.password}`,
					success(res){
                        res=JSON.parse(res);
                        window.localStorage.setItem('memberId',res.memberId);
                        G.UI.say( "登录成功");
                        this.$router.push({
                            path: '/conferenceFirstPage'
                        })
					},
					error(){
						G.UI.say("登录失败");
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
    .login{
        width: 100%;
        height: 100%;
        background-image: url("~assets/images/bg_1.jpg");
        text-align: center;
        input{
            width: 75%;
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
            width: 60px;
            font-size: 16px;
            margin-right: 5px;
        }
        .touxiang{
            height: 80px;
            width: 80px;
            border-radius: 40px;
            display: inline-block;
            background: #f3f3f3;
            margin-top: 100px;
            img{
                margin-top: 50%;
                transform: translateY(-50%);
            }
        }
        .input-box{
            margin-top: 40px;
        }
        .zhuce{
            height: 40px;
            span{
                float: right;
                color: gray;
                margin-right: 25px;
                margin-top: 10px;
            }
        }
        .signin{
            height: 50px;
            width: 130px;
            border-radius: 8px;
            display: inline-block;
            background: #f3f3f3;
            margin-top: 80px;
            font-size: 20px;
            color: gray;
            line-height: 50px;
        }
    }
</style>