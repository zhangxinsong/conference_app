<template>
    <div class="question-end">
        <img class="endImg" src='../../assets/images/question/score-bg.png'>
        <span class="beatnum" v-if="this.$parent.exam.examType == 'SPEED'">
            您本次用时 <span>{{ (time/1000).toFixed(2) }}</span> s
            <br>
            <br>
            历史最短用时 <span>{{(mintime/1000).toFixed(2)}}</span> s
            <br>
            <br>
            共击败了 <span>{{ num }}</span> 人
        </span>
        <span class="beatnum" v-if="this.$parent.exam.examType == 'SCORE'">
            您本次得分 <span>{{ score }}</span>
            <br>
            <br>
            历史最高得分 <span>{{bestScore}}</span>
            <br>
            <br>
            共击败了 <span>{{ num }}</span> 人
        </span>
        <img class="challengeAgain" @click="tryAgain" src='../../assets/images/question/challenge_again.png'>
        <img class="share" @click="share" src='../../assets/images/question/share_scores.png'>
        <img class="close" @click="close" src='../../assets/images/question/dead_line_close_btn.png'>
    </div>
</template>
<script>
export default {
    data(){
        return {
            time: 0,
            mintime: null,
            num: 0,
            score: 0,
            bestScore: null
        }
    },
    computed:{
        sequence(){
            return this.$route.query.sequence;
        }
    },
    methods: {
        getExamData(){
            this.$ajax({
                url:`/rest/v1/answer/exam/result/${this.$parent.examId}?sequence=${this.sequence}&memberId=${this.$root.memberId}`,
                type: 'get',
                success(res){
                    let date = JSON.parse(res);
                    this.time = date.totalTime;
                    this.score = date.totalScore;
                },
                error(err){
                }
            })
        },
        getExamBest(){
            if(this.$parent.exam.examType == 'SCORE'){
                this.$ajax({
                    url:`/rest/v1/answer/exam/result/${this.$parent.examId}/score/grade?sequence=${this.sequence}&memberId=${this.$root.memberId}`,
                    type: 'get',
                    success(res){
                        let date = JSON.parse(res);
                        this.num = date.beatNumber;
                        this.bestScore = date.bestScore;
                    },
                    error(err){
                    }
                })
            }else{
                this.$ajax({
                    url:`/rest/v1/answer/exam/result/${this.$parent.examId}/speed/grade?sequence=${this.sequence}&memberId=${this.$root.memberId}`,
                    type: 'get',
                    success(res){
                        let date = JSON.parse(res);
                        this.num = date.beatNumber;
                        this.mintime = date.minTime;
                    },
                    error(err){
                    }
                })
            } 
        },
        share(){
            this.$parent.showShareBoard = true;
            this.$parent.rangeData = {
                title: '答题',
                zoneTitle: '答题',
                content: '啦啦啦',
                url: window.location.href,
                imgUrl: "https://ykj-yyim-test.oss-cn-beijing.aliyuncs.com/conference/2018/08/31/16/39/a56ab240-d353-4e59-be3b-9585406cfad6.png",
            };
        },
        tryAgain(){
            this.$router.back();
        },
        close(){
            this.$router.go(-2);
        }
    },
    mounted(){
        this.getExamData();
        this.getExamBest();
    }
}
</script>
<style lang="less" scoped>
    .question-end{
        width: 100%;height: 100%;
        background: url('../../assets/images/question/exam-bg-2018.png');
        background-size: 100% 100%;
        position: relative;
        .endImg{
            position: absolute;
            top: 80px;left: 50%;
            width: 200px;
            transform: translateX(-50%);
        }
        .beatnum{
            position: absolute;
            top: 250px;left: 50%;
            transform: translateX(-50%);
            width: 250px;
            text-align: center;
            color: #fff;
            font-size: 20px;
            span{
                color: #f1b42a;
                font-size: 24px;
                font-weight: 600; 
            }
        }
        .challengeAgain{
            position: absolute;
            left: 50%;bottom: 200px;
            width: 160px;height: 50px;
            transform: translateX(-50%);
        }
        .share{
            position: absolute;
            bottom: 130px;left: 50%;
            width: 160px;height: 50px;
            transform: translateX(-50%);
        }
        .close{
            position: absolute;
            bottom: 60px;left: 50%;
            width: 160px;height: 50px;
            transform: translateX(-50%);
        }
    }
</style>