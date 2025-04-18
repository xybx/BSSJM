// pages/clockIn/clockIn.ts
const app = getApp<IAppProps>()
import { getAxios,postAxios,getJson} from "../../utils/request";
import { photo, tips,showModal,formatTime } from '../../utils/util'
const mapCtx = wx.createMapContext('map')
interface TabPorps {
  pid:number,
  name:string,
  uptype?:number
}
interface FormProps{
  cate?:string|number,
  typeid:number|string,
  content:string,
  latitude:any,
  longitude:any,
  signaddress:string,
  signimage:string,
  poffice?:string,
  pname?:string,
  phone?:string,
  ptime?:string
}

Component({
  data:{
    winWidth:<number>0,
    winHeight:<number>0,
    padtop:<number>0,
    mTitle:<string>'日常打卡',
    lastPage:<string>'../matter/matter',
    tabData:<TabPorps[] | []>[],
    currentTab:<number>0,
    inputData:<FormProps>{},
    cateData:<TabPorps[] | []>[],
    imgs:<string[]>[],
    imgurl:<string>'',
    areaData:<TabPorps[] | []>[],
    latitude:<number>0,
    longitude:<number>0,
    scale: 14,
    tMarkers:<any[]>[],
    imgshow:<boolean>true
  },
  lifetimes:{
    attached(){
      this.getTabData()
      this.getCateData()
      this.getUserData()
      this.getLocalData()
      
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
      this.setData({
        imgurl:`${app.globalData.baseUrl}/api/dbfile/artworkmaster/`
      })
    },
    async getUserData(){
      let res:any = await getAxios('/user/userinfo',{},1)
      if(res.code == 200){
        this.setData({
           ['inputData.poffice']:res.data.officename,
           ['inputData.pname']:res.data.username,
           ['inputData.phone']:res.data.phonenum,
           ['inputData.ptime']:formatTime(new Date())
        })
      }else {
        this.setData({
          ['inputData.poffice']:'数据未获取',
          ['inputData.pname']:'数据未获取',
          ['inputData.phone']:'数据未获取',
          ['inputData.ptime']:formatTime(new Date()) 
       })
      }  
    },
    getTabData(){
      let arr = <TabPorps[]> [{
        pid:0,
        name:'新建打卡'
      },{
        pid:1,
        name:'历史记录'
      }]
      this.setData({
        tabData:arr
      })
    },  
    // 滑动切换
    swiperTab(e:any){
      let that = this 
      that.setData({
        currentTab: e.detail.current
      })
      if(e.detail.current == 0){
        that.setData({
          inputData:<FormProps>{},
          imgs:[],
          imgshow:true
        })
        this.getUserData()
        this.getLocalData() 
      }  
    },
    // 点击切换
    bindclickTab(e:any){
      let that = this
      let index = e.target.dataset.id
      if(index == 0){
        that.setData({
          inputData:<FormProps>{},
          imgs:[],
          imgshow:true
        })
        this.getUserData()
        this.getLocalData()
      } 
      if(this.data.currentTab === index){
        return false
      }  else {
        that.setData({
          currentTab:index    
        })
      }
    },
    updateTime(){
      wx.showLoading({
        title:'更新时间中...'
      })
      this.setData({
        ['inputData.ptime']:formatTime(new Date()) 
     })
     setTimeout(()=>{
      wx.hideLoading()
     },500) 
    },
    saveData(e:any){
      const obj = e.detail.value
      this.cardInfo(obj)
    },
    cardInfo(obj:any){
      let that = this
      let arr = that.data.imgs
      let latitude = that.data.inputData.latitude
      let longitude = that.data.inputData.longitude
      let error:string = ''
      if((!obj.cate || obj.cate == '') && (!obj.typeid || obj.typeid == '')){
        error = '请选择打卡类别'
      } else if (!obj.content || obj.content == ''){
        error = '请输入打卡内容描述'
      }
      if(error != ''){
        showModal(error)
      }else {
        wx.showLoading({
          title:'打卡中...',
          mask:true
        })
        Object.assign(obj,{latitude:latitude,longitude:longitude})
        if(arr.length > 0){
          Object.assign(obj,{signimage:arr.join(',')})
        }
        postAxios('/mpolicesign/sign',obj,1).then((res:any)=>{
          if(res.code == 200){
            wx.hideLoading()
            tips('打卡成功','success',true,2000)
            that.setData({
              inputData:<FormProps>{},
              imgs:[],
              imgshow:true
            })
            setTimeout(()=>{
                that.setData({
                    currentTab:1,
                })
                const childComponent = this.selectComponent('#child');
                childComponent.reload();
            },1000)
          }else {
            wx.hideLoading()
            wx.showModal({
                title: '提示',
                content: '打卡失败，请重新打卡！',
                showCancel: false
            })
          }
        })
      }
    },
    bindcatechange(e:any){
        let index = Number(e.detail.value)
        let arr = this.data.cateData 
        this.setData({
          [`inputData.${e.currentTarget.id}`]:index,
          ['inputData.typeid']:arr[index].pid,
        })         
    },
    async getCateData(){
      let res:any = await getAxios(`/mpolicesign/signtype`,{},1)
      let arr:TabPorps[] = res.data.length > 0 ? res.data.map((item:any)=>{
        return {
          pid:item.pid,
          name:item.typename
        }
      }) : []
      this.setData({
        cateData:arr,
      })      
    },
    chooseImg(e:any){
      let that = this
      let imgs = that.data.imgs
      photo(1,'image').then((item:any) => {
        console.log(item);  
        if (item.length > 0) {
            for (let i = 0; i < item.length; i++) {
                imgs.push(item[i]);
            }     
            wx.hideLoading()
            that.setData({
                imgs:imgs,
                imgshow:imgs.length >= 1 ? false : true
            })         
        } else {         
            wx.hideLoading()
            wx.showModal({
                title: '提示',
                content: '上传失败，请重新上传！',
                showCancel: false
            })           
        }
      })
    },
    previewImg(e:any){
      let that = this
      let index = e.currentTarget.dataset.index;
      let imgArr = that.data.imgs;
      let urlArr = [];
      for (let i = 0; i < imgArr.length; i++) {
          urlArr.push(that.data.imgurl + imgArr[i])
      }
      wx.previewImage({
          current: that.data.imgurl + imgArr[index],
          urls: urlArr
      })
    },
    deleteImg(e:any){
      let that = this
      let imgArr = that.data.imgs
      let index = e.currentTarget.dataset.index;
      wx.showModal({
        title: '删除提示',
        content: '确定要删除此图片吗？',
        async success(res:any) {
            if (res.confirm) {
                imgArr.splice(index, 1)
                that.setData({
                  imgshow:imgArr.length >= 1 ? false : true
                })
                await that.delImg(imgArr[index])   
            } else if (res.cancel) {
                return false;
            }
            that.setData({
                imgs: imgArr
            })
        }
      })
    },
    async delImg(fileid:any){
      let res:any = await getAxios('/api/dbfile/delfile',{fileid:fileid})
      if(res.code == 200){
        tips('图片删除成功','success',true,1500)
      }else {
        tips('图片删除失败','error',true,1500)
      }
    },
    getLocalData(){
      let that = this
      wx.getSetting({
         success: res => {
           if (!res.authSetting['scope.userLocation']) {
            wx.authorize({
              scope: 'scope.userLocation',
              async success () {
                await that.getLocal()
              }
            })
          } else {
            that.getLocal()
          } 
        }
      })
     },
     getLocal(){
      let that = this
      wx.getLocation({
        type:'wgs84',
        isHighAccuracy: true,
        async success(res:any){
          tips('已成功获取位置','success',true,1500)
          that.setData({
             ['inputData.latitude']:res.latitude,
             ['inputData.longitude']:res.longitude,
          })
          mapCtx.moveToLocation();
          await that.getAreaName(res.longitude,res.latitude)
        }
      })
     },
     async PointClick(e:any){
        let allMarkers:any[] = []
        this.setData({
          ['inputData.latitude']:e.detail.latitude,
          ['inputData.longitude']:e.detail.longitude,
        })
        await this.getAreaName(e.detail.longitude,e.detail.latitude)
        let marker = {
          id: 1,
          latitude: e.detail.latitude,
          longitude: e.detail.longitude,
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
     },
    getAreaName(longitude:any,latitude:any){
      let that = this
      let url =`https://api.tianditu.gov.cn/geocoder?postStr={'lon':${longitude},'lat':${latitude},'ver':1}&type=geocode&tk=${app.globalData.tk}`
      getJson(url,{}).then((res:any) =>{
          if(res.status == "0" && res.msg == 'ok'){
            let addres = `${res.result.addressComponent.city}${res.result.addressComponent.county}${res.result.addressComponent.address}`
            that.setData({
              ['inputData.signaddress']:addres
            })
          } else {
            tips('无法准确定位','error',true,2000)
            that.setData({
              ['inputData.signaddress']:'定位失败'
            })
          }    
      })
    },
    bindscrolltolower(){
        const childComponent = this.selectComponent('#child');
        childComponent.loadMore();
    } 
  }
})