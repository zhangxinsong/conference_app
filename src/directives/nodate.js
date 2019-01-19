import Vue from 'vue';

Vue.directive('nodata', {
    bind(el, binding, vnode) {
        let val = binding.value ;
        nodate_auto_append(el , val);
    },
    componentUpdated(el , binding,vnode){
        let val = binding.value ;
        nodate_auto_append(el , val);
    },
    unbind(el , binding,vnode){
        let it = getIt(el);
        if(it){
            el.removeChild(it)
        }       
    }
});

function nodate_auto_append(dom , val) {
    let src = require('assets/images/empty.png');
    let it = getIt( dom )
    if( val ){
        if(!it){
            let div = document.createElement('div');
                div.className="v-nodata-wrap";
            let style = dom.getAttribute('nodata-style') || '' ;
            let text  = dom.getAttribute('nodata-text')  || '暂无数据' ;
                div.innerHTML = `<div class="nodata" style="${style}">
                                    <img src="${src}"/>
                                    <p>${text}</p>
                                 </div>`;
                dom.appendChild( div );
        }
    }else {
        if(it){
            dom.removeChild( it );
        }
    }
}

function getIt( dom ){
    let children = dom.children ;
    for(let i=0 ; i<children.length ; i++){
        if(children[i].className.indexOf('v-nodata-wrap')>-1){
            return children[i]
        }
    }
    return false ;
}

