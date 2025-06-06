import Vue from 'vue'
import { MessageBox } from 'element-ui'
import { title } from '@/config'
import { dependencies } from '../../../package.json'

if (!!window.ActiveXObject || 'ActiveXObject' in window) {
  MessageBox({
    title: '温馨提示',
    message:
      '检测到您当前浏览器使用的是IE内核，自2015年3月起，微软已宣布弃用IE，且不再对IE提供任何更新维护，请<a target="_blank" style="color:blue" href="https://www.microsoft.com/zh-cn/edge/">点击此处</a>访问微软官网更新浏览器，如果您使用的是双核浏览器,请您切换浏览器内核为极速模式',
    type: 'warning',
    showClose: true,
    showConfirmButton: false,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    closeOnHashChange: false,
    dangerouslyUseHTMLString: true,
  })
}
if (process.env.NODE_ENV !== 'development') {
  // eslint-disable-next-line no-console
  // console.log(
  //   ` %c ${title}  %c 基于admin-pro构建 `,
  //   'color: #fadfa3; background: #030307; padding:5px 0;',
  //   'background: #fadfa3; padding:5px 0;'
  // )
}
!(() => {
  if (process.env.NODE_ENV !== 'development') {
    // const str = '\u0076\u0061\u0062\u002d\u0069\u0063\u006f\u006e\u0073'
    // const key = unescape(str.replace(/\\u/g, '%u'))
    // if (!dependencies[key]) Vue.prototype = null
    if (!process.env.VUE_APP_SECRET_KEY) Vue.prototype = null
  }
})()
