<template>
    <div class="question">
        <transition name="slide-fade">
            <router-view class="router-view"></router-view>
                    </transition>
            <fs-share rangs="5,6"
            :rangeData="rangeData"
            :showBoard="showShareBoard"
            @shareBoardState="shareBoardState" />
        </div>
</template>
<script>
import FsShare from "../common/share";
export default {
    components:{
		FsShare,
	},
    data(){ 
        return {
            showShareBoard: false,
            rangeData: {},
            exam: {},
            examId: ''
        }
    },
    computed:{
        
    },
    methods: {
        getExam(){
            this.$ajax({
                url:`/rest/v1/answer/exam/${this.examId}?memberId=${this.$root.memberId}`,
                type: 'get',
                success(res){
                    let now = new Date().valueOf();
                    let date = JSON.parse(res);
                    this.exam = date;
                    if(now < date.startTime){
                        G.UI.say('考试还未开始');
                    }else if(now > date.endTime){
                        G.UI.say('考试已经结束');
                    }
                },
                error(err){
                    G.UI.say();
                }
            })
        },
        share() { // 分享
            this.showShareBoard = true;
            this.rangeData = {
                title: '答题',
                zoneTitle: '答题',
                content: '啦啦啦',
                url: window.location.href,
                imgUrl: "https://ykj-yyim-test.oss-cn-beijing.aliyuncs.com/conference/2018/08/31/16/39/a56ab240-d353-4e59-be3b-9585406cfad6.png",
            };
        },
        shareBoardState(params) {
            this.showShareBoard = params;
        },
        configNavBar() { // 配置导航栏
            let	rightItems = {
                title: this.$t("html5.share"),
                call: () => {
                    this.share();
                }
            }
            G.BRIDGE.changeTitle({
                centerItems: {
                    title: "答题"
                },
                rightItems: rightItems
            });
        },
    },
    created(){
        this.examId = this.$route.query.examId;
        this.getExam();
        this.configNavBar();
    }
}
</script>
<style lang="less" scoped>
    .question{
        width: 100%;
        height: 100%;
        .router-view{
			transition: all 0.6s ease-in-out;
		}
    }
    .slide-fade-enter-active {
        transition: all .3s ease;
    }
    .slide-fade-leave-active {
        transition: all .6s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to {
        opacity: 0;
    }
</style>