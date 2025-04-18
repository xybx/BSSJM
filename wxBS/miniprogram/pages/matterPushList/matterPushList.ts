// index.ts
// 获取应用实例
const app = getApp<IAppProps>()
import {getAxios,postAxios} from "../../utils/request";
interface TabPorps {
  pid:number,
  name:string,
  uptype?:number
}
Component({
  data: {
    winWidth: <number>0,
    winHeight: <number>0,
    tabData:<TabPorps[] | []>[],
    currentTab:<number>0,
    padtop: <number>0,
    mTitle: <string>'业务推送',
    guideInfo: <any>{},
    matterPid: <number>0,
    imgurl: <string>'',
    videoUrl: <string>'',
    globletoken: <string>'',
    showview:<boolean>false,
    pushOverList:<any>[],
    pushEndList:<any>[],
    typeList:<any>['待办','已办','作废'],
    //  定义一个分页信息
    pagesize:10,//每页展示的条数
    curpage: 1,//当前页数
    count:1,//总页数
    pageSize:10,//每页展示的条数
    curPage: 1,//当前页数
    total:1,//总页数
    redirectback:<boolean>false,
    lastPage: <string>'../userHome/userHome',
  },
  lifetimes: {
    attached() {
      this.getTabData()
    },
    ready() {

    },
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      //先清空数据
      this.setData({
        pushOverList:[],
        pushEndList:[]
      })
      //展示
      this.getPushOverList()
      this.getPushEndList()
    },
    hide: function () {

    },
    resize: function () {

    },
  },
  methods: {
    onLoad:function(options: { redirectback: boolean}){
     wx.getSystemInfo({
            success: (res) =>{
              this.setData({
                winWidth: res.windowWidth,
                winHeight: res.windowHeight,
                padtop:res.safeArea.top
              });
            },
          })
      if(options.redirectback){
        this.setData({
            redirectback:options.redirectback
        })
      }
    },
    getTabData(){
      let arr = <TabPorps[]> [{
        pid:0,
        name:'待处理推送'
      },{
        pid:1,
        name:'已处理推送'
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
    },
    // 点击切换
    bindclickTab(e:any){
      let that = this
      let index = e.target.dataset.id
      if(this.data.currentTab === index){
        return false
      }  else {
        that.setData({
          currentTab:index    
        })
      }
    },
    async getPushOverList(){
      // let level = app.globalData.userlevel
      let sitemanager = app.globalData.userData.sitemanager
      console.log(sitemanager);
      let res:any = sitemanager == 1 ? await postAxios("/snapshot/beshenhe",{pagenumber:this.data.curpage,pagesize:this.data.pagesize},1) : await postAxios("/snapshot/behandle",{pagenumber:this.data.curpage,pagesize:this.data.pagesize},1)
      console.log(res)
      if(res.data.list!=null){
        //将获取到的数据追加到原有的historyList中
        this.setData(
            {
              pushOverList:this.data.pushOverList.concat(res.data.list),
              count:res.data.pages
            }
        )
      }
    },
    async getPushEndList(){
      // let level = app.globalData.userlevel
      let sitemanager = app.globalData.userData.sitemanager
      console.log(sitemanager);
      let res:any = sitemanager == 1 ? await postAxios("/snapshot/hasshenhe",{pagenumber:this.data.curPage,pagesize:this.data.pageSize},1) : await postAxios("/snapshot/yiban",{pagenumber:this.data.curPage,pagesize:this.data.pageSize},1)
      //将获取到的数据追加到原有的historyList中
      if(res.data.list!=null) {
        this.setData(
            {
              pushEndList: this.data.pushEndList.concat(res.data.list),
              total: res.data.pages
            }
        )
      }
    },
    bindoverClick(e:any){
      let pid = e.currentTarget.dataset.id;
      console.log(pid)
      wx.navigateTo({
        url: `../matterInfo/matterInfo?pid=${pid}&type=1`,
      })
    },
    bindendClick(e:any){
      let pid = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `../matterInfo/matterInfo?pid=${pid}&type=2`,
      })
    },
    loadMore(){
      //  判断当前页数是否大于总页数
      if(this.data.curpage < this.data.count){
        this.setData({
          curpage:this.data.curpage + 1
        })
        this.getPushOverList();
      }
    },
    loadEndMore(){
      //  判断当前页数是否大于总页数
      if(this.data.curPage < this.data.total){
        this.setData({
          curPage:this.data.curPage + 1
        })
        this.getPushEndList();
      }
    },
    // reload(){
    //   this.setData({
    //     curpage:1,
    //     pushOverList:[]
    //   })
    //   this.getPushOverList();
    // },

    bindscrolltolower(){
     this.loadMore();
    },
    bindEndscrolltolower(){
      this.loadEndMore()
    },
  },
})
