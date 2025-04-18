  let loadingIndex = 0
  let mapp = getApp<IAppProps>()
  // 加载动画
  const Loading = (is:boolean) => {
    if (is) {
      if (loadingIndex === 0) {
        wx.showLoading({
          title: '加载中'
        })
      }
      loadingIndex++
    } else {
      loadingIndex--
      if (loadingIndex === 0) {
        wx.hideLoading()
      }
    }
  }
    // 全局请求方法封装
  export const axiosToken = (url:string,type:any, data:object,tokenType?:number) =>{
    let  Authorization = tokenType == 1 ? mapp.globalData.utoken:mapp.globalData.token
    // let header = {}
    // if(type == 'POST' || type == 'post'){
    //   header = {
    //     'X-Access-Token':token,
    //     'content-type': 'application/json;charset=UTF-8',
    //   }
    // }else{
    //   header = {
    //     'X-Access-Token':token
    //   }
    // }
    return new Promise((resolve) => {
      Loading(true)
      wx.request({
        url: `${mapp.globalData.baseUrl}${url}`,
        method:type,
        data,
        dataType:'json',
        header: {
          'Authorization':Authorization // 默认值
        },
        // header,
        success(res) {
          if (res.statusCode == 200) {
              Loading(false)
              resolve(res.data)
          }
        },
        fail(e) {
          console.log('请求错误：', e)
        }
      })
    });
  }

  export const getAxios = (url:string, data:object,tokenType?:number) => {
    let  Authorization = tokenType == 1?mapp.globalData.utoken:mapp.globalData.token
    return new Promise((resolve) => {
      Loading(true)
      wx.request({
        url: `${mapp.globalData.baseUrl}${url}`,
        method: 'GET',
        data,
        dataType: 'json',
        header: {
          'Authorization':Authorization // 默认值
        },
        success(res) {
          if (res.statusCode == 200) {
            Loading(false)
            resolve(res.data)
          }
        },
        fail(e) {
          console.log('请求错误：', e)
        }
      })
    });
  }

  export const getJson = (url:string, data:object)=>{
    return new Promise((resolve) => {
      Loading(true)
      wx.request({
        url: `${url}`,
        method: 'GET',
        dataType: 'json',
        success(res) {
          if (res.statusCode == 200) {
            Loading(false)
            resolve(res.data)
          }
        },
        fail(e) {
          console.log('请求错误：', e)
        }
      })
    });
  }

  export const getToken = (url:string, data:object)=>{
    return new Promise((resolve) => {
      wx.request({
        url: `${mapp.globalData.baseUrl}${url}`,
        method: 'GET',
        data,
        dataType: 'json',
        success(res) {
          if (res.statusCode == 200 && res.errMsg == 'request:ok') {
            resolve(res.data)
          }
        },
        fail(e) {
          console.log('请求错误：', e)
        }
      })
    });
  }

  export const postAxios = (url:string, data:object,tokenType?:number) => {
  let  Authorization = tokenType == 1?mapp.globalData.utoken:mapp.globalData.token
    return new Promise((resolve) => {
      Loading(true)
      wx.request({
        url: `${mapp.globalData.baseUrl}${url}`,
        method: 'POST',
        data,
        dataType: 'json',
        header: {
          'Authorization':Authorization // 默认值
        },
        success(res) {
          if (res.statusCode == 200) {
            Loading(false)
            resolve(res.data)
          }
        },
        fail(e) {
          console.log('请求错误：', e)
        }
      })
    });
  }