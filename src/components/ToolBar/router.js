import Vue from 'vue';
import store from '@/store';
import Router from 'vue-router';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import home from './modules/home';
import demand from './modules/demand';
import contacts from './modules/contacts';
import dictionary from './modules/dictionary';
import doctor from './modules/doctor';
import patient from './modules/patient';
import orderManage from './modules/orderManage';
import evaluation from './modules/evaluation';
import feeSetting from './modules/feeSetting';
import pen from './modules/pen';
import contents from './modules/contents';
import organization from './modules/organization';
import entry from './modules/entry';
import hospitalDept from './modules/hospitalDept';
import feedback from './modules/feedback';
import statistics from './modules/statistics';
import hospital from './modules/hospital';
import live from './modules/live';

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)
const routes = [{
  path: '/login',
  name: 'login',
  component: resolve => require(['@/pages/login'], resolve)
  // () => import('@/pages/login')
},
{
  path: '/',
  redirect: '/login' // /main
},
{
  path: '/main',
  name: 'main',
  redirect: '/main/home',
  component: resolve => require(['@/components/Layout'], resolve),
  children: [
    home,
    demand,
    contacts,
    dictionary,
    doctor, //  医生管理
    patient, // 患者管理
    orderManage, // 订单管理
    feeSetting, //  费用设置
    evaluation, //  评价管理
    pen, // 数据图
    contents, //  内容管理
    organization, //  组织管理
    entry, // 词条管理
    hospitalDept, //  医科管理
    feedback, // 意见反馈
    statistics, // 数据统计
    hospital, //  医院管理
    live //  直播管理
  ]
}
]
// const routes = [{
//   path: '/login',
//   name: 'login',
//   component: () => import('@/pages/login')
// },
// {
//   path: '/',
//   redirect: '/login' // /main
// },
// {
//   path: '/main',
//   name: 'main',
//   redirect: '/main/home',
//   component: () => import('@/components/Layout'),
//   children: [
//     home,
//     demand,
//     contacts,
//     dictionary,
//     doctor, //  医生管理
//     patient, // 患者管理
//     orderManage, // 订单管理
//     feeSetting, //  费用设置
//     evaluation, //  评价管理
//     pen, // 数据图
//     contents, //  内容管理
//     organization, //  组织管理
//     entry, // 词条管理
//     feedback, // 意见反馈
//     statistics, // 数据统计
//     hospital //  医院管理
//   ]
// }
// ]

let router = new Router({
  routes: routes
})
// const originalPush = router.prototype.push
// router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }
router.beforeEach((to, from, next) => {
  store.commit('system/backGoMutation', false)
  if (to.path === '/login') {
    let charts = (localStorage.charts !== 'undfind' && localStorage.charts) ? JSON.parse(localStorage.charts) : {}
    window.localStorage.clear()
    window.sessionStorage.clear()
    localStorage.charts = JSON.stringify(charts)
    store.commit('user/clearUserInfoMutation')
  }
  NProgress.start()
  next()
})
router.afterEach(to => {
  // 完成路由后关闭loading
  NProgress.done()
  if (to.path !== '/login') {
    if (routes && routes.length > 0) {
      routes.map(item => {
        const { children } = item || {};
        if (children && children.length > 0) {
          children.map(childItem => {
            // @ts-ignore
            const { children } = childItem || {};
            if (children && children.length > 0) {
              const toPath = to.path.split('/');
              const toPathIndex = toPath[toPath.length - 1];
              const endIndex = children.findIndex(v => {
                const { path } = v || {}
                return path === toPathIndex
              })
              if (endIndex !== -1) {
                const { text } = children[endIndex];
                if (text) {
                  store.commit('system/backGoMutation', true)
                }
                store.commit('system/pathEndNameMutation', text)
              } else {
                store.commit('system/pathEndNameMutation', '')
              }
            }
          })
        }
      })
      // console.log(to.path, '完成路由后关闭loading', routes)
    }
    // console.log(to.path, '完成路由后关闭loading')
    store.commit('user/historyPathMutation', to.path)
  }
})
export default router
