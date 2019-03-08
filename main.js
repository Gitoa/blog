import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './app.vue';
import header from './views/header.vue';
import Vuex from 'vuex';

Vue.use(Vuex);
Vue.use(VueRouter);

Vue.prototype.ajax = function(method='GET', url='', resolve, reject) {

}

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
        path: '/signin',
        component: (resolve) => require(['./views/login.vue'], resolve)
    },
    {
        path: '*',
        redirect: '/index'
    }
];

const RouterConfig = {
    mode: 'history',
    routes: Routers
}

const store = new Vuex.Store({
    state: {
        login: false,
        user: '',
        preUrl: ''
    },
    mutations: {
        setLogin(state, newLogin) {
            state.login = newLogin;
        },
        setUser(state, newUser) {
            state.user = newUser;
        },
        setPreUrl(state, url) {
            state.preUrl = url;
        }
    }
})

const router = new VueRouter(RouterConfig);

new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => {
        return h(App)
    }
});