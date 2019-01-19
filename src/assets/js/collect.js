var boolInit = false;
var isResume = false;
function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge)
    } else {
        document.addEventListener('WebViewJavascriptBridgeReady', function () {
            callback(WebViewJavascriptBridge)
        }, false)
    }
}

function GetQueryString(name){     
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); //定义正则表达式 
    var r = window.location.search.substr(1).match(reg);  
    if (r != null) return unescape(r[2]); 
    return null; 
}

var Ajax={
    get: function(url, fn) {
        // XMLHttpRequest对象用于在后台与服务器交换数据   
        var xhr = new XMLHttpRequest();            
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function() {
            // readyState == 4说明请求已完成
            if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) { 
            // 从服务器获得数据 
            fn.call(this, xhr.responseText);  
            }
        };
        xhr.send();
    },
    // datat应为'a=a1&b=b1'这种字符串格式，在jq里如果data为对象会自动将对象转成这种字符串格式
    post: function (url, data, fn) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        // 添加http头，发送信息至服务器时内容编码类型
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        var data = JSON.stringify(data);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
            fn.call(this, xhr.responseText);
            }
        };
        xhr.send(data);
    }
}

var language = {
    zh:{
        'error': '加载失败，请联系管理员查询原因',
        'success': '采集成功',
        'face_success': '恭喜您，人脸采集成功',
        'faced': '已经采集',
        'collected': '您已经采集过了呦(｡-_-｡)',
        'collect': '采集',
        'collectagain': '请重新采集人脸'
    },
    tw:{
        'error': '加載失敗，請聯系管理員查詢原因',
        'success': '采集成功',
        'face_success': '恭喜您，人臉采集成功',
        'faced': '已經采集',
        'collected': '您已經采集過了呦(｡-_-｡)',
        'collect': '采集',
        'collectagain': '請重新采集人臉'
    },
    en:{
        'error': 'Failed to load. Please contact Admin',
        'success': 'Collect successful',
        'face_success': 'Congratulations.  Face Info collected successfully',
        'faced': 'Collected',
        'collected': 'Your face Info has been collected',
        'collect': 'Collect',
        'collectagain': 'Collect again'
    }
}

function lang(str){
    var lang = GetQueryString('lang');
    if(lang == 'zh'){
        return language.zh[str];
    }
    else if(lang == 'tw'){
        return language.tw[str];
    }else{
        return language.en[str];
    }
}



window.onload = function() {
    //1.获取页面元素
    var bodyDocument = document.querySelector("body");
    //bodyDocument.style.display = "none";
    var imageHD = document.querySelector('#imageHD');
    var containerContent = document.querySelector(".container-content");
    var containerContentTop = document.querySelector(".container-content-top");
    var containerContentWord = document.querySelector('.container-content-bottom');
    var conferenceId = GetQueryString('conferenceId');
    var qzId = GetQueryString('qzId');
    var groupId;
    var token = window.sessionStorage.getItem('conferenceToken') || 'Qzp3m4ES38dLEFkJzVercUKakp0XYxFRXM5aBfViVcwzERu9s6tRMn/WCqqoA/6dOIab3WJtKMwzKjeHxU4R0QfG4fZO7HqGy5jFwCojABIPy5xkIp1PBVMhIR3oLJzVkFH4esQWyLWi5gFaaDif3g==';

    document.title = lang('collect');

    var config = {
        basePath: 'localhost' === window.location.hostname ?
        "http://123.103.9.204:6058" : 
        window.location.protocol + "//" + window.location.host 
    };

    Ajax.get(config.basePath + "/conference/rest/v1/conference/" + conferenceId + "/ai/face/setting/group",function(data){
        groupId = data;

        Ajax.get(config.basePath + '/conference/rest/v1/conference/ai/face/registration/status/' + data + '?token=' + token,function(res){
            //2.调用jsBridge访问人脸识别
            if(res == 'false'){
                connectWebViewJavascriptBridge(function (YonYouJSBridge) {
                    if (!boolInit) {
                        boolInit = true;
                        YonYouJSBridge.init(function (message, responseCallback) {});
                    }
                    var params = {
                        'function': 'faceRecog',
                        'parameters': {"isForSign":false,"groupId":groupId,"isForceRegister":false}
                    };
        
                    var configNavBar = function (title) {
                        var params = {
                            'function': 'configNavBar',
                            'parameters': {
                                'centerItems':[{'title': title}],
                                'rightItems':[]
                            }
                        };
                        YonYouJSBridge.send(JSON.stringify(params), function (rsData) {
                            var code = JSON.parse(rsData).data.error_code || "";
                            if(code === 4) {
                                alert(lang('error'));
                            }
                        });
                    }
                    
                    configNavBar(lang('collect'));
        
                    YonYouJSBridge.send(JSON.stringify(params), function (rsData) {
                        var code = JSON.parse(rsData).data.code || "";
                        bodyDocument.removeAttribute('style');
                        if (code === 1) {
                            Ajax.post(config.basePath + "/conference/rest/v1/conference/ai/face/registration/status?token=" + token,{
                                alreadyRegistration: true,
                                conferenceId: conferenceId,
                                groupId: groupId,
                                qzId: qzId
                            },function(res){
                            });
                            isResume = true;
                            configNavBar(lang('success'));
                            imageHD.src = "../activity/imgs/collect/success.png";
                            containerContentWord.innerHTML = lang('face_success');
                            containerContent.setAttribute("class","container-content-success");
                            containerContentTop.setAttribute("class","container-content-top-success");
                            containerContentWord.setAttribute("class","container-content-bottom-success");
                        } else if(code === 2) {
                            isResume = true;
                            configNavBar(lang('success'));
                            imageHD.src = "../activity/imgs/collect/collected.png";
                            containerContentWord.innerHTML = lang('collected');
                            containerContent.setAttribute("class","container-content-collected");
                            containerContentTop.setAttribute("class","container-content-top-collected");
                            containerContentWord.setAttribute("class","container-content-bottom-collected");
                        }
                    });
                    YonYouJSBridge.registerHandler("resume", function(responseCallback) {
                        if(!isResume){
                            isResume = true;
                            window.history.back();
                            // window.close();
                        }else{
                            // window.location.href = config.basePath + '/conference/app/index.html#/conferenceFirstPage'
                        }
                    });
                });
            }else{
               window.location.replace(config.basePath + '/conference/app/assets/activity/scan.html?token=' + token); 
            }
        })
    });
}

