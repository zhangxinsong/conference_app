const AJAX = ( options={} )=>{
    var method      = options.type ? options.type.toUpperCase() : 'GET';
    var params      = options.params || {};   // 拼接地址
    var data        = options.data || {} ;    // formdata 数据
    var contentType = options.contentType ;
    var timeout     = options.timeout || 20000 ;
    var url         = options.url || '';
    
    var beforeSend = options.beforeSend || function(){} ;
    var success    = options.success || function(){} ;
    var error      = options.error   || function(){} ;

    var XHR = new window.XMLHttpRequest() || new window.ActiveXObject( "Microsoft.XMLHTTP" );
        // 设置必备信息
        XHR.withCredentials = true ;
        // 设置函数
        XHR.onreadystatechange = function() {
            if( XHR.readyState==4 ){
                if( XHR.status==200 ){
                    success( XHR.responseText );
                }else{
                    error(XHR);
                }
            }
        };
        // **** ajax 失败一律不反错
        XHR.onerror=function(e){
            console.error('XHR.onerror\n',e);
            error(e);
        };
        XHR.onabort=function(){
            console.error('XHR.onabort');
            error();
        };
        XHR.ontimeout=function(){
            console.error('XHR.ontimeout');
            error();
        };
        
    // 转译
    var U = str=>encodeURIComponent(str) ;


    // params拼接到url上
    var paramsArr=[];
    for( let key in params ){
        paramsArr.push(`${U(key)}=${U(params[key])}`)
    };
    if( paramsArr.length ){
        if( url.indexOf('?')==-1 ){
            url=`${url}?${paramsArr.join('&')}`;
        }else{
            url=`${url}&${paramsArr.join('&')}`;
        }
    };

    // 发送数据 ;
    if( method=='GET' ){
        // open 
        XHR.open( method , url, true);
        XHR.timeout = timeout ;
        // beforeSend
        beforeSend(XHR);
        // send
        XHR.send( null );
    }else{
        if( contentType=='json' ){
            XHR.open( method , url, true);
            XHR.timeout = timeout ;
            // setRequestHeader
            XHR.setRequestHeader("Content-Type", "application/json; charset=UTF-8"); 
            // beforeSend
            beforeSend(XHR);
            // send
            var sendStr = JSON.stringify(data) ;
            XHR.send( sendStr );
        }else{
            // open
            XHR.open( method , url, true);
            XHR.timeout = timeout ;
            // setRequestHeader
            XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8"); 
            // beforeSend
            beforeSend(XHR);
            // data格式化
            var dataArr = [];
            for( let key in data ){
                dataArr.push(`${U(key)}=${U(data[key])}`)
            };
            // send ;
            var sendStr = dataArr.join('&') ;
            XHR.send( sendStr );
        }
    };

// XHR.setRequestHeader('X-Requested-With','XMLHttpRequest');
    return XHR ;
};



import lang from 'src/languages';
import ui from 'g/ui';
import config from 'g/config';
import htmlDecode from 'g/tool/html-decode';
// 导出封装的ajax ;
export default function( opt ){
	// 特殊处理get请求 ;
	opt.type ? opt.type=opt.type.toUpperCase() : opt.type='GET';
	opt.type=='GET' ? opt.params=opt.data : null ;

	// loading
	var LD = opt.loading ? (new ui.loading()) : null ;  

    var url= `${config['host']}${opt.url}`;

	// 配置
	var options = {
		type : opt.type ,
		params: opt.params,
		data : opt.data,
		contentType: opt.contentType,
		timeout: opt.timeout ,
		url: url ,
		beforeSend:(xhr)=>{
			opt.beforeSend ? opt.beforeSend.bind(this,xhr) : null ;
            // loading
            LD && LD.open();
		} ,
		success: (responseText)=>{
			//全局替换XSS
            // try{
            //     responseText = JSON.parse( htmlDecode(responseText) );
            // }catch(e){
            //     console.error(`xss 过滤失败  --->  ${opt.url}\n`,e);
            // };
            opt.success && opt.success.call(this, responseText );
            // loading
            LD && LD.close();
		},
		error: (err)=>{
            opt.error && opt.error.call(this, err);
            // ui.say( '网络正在开小差');
			// loading 
			LD && LD.close();
		} 
	};
	// 返回XHR用于停止 ;
	return AJAX( options );
};
