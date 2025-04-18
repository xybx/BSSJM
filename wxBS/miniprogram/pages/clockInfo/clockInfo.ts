// index.ts
// 获取应用实例
import {getAxios} from "../../utils/request";

let app = getApp<IAppProps>()

interface FormProps {
    signtime: string, //打卡时间
    signaddress: string, //打卡地址
    signimage:string, //打卡图片
    longitude:number, //经度
    latitude:number, //纬度
    content:string, //打卡内容
    typename:string, //打卡类型
    officename: string, //部门名称
    name: string, //姓名
    phonenum: string, //手机号
    imageList: any[],
}

Component({
  data: {
    winWidth: <number>0,
    winHeight: <number>0,
    padtop: <number>0,
    mTitle: <string>'打卡详情',
    guideInfo: <any>{},
    clockPid: <number>0,
    lastPage: <string>'../madd/madd',
    ndata: <string[]>['实名', '匿名'],
    inputData: <FormProps>{
      signtime: '', //打卡时间
      signaddress: '', //打卡地址
      signimage:'', //打卡图片
      longitude:0, //经度
      latitude:0, //纬度
      content:'', //打卡内容
      typename:'', //打卡类型
      officename: '', //部门名称
      name: '', //姓名
      phonenum: '', //手机号
      imageList: [],
    },
    imgurl: <string>'',
    globletoken: <string>'',
    showview:<boolean>true,
    tMarkers:<any[]>[],
  },
  lifetimes: {
    attached() {
    },
    ready() {

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
    onLoad: function (options: { pid: number; }) {
      wx.getSystemInfo({
        success: (res) =>{
          this.setData({
            winWidth: res.windowWidth,
            winHeight: res.windowHeight,
            padtop:res.safeArea.top
          });
        },
      })
      this.setData({
        clockPid: options.pid,
        imgurl: app.globalData.baseUrl + '/gridfs/artworkmaster/',
        globletoken: '?token=' + app.globalData.token
      })
      this.getClock();
    },
    async getClock() {
      let res: any = await getAxios(`/mpolicesign/byid?pid=${this.data.clockPid}`, {},1)
      console.log(res)
      //如果返回的信息中的content不为空，需要给img标签添加样式
      if (res.code == 200) {
        //  设置inputData的值
        this.setData({
          inputData: <any>{
            signtime:res.data.signtime,
            signaddress: res.data.signaddress,
            longitude:res.data.longitude,
            latitude:res.data.latitude,
            typename:res.data.typename,
            content: res.data.content,
            imageList: (res.data.signimage == '' || res.data.signimage == null) ? [] : res.data.signimage.split(','),
          },
        })
        let allMarkers:any[] = []
        console.log(this.data.inputData)
        let marker = {
          id: 1,
          //将坐标转成数值类型
          latitude: this.data.inputData.latitude,
          longitude: this.data.inputData.longitude,
          iconPath: '../../image/marker.png',
          width: 40,
          height: 40,
          callout: {
            // 点击marker展示title
            content: '',
            display: 'ALWAYS',
            fontSize: 18,
            padding: 5,
            borderRadius: 5,
            anchorY: 100
          }
        }
        allMarkers.push(marker)
        this.setData({
          tMarkers:allMarkers
        })
        this.getUserInfo()
      }
    },

    //获取登录的用户信息
    async getUserInfo() {
      let res: any = await getAxios('/user/userinfo', {},1)
      console.log(res)
      if (res.code == 200) {
         this.setData({
             ['inputData.officename']: res.data.officename,
             ['inputData.name']: res.data.username,
             ['inputData.phonenum']: res.data.phonenum,
          })
        }
      // this.setData({
      //       inputData:<any>{
      //           officename: res.data.officename,
      //           name: res.data.username,
      //           phonenum: res.data.phonenum
      //       }
      //     })
    },

    previewImg(e:any){
      let that = this
      let index = e.currentTarget.dataset.index;
      let imgArr = that.data.inputData.imageList;
      let urlArr = [];
      for (let i = 0; i < imgArr.length; i++) {
        urlArr.push(that.data.imgurl + imgArr[i]+that.data.globletoken)
      }
      wx.previewImage({
        current: that.data.imgurl + imgArr[index]+that.data.globletoken,
        urls: urlArr
      })
    }



  },
})
