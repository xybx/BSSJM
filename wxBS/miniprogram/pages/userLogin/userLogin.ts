// pages/userLogin/userLogin.ts
const app = getApp<IAppProps>()
import { getAxios,postAxios} from "../../utils/request";
import {tips,showModal } from '../../utils/util'

// interface LoginProps{
//   cate:string|number,
//   uptype:string|number,
//   pname:string,
//   pphone:string,
//   repconten:string,
//   latitude:any,
//   longitude:any
// }

Component({
  data:{
    winWidth:<number>0,
    winHeight:<number>0,
    loginData:{},
    areaData:[],
    phonename:'获取手机号',
    showphone:false,
    showbtn:false
  },
  lifetimes:{
    attached(){
     this.getShowbtn()
    },
    ready(){

    },
  },
  pageLifetimes:{
    show: function () {

    },
    hide: function () {

    },
    resize: function () {

    },
   
  },
  methods:{
    onLoad:function () {
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
    getShowbtn(){
      if(app.globalData.utoken == ''){
         this.setData({
           showbtn:true
         })   
      }
    },
    goback(){
      wx.redirectTo({
        url:'../matter/matter'
      })
    },
    async getPhoneNumber(e:any){
      if(e.detail.errMsg == 'getPhoneNumber:fail user deny') {
        return
      } else {
        wx.showToast({
          title: '您已经同意授权登录',
        }) 
        let res:any = await getAxios('/api/miniProgram/getPhoneNumber',{code:e.detail.code})
        if(res.code == 200){
          tips('已成功获取手机号','success',true)
          this.setData({
            ['loginData.username']:res.data,
            showphone:true,
            phonename:'获取手机号'
          })  
        } else {
          tips('手机号获取失败','error',true)
          this.setData({
            ['loginData.username']:'',
            showphone:false,
            phonename:'再次获取'
          })  
        } 
      }
    },
    loginData(e:any){
      const obj = e.detail.value
      this.loginInfo(obj)
    },
    loginInfo(obj:any){
      let that = this
      let error:string = ''
      if (!obj.username || obj.username == ''){
        error = '请获取手机号'
      }else if (!obj.password || obj.password == ''){
        error = '请输入密码'
      }
      if(error != ''){
        showModal(error)
      }else {
        wx.showLoading({
          title:'登录中...',
          mask:true
        })
        let data:any = Object.assign({},obj,{openid:app.globalData.openid})
        postAxios('/user/LoginForMiniProgram',data).then((res:any)=>{
          if(res.code == 200){
            app.globalData.utoken = res.data.token
            wx.hideLoading()
            tips('登录成功','success',true,2000)
            setTimeout(()=>{
              that.getUserinfo()
              wx.redirectTo({
                url:'../userHome/userHome'
              })
            },1000)
          }else {
            wx.hideLoading()
            wx.showModal({
                title: '提示',
                content: res.msg,
                showCancel: false
            })
          }
        })
      }
    },
    async getUserinfo(){
      getAxios('/user/getuserbyopenid',{openid:app.globalData.openid}).then((res:any)=>{
        if(res.code == 200){
          console.log("用户信息",res);
          app.globalData.userData = res.data
          app.globalData.username = res.data.username
          app.globalData.userlevel = res.data.userlevel
          app.globalData.sitemanager = res.data.sitemanager
          wx.setStorage({
            key:"username",
            data:res.data.username
          })
        }else {
          tips('用户信息未获取','error',true,2000)
          app.globalData.userData = {}
          app.globalData.username = ''
          app.globalData.userlevel = 0
          app.globalData.sitemanager = 0
          wx.setStorage({
            key:"username",
            data:''
          })
        }
      })
    },
    bindareachange(e:any){
      let that = this
      let index = Number(e.detail.value)
      console.log(index);  
      let arr = that.data.cateData 
      that.setData({
        [`loginData.${e.currentTarget.id}`]:index,
        ['loginData.uptype']:arr[index].uptype,
        ['loginData.typeid']:arr[index].pid,
      })  
      console.log(that.data.loginData);
    },  
  }
})