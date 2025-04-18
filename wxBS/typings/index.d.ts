/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo,
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}
// let axios = (n1:string,n2:string,n3:string,n4:string):void =>{
//   return callback()
// }


interface IAppProps extends IAppOption{
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo,
    uopenid?:string,
    tempId?:string,
    appid?:string,
    secret?:string,
    openid?:string,
    session_key?:string,
    userData?:string | any,
    userlevel?:number | string,
    sitemanager?:number | string,
    token?:any,
    utoken?:any,
    username?:string,
    baseUrl?:string,
    tk?:string
  },
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback, 
}