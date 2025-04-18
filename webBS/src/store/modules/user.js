/**
 * @description 登录、获取用户信息、退出登录、清除token逻辑，不建议修改
 */
import Vue from 'vue'
import { getUserInfo, login, logout,getBack } from '@/api/user'
import { getToken, removeToken, setToken } from '@/utils/token'
import { resetRouter } from '@/router'
import { isArray, isString } from '@/utils/validate'
import { title, tokenName } from '@/config'
import http from '@/utils/request'

const state = () => ({
    token: getToken(),
    username: '游客',
    avatar: 'https://i.gtimg.cn/club/item/face/img/2/15922_100.gif',
    userData: {},
    // backData:{},
    level:null
    // showMenuIndex: 3
})
const getters = {
    token: (state) => state.token,
    username: (state) => state.username,
    avatar: (state) => state.avatar,
    userData: (state) => state.userData,
    // backData:(state) => state.backData,
    level:(state)=> state.level
    // showMenuIndex: (state) => state.showMenuIndex,
}
const mutations = {
    /**
     * @description 设置token
     * @param {*} state
     * @param {*} token
     */
    setToken(state, token) {
        state.token = token
        setToken(token)
    },
    /**
     * @description 设置用户名
     * @param {*} state
     * @param {*} username
     */
    setUsername(state, username) {
        state.username = username
    },
    /**
     * @description 设置头像
     * @param {*} state
     * @param {*} avatar
     */
    setAvatar(state, avatar) {
        state.avatar = avatar
    },
    setUserData(state, userData) {
        state.userData = userData
    },
    // setBackData(state, backData) {
    //   state.backData = backData
    // },
    setLevel(state, level){
      state.level = level
    }
}
const actions = {
    /**
     * @description 登录拦截放行时，设置虚拟角色
     * @param {*} { commit, dispatch }
     */
    setVirtualRoles({ commit, dispatch }) {
        dispatch('acl/setFull', true, { root: true })
        commit('setAvatar', 'https://i.gtimg.cn/club/item/face/img/2/15922_100.gif')
        commit('setUsername', 'admin(未开启登录拦截)')
    },
    // async getBack({commit},areaid){
    //   let params = areaid != '/' ?  {areaid} : {}
    //   if(areaid) sessionStorage.setItem('areaid',areaid)
    //   let res = await getBack(params)
    //   if(res.code == 200){
    //     commit('setBackData', res.data)
    //     commit('setLevel', res.data.level)
    //   }
    // },
    getToken({commit},token,level){
      commit('setLevel', level)
      sessionStorage.setItem('Maptoken',token)
      http.defaults.headers['Authorization'] = `${token}`
      if(token) {
        commit('setToken', token)
        const hour = new Date().getHours()
        const thisTime =
          hour < 8 ?
            '早上好' :
            hour <= 11 ?
              '上午好' :
              hour <= 13 ?
                '中午好' :
                hour < 18 ?
                  '下午好' :
                  '晚上好'
        Vue.prototype.$baseNotify(`欢迎登录${title}`, `${thisTime}！`)
      }else {
        const err = `未获取token`
        Vue.prototype.$baseMessage(err, 'error')
        throw err
      }
    },
    /**
     * @description 登录
     * @param {*} { commit }
     * @param {*} userInfo
     */
    async login({ commit }, userInfo) {
        const { data } = await login(userInfo)
        const token = data[tokenName]
        commit('setLevel', data.level)
        if (token) {
            commit('setToken', token)
            const hour = new Date().getHours()
            const thisTime =
                hour < 8 ?
                '早上好' :
                hour <= 11 ?
                '上午好' :
                hour <= 13 ?
                '中午好' :
                hour < 18 ?
                '下午好' :
                '晚上好'
            Vue.prototype.$baseNotify(`欢迎登录${title}`, `${thisTime}！`)
        } else {
            const err = `登录接口异常，未正确返回${tokenName}...`
            Vue.prototype.$baseMessage(err, 'error')
            throw err
        }
    },
    /**
     * @description 获取用户信息接口 这个接口非常非常重要，如果没有明确底层前逻辑禁止修改此方法，错误的修改可能造成整个框架无法正常使用
     * @param {*} { commit, dispatch, state }
     * @returns
     */
    async getUserInfo({ commit, dispatch }) {
        const { data } = await getUserInfo()
            /**
             * 检验返回数据是否正常，无对应参数，将使用默认用户名,头像,Roles和Ability
             * username {String}
             * avatar {String}
             * roles {List}
             * ability {List}
             */
        if (data.username && !isString(data.username)) {
            const err = '用户信息接口异常，请检查返回JSON格式是否正确'
            Vue.prototype.$baseMessage(err, 'error')
            throw err
        } else {
            // 如不使用username用户名,可删除以下代码
            if (data.username) commit('setUsername', data.username)
                // 如不使用avatar头像,可删除以下代码
            commit('setUserData', data)
            sessionStorage.setItem('uid', data.pid)
                // 如不使用roles权限控制,可删除以下代码
                // if (roles) dispatch('acl/setRole', roles, { root: true })
                // 如不使用ability权限控制,可删除以下代码
                // if (ability) dispatch('acl/setAbility', ability, { root: true })
        }
    },
    /**
     * @description 退出登录
     * @param {*} { dispatch }
     */
    async logout({ dispatch }) {
        await logout()
        localStorage.removeItem('showMenuIndex')
        // localStorage.removeItem('bdata')
        // sessionStorage.removeItem('areaid')
        await dispatch('resetAll')
    },
    /**
     * @description 重置token、roles、ability、router、tabsBar等
     * @param {*} { commit, dispatch }
     */
    async resetAll({ commit, dispatch }) {
        commit('setUsername', '游客')
        commit('setAvatar', 'https://i.gtimg.cn/club/item/face/img/2/15922_100.gif')
        commit('setUserData', {})
        // commit('setBackData', {})
        commit('setLevel', null)
        sessionStorage.removeItem('uid')
        commit('routes/setRoutes', [], { root: true })
        await dispatch('setToken', '')
        await dispatch('acl/setFull', false, { root: true })
        await dispatch('acl/setRole', [], { root: true })
        await dispatch('acl/setAbility', [], { root: true })
        await dispatch('tabs/delAllVisitedRoutes', [], { root: true })
        await resetRouter()
        removeToken()
    },
    /**
     * @description 设置token
     * @param {*} { commit }
     * @param {*} token
     */
    setToken({ commit }, token) {
        commit('setToken', token)
    },
    /**
     * @description 设置头像
     * @param {*} { commit }
     * @param {*} avatar
     */
    setAvatar({ commit }, avatar) {
        commit('setAvatar', avatar)
    },
    /**
     * @description 设置显示菜单
     * @param {*} { commit }
     * @param {*} showMenuIndex
     */
    // setShowMenuIndex({commit}, showMenuIndex) {
    //   commit('setShowMenuIndex', showMenuIndex)
    // }
}
export default { state, getters, mutations, actions }
