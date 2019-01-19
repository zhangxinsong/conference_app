var init = false ;
const connect_bridge = function( callback ){
    if (window.WebViewJavascriptBridge) {
    	try{
    		if( !init ){
    			init=true ;
				WebViewJavascriptBridge.init(function(message, responseCallback) {});
    		}
    	}catch(e){}
        callback ? callback( WebViewJavascriptBridge ) : null ;
    } else {
        document.addEventListener('WebViewJavascriptBridgeReady', function() {
	    	try{
	    		if( !init ){
	    			init=true ;
					WebViewJavascriptBridge.init(function(message, responseCallback) {});
	    		}
	    	}catch(e){}
            callback ? callback( WebViewJavascriptBridge ) : null ;
        }, false);
    }
};
connect_bridge();

// 简易封装 ;
const bridge = {
	// 更改原生头部
	configNavBar( title , tintColor , bgcolor ){
		connect_bridge( bridge=>{
			var params = {
				function:'configNavBar',
				parameters:{
					centerItems: [{
						title: title
					}],
					rightItems:[],
					tintColor: tintColor||"#444444",
					backgroundColor: bgcolor||"#FFFFFF",
					statusBarStyle: 0,
					hideShadowImage: 1,
				}
			};
			params = JSON.stringify(params);
			bridge.send( params , function(res){});
		});
	},
	// 扫描二维码
	scanQRCode(){
		connect_bridge( bridge=>{
			var params = {
				function:'scanQRCode',
				parameters:{}
			};
			params = JSON.stringify(params);
			bridge.send( params , function(res){});
		});
		// G.CONNECT_BRIDGE( function(bridge){
		// 	// 注册事件
  //           bridge.registerHandler('scanQRCode_callback',function(res){
  //           	alert(1)
  //           	alert(res)
  //           });
		// 	var params = {
		// 		function:'scanQRCode',
		// 		parameters:{
		// 			type:0,
		// 			callback:'scanQRCode_callback'
		// 		}
		// 	};
		// 	params = JSON.stringify(params);
		// 	bridge.send( params , function(res){
		// 		alert(2)
		// 		alert(res)
		// 	});
		// });
	},
	// 获取accessToken ;
	getAccessToken( callback ){
		connect_bridge( bridge=>{
			var params = { 
				function: 'getToken'
			};
			params = JSON.stringify(params);
			bridge.send( params , function(res){ 
				res=JSON.parse(res);
				if(res.data&&res.data.token){
					callback && callback( res.data.token )
				}else{
					callback && callback('')
				}
			});
		});
	},
	// 验证版本支不支持 发言组件
	getAppVersion( callback ){
		connect_bridge( bridge=>{
			var params = {
				function:'getAppInfo'
			};
			params = JSON.stringify(params);
			bridge.send( params , function(res){
				var appData = JSON.parse(res);
                var infoArr = appData.data.vercode.split("-");
                var isNewVersion = false;
                infoArr.forEach(function(value){
                    if(value.split(".").length === 3){
                        if(value.substring(0,1) < 5) {
                            isNewVersion = false;
                        } else {
                            isNewVersion = true;
                        }
                        callback && callback(isNewVersion);
                    }
                })
			});
		})
	},
	// 评论组件
	commonReply( str , callback ){
		connect_bridge( bridge=>{
			this.getAppVersion( bool=>{
				if( !bool ){ G.UI.say( '版本太久' ); return };

	            var params = {
	                function: 'commonReply',
	                parameters: {
	                    rName: '',
	                    title: str ,
	                    qz_id: G.APP.userInfo.szId
	                }   
	            };
	            params = JSON.stringify(params);
	            bridge.send( params , function (res) {
	                callback(res)
	            });
			})
		});
	},
	// 预览图片
	viewImage( imagesArr , index ){
		connect_bridge( bridge=>{
		    var params = {
                function: "viewImage",
                parameters: {
                    files: imagesArr.join(','),
                    index: index
                }
            };
            params = JSON.stringify(params);
            bridge.send( params , function(res) {});
		});
	},
	// 预览文件
	previewFile( obj ){
		connect_bridge( bridge=>{
			let params = {
				function: "previewFile", 
				parameters: {
					...obj,
					qz_id: G.APP.userInfo.szId
				}
			};
            params = JSON.stringify(params);
            bridge.send( params , function(res) {});
		});
	},
	// 点击头像显示用户信息
	viewUser( mid ){
		connect_bridge( bridge=>{
			let params = {
                function: 'viewUser',
                parameters: {
                    member_id: mid
                }
			};
            params = JSON.stringify(params);
            bridge.send( params , function(res) {});
		});
	},
    // 选人组件
    selectContacts(obj,callback){
       !obj.select_list ? obj.select_list=[] : null ;
        obj.select_list.map( v=>{
			v.member_id = v.memberId ;
			v.name = v.userName ;
        });
    	connect_bridge( bridge=>{
   			let params = {
	            function: 'selectContacts',
	            parameters: {
 					...obj,
                    qzid: G.APP.userInfo.szId
	            }
			};
            params = JSON.stringify(params);
            bridge.send( params , function(res) { 
	            if (res) {
	                res = JSON.parse(res);
	                if (res.error_code == "0") {
	                    let list = res.data;
	                    	list.map(v=>{
	                    		v.memberId = v.member_id ;
	                    		v.userName = v.name ;
	                    	})
	                   	callback( list );
	                }else{
	                	G.UI.say('error_code!=0')
	                }	
	            }else{
	            	G.UI.say('no res')
	            }
            });
    	})
    },
    // 上传附件
    selectAttachment( type, maxl , callback){
    	connect_bridge( bridge=>{
      		let params = {
                function: "selectAttachment",
                parameters: {
                    "type": type ,
                    "maxselectnum": maxl
                }
			};
    		params = JSON.stringify(params);
            bridge.send( params , function(res) {
	            if (res) {
	                res = JSON.parse(res);
	                if (res.error_code == "0") {
	                	callback( res.data );
	                }else{
	                	G.UI.say('error_code!=0')
	                }	
	            }else{
	            	G.UI.say('没反res')
	            }
            });
    	})
    },
    // 打开新webview
    openWindow( url ){
    	connect_bridge( bridge=>{
      		let params = {
                function: "openWindow",
                parameters: {
                    "orientation": 1,
                    "url": url
                }
			};
            params = JSON.stringify(params);
            bridge.send( params , function(res) {});
    	})
    },
    // 关闭页面
    closeWindow(){
    	connect_bridge( bridge=>{
      		let params = {
                function: "closePage",
			};
            params = JSON.stringify(params);
            bridge.send( params , function(res) {});
    	})
    },
    //获取轻应用code
    getAppCode(){
    	connect_bridge( bridge=>{
      		let params = {
                function: "getAppCode",
			};
            params = JSON.stringify(params);
            bridge.send( params , function(res) {});
    	})
	},
	changeTitle(params = {}) {
		let centerItems = params.centerItems || {},
			rightItems = params.rightItems || {};
		connect_bridge(bridge => {
			let params = {
				function: 'configNavBar',
				parameters: {
					centerItems: [centerItems],
					rightItems: [rightItems]
				}
			};
			if (rightItems.call) {
				rightItems.callback = "callback";
				bridge.registerHandler(rightItems.callback, function (data, responseCallback) {
					rightItems.call();
				});
			}
			if (centerItems.call) {
				centerItems.callback = "callback";
				bridge.registerHandler(centerItems.callback, function (data, responseCallback) {
					centerItems.call();
				});
			}
			bridge.send(JSON.stringify(params), function (res) { });
		})
	}
}
export { connect_bridge , bridge };
