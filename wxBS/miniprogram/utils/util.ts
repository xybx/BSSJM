let uapp = getApp<IAppProps>()
import { getToken } from './request'
export const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

const formatNumber = (n: number) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}
// const numStr= (a:number, b:number) => {
//   return Math.floor(Math.random() * (b - a + 1) + a);
// }

// 全局提示信息
export const tips = (title:string, icon:any = 'none',mask:boolean=false,time:number=1000)=> {
  wx.showToast({
    title,
    icon,
    duration:time,
    mask:mask
  })
}
export const showModal = (error:string)=> {
  wx.showModal({
    title: '提示',
    content: error,
    showCancel: false,
  })
}

export const isnumber = (val:any) => {
  let patrn = /^[0-9]*$/
  if (patrn.exec(val) == null || val == "") {
    return false
  } else {
    return true
  }
}

export const photo = (count:number,mediaType:any)=> {
  return new Promise((resolve) => {
      wx.chooseMedia({
          count:count,
          mediaType:[mediaType], //['image','video'],
          sourceType: ['album', 'camera'],
          maxDuration: 20,
          sizeType:['original','compressed'],
          camera: 'back',
          success: (res:any) => {
              const tempFilePaths = res.tempFiles
              console.log(tempFilePaths);   
              let array:any = [] 
              for (let i = 0; i < tempFilePaths.length; i++) {
                uploadImg(tempFilePaths[i].tempFilePath).then(path => {   
                   array.push(path)     
                  if (array.length == tempFilePaths.length) {
                      resolve(array)
                  }
                })
              }
          }
      })
  })
}
//上传图片
export const uploadImg = (path:string) =>{    
  return new Promise((resolve,reject) => {
      wx.showLoading({
        title: '上传中...',
        mask: true
      })
      wx.uploadFile({
          url: `${uapp.globalData.baseUrl}/api/dbfile/fileupload`,
          filePath: path,
          name: 'file',
          formData:{
            // fileurl:path
          },
          header: {
            "Content-Type": "multipart/form-data",
            'Authorization':uapp.globalData.token
          },
          success: (res:any) => {
            console.log(res);
              let json = JSON.parse(res.data)
              //返回图片路径 发送请求
              if(json.code == 200){
                resolve(json.data)  
              }else{
                tips('部分图片失败','error',true,2000)
                reject('error')
              }
          }
      })
  })
}

export const getLogin= ()=>{
  wx.showLoading({
    title:'数据加载中...',
    mask:true
  })
 
  return new Promise((resolve , reject)=>{
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if(res.code){
          getToken('/api/miniProgram/login',{code:res.code}).then((res:any)=>{
              if(res.code == 200){
                uapp.globalData.openid = res.data.openid
                resolve('success')
                getToken('/api/publicUser/xcxlogin',{openid:res.data.openid}).then((json:any)=>{
                    if(json.code == 200){
                      uapp.globalData.token = json.data
                      resolve('success')
                    }else {
                      tips('获取Token失败','error',true,2000)
                      reject('error')
                    }
                 })
              }else {
                tips('获取openID失败','error',true,2000)
                reject('error')
              }  
          })
          // wx.request({
          //   url: `${uapp.globalData.baseUrl}/api/miniProgram/login`,
          //   method: "GET",
          //   data: {
          //     code:res.code,
          //   },
          //   success: function (r) {   
          //     let json:any = r.data   
          //     if(json.code == 200){
          //       uapp.globalData.openid = json.data.openid
          //       // uapp.globalData.session_key = json.data.session_key
          //       wx.request({
          //         url: `${uapp.globalData.baseUrl}/api/publicUser/xcxlogin`,
          //         method: "GET",
          //         data:{openid:json.data.openid},
          //         dataType:'json',
          //         success(res){
          //           let json:any = res.data
          //           if(res.statusCode == 200 && res.errMsg == 'request:ok'){
          //             uapp.globalData.token = json.data
          //             resolve(json)
          //           }else {
          //             reject('获取token失败')
          //           } 
          //         }
          //       })
          //       resolve(json)
          //     } else {
          //       reject('获取OpenId失败')
          //     }
          //   }
          // }) 
        }  
      },
    })
  })
}

export const getUserInfo = ()=>{
  return new Promise((resolve)=>{
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {  
              // 可以将 res 发送给后台解码出 unionId
              uapp.globalData.userData = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (uapp.userInfoReadyCallback) {
                uapp.userInfoReadyCallback(res)
              }
              resolve('success');
            }
          })
        }else{
          wx.authorize({
            scope: 'scope.userInfo',
            success () {
               wx.getUserInfo({
                success: res => {  
                  // 可以将 res 发送给后台解码出 unionId
                  uapp.globalData.userData = res.userInfo
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (uapp.userInfoReadyCallback) {
                    uapp.userInfoReadyCallback(res)
                  }
                }
              })
            }
          }) 
        }
        // 
      }
    })
  })
}

export const noAuthPower = ()=>{
  wx.showModal({
    title: '授权提醒',
    content: '未授权将无法使用小程序，请授权获取你的基本信息',
    cancelText:'取消',
    confirmText:"去授权"
  });
} 
export const versionUpdate = ()=>{
  const updateManager = wx.getUpdateManager()    
     updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
//             console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
              wx.showModal({
                  title: '更新提示',
                  content: '新版本已经准备好，是否重启应用？',
                  success(res) {
                      if (res.confirm) {
                          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                          updateManager.applyUpdate()
                      }
                  }
              })
     })
  
     updateManager.onUpdateFailed(function () {
            // 新版本下载失败
    })
}









