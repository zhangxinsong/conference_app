import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import routes from './routes';


const router =  new VueRouter({ 
    mode: 'hash',
    routes
});
// router.beforeEach((to_, from_, next) => {
// 	next();
// });

export default router ;