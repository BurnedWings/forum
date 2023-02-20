import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '数据展示', icon: 'dashboard' }
    }]
  },
  {
    path: '/user',
    component: Layout,
    meta: { title: '用户管理', icon: 'el-icon-user',permissions:1 },
    children: [
      {
        path: 'userStatus',
        name: 'UserStatus',
        component: () => import('@/views/user/userStatus'),
        meta: { title: '用户状态管理', icon: 'form' }
      },
      {
        path: 'systemMessage',
        name: 'systemMessage',
        component: () => import('@/views/user/systemMessage'),
        meta: { title: '公告推送', icon: 'el-icon-s-promotion' }
      }
    ]
  },
  {
    path: '/article',
    component: Layout,
    name: 'Article',
    meta: { title: '文章管理', icon: 'el-icon-notebook-1',permissions:2 },
    children: [
      {
        path: 'articleStatus',
        name: 'ArticleStatus',
        component: () => import('@/views/article/articleStatus'),
        meta: { title: '文章状态管理', icon: 'el-icon-document-checked',permissions:2 },
        children: [
          {
            path: 'audit',
            name: 'ArticleAudit',
            component: () => import('@/views/article/articleStatus/audit'),
            meta: { title: '文章审核', icon: 'el-icon-circle-check' }
          },
          {
            path: 'change',
            name: 'ArticleChange',
            component: () => import('@/views/article/articleStatus/changeStatus'),
            meta: { title: '修改状态', icon: 'el-icon-edit' }
          },
        ]
      },
      {
        path: 'articleType',
        name: 'ArticleType',
        component: () => import('@/views/article/articleType'),
        meta: { title: '文章分类管理', icon: 'el-icon-collection-tag'}
      },
      {
        path: 'report',
        name: 'report',
        component: () => import('@/views/article/articleReport'),
        meta: { title: '举报管理', icon: 'el-icon-document-remove',permissions:2 },
        children: [
          {
            path: 'articleReport',
            name: 'ArticleReport',
            component: () => import('@/views/article/articleReport/article'),
            meta: { title: '文章举报', icon: 'el-icon-s-release' }
          },
          {
            path: 'commentReport',
            name: 'ArticleCommentReport',
            component: () => import('@/views/article/articleReport/comment'),
            meta: { title: '评论举报', icon: 'el-icon-chat-line-square' }
          },
        ]
      }
    ]
  },
  {
    path: '/trend',
    component: Layout,
    name: 'Trend',
    meta: {
      title: '动态管理',
      icon: 'el-icon-camera',
      permissions:3
    },
    children: [
      {
        path: 'trendStatus',
        component: () => import('@/views/trend/trendStatus/index'), // Parent router-view
        name: 'trendStatus',
        meta: { title: '动态状态管理', icon: 'el-icon-document-checked',permissions:3 },
        children: [
          {
            path: 'audit',
            component: () => import('@/views/trend/trendStatus/audit'),
            name: 'TrendAudit',
            meta: { title: '动态审核', icon: 'el-icon-circle-check' }
          },
          {
            path: 'change',
            component: () => import('@/views/trend/trendStatus/changeStatus'),
            name: 'TrendChange',
            meta: { title: '修改状态', icon: 'el-icon-edit' }
          }
        ]
      },
      {
        path: 'trendReport',
        component: () => import('@/views/trend/trendReport'),
        name: 'TrendReport',
        meta: { title: '举报管理', icon: 'el-icon-document-remove',permissions:3 },
        children: [
          {
            path: 'aboutTrend',
            component: () => import('@/views/trend/trendReport/trend'),
            name: 'AboutTrend',
            meta: { title: '动态举报', icon: 'el-icon-s-release' }
          },
          {
            path: 'commentReport',
            component: () => import('@/views/trend/trendReport/comment'),
            name: 'TrendCommentReport',
            meta: { title: '评论举报', icon: 'el-icon-chat-line-square' }
          }
        ]
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    name: 'System',
    meta: {
      title: '前台信息管理',
      icon: 'el-icon-info',
      permissions:4
    },
    children: [
      {
        path: 'images',
        component: () => import('@/views/system/images'), // Parent router-view
        name: 'Images',
        meta: { title: '轮播图管理', icon: 'el-icon-picture' },
      },
      {
        path: 'recommend',
        component: () => import('@/views/system/recommend'),
        name: 'Recommend',
        meta: { title: '推荐管理', icon: 'el-icon-medal' }
      }
    ]
  },
  {
    path: '/permissions',
    component: Layout,
    redirect: '/admin',
    meta:{},
    children: [
      {
        path: 'admin',
        component: () => import('@/views/admin'), // Parent router-view
        name: 'admin',
        meta: { title: '权限管理', icon: 'el-icon-s-check',permissions:0},
      },
    ]
  },
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'http://localhost:8080/',
        meta: { title: '前台链接', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
