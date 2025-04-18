// index.ts
// 获取应用实例
import { getAxios} from "../../utils/request";
const WxParse = require('../../wxParse/wxParse.js');
Component({
    data: {
        winWidth:<number>0,
        winHeight:<number>0,
        padtop:<number>0,
        mTitle:<string>'办事指南详情',
        guideInfo:<any>{},
        guidePid:<number>0,
        lastPage:<string>'../matter/matter',
    },
    lifetimes:{
        attached(){
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
        onLoad:function(options: { pid: number; }){
            this.setData({
               guidePid:options.pid
            })
            this.getGuide();
            wx.getSystemInfo({
              success: (res) =>{
                console.log(res);   
                this.setData({
                  winWidth: res.windowWidth,
                  winHeight: res.windowHeight,
                  padtop:res.safeArea.top
                });
              },
            })
        },
        async getGuide(){
            let res:any = await getAxios(`/guidelines/info`,{pid:this.data.guidePid})
            //如果返回的信息中的content不为空，需要给img标签添加样式
            if(res.data.content){
                // WxParse.wxParse('article', 'html', res.data.content, this, 5);
                res.data.content = res.data.content.replace(/\<img/gi, '<img style="width:100%;height:auto"')
            }
            this.setData({
                guideInfo:res.data
           })
        }


    },
})
