import Vue from 'vue';

Vue.directive('loading', {
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
    let it = getIt( dom )
    if(val){
        if(!it){
            let div = document.createElement('div');
                div.className="v-loading-wrap";
            let style = dom.getAttribute('loading-style') || '' ;

                div.innerHTML = `<div class="loading" style="${style}">
                                    <span class="icon-spinner2"></span>
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
        if(children[i].className.indexOf('v-loading-wrap')>-1){
            return children[i]
        }
    }
    return false ;
}