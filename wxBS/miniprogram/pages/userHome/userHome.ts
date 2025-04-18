// pages/userHome/userHome.ts
const app = getApp<IAppProps>()
import { getAxios} from "../../utils/request";
// import {tips,showModal } from '../../utils/util'
interface userProps{
  name:string,
  img:string
}

Component({
  data:{
    winWidth:<number>0,
    winHeight:<number>0,
    padtop:<number>0,
    mTitle:<string>'淄博市公安局博山分局',
    username:<string>'',
    userData:<userProps[] | []>[],
    showpage:<boolean>false
    
  },
  lifetimes:{
    attached(){
     this.getNavData()
     this.getUserName()
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
      let that = this
      wx.getSystemInfo({
        success: (res) =>{
          that.setData({
            winWidth: res.windowWidth,
            winHeight: res.windowHeight,
            padtop:res.safeArea.top
          });
        },
      }) 

    },
    getUserName(){
      let that = this
      setTimeout(()=>{
        wx.getStorage({
          key: "username",
          success(res) {
            that.setData({
              username:res.data
            }) 
          }
        })
      },500) 
    },
    bindUserChange(){
      this.setData({
        showpage:true
      })
    },
    async getNavData() {
      let res: any = await getAxios('/user/xcxhomepage', {}, 1)
      if(res.code == 200){
        let arr: userProps[] = res.data;
        // let arr: userProps[] = [
        //     {img: '../../image/img0.png', name: '业务推送'},
        //     {img: '../../image/img1.png', name: '业务监督'},
        //     {img: '../../image/img5.png', name: '日常打卡'},
        //   ];
        this.setData({
          userData: arr
        })
      }else{
        await wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
      // let arr: userProps[] = [
      //   {img: '../../image/img0.png', name: '业务推送'},
      //   {img: '../../image/img1.png', name: '业务监督'},
      //   {img: '../../image/img5.png', name: '日常打卡'},
      // ]
      // this.setData({
      //   userData: arr
      // })
    },
    bindNavClick(e:any){
      let index:number =Number(e.currentTarget.id)
      let urr = ['../matterPushList/matterPushList','../matterdirect/matterdirect','../clockIn/clockIn']
      if(index == 3){
          // 获取用户设置校验是否同意订阅消息，如果没有的话弹窗提示同意订阅
        wx.getSetting({
          withSubscriptions: true,
          success(res: any) {
            if (!res.subscriptionsSetting.mainSwitch) {
              wx.showModal({
                title: '提示',
                content: '您还没有打开接收通知按钮，是否跳转设置？',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success(res) {
                        console.log(res.authSetting)
                      }
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }else{
              wx.requestSubscribeMessage({
                tmplIds: [app.globalData.tempId],
                success (res) {
                  console.log(res)
                  if(res[<string>app.globalData.tempId] == 'accept' || res[<string>app.globalData.tempId] == 'acceptWithAlert') {
                    wx.navigateTo({
                      url: urr[index - 1]
                    })
                  }else{
                    wx.showModal({
                      title: '提示',
                      content: '您未同意接收通知，是否跳转设置打开？',
                      success(res) {
                        if (res.confirm) {
                          wx.openSetting({
                            success(res) {
                              console.log(res.authSetting)
                            }
                          })
                        } else if (res.cancel) {
                          wx.navigateTo({
                            url: urr[index - 1]
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          }
        })
          // wx.getSetting({
          //   withSubscriptions: true,
          //   success(res: any) {
          //     if (!res.subscriptionsSetting.mainSwitch) {
          //       wx.showModal({
          //         title: '提示',
          //         content: '您还没有打开接收通知按钮，是否跳转设置？',
          //         success(res) {
          //           if (res.confirm) {
          //             wx.openSetting({
          //               success(res) {
          //                 console.log(res.authSetting)
          //               }
          //             })
          //           } else if (res.cancel) {
          //             console.log('用户点击取消')
          //           }
          //         }
          //       })
          //     } else {
          //       console.log(res.subscriptionsSetting)
          //       //校验是否允许app.globalData.tempId推送，如果没有的话弹窗提示同意订阅
          //       if (res.subscriptionsSetting.itemSettings[<string>app.globalData.tempId] == 'reject') {
          //         wx.requestSubscribeMessage({
          //           tmplIds: [app.globalData.tempId],
          //           success (res) {
          //             console.log(res)
          //             if(res[<string>app.globalData.tempId] == 'accept') {
          //               wx.navigateTo({
          //                 url: urr[index - 1]
          //               })
          //             }else{
          //               wx.showModal({
          //                 title: '提示',
          //                 content: '您未同意接收通知，是否跳转设置打开？',
          //                 success(res) {
          //                   if (res.confirm) {
          //                     wx.openSetting({
          //                       success(res) {
          //                         console.log(res.authSetting)
          //                       }
          //                     })
          //                   } else if (res.cancel) {
          //                     wx.navigateTo({
          //                       url: urr[index - 1]
          //                     })
          //                   }
          //                 }
          //               })
          //             }
          //             // wx.navigateTo({
          //             //   url:urr[index-1]
          //             // })
          //           }
          //         })
          //       }else{
          //         wx.navigateTo({
          //           url:urr[index-1]
          //         })
          //       }
          //     }
          //   }
          // })
      }else {
        wx.navigateTo({
          url:urr[index-1]
        })
      }
    },
    public(){
      let that = this
      wx.showModal({
        title: '提示',
        content: '你确定要切换公众端吗？',
        success(res){
          if (res.confirm) {
            wx.redirectTo({
              url:'../matter/matter'
            })
            app.globalData.utoken = ''
            app.globalData.userlevel = 0
            wx.clearStorage()
          } else if (res.cancel) {
            that.setData({
              showpage:false
            })
          }
        },
      })
    },
    logout(){
      let that = this
      wx.showModal({
        title: '提示',
        content: '你确定要退出登录吗？',
        success(res){
          if (res.confirm) {
            wx.redirectTo({
              url:'../userLogin/userLogin'
            })
            app.globalData.utoken = ''
            app.globalData.userlevel = 0
            wx.clearStorage()
          } else if (res.cancel) {
            that.setData({
              showpage:false
            })
          }
        },
      })
    },
    cancle(){
      this.setData({
        showpage:false
      })
    },


    
  }
})