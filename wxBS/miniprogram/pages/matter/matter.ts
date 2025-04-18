// index.ts
// 获取应用实例
const app = getApp<IAppProps>()
//const util = require('../../utils/util.ts')
//const http = require('../../utils/request.ts')
import { getAxios } from '../../utils/request'
import {tips,getLogin,getUserInfo,versionUpdate} from '../../utils/util'

interface ArrayProp{
  pid:number,
  title:string,
  children:ListProp[] | []
}
interface ListProp {
  pid?:number,
  name?:string,
  phone?:number|string,
  images?:string
}

Component({
  data: {
    winWidth:<number>0,
    winHeight:<number>0,
    padtop:<number>0,
    mTitle:<String>'淄博市公安局博山分局',
    listData:<ArrayProp[]|[]>[],
    showfoot:<boolean>false
  },
  lifetimes:{
     attached(){ 
      getLogin().then(async ()=>{
        await getUserInfo()
      }).then(async ()=>{
        await this.getList()
      })
     },
    ready(){

    },
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {    
    },
    hide: function () {

     },
    resize: function () { 

    },
  },
  methods: {
    onLoad:function () {
      versionUpdate()
      wx.getSystemInfo({
        success: (res) =>{
          this.setData({
            winWidth: res.windowWidth,
            winHeight: res.windowHeight,
            padtop:res.safeArea.top
          });
        },
      })
    },
    async getList(){
      let res1:any = await getAxios(`/convenience/list`,{}) 
      // let res2:any = await getAxios(`/guidelines/list`,{}) 
      let arr:ArrayProp[] = [
        {pid:1,title:'我要留言',children:[
          {images:'../../image/mimg.png'}
        ]},
        {pid:2,title:'值班电话',children:res1.data.length > 0 ? res1.data.map((item:any)=>{
          return {
            name:item.desname,
            phone:item.phone
          }
        }):[]},
        // {pid:3,title:'办事指南',children:res2.data.length > 0 ? res2.data.map((item:any)=>{
        //   return {
        //     pid:item.pid,
        //     name:item.guidname
        //   }
        // }):[]}
      ]
      this.setData({
        listData:arr,
        showfoot:true
      })
    },
    bindUserClick(){
      let that = this
      //先去校验当前人员的权限
      wx.showLoading({
        title:'身份校验中...',
        mask:true,
      })
      setTimeout(async ()=>{
        let res:any = await getAxios('/user/LoginForMiniProgramByOpenid',{openid:app.globalData.openid})
        if(res.code == 200){
          wx.hideLoading()
          app.globalData.utoken = res.data
          tips('身份校验成功','success',true,1600) 
          setTimeout(()=>{
            that.getUserinfo()
            wx.redirectTo({
              url: '../userHome/userHome',
            })  
          },600)   
        }else{
          wx.hideLoading()
          app.globalData.utoken = '' 
          tips(res.msg,'none',true,1500)
          setTimeout(()=>{ 
            wx.redirectTo({
              url: '../userLogin/userLogin',
            })  
          },600)             
        }
      },1300)  
    },
    async getUserinfo(){
      getAxios('/user/getuserbyopenid',{openid:app.globalData.openid}).then((res:any)=>{
        if(res.code == 200){
          app.globalData.userData = res.data
          app.globalData.username = res.data.username
          app.globalData.userlevel = res.data.userlevel
          wx.setStorage({
            key:"username",
            data:res.data.username
          })
        }else {
          tips('用户信息未获取','error',true,1600)
          app.globalData.userData = {}
          app.globalData.username = ''
          app.globalData.userlevel = 0
          wx.setStorage({
            key:"username",
            data:''
          })
        }
      })
    },
    bindFillClick(){
      wx.navigateTo({
        url: '../madd/madd',
      })
    },
    // 事件处理函数
    bindoverClick(e:any) {
      let pid:number = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `../guide/guide?pid=${pid}`,
      })
    },
    bindPhoneClick(e:any){
      let phone:string = e.currentTarget.dataset.phone
      wx.makePhoneCall({
        phoneNumber:phone 
      })
    },
    getUserProfile() {
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log(res)
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    },
  },
})
