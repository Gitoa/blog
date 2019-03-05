import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './app.vue';

const Routers = [
    {
        path: '/index',
        component: (resolve) => require(['./views/article_list.vue'], resolve)
    },
    {
        path: '/post/:id',
        component: (resolve) => require(['./views/article.vue'], resolve)
    },
    {
        path: '*',
        redirect: '/index'
    }
];

const RouterConfig = {
    routes: Routers
}

Vue.use(VueRouter);

const router = new VueRouter(RouterConfig);

new Vue({
    el: '#app',
    router: router,
    render: h => {
        return h(App)
    }
});