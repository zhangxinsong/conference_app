<template>
    <div class="question-doing">
        <!-- 倒计时浮层 -->
        <div class="count-down" v-if="isCountDown">
            <div class="count-down-s" >
                <img :src="countDownImg">
            </div>
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
            :title="'[多选]'+ (questionIndex+1) +'.'+title"
            v-model="multipleAnswer"
            :options="options"
            >
            </mt-checklist>
            <!-- 单选选择 -->
            <mt-radio
            v-if="questionType=='SINGLE'"
            :title="'[单选]'+ (questionIndex+1) +'.'+title"
            v-model="singleAnswer"
            :options="options" 
            @change="clickRadio"/>
            <div class="btn-group">
                <div v-if="questionIndex>0" class="confirmMu" @click="prevQuestion">上一题</div>
                <div v-if="questionIndex<(questionCount-1)" class="confirmMu" @click="nextQuestion">下一题</div>
                <div v-if="questionIndex>=(questionCount-1)" class="confirmMu" @click="nextQuestion">结束考试</div>
            </div>
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
            isEnd: false,   //是否最后一题
            title: '',  //问题描述
            multipleAnswer: [],  //多选答案
            singleAnswer: '',   //单选答案
            options: [],
            sequence: null
        }
    },
    computed:{
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
        countGlobalTimer(){  //全局计时
            let startTime = new Date().getTime();
            this.globalTimer = setInterval(()=>{
                let nowTime = new Date().getTime();
                this.globalTime = parseInt((nowTime - startTime)/10);
            },10)
        },
        clickRadio(){   //单选选中
            this.$nextTick(()=>{
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
                }
            })
        },
        prevQuestion(){
            this.questionIndex--;
            this.getOtherQuestion();
        },
        nextQuestion(){
            this.questionIndex++;
            this.getOtherQuestion();
        },
        getOtherQuestion(){  //最后一题
            if(this.questionIndex == this.questionCount){
                this.$ajax({
                    url:`/rest/v1/answer/exam/${this.$parent.examId}/score/end/${this.questionId}?totalTime=${this.globalTime*10}&sequence=${this.sequence}&memberId=${this.$root.memberId}`,
                    type: 'get',
                    data: this.questionType == 'SINGLE' ? {userAnswers:[this.singleAnswer]} : {userAnswers:this.multipleAnswer},
                    success(res){
                        clearInterval(this.globalTimer);
                        this.isEnd = true;
                        this.$router.push({
                            path: 'end',
                            query: {
                                sequence: this.sequence
                            }
                        })
                    },
                    error(err){}
                })
            }else{ 
                this.$ajax({
                    url:`/rest/v1/answer/exam/${this.$parent.examId}/score/next/${this.questionId}/${this.questionIndex}?sequence=${this.sequence}&memberId=${this.$root.memberId}`,
                    type: 'get',
                    data: this.questionType == 'SINGLE' ? {userAnswers:[this.singleAnswer]} : {userAnswers:this.multipleAnswer},
                    success(res){
                        let data = JSON.parse(res);
                        this.title = data.description;
                        this.questionType = data.questionType;
                        this.questionId = data.questionId;
                        this.options = [];
                        this.multipleAnswer = [];
                        Object.keys(data.question).map((key,i)=>{
                            this.options.push({label:data.question[key],value:key});
                            data.userChoose&&data.userChoose.map((value,k)=>{
                                if(data.questionType == 'SINGLE' &&value == key){
                                    this.singleAnswer = value;
                                }else if(data.questionType == 'MULTIPLE' &&value == key){
                                    this.multipleAnswer.push(value);
                                }
                            })
                        });
                    },
                    error(err){}
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
            z-index: 9999;
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
            .btn-group{
                width: 100%;
                text-align: center;
                margin-top: 40px;
                .confirmMu{
                    display: inline-block;
                    width: 120px;
                    height: 40px;
                    text-align: center;
                    background: #fa4c21;
                    line-height: 40px;
                    border-radius: 4px;
                    color: #fff;
                    font-size: 16px;
                    margin: 0 15px;
                }
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
        .mint-radio{
            display: inline-block;
            width: 20px;
        }
        .mint-radio-label{
            display: inline-block;
            width: 90%;
        }
        .mint-radiolist-label{
            padding: 10px;
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
    }
</style>