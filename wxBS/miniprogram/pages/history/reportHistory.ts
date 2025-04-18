// index.ts
// 获取应用实例
import {postAxios} from "../../utils/request";

// @ts-ignore
Component({
  data: {
    mTitle:<string>'历史记录',
    listTitle:<string>'我的留言',
    historyList:<any>[

    ],
    guidePid:<number>0,
    lastPage:<string>'../matter/matter',
  //  定义一个分页信息
    pagesize:10,//每页展示的条数
    curpage: 1,//当前页数
    count:1//总页数
  },
  lifetimes:{
    attached(){
      this.getHistoryList();
    },
    ready(){

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
    // onLoad:function(options: { pid: number; }){
    //   this.setData({
    //     guidePid:options.pid
    //   })
    //   this.getGuide();
    // },
    async getHistoryList(){
      let res:any = await postAxios("/api/sjmmatter/matterList",{pagenumber:this.data.curpage,pagesize:this.data.pagesize})
      console.log(res)
      //将获取到的数据追加到原有的historyList中
       this.setData(
            {
            historyList:this.data.historyList.concat(res.data.list),
            count:res.data.pages
            }
       )
    },

    bindoverClick(e:any){
        let pid = e.currentTarget.dataset.id;
        console.log(pid)
      wx.navigateTo({
        url: `../matterInfo/matterInfo?pid=${pid}`,
      })
    },

    loadMore(){
      //  判断当前页数是否大于总页数
      if(this.data.curpage < this.data.count){
        this.setData({
          curpage:this.data.curpage + 1
        })
        this.getHistoryList();
      }
    },

    reload(){
        this.setData({
            curpage:1,
            historyList:[]
        })
        this.getHistoryList();
    }

  },
})


