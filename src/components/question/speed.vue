<template>
    <div class="question-doing">
        <!-- 倒计时浮层 -->
        <div class="count-down" v-if="isCountDown">
            <div class="count-down-s" >
                <img :src="countDownImg">
            </div>
        </div>
        <!-- 答题正确错误提示 -->
        <div class="tip-wrapper" v-if="isTip">
            <img v-if="isTrue" src="../../assets/images/question/wright/wright_new.jpg">
            <img v-else src="../../assets/images/question/wrong/wrong_new.jpg">
        </div>
        <!-- 答题计时 -->
        <div class="timing">
            <div class="s">{{ parseInt(globalTime/100) }}</div>
            <div class="s d"></div>
            <div class="s ms">{{ globalTime%100 }}</div>
            <div class="dw">s</div>
        </div>
        <!-- 答题选择 -->
        <div class="content">
            <!-- 多项选择 -->
            <mt-checklist
            v-if="questionType=='MULTIPLE'"
            :title="'[多选]'+ questionIndex +'.'+title"
            v-model="multipleAnswer"
            :options="options"
            >
            </mt-checklist>
            <div v-if="questionType=='MULTIPLE'" class="confirmMu" @click="nextQuestion">确认选择</div>
            <!-- 单选选择 -->
            <mt-radio
            v-if="questionType=='SINGLE'"
            :title="'[单选]'+ questionIndex +'.'+title"
            v-model="singleAnswer"
            :options="options" 
            @change="clickRadio"/>
        </div>
    </div>
