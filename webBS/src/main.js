import Vue from 'vue'
import App from './App'
import i18n from './i18n'
import store from './store'
import router from './router'
import '@/vab'
import '@/directive/dialogDrag'
import '../public/fonts/iconfont.css'
import '../public/fonts/iconfont'
import animated from 'animate.css'
import http from '@/utils/request'
import SlideVerify from 'vue-monoplasty-slide-verify'
import VueClipboard from 'vue-clipboard2'
import regular from './utils/dataDesensi'
import 'cesium/Widgets/widgets.css';
// fade/zoom 等
import 'element-ui/lib/theme-chalk/base.css';
import '@/utils/directives'

Vue.prototype.regular = regular
Vue.use(animated)
Vue.use(SlideVerify)
Vue.use(VueClipboard)
// import * as echarts from 'echarts'
const echarts = require('echarts')
Vue.config.productionTip = false
let urlShow = window.location.href
http.defaults.baseURL =
  urlShow.indexOf('172.20.46.73:9002') > -1 ? window.midApiURL : window.apiURL
Vue.prototype.$baseUrl =
  urlShow.indexOf('172.20.46.73:9002') > -1 ? window.midApiURL : window.apiURL
Vue.prototype.$fileURL = window.fileURL
Vue.prototype.$http = http
Vue.prototype.$accuracy = window.accuracy
Vue.prototype.$echarts = echarts
Vue.prototype.$tourServerUrl = window.tourServerUrl
new Vue({
  el: '#app',
  i18n,
  store,
  router,
  render: (h) => h(App),
})
