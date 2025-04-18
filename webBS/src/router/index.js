/**
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，pro版只支持remixIcon图标，具体配置请查看vip群文档
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/vab/layouts'
import Home from '@/vab/Home/Home.vue'
import VabComLayout from '@/vab/layouts/VabLayoutCommon'
import VabRedLayout from '@/vab/layouts/VabLayoutRedHorizontal'
import VabComRedLayout from '@/vab/layouts/VabLayoutRedCommon'
/* 多级路由不需要缓存时可放开注释直接引入 用法component:VabEmptyLayout*/
/*import VabEmptyLayout from '@/vab/layouts/VabEmptyLayout'*/
import { publicPath, routerMode } from '@/config'
import { stringifyQuery, parseQuery } from "@/utils/query";
Vue.use(VueRouter)
export const constantRoutes = [{
        path: '/login',
        name: 'Login',
        component: () => import ('@/views/login/login'),
        hidden: true,
    },
   {
        path: '/home',
        name: 'Home',
        component: Home,
        hidden: true,
    },
    {
        path: '/403',
        name: '403',
        component: () =>
            import ('@/views/403'),
        hidden: true,
    },
    {
        path: '/404',
        name: '404',
        component: () =>
            import ('@/views/404'),
        hidden: true,
    },
    {
          path: '/',
          name: 'Root',
          component: Layout,
          redirect: '/home',
    },
    {
          path: '/analysis',
          name: 'Analysis',
          component: Layout,
          redirect: '/analysis',
          showMenuIndex: 1,
          children: [{
              path: '/analysis',
              name: 'Analysies',
              component: () => import ('@/views/Analysis/Analysis'),
              meta: { title: '三维可视化', icon: 'iconfont icon-zukuneiqiantubiao' },
              showMenuIndex: 1,
          }]
    },
]

export const asyncRoutes = [
      {
        path: '/eventManage',
        name: 'EventManage',
        component: VabComLayout,
        redirect: '/eventManage/taskwork',
        meta: { title: '事项上报管理', icon: 'iconfont icon-renwuguanli'},
        showMenuIndex: 2,
        children: [
            {
              path: 'taskwork',
              name: 'Taskwork',
              component: () => import ('@/views/Taskwork/taskwork'),
              meta: { title: '公众事项台账'},
              showMenuIndex: 2,
          },
          {
            path: 'tasktotal',
            name: 'Tasktotal',
            component: () => import ('@/views/Taskwork/tasktotal'),
            meta: { title: '数据统计分析'},
            hidden: true,
            showMenuIndex: 2,
          },
          {
            path: 'taskreport',
            name: 'Taskreport',
            component: () => import ('@/views/Taskwork/taskReport'),
            meta: { title: '事项上报统计'},
            showMenuIndex: 2,
          },
          {
            path: 'taskover',
            name: 'Taskover',
            component: () => import ('@/views/Taskwork/taskover'),
            meta: { title: '公众事项处理'},
            showMenuIndex: 2,
          },
          {
            path: 'taskverify',
            name: 'Taskverify',
            component: () => import ('@/views/Taskwork/taskverify'),
            meta: { title: '公众审核处理'},
            showMenuIndex: 2,
          }
        ]
      },
      {
            path: '/conventManage',
            name: 'ConventManage',
            component: VabComLayout,
            redirect: '/conventManage/phoneage',
            meta: { title: '便民服务管理', icon: 'iconfont icon-shequguanli'},
            showMenuIndex: 2,
            children: [
                {
                  path: 'phoneage',
                  name: 'Phoneage',
                  component: () => import ('@/views/conventage/phoneage'),
                  meta: { title: '便民电话管理'},
                  showMenuIndex: 2,
              },
              {
                path: 'guideage',
                name: 'Guideage',
                component: () => import ('@/views/conventage/guideage'),
                meta: { title: '办事指南管理'},
                showMenuIndex: 2,
              }
            ]
          },
          {
            path: '/recordstory',
            name: 'Recordstory',
            component: VabComLayout,
            redirect: '/recordstory',
            showMenuIndex: 2,
            children: [{
              path: '/recordstory',
              name: 'Recordstorys',
              component: () => import ('@/views/Records/RecordStory'),
              meta: { title: '打卡记录', icon: 'iconfont icon-gongzuorenwu' },
              showMenuIndex: 2,
            }]
          },
       {
            path: '*',
            redirect: '/404',
            hidden: true,
       },
]

const router = createRouter()

export function resetRouter(routes = constantRoutes) {
    router.matcher = createRouter(routes).matcher
}

function createRouter(routes = constantRoutes) {
    return new VueRouter({
        base: publicPath,
        mode: routerMode,
        scrollBehavior: () => ({
            y: 0,
        }),
        stringifyQuery: stringifyQuery, // 序列化query参数
        parseQuery: parseQuery, // 反序列化query参数
        routes: routes,
    })
}

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject)
        return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch((err) => err)
}
//动态添加路由警告解决方案
// router.$addRoutes = (params) => {
//   router.matcher = new Router({mode: routerMode}).matcher
//   router.addRoutes(params)
// }

export default router
