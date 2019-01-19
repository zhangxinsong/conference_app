<template>
    <div class="question-start">
        <div class="examTitle">
            <img src="../../assets/images/question/exam-name-2018.png">
        </div>
        <div class="examRegulation">
            <img src='../../assets/images/question/exam-title-2018.png'>
            <div class="regulation" v-html="regulation">
            </div>
        </div>
        <div class="btnGroup">
            <div class="startExam" @click="toDoing"></div>
            <div class="rankList" @click="toRank"></div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
        }
    },
    computed:{
        regulation(){
            if(this.$parent.exam.examRegulation){
                return this.$parent.exam.examRegulation.replace( /\n/g,'<br/>')
            }else{
                return '';
            }
        }
    },
    methods: {
        toDoing(){
            if(this.$parent.exam.examType == "SPEED"){
                this.$router.push({
                    path: 'speed'
                })
            }else{
                this.$router.push({
                    path: 'score'
                })
            }
        },
        toRank(){
            this.$router.push({
                path: 'rank'
            })
        }
    },
    mounted(){
    }
}
</script>
<style lang="less" scoped>
    .question-start{
        width: 100%;
        height: 100%;
        background: url('../../assets/images/question/exam-bg-2018.png');
        background-size: 100% 100%;
        .examTitle{
            height: 25%;
            width: 100%;
            text-align: center;
            img{
                width: 80%;
                margin-top: 60px;
            }
        }
        .examRegulation{
            width: 80%;
            height: 50%;
            margin: 10px auto 0 auto;
            background: rgba(247, 234, 234,0.3);
            border-radius: 5px;
            position: relative;
            img{
                width: 150px;
                height: 30px;
                position: absolute;
                top:-15px; 
                left:50%;
                transform: translateX(-50%);
            }
            .regulation{
                position: absolute;
                top: 25px;bottom: 10px;
                right: 8px;left: 12px;
                color: #FFF;
                font-size: 16px;
                line-height: 22px;
                overflow-y: scroll; 
            }
        }
        .btnGroup{
            text-align: center;
            margin-top: 40px;
            .startExam{
                display: inline-block;
                width: 125px;
                height: 45px;
                background: url('../../assets/images/question/btn_begin_exam.png');
                background-size: cover;
                animation: myfirst 1s infinite linear;
            }
            .rankList{
                display: inline-block;
                width: 125px;
                height: 45px;
                background: url('../../assets/images/question/btn_hero_ranks.png');
                background-size: cover;
                margin-left: 20px;
            }
        }
    }
    @keyframes myfirst
    {
    0%   {}
    50% {transform: scale3d(1.1,1.1,1.1)}
    100% {}
    }
</style>