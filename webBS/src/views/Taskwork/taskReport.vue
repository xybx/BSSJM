<template>
  <div class="taskReport">
     <el-card class="box-card">
       <div slot="header" class="clearfix">
         <i></i>
         <span>事项上报统计</span>
       </div>
       <ul class="tlist">
         <li v-for="(item,index) in totalData" :key="index">
           <template v-if="index != 2">
             <div class="tleft">
               <i :class="['iconfont', `${item.icon}`]"></i>
               <span>{{item.title}}</span>
             </div>
             <u>{{ item.num }}</u>
           </template>
           <template v-else>
             <div class="tleft">
               <span>{{item.title}}</span>
               <u>{{item.num}}</u>
             </div>
             <div class="tright">
               <p v-for="(val,k) in item.children" :key="k">
                 <span>{{val.title}}</span>
                 <u>{{val.num}}</u>
               </p>
             </div>
           </template>
         </li>
       </ul>
     </el-card>
     <el-card class="box-card">
       <div slot="header" class="clearfix">
         <i></i>
         <span>事项上报归属单位统计</span>
       </div>
       <el-table v-loading="tabloading" :data="tableData" border stripe :max-height="515" tooltip-effect="dark" :element-loading-text="loadingText">
         <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
         <el-table-column v-for="item in tableColumns" :key="item.prop" align="center" show-overflow-tooltip :label="item.label">
           <template #default="{ row, $index }">
             {{ row[item.prop] }}
           </template>
         </el-table-column>
       </el-table>
     </el-card>
  </div>
</template>

<script>
import queryForm from "./components/queryForm.vue";
import {getByareaList, getMatterList} from "@/views/Taskwork/api/taskwork";
export default {
  name: "taskReport",
  data(){
    return {
      totalData:[],
      tableColumns:[],
      tableData:[],
      tabloading:true,
      loadingText: "正在加载...",
      formData:{},
    }
  },
  components:{
    queryForm
  },
  created(){
  },
  mounted() {
    this.getTotal()
    this.getTableFields()
    this.getData()
  },
  methods:{
    getTableFields(){
      this.tableColumns = [
        {prop: 'areaname', label: '单位名称'},
        {prop: 'quanbu', label: '总数量(件)'},
        {prop: 'shixiannei', label: '时限内处理(件)'},
        {prop: 'shixianwai', label: '时限48小时外处理（件）'},
        {prop: 'yichuli', label: '已处理（件）'},
        {prop: 'weichuli', label: '未处理（件）'},
        {prop: 'anshilv', label: '按时回复率（%）'},
      ]
    },
    async getData(){
      let res = await getByareaList()

      if(res.code === 200){
        this.tableData = res.data
      }else{
        this.tableData = []
      }
      setTimeout(() => {
        this.tabloading = false;
      }, 200)
    },
    async getTotal(){
      let res = await getMatterList()
      this.totalData = [
        {title:'全部事项',icon:'icon-quanbushixiang-xuanzhong',num:res.data.quanbu},
        {title:'未处理',icon:'icon-weichulidingdan',num:res.data.weichuli},
        {title:'已处理',num:res.data.yichuli,children:[{title:'时限内处理',num:res.data.shixiannei},{title:'时限48小时外处理',num:res.data.shixianwai}]}
      ]
    },
  }

}
</script>

<style scoped lang="scss">
@import './style/taskreport.scss';
</style>
