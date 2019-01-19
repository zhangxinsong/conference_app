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
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
            fn.call(this, xhr.responseText);
            }
        };
        xhr.send(data);
    }
}

window.onload = function() {
    //1.获取页面元素
    var conferenceId = GetQueryString('conferenceId');
    var face = document.querySelector('.collect');
    var radio = document.getElementsByName('isForceRegister');
    var isForceRegister = false;
    var groupId;

    var config = {
        basePath: 'localhost' === window.location.hostname ?
        "http://123.103.9.204:6058" : 
        window.location.protocol + "//" + window.location.host 
    };

    Ajax.get(config.basePath + "/conference/rest/v1/conference/" + conferenceId + "/ai/face/setting/group",function(data){
        groupId = data;
    });

    radio[0].onclick = function(){
        isForceRegister = true;
    }

    radio[1].onclick = function(){
        isForceRegister = false;
    }

    face.onclick = function(){
        connectWebViewJavascriptBridge(function (YonYouJSBridge) {
            if (!boolInit) {
                boolInit = true;
                YonYouJSBridge.init(function (message, responseCallback) {});
            }
            var params = {
                'function': 'faceRecog',
                'parameters': {"isForSign":false,"groupId":groupId,"isForceRegister":isForceRegister}
            };

            YonYouJSBridge.send(JSON.stringify(params), function (rsData) {
                var code = JSON.parse(rsData).data.code || "";
                if (code === 1) {
                    alert(code);
                } else if(code === 2) {
                    alert(code);
                }
            });
        });
    }
   
}