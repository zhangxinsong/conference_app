<template>
    <div class="question-rank">
        <div class="header-img"></div>
        <ul v-if="rankList.length">
            <li v-for="(item,index) in rankList" :key="index">
                <img v-if="index == 0" src="../../assets/images/question/first.png">
                <img v-else-if="index == 1" src="../../assets/images/question/second.png">
                <img v-else-if="index == 2" src="../../assets/images/question/third.png">
                <span v-else class="rankIndex">{{  index + 1  }}</span>
                <span class="rankName">{{item.user.name}}</span>
                <span class="rankTime">{{examType == 'SCORE' ? item.totalScore : (item.totalTime/1000).toFixed(2)+'s' }}</span>
            </li>
        </ul>
        <div v-else>
            zanwushuju
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            rankList: []
        }
    },
    computed:{
        examType(){
            return this.$parent.exam.examType;
        }
    },
    methods: {
        gitRankList(){
            this.$ajax({
                url:`/rest/v1/answer/exam/result/${this.$parent.examId}/${this.examType == 'SCORE'? 'score':'speed'}/seniority?memberId=${this.$root.memberId}`,
                type: 'get',
                success(res){
                    let date = JSON.parse(res);
                    this.rankList = date;
                },
                error(err){
                    G.UI.say();
                }
            })
        }
    },
    mounted(){
        this.gitRankList();
    }
}
</script>
<style lang="less" scoped>
    .question-rank {
        width: 100%;
        height: 100%;
        background: #fff;
        position: relative;
        .header-img{
            width: 100%;
            height: 120px;
            background: url('../../assets/images/question/top_pic1_new.png');
            background-size: 100% 100%;
        }
        ul{
            position: absolute;
            top: 120px;bottom: 0;
            right: 0;left: 0;
            overflow-y: scroll;
            li{
                height: 60px;
                border-bottom: 1px #f3f3f3 solid;
                position: relative;
                font-size: 16px;
                img{
                    position: absolute;
                    width: 50px;
                    height: 50px;
                    left: 10px;
                    top: 6px;
                }
                .rankIndex{
                    position: absolute;
                    width: 50px;
                    height: 50px;
                    left: 10px;
                    top: 6px;
                    text-align: center;
                    line-height: 50px;
                    color: #fbf650;
                }
                .rankName{
                    position: absolute;
                    left: 65px;right: 95px;
                    top: 0;
                    line-height: 60px;
                }
                .rankTime{
                    position: absolute;
                    right: 15px;
                    top: 0;
                    width: 80px;
                    text-align: right;
                    line-height: 60px;
                }
            }
        }
        
    }
</style>