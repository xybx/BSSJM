<template>
  <div class="record">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>打卡记录</span>
      </div>
      <el-form :inline="true" ref="queryForm" :model="queryForm" @submit.native.prevent>
        <el-form-item label="姓名">
          <el-input v-model="queryForm.username" placeholder="请输入姓名" clearable/>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="queryForm.phonenum" placeholder="请输入手机号" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" size="medium" @click="queryClick">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
        <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
        <el-table-column v-for="item in tableColumns" :key="item.prop" align="center" :width="item.prop== 'username' || item.prop== 'phonenum' ? '130px' : ''" show-overflow-tooltip :label="item.label">
          <template #default="{ row, $index }">
            <template v-if="item.prop == 'areaname'">
              {{row[item.prop] ? row[item.prop] :'无'}}
            </template>
            <template v-else-if="item.prop == 'typename'">
              {{row[item.prop] ? row[item.prop] :'无'}}
            </template>
            <template v-else-if="item.prop == 'signimage'">
              <el-image :src="srcList[$index]" :preview-src-list="srcList"></el-image>
            </template>
            <template v-else>
              {{ row[item.prop] ? row[item.prop] : '暂无数据'}}
            </template>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="280px">
          <template v-slot="scope">
            <el-button type="text" @click="Look(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
    </el-card>
    <recordLog ref="recordlog" />
  </div>
</template>
<script>
import {getSignupList} from "@/views/Records/api/record";
import recordLog from "./components/recordLog.vue";
export default {
  name: "RecordStory",
  data(){
    return {
      queryForm:{},
      tableColumns:[],
      tableData:[],
      tabloading:true,
      loadingText: "正在加载...",
      layout: "total, sizes, prev, pager, next, jumper",
      total: 0,
      pageNo: 1,
      pageSize: 0,
      pageSizes: [10, 15, 20],
      formData:{},
      srcList:[],

    }
  },
  components:{
    recordLog
  },
  created(){
    this.pageSize = this.pageSizes[0]
  },
  mounted() {
    this.getTableFields()
    this.getListData()
  },
  methods:{
    getTableFields(){
      this.tableColumns = [
        {prop: 'username', label: '姓名'},
        {prop: 'phonenum', label: '手机号'},
        {prop: 'areaname', label: '单位'},
        {prop: 'typename', label: '打卡类型'},
        {prop: 'signtime', label: '打卡时间'},
        {prop: 'signimage', label: '上传图片'},
        {prop: 'signaddress',label: '上传地址'},
      ]
    },
    async getListData(){
      let params = {pagenum:this.pageNo,pagesize:this.pageSize}
      let arr = Object.keys(this.queryForm)
      for(let i in this.queryForm){
        if(arr.includes(i)){
          Object.assign(params,this.queryForm)
        }
      }
      let res = await getSignupList(params)
      if(res.code === 200){
        this.tableData = res.data.list
        this.total = res.data.total
        this.srcList = res.data.list.length > 0 ? res.data.list.map(item=>{
          return `${window.apiURL}/gridfs/artworkmaster/${item.signimage}`
        }) : []
      }else{
        this.tableData = []
      }
      setTimeout(() => {
        this.tabloading = false;
      }, 200)
    },

    Look(obj){
      this.$refs.recordlog.showEdit(obj)
    },
    queryClick(){
      this.pageNo = 1
      this.getListData()
    },
    SizeChange(val) {
      this.pageSize = val;
      this.getListData();
    },
    CurrentChange(val) {
      this.pageNo = val;
      this.getListData();
    },
  }
}
</script>
<style scoped lang="scss">
@import './style/record.scss';
</style>
