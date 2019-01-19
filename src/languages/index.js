export default{
	getLang(){
		var env = null ;
		var lan = navigator.language || navigator.browserLanguage ; 
			lan = lan.toLocaleLowerCase();
		var splt = lan.split('-')[0];
		if( splt == 'zh' ){
			if( lan.indexOf('tw') > -1 || lan.indexOf('hk') > -1 || lan.indexOf('sg') > -1 ){
				env = 'tw';
			}else{
				env = 'zh';
			}
		}else{
			env = 'en';
		}
		// 2 从端上youZoneLanguage中取 ;
		var ua = navigator.userAgent ;
		var uaLanguage = ua.match(/youZoneLanguage=(\w*)/);
		if( uaLanguage && uaLanguage[1] ){
			env = uaLanguage[1] ;
		}
		return env;
	}
}