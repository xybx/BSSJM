// pages/greet/greet.ts
let intervalId:any
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth:<number>0,
    winHeight:<number>0,
    timer:<number>0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    wx.getSystemInfo({
      success: (res) =>{
        this.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          padtop:res.safeArea.top
        });
      },
    }) 
    this.countdown(5).then(() => {
      wx.redirectTo({
        url:'../matter/matter'
      })
    }).catch((error) => {
      console.error(error);
    });
    this.setData({
      timer:5
    })
  },

  // 使用Promise实现倒计时
  countdown(seconds:number) {
    let that = this
    return new Promise((resolve, reject) => {
      let remainingSeconds = seconds;
      intervalId = setInterval(() => {
        if (remainingSeconds === -1) {
          clearInterval(intervalId);
          resolve('success');
        } else {
          that.setData({
            timer:remainingSeconds
          })
          console.log("剩余时间：" + remainingSeconds + "秒");
          remainingSeconds--;
        }
      }, 1000);
    });
  },

  navClick(){
    clearInterval(intervalId);
    wx.redirectTo({
      url:'../matter/matter'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})