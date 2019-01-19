import conferenceFirstPage from 'components/conference-first-page/conference-first-page';
import conferenceCloudList from 'components/conference-cloud-list/conference-cloud-list';
import conferenceGuide from 'components/conference-guide/conference-guide';
import conferenceMy from 'components/conference-my/conference-my';
import conferenceMyQr from 'components/conference-my/conference-my-qr';
import conferenceSign from 'components/conference-sign/conference-sign';
import conferenceSignInfo from 'components/conference-sign/conference-sign-info';
import conferencehelpSignInfo from 'components/conference-sign/conference-helpsign-info';
import conferenceHelpSign from 'components/conference-help-sign/conference-help-sign';
import conferenceHtml5 from 'components/conference-html5/conference-html5';
import conferenceHtml5Info from 'components/conference-html5/conference-html5-info';
import conferenceBarrage from 'components/conference-barrage/conference-barrage';
import question from 'components/question/index.vue';
import questionStart from 'components/question/start';
import questionSpeed from 'components/question/speed';
import questionScore from 'components/question/score';
import questionEnd from 'components/question/end';
import questionRank from 'components/question/rank';
import login from 'components/login/login';
import signup from 'components/login/signup';

export default [
    {
        // 首页菜单  ---------------->************缓存************* ;
        path:'/conferenceFirstPage',
        components:{
            keepAlive:conferenceFirstPage
        }
    },
    {
        // 云会务
        path:'/conferenceCloudList',
        component:conferenceCloudList
    },
    {
        // 大会指南
        path:'/conferenceGuide',
        component:conferenceGuide
    },
    {
        // 大会我的信息
        path:'/conferenceMy',
        component:conferenceMy
    },
    {
        // 大会我的信息-二维码
        path:'/conferenceMyQr',
        component:conferenceMyQr
    },
    {
        // 大会签到
        path:'/conferenceSign',
        component:conferenceSign
    },
    {
        // 大会签到--->扫码后做展示 ----------------> 不用经过code验证 ;
        path:'/conferenceSignInfo',
        component: conferenceSignInfo
    },
    {
        // 大会签到--->扫码后做展示 ----------------> 不用经过code验证 ;
        path:'/conferencehelpSignInfo',
        component: conferencehelpSignInfo
    },
    {
        // 帮他签到
        path:'/conferenceHelpSign',
        component:conferenceHelpSign   
    },
    {
        // 弹幕
        path:'/conferenceBarrage',
        component:conferenceBarrage   
    },
    {
        //报名
        path:'/conferenceHtml5',
        component: conferenceHtml5
    },
    {
        path:'/conferenceHtml5Info',
        component: conferenceHtml5Info
    },
    {
        //答题
        path:'/question',
        redirect: '/question/start',
        component: question,
        children: [{
            path: 'start',
            component: questionStart
        },{
            path: 'speed',
            component: questionSpeed
        },{
            path: 'score',
            component: questionScore
        },{
            path: 'end',
            component: questionEnd
        },{
            path: 'rank',
            component: questionRank
        }]
    },
    {
        path: '/login',
        component: login
    },{
        path: '/signup',
        component: signup
    }
]

