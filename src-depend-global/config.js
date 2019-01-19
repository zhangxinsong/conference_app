
// 本地环境ajax地址写死 , 打包ajax地址自适应 ;
const host = location.protocol + '//' + location.host ;

const ConfigObj = {
	// 本地
	dev:{
		host: 'http://140.143.133.139:8080'
	},
	dev2:{
		host: 'https://ezone.esn.ren'
	},
	dev3:{
		host: 'https://ezone.yonyoucloud.com'
	},
	daily:{
		host: 'https://ezone-daily.yyuap.com'
	},
	// 打包
	'test':{
		host: host
	},
	'prev':{
		host : host
	},
	'build':{
		host : host
	}
}

const config = ConfigObj[ ENV ] ;

// // 当地址存在token 赋值给config ;
// var href  = window.location.href ;
// var token = href.match(/[^\w]token=([\w-]*)/) && href.match(/[^\w]token=([\w-]*)/)[1];
//     token ? config['token']=token : null ;

// console.warn('ENV =====> ');
// console.warn('config ======> ' + JSON.stringify(config));

export default config ;

