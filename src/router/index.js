import Vue from 'vue'
import VueRouter from 'vue-router'
import Cookies from 'js-cookie' // 导入 js-cookie 库
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    {
      path: '/login',
      component: () => import('@/views/login/login.vue') // 登录页面
    },
    {
      path: '/layout',
      component: () => import('@/views/layout/index.vue'), // 布局页面
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          component: () => import('@/views/layout/welcome.vue') // 欢迎页面
        },
        {
          path: '/banner',
          component: () => import('@/views/home/banner.vue') // 轮播图管理
        },
        {
          path: '/PopularSkitsList',
          component: () => import('@/views/home/PopularSkitsList.vue') // 热门短剧列表
        },
        {
          path: '/NewlyLaunchedSkitsList',
          component: () => import('@/views/home/NewlyLaunchedSkitsList.vue') // 新上线短剧列表
        },
        {
          path: '/RecommendedSkitsList',
          component: () => import('@/views/home/RecommendedSkitsList.vue') // 今日推荐短剧列表
        },
        {
          path: '/userlist',
          component: () => import('@/views/user/userlist.vue') // 用户列表
        },
        // {
        //   path: '/usercomments',
        //   component: () => import('@/views/user/usercomments.vue') // 用户留言列表
        // },
        {
          path: '/analytics',
          component: () => import('@/views/analytics/analytics.vue') // 数据分析
        },
        {
          path: '/articles',
          component: () => import('@/views/articles/articles.vue') // 软文管理
        },
        {
          path: '/videoadd',
          component: () => import('@/views/vedio/videoadd.vue') // 视频添加
        },
        {
          path: '/videolist',
          component: () => import('@/views/vedio/videolist.vue') // 视频列表
        },
        {
          path: '/permissions',
          component: () => import('@/views/permissions/permissions.vue') // 权限管理
        }
      ]
    }
  ]
})

// 添加路由拦截
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!Cookies.get('token') // 检查用户是否登录，token存储在 Cookie 中

  if (to.path !== '/login' && !isAuthenticated) {
    // 如果用户未登录且试图访问非登录页面，重定向到登录页面
    next('/login')
  } else {
    next() // 继续导航
  }
})

export default router