</template>
<script>
import { MessageBox } from 'mint-ui';
export default {
    data(){
        return {
            countDown: 3, //倒计时S数
            isCountDown: true,
            countDownImg: '',
            globalTime: 0,   //全局计时
            globalTimer: null,  //全局interval
            questionIndex: 0,  //题号
            questionId: '',
            questionType: 'SINGLE',  //题目类型
            isTrue: true, //题目是否正确
            isTip: false,   //提示浮层
            isEnd: false,   //是否最后一题
            title: '',  //问题描述
            multipleAnswer: [],  //多选答案
            singleAnswer: '',   //单选答案
            options: [],
            sequence: null
        }
    },
    computed:{
        tipTime(){    //提示延时
            return this.$parent.exam.interval;
        },
        questionCount(){
            return this.$parent.exam.singleQuestionCount + this.$parent.exam.multipleQuestionCount;
        }
    },
    beforeRouteLeave(to, from, next) {
        if(this.isEnd){
            next(true);
        }else{
            MessageBox.confirm('', { 
                message: "是否放弃答题，离开本页？", 
                title: "提示", 
                confirmButtonText: "确认", 
                cancelButtonText: "取消"
            }).then(action => { 
                if (action == 'confirm') {   //确认的回调
                    next(true);
                    this.$router.back();
                }
            }).catch(err => { 
                if (err == 'cancel') {
                    next(false);     //取消的回调
                } 
            });
        }
    },
    methods: {
        countDownTimer(){  //开始倒计时
            this.getFirstQuestion();
            let timer = setInterval(()=>{
                if (this.countDown == 0) {
                    clearInterval(timer);
                    this.isCountDown = false;
                    this.countGlobalTimer();
                    return
                }
                this.countDownImg = require('../../assets/images/question/count_down_'+this.countDown+'.jpg');
                this.countDown--;
            },1000);
        },
        countGlobalTimer(){   //全局计时
            let startTime = new Date().getTime();
            this.globalTimer = setInterval(()=>{
                let nowTime = new Date().getTime();
                this.globalTime = parseInt((nowTime - startTime)/10);
            },10)
        },
        tipWrongTimer(){   //错误提示延时
            this.isTrue = false;
            this.isTip = true;
            let timer = setTimeout(()=>{
                this.isTip = false;
            },this.tipTime*1000);
        },
        tipRightTimer(){   //正确提示延时
            this.isTrue = true;
            this.isTip = true;
            let timer = setTimeout(()=>{
                this.isTip = false;
                if(this.isEnd){
                    this.$router.push({
                        path: 'end',
                        query: {
                            sequence: this.sequence
                        }
                    })
                }
            },500);
        },
        clickRadio(){   //单选选中
            this.$nextTick(()=>{
                this.nextQuestion();
            });
        },
        getFirstQuestion(){  //获取第一道题
            this.$ajax({
                url:`/rest/v1/answer/exam/${this.$parent.examId}/start?memberId=${this.$root.memberId}`,
                type: 'get',
                success(res){
                    let data = JSON.parse(res);
                    this.$nextTick(()=>{
                        this.title = data.description;
                        this.questionType = data.questionType;
                        this.questionId = data.questionId; 
                        this.sequence = data.sequence;
                        Object.keys(data.question).map((key,i)=>{
                            this.options.push({label:data.question[key],value:key});
                        })
                    });
                    this.questionIndex++;
                }
            })
        },
        nextQuestion(){  //最后一题
            if(this.questionIndex == this.questionCount){
                this.$ajax({
                    url:`/rest/v1/answer/exam/${this.$parent.examId}/speed/end/${this.questionId}?totalTime=${this.globalTime*10}&sequence=${this.sequence}&memberId=${this.$root.memberId}`,
                    type: 'get',
                    data: this.questionType == 'SINGLE' ? {userAnswers:[this.singleAnswer]} : {userAnswers:this.multipleAnswer},
                    success(res){
                        clearInterval(this.globalTimer);
                        this.isEnd = true;
                        this.tipRightTimer();
                    },
                    error(err){
                        this.tipWrongTimer()
                    }
                })
            }else{   //下一题
                this.$ajax({
                    url:`/rest/v1/answer/exam/${this.$parent.examId}/speed/next/${this.questionId}/${this.questionIndex}?sequence=${this.sequence}&memberId=${this.$root.memberId}`,
                    type: 'get',
                    data: this.questionType == 'SINGLE' ? {userAnswers:[this.singleAnswer]} : {userAnswers:this.multipleAnswer},
                    success(res){
                        this.tipRightTimer();
                        let data = JSON.parse(res);
                        this.title = data.description;
                        this.questionType = data.questionType;
                        this.questionId = data.questionId;
                        this.options = [];
                        this.multipleAnswer = [];
                        Object.keys(data.question).map((key,i)=>{
                            this.options.push({label:data.question[key],value:key});
                        });
                        this.questionIndex++;
                    },
                    error(err){
                        this.tipWrongTimer()
                    }
                })
            }  
        }
    },
    mounted(){
        this.countDownTimer();
    }
}
</script>
<style lang="less" scoped>
    .question-doing{
        width: 100%;
        height: 100%;
        background: #fff;
        position: relative;
        .count-down{
            position: absolute;
            top: 0;bottom: 0;
            right: 0;left: 0;
            background: url('../../assets/images/question/count_down_bg.jpg');
            background-size: cover;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            .count-down-s{
                img{
                    animation: myfirst 1s infinite linear;
                }
            }
        }
        .tip-wrapper{
            position: absolute;
            top: 0;bottom: 0;
            right: 0;left: 0;
            background: rgba(255, 255, 255, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        .timing{
            width: 100%;
            height: 70px;
            background: #fa4c21;
            text-align: center;
            padding: 12px 0;
            .s{
                display: inline-block;
                padding: 0 15px;
                height: 45px;
                background: #fff;
                border-radius: 6px;
                color: #fa4c21;
                text-align: center;
                font-size: 25px;
                line-height: 45px;
                vertical-align: bottom;
            }
            .d{
                width: 6px;
                height: 6px;
                padding: 0;
                border-radius: 2px;
            }
            .ms{

            }
            .dw{
                display: inline-block;
                font-size: 35px;
                color: #fff;
                vertical-align: bottom;
            }
        }
        .content{
            position: absolute;
            top: 70px; bottom: 0;
            right: 0;left: 0;
            background: #FFF;
            .confirmMu{
                width: 120px;
                height: 40px;
                text-align: center;
                background: #fa4c21;
                line-height: 40px;
                margin: 40px auto 0 auto;
                border-radius: 4px;
                color: #fff;
                font-size: 16px;
            }
        }
    }
    @keyframes myfirst
    {
    0%   {width: 150%; opacity: 0;}
    50%  {opacity: 1;}
    100% {width: 50%;opacity: 0;}
    }
</style>
<style lang="less">
    .question-doing{
        .mint-checklist-label{
            padding: 10px;
        }
        .mint-checkbox{
            display: inline-block;
            width: 20px;
        }
        .mint-checkbox-label{
            display: inline-block;
            width: 90%;
        }
        .mint-checklist-title{
            font-size: 20px;
        }
        .mint-cell{
            background-color: transparent;
        }
        .mint-cell-wrapper{
            padding-left: 0;
            background: #fff;
        }
        .mint-cell:last-child{
            background: #fff;
        }
        .mint-radiolist-title{
            font-size: 20px;
        }
        .mint-checkbox-core{
            border-radius: 4px;
        }
        .mint-checkbox-input:checked + .mint-checkbox-core{
            background-color: #fa4c21;
            border-color: #fa4c21;
        }
        .mint-radio-input:checked + .mint-radio-core{
            background-color: #fa4c21;
            border-color: #fa4c21;
        }
    }
    body .mint-msgbox-confirm{
        color: #fa4c21;
    }
</style>
