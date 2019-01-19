;(function() {
    var config = {
        basePath: 'https://fast.yonyou.com/30years_service'
    };
    function souvenir(params) {
        this.basePath = params.basePath;
        this.xhr = null;
        this.file = null;
        this.commitTimer = null;
        this.userInfo = null;
        this.size = "";
        this.sizeDesc = "";
        this.code = this.getQueryString().code;
        this.hasComAuth = true;
        this.avatarUrl = "";
        this.rangeArr = [
            '0001AB1000000006AR1F', // 非自有-派遣人员-正式
            '0001UC100000000FCDCN', // 自有-复职考察
            '0001AB1000000006AR16', // 自有-正式
            '0001AB1000000006AR17', // 自有-试用
            '0001AB1000000006AR1G' // 非自有-派遣人员-试用
        ];
    }
    souvenir.prototype = {
        init: function() { // 初始化
            this.createAjax();
            if (this.code) {
                this.getUserInfo();
            } else {
                this.getBridgeCode()
            }
            this.events();
        },
        nodes: {
            $toash: $(".toast-msg"),
            $fileImage: $("#fileImage"),
            $loading: $(".loading-wrapper"),
            $submit: $(".btn-cmt"),
            $clothes: $(".clothes .size"),
            $sizeInput: $('.size .size-input'),
            $clear: $('.size .clear'),
            $avatar: $(".lf-logo")
        },
        createAjax: function() { // 初始化ajax
            this.xhr = window.XMLHttpRequest ?
                new XMLHttpRequest() :
                new ActiveXObject("Microsoft.XMLHTTP");
        },
        getQueryString: function() { // 获取地址栏参数
            var params = window.location.search.length > 0 ? window.location.search.substring(1) : "",
                itemsArr = params.length ? params.split("&") : [],
                item = [],
                args = {};
            itemsArr.forEach(function(val, key) {
                item = val.split("=");
                if(decodeURIComponent(item[0]).length) {
                    args[item[0]] = decodeURIComponent(item[1]);
                }
            })
            return args;
        },
        connectJSBridge: function (callback) { // 初始化jsbridge
            var _this = this;
            if (window.WebViewJavascriptBridge) {
                if (!_this.initBridge) {
                    _this.initBridge = true
                    window.WebViewJavascriptBridge.init(); // 页面中只能初始化一次，不可多次
                }
                callback(window.WebViewJavascriptBridge);
            } else {
                document.addEventListener('WebViewJavascriptBridgeReady', function () {
                    if (!_this.initBridge) {
                        _this.initBridge = true
                        window.WebViewJavascriptBridge.init();
                    }
                    callback(window.WebViewJavascriptBridge);
                }, false);
            }
        },
        getBridgeCode: function () { // 地址栏没有code时，jsbridge获取
            var _this = this;
            _this.connectJSBridge(function (ESNBridge) {
                var data = {
                    function: 'getAppCode',
                };
                ESNBridge.send(JSON.stringify(data), function (responseData) {
                    var data = JSON.parse(responseData);
                    if (data && data.error_code == 0) {
                        _this.code = data.data.code;
                        _this.getUserInfo();
                    } else {
                        _this.showToast("获取用户信息失败！");
                    }
                });
            });
        },
        ajax: function (params) { // 封装ajax
            var _this = this;
            var ContentTypeArr = [
                "application/json",
                "multipart/form-data",
                "application/x-www-form-urlencoded"
            ]; // 默认只处理3种类型

            var type = params.type && params.type.toLowerCase() || "get",
                data = params.data || null,
                contentType = params.contentType || "application/json",
                url = this.basePath + (params.url || "");
            
            if (data) {
                
                switch (ContentTypeArr.indexOf(contentType)) {
                    case 1: {
                        var formData = new FormData();
                        (function iteratorFormData(data) {
                            for (var property in data) {
                                if (data[property] instanceof Array) {
                                    iteratorFormData(data[property]);
                                } else {
                                    formData.append(property, data[property]);
                                }
                            }
                        })(data);
                        data = formData;
                        break;
                    }
                    case 2: {
                        var tmpArr = [];
                        for (var property in data) {
                            tmpArr.push(property, data[property]);
                        }
                        data = tmpArr.join("&");
                        break;
                    }
                    default: {// 默认json格式
                        data = JSON.stringify(data);
                        break;
                    }
                }
            }
            
            this.xhr.open(type, url, true);
            if(contentType !== 'multipart/form-data') {
                this.xhr.setRequestHeader("Content-type", contentType);
            }
            this.xhr.send(data);
            this.xhr.onreadystatechange = function () {
                if (_this.xhr.readyState === 4) {
                    if (_this.xhr.status === 200) {
                        params.success && params.success(JSON.parse(_this.xhr.responseText));
                    } else {
                        params.error && params.error(JSON.parse(_this.xhr.responseText));
                    }
                }
            };
            
            this.xhr.onerror = function () {
                params.error && params.error(_this.xhr.responseText);
            };
        },
        getUserInfo: function () { // 通过code获取用户信息
            var _this = this;
            if(_this.code) {
                this.ajax({
                    type: "get",
                    url: "/public/get_info?esncode=" + _this.code,
                    success: function(data) {
                        if( data.code == 0 ) { 
                            _this.userInfo = data && data.data || {};
                            // 实习生等不能参加！
                            if (_this.rangeArr.indexOf(_this.userInfo.PK_PSNCL) < 0) {
                                _this.showToast('非常抱歉，您不能参加此活动 。', 3000);
                                _this.nodes.$submit.addClass("submitted");
                                _this.hasComAuth = false;
                            } else {
                                // 是否已经提交
                                if (_this.userInfo.psn_info) {
                                    _this.userInfo.psn_info.imgUrl &&
                                        _this.backAvatar(_this.userInfo.psn_info.imgUrl);

                                    (_this.userInfo.psn_info.clothSize ||
                                        _this.userInfo.psn_info.ext1) &&
                                    _this.backSize(_this.userInfo.psn_info.clothSize, _this.userInfo.psn_info.ext1);

                                    // _this.userInfo.psn_info.imgUrl &&
                                    // (_this.userInfo.psn_info.clothSize ||
                                    // _this.userInfo.psn_info.ext1) &&
                                    // _this.nodes.$submit.text("已提交").addClass("submitted");
                                }
                            }
                        }else {
                            _this.showToast(data.msg || "获取用户信息失败！");
                        }
                    },
                    error: function(error) {
                        _this.showToast("网络错误，请稍后重试！");
                    }
                });
            }else {
                _this.showToast("获取用户信息失败！");
            }
        },
        backAvatar: function(url) {
            var _this = this;
            _this.avatarUrl = _this.basePath + "/download/30years/" + url;
            _this.nodes.$avatar.addClass("selected").css({
                "background-image": "url(" + _this.avatarUrl + ")"
            });
        },
        backSize: function(size, sizeExt) {
            var _this = this;
            size && _this.nodes.$clothes.children().forEach(function(item) {
                if($(item).text().toLocaleUpperCase() === size.toLocaleUpperCase()) {
                    $(item).addClass("selected");
                }
            });
            sizeExt && _this.nodes.$clothes.find('.size-input').val(sizeExt);
        },
        submit: function() { // 注册
            var _this = this;
            if (_this.code) {
                var formData = {
                    clothSize: _this.size,
                    height: "",
                    weight: "",
                    ext1: _this.sizeDesc // 备注
                };
                _this.file && (formData.headImg = _this.file);
                this.ajax({
                    type: "post",
                    url: "/upload/post_file?user=" + _this.userInfo.tys_user + "&expired=" + _this.userInfo.tys_expired + "&sign=" + _this.userInfo.tys_sign,
                    contentType: "multipart/form-data",
                    data: formData,
                    success: function(data) {
                        if(data.code == 0) {
                            _this.nodes.$loading.css("opacity", 0).addClass("hidden");
                            _this.showToast("提交成功！");
                            _this.nodes.$submit.text("已提交").addClass("submitted");
                        }else {
                            _this.nodes.$loading.css("opacity", 0).addClass("hidden");
                            _this.showToast(data && data.msg || "提交失败！");
                        }
                    },
                    error: function(error) {
                        _this.nodes.$loading.css("opacity", 0).addClass("hidden");
                        _this.showToast("提交失败！");       
                    }
                });       
            }else {
                _this.nodes.$loading.css("opacity", 0).addClass("hidden");
                _this.showToast("获取用户信息失败！");
            }
        },
        showToast: function(text, ts) { // 提示
            var _this = this;
            _this.nodes.$toash.html(text).removeClass("hidden").css("opacity", 1);
            setTimeout(function() {
                _this.nodes.$toash.html(text).css("opacity", 0).addClass("hidden");
            }, ts || 3000);
        },
        events: function() { // 事件
            var _this = this;
            // 文上上传
            _this.nodes.$fileImage[0].addEventListener("change", function(e) {
                e.target.files.length &&
                (_this.file = e.target.files[0]);

                if (_this.file.size < 614400) {
                    _this.showToast("文件大小不能小于600KB！");
                    _this.file = null;
                } else if(_this.file.type.indexOf("jpeg") < 0 && _this.file.type.indexOf("jpg") < 0) {
                    _this.showToast("图片格式必须为.jpg后缀！");
                    _this.file = null;
                } else {
                    // var freader = new FileReader();
                    // freader.readAsDataURL(_this.file);  
                    // freader.onload = function(e) {  
                    //     _this.nodes.$avatar.addClass("selected").css({
                    //         "background-image": "url(" + e.target.result + ")"
                    //     });
                    // };
                    _this.nodes.$loading.removeClass('hidden').css("opacity", 1).find(".text").text("正在上传...");
                    _this.ajax({
                        type: "post",
                        url: "/upload/post_file?user=" + _this.userInfo.tys_user + "&expired=" + _this.userInfo.tys_expired + "&sign=" + _this.userInfo.tys_sign,
                        contentType: "multipart/form-data",
                        data: {
                            headImg: _this.file
                        },
                        success: function (data) {
                            _this.nodes.$loading.css("opacity", 0).addClass("hidden");
                            if (data.code == 0) {
                                var imgUrl = _this.basePath + "/download/30years/" + data.data.imgUrl;

                                _this.nodes.$avatar.addClass("selected").css({
                                    "background-image": "url(" + imgUrl + ")"
                                });
                                
                                _this.nodes.$submit.text("提交").removeClass("submitted");                                
                            } else {
                                _this.showToast(data.msg || "图片上传失败！");
                            }
                        },
                        error: function (error) {
                            _this.nodes.$loading.css("opacity", 0).addClass("hidden");
                            _this.showToast("图片上传失败！");
                        }
                    });
                }
            });
            // 提交
            this.nodes.$submit[0].addEventListener("touchend", function(e) {
                _this.size = "";
                _this.sizeDesc = "";
                if(_this.nodes.$clothes.children('li.selected').length) {
                    _this.size = _this.nodes.$clothes.children('li.selected').text();
                    _this.sizeDesc = "";
                } else {
                    _this.sizeDesc = _this.nodes.$clothes.find('.size-input').val().trim();
                    _this.size = "";
                }

                if (!_this.hasComAuth) {
                    _this.showToast("非常抱歉，您不能参加此活动。", 3000);
                } else if ($(this).hasClass("submitted")) {
                    _this.showToast("您已经提交过了！");
                } else if (!_this.file && !_this.avatarUrl) {
                    _this.showToast("请先上传照片！");
                }else if(!_this.size && !_this.sizeDesc) {
                    _this.showToast("请选择服装尺码！");
                }else {
                    _this.nodes.$loading.removeClass('hidden').css("opacity", 1).find(".text").text("提交中...");
                    _this.commitTimer && clearTimeout(_this.commitTimer);
                    _this.commitTimer = setTimeout(function() { // 节流
                        _this.submit();
                    }, 2000);
                }
            });
            // 选择服装尺寸
            this.nodes.$clothes[0].addEventListener("touchend", function(e) {
                if(e.target.nodeName === 'LI') {
                    if($(e.target).hasClass('selected')) {
                        $(e.target).removeClass('selected');
                    }else {
                        $(e.target).addClass('selected').siblings().removeClass("selected");
                    }
                }else if (e.target.nodeName === 'INPUT') {
                    $(e.target).parent().siblings().removeClass("selected");
                }
                
                _this.nodes.$submit.text("提交").removeClass("submitted");
            });
            // 清空输入
            this.nodes.$clear[0].addEventListener("touchend", function(e) {
                _this.nodes.$clothes.find('.size-input').val("");
            });
            this.nodes.$sizeInput.focus(function (e) {
                $(this).siblings(".clear").removeClass("hidden");
            });
            this.nodes.$sizeInput.blur(function (e) {
                $(this).siblings(".clear").addClass("hidden");
            });
        }
    }
    new souvenir(config).init();
})();