// pages/mview/mview.ts
interface ArrayProp{
  pid:number,
  title:string,
  content:string,
  images?:string
}

Component({
  /**
   * 组件的初始数据
   */
  data: {
    mTitle: <string>'公安业务码上办',
    listData:<ArrayProp[]|[]>[],
    targetUrl:<string>'http://isdapp.shandong.gov.cn/jmportal/asd2wm/down/downandroid.html',
    viewimg:<string>'',
    winWidth:<number>0,
    winHeight:<number>0,
    padtop:<number>0,
  },
  lifetimes:{
    attached(){
      this.getViewList()
    },
    ready(){},
  },

  /**
   * 组件的方法列表
   */
  methods: {
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
    handleLongPress(e:any){
      console.log(e);
    
    },

    getViewList(){
      let arr = [
        {pid:1,title:'方式一：',content:'长按保存二维码扫码下载爱山东APP，畅享更多便民服务!',images:'../../image/codeimg.png'},
        {pid:2,title:'方式二：',content:'点击复制链接，打开手机浏览器粘贴访问下载爱山东APP!',}
      ]

      this.setData({
        viewimg:'../../image/viewbg.png',
        listData:arr
      })
    },

    copyLink(){
      wx.setClipboardData({
        data: this.data.targetUrl,
        success: () => {
          wx.showToast({ title: '链接已复制' });
        }
      }); 
    },


  }
})