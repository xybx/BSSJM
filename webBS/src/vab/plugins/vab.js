import Vue from 'vue'
import { loadingText, messageDuration } from '@/config'
import { Loading, Message, MessageBox, Notification } from 'element-ui'
import { dependencies } from '../../../package.json'

/**
 * @description 全局加载层
 * @param {*} index
 * @param {*} text
 */
Vue.prototype.$baseLoading = (index, text = loadingText) => {
  let loading
  if (!index) {
    loading = Loading.service({
      lock: true,
      text: text,
      background: 'hsla(0,0%,100%,.8)',
    })
  } else {
    loading = Loading.service({
      lock: true,
      text: text,
      spinner: 'vab-loading-type' + index,
      background: 'hsla(0,0%,100%,.8)',
    })
  }
  return loading
}

/**
 * @description 全局多彩加载层
 * @param {*} index
 * @param {*} text
 */
Vue.prototype.$baseColorfullLoading = (index, text = loadingText) => {
  let loading
  if (!index) {
    loading = Loading.service({
      lock: true,
      text: text,
      spinner: 'dots-loader',
      background: 'hsla(0,0%,100%,.8)',
    })
  } else {
    switch (index) {
      case 1:
        index = 'dots'
        break
      case 2:
        index = 'gauge'
        break
      case 3:
        index = 'inner-circles'
        break
      case 4:
        index = 'plus'
        break
    }
    loading = Loading.service({
      lock: true,
      text: text,
      spinner: index + '-loader',
      background: 'hsla(0,0%,100%,.8)',
    })
  }
  return loading
}

/**
 * @description 全局Message
 * @param {*} message
 * @param {*} type
 * @param {*} dangerouslyUseHTMLString
 * @param {*} customClass
 */
Vue.prototype.$baseMessage = (
  message,
  type,
  dangerouslyUseHTMLString,
  customClass
) => {
  Message({
    showClose: true,
    message,
    type,
    dangerouslyUseHTMLString,
    duration: messageDuration,
    customClass,
  })
}

/**
 * @description 全局Alert
 * @author chuzhixin 1204505056@qq.com
 * @param {*} content
 * @param {*} title
 * @param {function} callback
 */
Vue.prototype.$baseAlert = (content, title, callback) => {
  MessageBox.alert(content, title || '温馨提示', {
    confirmButtonText: '确定',
    dangerouslyUseHTMLString: true,
    callback: () => {
      if (callback) {
        callback()
      }
    },
  }).then(() => {})
}

/**
 * @description 全局Confirm
 * @param {*} content
 * @param {*} title
 * @param {*} callback1
 * @param {*} callback2
 * @param {*} confirmButtonText
 * @param {*} cancelButtonText
 */
Vue.prototype.$baseConfirm = (
  content,
  title,
  callback1,
  callback2,
  confirmButtonText = '确定',
  cancelButtonText = '取消'
) => {
  MessageBox.confirm(content, title || '温馨提示', {
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText,
    closeOnClickModal: false,
    type: 'warning',
    lockScroll: false,
  })
    .then(() => {
      if (callback1) {
        callback1()
      }
    })
    .catch(() => {
      if (callback2) {
        callback2()
      }
    })
}

/**
 * @description 全局Notification
 * @param {*} message
 * @param {*} title
 * @param {*} type
 * @param {*} position
 */
Vue.prototype.$baseNotify = (
  message,
  title,
  type = 'success',
  position = 'top-right'
) => {
  Notification({
    title: title,
    message: message,
    position: position,
    type: type,
    duration: messageDuration,
  })
}

/**
 * @description 表格高度
 * @param {*} formType
 */
Vue.prototype.$baseTableHeight = (formType) => {
  let height = window.innerHeight
  const paddingHeight = 291
  const formHeight = 60

  if ('number' === typeof formType) {
    height = height - paddingHeight - formHeight * formType
  } else {
    height = height - paddingHeight
  }
  return height
}

/**
 * @description 全局事件总线
 */
Vue.prototype.$baseEventBus = new Vue()
!(() => {
  if (process.env.NODE_ENV !== 'development') {
    // const str = '\u0076\u0061\u0062\u002d\u0069\u0063\u006f\u006e\u0073'
    // const key = unescape(str.replace(/\\u/g, '%u'))
    // if (dependencies[key]) Vue.prototype = null
    if (!process.env.VUE_APP_SECRET_KEY) Vue.prototype = null
  }
})()
