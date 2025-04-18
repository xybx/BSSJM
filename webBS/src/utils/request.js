import Vue from 'vue'
import axios from 'axios'
import {
    // baseURL,
    contentType,
    debounce,
    messageName,
    requestCount,
    delayTime,
    requestTimeout,
    statusName,
    successCode,
    /* tokenName, */
} from '@/config'
import store from '@/store'
import qs from 'qs'
import router from '@/router'
import { isArray } from '@/utils/validate'
import { checkNeed } from '@/vab/plugins/errorLog'

let loadingInstance
// 操作正常Code数组
const codeVerificationArray = isArray(successCode) ? [...successCode] : [...[successCode]]

const CODE_MESSAGE = {
    200: '服务器成功返回请求数据',
    201: '新建或修改数据成功',
    202: '一个请求已经进入后台排队(异步任务)',
    204: '删除数据成功',
    400: '发出信息有误',
    401: '用户没有权限(令牌、用户名、密码错误)',
    403: '用户得到授权，但是访问是被禁止的',
    404: '访问资源不存在',
    406: '请求格式不可得',
    410: '请求资源被永久删除，且不会被看到',
    500: '服务器发生错误',
    502: '网关错误',
    503: '服务不可用，服务器暂时过载或维护',
    504: '网关超时',
}

const handleData = ({ config, data, status, statusText }) => {
    if (loadingInstance) loadingInstance.close()
        // 若data.code存在，覆盖默认code
    let code = data && data[statusName] ? data[statusName] : status
        // 若code属于操作正常code，则status修改为200
    if (codeVerificationArray.indexOf(data[statusName]) + 1) code = 200
    switch (code) {
        case 200:
            // 业务层级错误处理，以下是假定restful有一套统一输出格式(指不管成功与否都有相应的数据格式)情况下进行处理
            // 例如响应内容：
            // 错误内容：{ status: 1, msg: '非法参数' }
            // 正确内容：{ status: 200, data: {  }, msg: '操作正常' }
            // 修改返回内容为 `data` 内容，对于绝大多数场景已经无须再关心业务状态码(code)和消息(msg)
            // 或者依然保持完整的格式
            return data
                // return data.data ? { ...data.data, code} : data
        case 201:
            return data
        case 401:
            store
                .dispatch('user/resetAll')
                .then(() =>
                    router.push({ path: '/login', replace: true }).then(() => {})
                )
            break
        case 403:
            store
                .dispatch('user/resetAll')
                .then(() =>
                    router.push({ path: '/login', replace: true }).then(() => {})
                )
            break
    }
    // 异常处理
    // 若data.msg存在，覆盖默认提醒消息
    // const message = `${config.url} 后端接口 ${code} 异常：${
    //   !data
    //     ? CODE_MESSAGE[code]
    //     : !data[messageName]
    //     ? statusText
    //     : data[messageName]
    // }`
    const message = `${data[messageName]}`
    Vue.prototype.$baseMessage(message, 'error', false, 'vab-hey-message-error')
    if (checkNeed())
        store
        .dispatch('errorLog/addErrorLog', {
            err: new Error(message),
            vm: null,
            info: message,
            url: config.url,
        })
        .then(() => {})
    return Promise.reject(message)
}

/**
 * @description axios初始化
 */
const instance = axios.create({
    // baseURL,
    timeout: requestTimeout,
    retry:requestCount,
    retryDelay:delayTime,
    headers: {
        'Content-Type': contentType,
    },
})

/**
 * @description axios请求拦截器
 */
instance.interceptors.request.use(
    (config) => {
        const token = store.getters['user/token']

        // 不规范写法 可根据setting.config.js tokenName配置随意自定义headers
        // if (token) config.headers[tokenName] = token

        // 规范写法 不可随意自定义
        if (token) config.headers['Authorization'] = `${token}`
        if (
            config.data &&
            config.headers['Content-Type'] ===
            'application/x-www-form-urlencoded;charset=UTF-8'
        )

            config.data = qs.stringify(config.data)
        if (debounce.some((item) => config.url.includes(item)))
            loadingInstance = Vue.prototype.$baseLoading()
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

/**
 * @description axios响应拦截器
 */
instance.interceptors.response.use(
    (response) => handleData(response),
    (error) => {
        const { response } = error
        if (response === undefined) {
            Vue.prototype.$baseMessage(
                '网络异常，请检查远程网络设置',
                'error'
            )
            return {}
        } else return handleData(response)
      //超时处理
      var config = error.config;
      if (!config || !config.retry) return Promise.reject(error);
      // 设置用于跟踪重试次数的变量
      config.__retryCount = config.__retryCount || 0;
      // 检查我们是否已将重试总数最大化
      if (config.__retryCount >= config.retry) {
        // 错误拒绝
        return Promise.reject(error);
      }
      // 增加重试次数
      config.__retryCount += 1;
      // 创造新的承诺来处理指数退避
      var backoff = new Promise(function (resolve) {
        setTimeout(function () {
          resolve();
        }, config.retryDelay || 1);
      });
      // 返回承诺，其中将撤回axios以重试请求
      return backoff.then(function () {
        return Axios(config);
      });
    }
)
export default instance
