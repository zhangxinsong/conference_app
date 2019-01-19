<template>
    <transition name="fade">
        <div class="share" v-if="showBoard" @click="close">
            <div class="share-content">
                <div class="title">-{{$t("common.recommended_sharing")}}-</div>
                <div class="share-items">
                    <div class="item"
                        @click="shareOut(item)"
                        v-for="(item, index) in selectedRange" :key="index">
                        <img :src="item.icon" class="logo"/>
                        <p class="text">{{item.text}}</p>
                    </div>
                </div>
                <div class="cancle" @click="close">
                    {{$t("common.cancel")}}
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    props: {
        rangs: {
            type: String,
            default: "3,4,5,6"
        },
        rangeData: {
            type: Object,
            required: true       
        },
        showBoard: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            selectedRange: null,
            rangeArr: [{
                icon: require("../../assets/images/share/worker.png"),
                text: this.$t("common.colleagues"),
                shareType: "6"
            }, {
                icon: require("../../assets/images/share/upesn.png"),
                text: this.$t("common.youZone"),
                shareType: "5"
            }, {
                icon: require("../../assets/images/share/wechat.png"),
                text: this.$t("common.weChat"),
                shareType: "3"
            }, {
                icon: require("../../assets/images/share/firends.png"),
                text: this.$t("common.moments"),
                shareType: "4"
            }, {
                icon: require("../../assets/images/share/wechat.png"),
                text: this.$t("common.qq_Zone"),
                shareType: "2"
            }, {
                icon: require("../../assets/images/share/firends.png"),
                text: this.$t("common.qq_friends"),
                shareType: "1"
            }]
        }
    },
    methods: {
        getRanges() {
            this.selectedRange = this.rangeArr.filter((item) => {
                return this.rangs.split(",").indexOf(item.shareType) !== -1;
            });
        },
        close() {
            this.$emit("shareBoardState", false);
        },
        shareOut(item) {
            this.$emit("shareBoardState", false);
            let params;
            if (this.rangeData) {
                if (['5', '6'].indexOf(item.shareType) > -1) {
                    params = {
                        'function': 'shareLightAppMessage',
                        parameters: {
                            title: item.shareType === '5' ? this.rangeData.zoneTitle : this.rangeData.title,
                            content: this.rangeData.content,
                            url: this.rangeData.url,
                            icon: this.rangeData.imgUrl,
                            qzid: this.rangeData.qzid,
                            type: item.shareType === '5' ? 1 : 0,
                        }
                    };
                } else {
                    params = {
                        'function': 'share',
                        parameters: {
                            title: this.rangeData.title,
                            content: this.rangeData.content,
                            url: this.rangeData.url,
                            imgUrl: this.rangeData.imgUrl,
                            share_type: item.shareType
                        }
                    };
                }
                window.WebViewJavascriptBridge &&
                    window.WebViewJavascriptBridge.send(JSON.stringify(params), function (responseData) {});
            }
        }
    },
    mounted () {
        this.getRanges();
    }
}
</script>

<style lang="less" scoped>
.share {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10010;
    background-color: rgba(0,0,0,.6);
    transition: opacity .3s;
    .share-content {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: #fff;
        transition: all .3s;
        .title {
            text-align: center;
            color: #423737;
            font-size: 16px;
            padding-top: 20px;
        }
        .share-items {
            display: flex;
            align-items: center;
            justify-content: center;
            .item {
                flex: 1;
                text-align: center;
                font-size: 14px;
                padding: 28px 0;
                .logo {
                    width: 30px;
                    height: 30px;
                }
            }
        }
        .cancle {
            width: 100%;
            height: 45px;
            line-height: 45px;
            font-size: 14px;
            background: #f7f7f7;
            text-align: center;
        }
    }
    &.fade-enter-active, &.fade-leave-to {
        opacity: 0;
        .share-content {
            opacity: 0;
            transform: translateY(400px)
        }
    }
    &.fade-enter-to {
        opacity: 1;
        .share-content {
            opacity: 1;
            transform: translateY(0);
        }
    }
}
</style>