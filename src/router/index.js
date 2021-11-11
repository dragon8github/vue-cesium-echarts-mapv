import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

// Home
const Home = r => require.ensure([], () => r(require('@/views/Home.vue')), 'Home')

// 路由配置
var router = new Router({
  // 哈希模式
  mode: 'hash',
  
  // 路由导航
  routes: [
    // 重定向 - 首页
    { path: '/', redirect: '/Home' },

    // 首页
    { path: '/Home', name: 'Home', meta: { title: '首页' }, component: Home },
  ]
})

// 全局路由钩子
router.afterEach((to, from) => {

})

router.beforeEach((to, from, next) => {
    // 放行页面
    next()
})

export default router