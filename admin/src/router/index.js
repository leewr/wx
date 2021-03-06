import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
let RouteList = [
  {
    path: '/',
    component: resolve => require(['@/views/layout/App.vue'], resolve),
    meta: {
      title: '首页',
      keepAlive: false,
    },
    children: [
      {
        path: '/',
        name: 'crawler',
        meta: {
          title: '爬虫文章管理',
          keepAlive: false
        },
        component: resolve => require(['@/views/broker/Index.vue'], resolve),
      },
      {
        path: 'crawler/:id',
        name: 'crawlerarticle',
        meta: {
          title: '爬虫文章管理',
          keepAlive: false
        },
        component: resolve => require(['@/views/broker/detail.vue'], resolve),
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '后台登录',
      keepAlive: false
    },
    components: {
      blank: resolve => require(['@/views/login/Login.vue'], resolve),
    }
  },

]


export default new Router({routes: RouteList})


