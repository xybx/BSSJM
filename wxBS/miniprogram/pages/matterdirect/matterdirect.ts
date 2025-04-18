// pages/matterdirect.ts
// let mapp = getApp<IAppProps>()
import {postAxios} from "../../utils/request";

Component({
  data:{
    winWidth:<number>0,
    winHeight:<number>0,
    padtop:<number>0,
    mTitle:<string>'淄博市公安局博山分局',
    username:<string>'',
    userData:<userProps[] | []>[],
    showpage:<boolean>false,
    redirectback:<boolean>false,
    pushOverList:<any>[],
    lastPage: <string>'../userHome/userHome',
    pagesize:10,//每页展示的条数
    curpage: 1,//当前页数
    count:1,//总页数
  },
  lifetimes:{
    attached(){
      this.getPushOverList()  
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
    bindoverClick(e:any){
      let pid = e.currentTarget.dataset.id;
      console.log(pid)
      wx.navigateTo({
        url: `../matterInfo/matterInfo?pid=${pid}&type=3`,
      })
    },
    async getPushOverList(){
      let res:any =  await postAxios("/snapshot/allbehandle",{pagenumber:this.data.curpage,pagesize:this.data.pagesize},1)
      //将获取到的数据追加到原有的historyList中
      this.setData(
          {
            pushOverList:this.data.pushOverList.concat(res.data.list),
            count:res.data.pages
          }
      )
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
    bindscrolltolower(){
      this.loadMore();
    },
  }
})