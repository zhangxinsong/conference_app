

console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$\n', timeStr+' ; ENV='+ENV+ '\n$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');


import Vue from 'vue';

// 路由 
import router from 'src/router';

// 配置信息
import config from 'g/config';

//获取语言
import lang from 'src/languages';

// 链接bridge
import { connect_bridge , bridge } from 'g/bridge';

// 封装ui组件
import ui from 'g/ui';

// 工具
import tool from 'g/tool';

// rem布局
import 'g/tool/flexible/flexible.debug';

//mint-ui 上拉加载
import { Loadmore, Field } from 'mint-ui';

Vue.component(Field.name, Field);
Vue.component(Loadmore.name, Loadmore);

//i18n
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

//yyzone多语
import { locale } from 'yyzone'

// 解决延迟
import fastclick from 'fastclick';
fastclick.attach(document.body);

// 全局css
import 'assets/css/public.less';

// 全局组件
import vimg from 'components/common/global.img-div.vue';
Vue.component('v-img', vimg );
import avatar from 'components/common/avatar.vue';
Vue.component('avatar', avatar );
import vLoad from 'components/common/global.load-status.vue';
Vue.component('v-load', vLoad );

import { Switch, DatetimePicker, Actionsheet, Radio, Checklist, MessageBox} from 'mint-ui';
Vue.component(Switch.name, Switch);
Vue.component(DatetimePicker.name, DatetimePicker);
Vue.component(Actionsheet.name, Actionsheet);
Vue.component(Radio.name, Radio);
Vue.component(Checklist.name, Checklist);

//设置国际化
let languages = lang.getLang();
sessionStorage.setItem('lang',languages);
const i18n = new VueI18n({
    locale: languages,  // 语言标识
    messages: {
        'en': require('./languages/en-US'),
        'tw': require('./languages/zh-TW'),
        'zh': require('./languages/zh-CN')
    }
});

//yyzone 手机区号多语设置
let yyzonelang = 'zhs';
if(languages == 'zh'){
	yyzonelang = 'zhs';
}
else if(languages == 'tw'){
	yyzonelang = 'zht';
}else{
	yyzonelang = 'en';
}
locale(yyzonelang);


// 自定义指令 
import 'src/directives/nodate';
import 'src/directives/loading';

// ajax
Vue.prototype.$ajax = tool.ajax ;

// 全局通信
Vue.prototype.$eventbus = new Vue();

// 全局对象
window.G = {
	// 配置信息
	CONFIG:config ,
	// 工具函数(时间函数等)
	TOOL:tool , 
	// 简易封装UI样式(alert等)
	UI:ui,  
	// 简易封装bridge
	BRIDGE:bridge , 
	// 链接bridge 
	CONNECT_BRIDGE:connect_bridge
};

// 挂载 ** 必须mixins否则子组件this.$root不指向app.vue ;
import _app from 'src/app';
G.APP = new Vue({
		    router,
			mixins:[_app],
			i18n,
		    el:'#app'
		});	

 


// 打开地址 --- http://localhost:4000/#/discoverList?token=e7a3f240-537f-49ee-a015-9ff56827bd32 ;





