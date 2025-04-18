import {
  getAnswner,
  getAreas,
  getEventTotal,
  getMatterNum,
  getMouthNum,
  getMouthYear
} from "@/views/Taskwork/api/taskwork";

export default {
  name: "tasktotal",
  data(){
    return {
      proData:[],
      years:'',
      months:'',
      areaval:'',
      areaData:[],
    }
  },
  computed:{},
  components: {},
  created() {
  },
  mounted(){
    this.getAreaData()
    this.getProject()
    this.getpieOverChart()
    this.getpieTotalChart()
    this.getLineData()
    this.getAreaChart()
  },
  methods:{
    async getAreaData(){
      let res = await getAreas()
      this.areaData = res.data.length >0 ? res.data.map(item=>{
        return {
          pid:item.pid,
          areaname:item.areaname
        }
      }) : []
    },
    async getProject(){
      let res = await getMatterNum()
      this.proData = [
        {icon:'icon-icon-todo2',title:'全部事项',num:res.data.quanbu},
        {icon:'icon-yichuli',title:'已处理',num:res.data.yichuli},
        {icon:'icon-weidaqia',title:'未处理',num:res.data.weichuli},
        {icon:'icon-jinggao',title:'忽略',num:res.data.hulue}
      ]
    },
    async getpieOverChart(){
        let res  = await getAnswner()
        let arr = [{name:'已处理',value: res.data.yichuli === 0 ? res.data.yichuli : res.data.yichuli.toFixed(2)},{name:'未处理',value:res.data.weichuli === 0 ? res.data.weichuli : res.data.weichuli.toFixed(2)},{name:'忽略',value:res.data.hulue===0 ? res.data.hulue : res.data.hulue.toFixed(2)}]
        var myChart = this.$echarts.init(document.getElementById("matter"));
        var option =  {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            bottom:'center',
            right: '6%',
            itemGap:14,
            textStyle:{
              color:'#333'
            }
          },
          grid:{
            top:0,
          },
          color: ['#14b8a6','#cc2f2f','#f27c4e'],//扇形区域以及列表颜色
          series: [{
            type: 'pie',
            radius: ['48%', '70%'],//两个表示环
            center: ['50%', '48%'],
            labelLine: {//设置延长线的长度
              normal: {
                length:30,//设置延长线的长度
              }
            },
            label: {
              normal: {
                formatter: '{per|}{cf|{c}}%',//这里最后另一行设置了一个空数据是为了能让延长线与hr线对接起来
                color:'#333',
                rich: {
                  bf:{
                    color: '#333',
                    padding: [0,0,0,0],
                    fontsize:18,
                    lineHeight: 20
                  },
                  cf:{
                    color: '#000',
                    fontsize:30,
                    lineHeight:30,//设置最后一行空数据高度，为了能让延长线与hr线对接起来
                  },
                  per: {//用百分比数据来调整下数字位置，显的好看些。如果不设置，formatter最后一行的空数据就不需要
                    padding: [4, 0],
                  }
                }
              }
            },
            data:arr,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        };
        myChart.setOption(option);
        window.addEventListener("resize", function() {
          myChart.resize();
        });
    },
    async getpieTotalChart(){
      let res = await getEventTotal()
      var myChart = this.$echarts.init(document.getElementById("category"));
        var option =  {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            bottom:'center',
            right: '3%',
            itemGap:10,
            textStyle:{
              color:'#333'
            }
          },
          grid:{
            top:0,
          },
          color: ['#14b8a6','#3b82f6','#6366f1','#ec4899','#f59e0b','#facc15'],//扇形区域以及列表颜色
          series: [{
            type: 'pie',
            // radius: ['50%', '70%'],//两个表示环
            center: ['50%', '45%'],
            labelLine: {//设置延长线的长度
              normal: {
                length:30,//设置延长线的长度
              }
            },
            label: {
              normal: {
                formatter: '{bf|{b}}:{per|}{cf|{c}}',//这里最后另一行设置了一个空数据是为了能让延长线与hr线对接起来
                color:'#333',
                rich: {
                  bf:{
                    color: '#333',
                    padding: [0,0,0,0],
                    fontsize:18,
                    lineHeight: 20
                  },
                  cf:{
                    color: '#000',
                    fontsize:30,
                    lineHeight:30,//设置最后一行空数据高度，为了能让延长线与hr线对接起来
                  },
                  per: {//用百分比数据来调整下数字位置，显的好看些。如果不设置，formatter最后一行的空数据就不需要
                    padding: [4, 0],
                  }
                }
              }
            },
            data:res.data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        };
        myChart.setOption(option);
        window.addEventListener("resize", function() {
          myChart.resize();
        });
    },
    // yearChange(val){
    //   this.years = val
    //   this.getLineData()
    // },
    monthChange(val){
      this.months = val
      this.getLineData()
    },
    async getLineData(){
      let params = {}
      if(this.months && this.months !== ''){
        Object.assign(params,{year:this.months.split('-')[0],month:this.months.split('-')[1]})
      }
      let res = await getMouthYear(params)
      let xarr = Object.keys(res.data)
      let yarr = Object.values(res.data)
      this.getlineReportChart(xarr,yarr)
    },
    getlineReportChart(xarr,yarr){
      var myChart = this.$echarts.init(document.getElementById("report"))
      var option =  {
          tooltip:{
            trigger: 'axis',
            axisPointer: {// 坐标轴指示器，坐标轴触发有效
                type: 'shadow'// 默认为直线，可选为：'line' | 'shadow'
            },
            textStyle:{
              color: '#333',
              fontFamily:'Microsoft YaHei',
              fontSize:15
            },
            formatter:(params)=>{
                let str = ''
                str+='<div class="fname">'+ params[0].name+'</div>'
                str+=`<div class="fvals"><span style="display:inline-block;margin-right:10px;width:10px;height:10px;border-radius:10px;background-color:${params[0].color};"></span><label style="font-family:'DINBold';">${params[0].value}</label></div>`
                return str
            }
          },
          grid: { left: '2%', right: '2%', bottom: '4%', top: '10%', containLabel: true },
          xAxis:{
            show:true,
            type:'category',
            data:xarr,
            splitLine: {show: false,},
            axisTick: {show: false,},
            axisLine: {
              show: true,
              lineStyle:{
                color:['#666'],
                opacity:.18
              }
            },
            axisLabel: {
              color: "#666",
              rotate:15,
              fontFamily:'Microsoft YaHei',
              fontSize:14,
              interval: 0,
              margin:10,
            },
          },
          yAxis:{
            name:'单位:件数',
            nameTextStyle:{
              color: "#999",
              fontFamily:'Microsoft YaHei',
              fontSize:13,
            },
            type:'value',
            show: true,
            splitLine: {
              show: true,
              lineStyle:{
                color:['#666'],
                opacity:.18
              }
            },
            axisTick: {show: false,},
            axisLine: {
              show: false,
              lineStyle:{
                color:['#666'],
                opacity:.18
              }
            },
            axisLabel: {
              color: "#999",
              fontFamily:'Microsoft YaHei',
              fontSize:14,
              formatter:(value)=>{
                return value+"";
              }
            },
          },
          series:[
            {
              type:'line',
              data:yarr,
              symbol: 'circle',
              smooth: true,//true:弯曲的
              label:{
                show:true,
                position:'top',
                color:'#333',
                fontSize:14
              },
              lineStyle:{
                type:'solid',
                color:'#1cbead'
              },
              itemStyle: {
                color: 'rgba(28, 190, 173, 1)',
              },
              areaStyle:{
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(28, 190, 173, 1)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(28, 190, 173, 0)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          ]
        }
        myChart.setOption(option);
        window.addEventListener("resize", function() {
          myChart.resize();
        });
    },
    areaChange(val){
      this.areaval = val
      this.getAreaChart()
    },
    areaClear(){
      this.areaval = ''
      this.getAreaChart()
    },
    async getAreaChart(){
      let params = {}
      if(this.areaval && this.areaval != ''){
        Object.assign(params,{areaid:this.areaval})
      }
      let res  = await getMouthNum(params)
      let xarr = Object.keys(res.data).reverse()
      let yarr = Object.values(res.data).reverse()
      this.getbarScanChart(xarr,yarr)
    },
    getbarScanChart(xarr,yarr){
      var myChart = this.$echarts.init(document.getElementById("analysis"))
      var option =  {
          tooltip:{
            trigger: 'axis',
            axisPointer: {// 坐标轴指示器，坐标轴触发有效
                type: 'shadow'// 默认为直线，可选为：'line' | 'shadow'
            },
            textStyle:{
              color: '#333',
              fontFamily:'Microsoft YaHei',
              fontSize:15
            },
            formatter:(params)=>{
                let str = ''
                str+='<div class="fname">'+ params[0].name+'</div>'
                str+=`<div class="fvals"><span style="display:inline-block;margin-right:10px;width:10px;height:10px;border-radius:10px;background-color:${params[0].color};"></span><label style="font-family:'DINBold';">${params[0].value}</label></div>`
                return str
            }
          },
          grid: { left: '1%', right: '3%', bottom: '4%', top: '10%', containLabel: true },
          xAxis:{
            show:true,
            type:'value',
            splitLine: {show: true,},
            axisTick: {show: false,},
            axisLine: {
              show: false,
              lineStyle:{
                color:['#666'],
                opacity:.18
              }
            },
            axisLabel: {
              color: "#666",
              fontFamily:'Microsoft YaHei',
              fontSize:14,
              interval: 0,
              margin:10,
            },
          },
          yAxis:[{
            type:'category',
            data:xarr,
            show: true,
            splitLine: {
              show: false,
              lineStyle:{
                color:['#666'],
                opacity:.18
              }
            },
            axisTick: {show: true,},
            axisLine: {
              show: false,
              lineStyle:{
                color:['#666'],
                opacity:.18
              }
            },
            axisLabel: {
              color: "#999",
              fontFamily:'Microsoft YaHei',
              fontSize:14,
              formatter:(value)=>{
                return value+"";
              }
            },
          },{
            name:'单位:件',
            nameTextStyle:{
              color: "#999",
              fontFamily:'Microsoft YaHei',
              fontSize:13,
            },
            splitLine:{show: false,},
            axisTick:{show: false},
            axisLine:{show:false}
          }],
          series:[
            {
              type:'bar',
              data:yarr,
              barWidth: 12,
              label:{
                show:true,
                position:'right',
                color:'#333',
                fontSize:14
              },
              itemStyle: {
                color: '#596dc2',
              },
            }
          ]
        }
        myChart.setOption(option);
        window.addEventListener("resize", function() {
          myChart.resize();
        });
    },
  }
}
