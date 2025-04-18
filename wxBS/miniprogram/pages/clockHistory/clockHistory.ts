// index.ts
// 获取应用实例
import {getAxios} from "../../utils/request";

// @ts-ignore
Component({
  data: {
    winWidth: <number>0,
    winHeight: <number>0,
    padtop: <number>0,
    mTitle:<string>'历史记录',
    listTitle:<string>'我上报的事件',
    historyList:<any>[
      // {
      //   pid:1,
      //   typename:'业务1',
      //   signtime:'2021-01-01 00:00:00',
      //   signaddress:'地址1恶趣味驱蚊器问问去谔谔请问大苏打实打实',
      // },
      // {
      //   pid:1,
      //   typename:'业务1',
      //   signtime:'2021-01-01 00:00:00',
      //   signaddress:'地址1',
      // },
      // {
      //   pid:1,
      //   typename:'业务1',
      //   signtime:'2021-01-01 00:00:00',
      //   signaddress:'地址1',
      // },
      // {
      //   pid:1,
      //   typename:'业务1',
      //   signtime:'2021-01-01 00:00:00',
      //   signaddress:'地址1',
      // },
      // {
      //   pid:1,
      //   typename:'业务1',
      //   signtime:'2021-01-01 00:00:00',
      //   signaddress:'地址1',
      // },
      // {
      //   pid:1,
      //   typename:'业务1',
      //   signtime:'2021-01-01 00:00:00',
      //   signaddress:'地址1',
      // },
      // {
      //   pid:1,
      //   typename:'业务1',
      //   signtime:'2021-01-01 00:00:00',
      //   signaddress:'地址1',
      // },
      // {
      //   pid:1,
      //   typename:'业务1',
      //   signtime:'2021-01-01 00:00:00',
      //   signaddress:'地址1',
      // },
      // {
      //   pid:1,
      //   typename:'业务1',
      //   signtime:'2021-01-01 00:00:00',
      //   signaddress:'地址1',
      // },
      // {
      //   pid:1,
      //   typename:'业务1',
      //   signtime:'2021-01-01 00:00:00',
      //   signaddress:'地址1',
      // },
      // {
      //   pid:1,
      //   typename:'业务1',
      //   signtime:'2021-01-01 00:00:00',
      //   signaddress:'地址1',
      // },
      // {
      //   pid:1,
      //   typename:'业务1',
      //   signtime:'2021-01-01 00:00:00',
      //   signaddress:'地址1',
      // },
      // {
      //   pid:1,
      //   typename:'业务1',
      //   signtime:'2021-01-01 00:00:00',
      //   signaddress:'地址1',
      // },
      // {
      //   pid:1,
      //   typename:'业务1',
      //   signtime:'2021-01-01 00:00:00',
      //   signaddress:'地址1',
      // },
      // {
      //   pid:1,
      //   typename:'业务1',
      //   signtime:'2021-01-01 00:00:00',
      //   signaddress:'地址1',
      // }

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
    onLoad:function(){
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
    async getHistoryList(){
      let res:any = await getAxios("/mpolicesign/lishilist",{pagenum:this.data.curpage,pagesize:this.data.pagesize},1)
      console.log(res)
      //将获取到的数据追加到原有的historyList中
      this.setData(
          {
            historyList:this.data.historyList.concat(res.data.list),
            count:res.data.pages
          }
      )
    },

    async deleteClock(pid:number){
        let res:any = await getAxios("/mpolicesign/del",{pid:pid},1)
        console.log(res)
        if(res.code == 200){
            wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000
            })
            this.reload();
        }else{
            wx.showToast({
            title: '删除失败',
            icon: 'none',
            duration: 2000
            })
        }
    },

    bindoverClick(e:any){
      let pid = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `../clockInfo/clockInfo?pid=${pid}`,
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
    },

    bindscrolltolower(){
        this.loadMore();
    },

    binddeleteClick(e:any){
    //  询问是否删除，如果是调用后台删除接口进行删除
        let pid = e.currentTarget.dataset.id;
        console.log(pid)
        wx.showModal({
            title: '提示',
            content: '确定要删除吗？',
            success: (res) => {
            if (res.confirm) {
                console.log('用户点击确定')
                this.deleteClock(pid);
            } else if (res.cancel) {
                console.log('用户点击取消')
            }
            }
        })
    }

  },
})


