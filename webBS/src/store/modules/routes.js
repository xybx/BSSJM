/**
 * @description 路由拦截状态管理，目前两种模式：all模式与intelligence模式，其中partialRoutes是菜单暂未使用
 */
import Vue from 'vue'
import { asyncRoutes, constantRoutes, resetRouter } from '@/router'
import { getRouterList } from '@/api/router'
import { convertRouter, filterRoutes } from '@/utils/routes'
import { authentication, rolesControl} from '@/config'
import { isArray } from '@/utils/validate'

const state = () => ({
  routes: [],
  cachedRoutes: [],
  plantId: 0,
  pathone:'',
  pathtwo:''
})
const getters = {
  routes: (state) => state.routes,
  cachedRoutes: (state) => state.cachedRoutes,
  plantId:(state) => state.plantId,
  pathone:(state)=> state.pathone,
  pathtwo:(state)=> state.pathtwo
}
const mutations = {
  /**
   * @description 多模式设置路由
   * @param {*} state
   * @param {*} routes
   */
  setRoutes(state, routes) {
    state.routes = routes
  },
  /**
   * @description 设置缓存Name数组
   * @param {*} state
   * @param {*} routes
   */
  setCachedRoutes(state, routes) {
    state.cachedRoutes = routes
  },
  setPlantId(state,plantid){
    state.plantId = plantid
  },
  setPathOne(state,pathone){
    state.pathone = pathone
  },
  setPathTwo(state,pathtwo){
    state.pathtwo = pathtwo
  },
  /**
   * @description 修改Meta
   * @param {*} state
   * @param options
   */
  changeMenuMeta(state, options) {
    function handleRoutes(routes) {
      return routes.map((route) => {
        if (route.name === options.name) Object.assign(route.meta, options.meta)
        if (route.children && route.children.length)
          route.children = handleRoutes(route.children)
        return route
      })
    }

    state.routes = handleRoutes(state.routes)
  },
}
const actions = {
  /**
   * @description 多模式设置路由
   * @param {*} { commit }
   * @param mode
   * @returns
   */
  async setRoutes({ commit ,state}, mode = 'none') {
    // 默认前端路由
    let routes = [...asyncRoutes];
    // 设置游客路由关闭路由拦截(不需要可以删除)
    const control = mode === 'visit' ? false : rolesControl
    // 设置后端路由(不需要可以删除)
    if (authentication === 'all') {
      // let uid = sessionStorage.getItem('uid')
      // let res = await getRouterList({uid:uid})
      // const list = res.data
      // let arr = []
      // let hlist = res.data.filter(item=>{ return item.showMenuIndex === 3})
      // let slist = res.data.filter(item=>{ return item.showMenuIndex === 4})
      // let nlist = res.data.filter(item=>{ return item.showMenuIndex !== 3 && item.showMenuIndex !== 4})
      // if(hlist.length > 0){
      //   commit('setPathOne', hlist[0].path)
      //   hlist[0].children[0].meta.noClosable = true
      //   if(hlist[0].children.length == 1 && hlist[0].path == hlist[0].children[0].path){
      //     hlist[0].redirect = `${hlist[0].path}`
      //   }else{
      //     hlist[0].redirect = `${hlist[0].path}/${hlist[0].children[0].path}`
      //   }
      // }
      // if(slist.length > 0){
      //   commit('setPathTwo', slist[0].path)
      //   slist[0].children[0].meta.noClosable = true
      // }
      // arr = [...hlist,...slist,...nlist]
      // const list = arr
      const { data } = await getRouterList()
      if (!isArray(data))
        Vue.prototype.$baseMessage(
          '路由格式返回有误！',
          'error',
          false,
          'vab-hey-message-error'
        )
      if (data[data.length - 1].path !== '*')
        data.push({ path: '*', redirect: '/404', hidden: true })
        routes = convertRouter(data)
    }
    // 根据权限和rolesControl过滤路由
    const finallyRoutes = filterRoutes([...constantRoutes, ...routes], control)
    // 设置菜单所需路由
    commit('setRoutes', finallyRoutes)
    // 根据可访问路由重置Vue Router
    await resetRouter(finallyRoutes)
  },
  /**
   * @description 设置缓存Name数组
   * @param {*} { commit }
   * @param {*} routes
   */
  setCachedRoutes({ commit }, routes) {
    commit('setCachedRoutes', routes)
  },
  /**
   * @description 修改Route Meta
   * @param {*} { commit }
   * @param options
   */
  changeMenuMeta({ commit }, options = {}) {
    commit('changeMenuMeta', options)
  },
}
export default { state, getters, mutations, actions }
