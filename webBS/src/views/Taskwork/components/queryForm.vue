<template>
<div class="query-container">
      <vab-query-form>
        <vab-query-form-left-panel :span="24">
          <el-form :inline="true" ref="queryForm" :model="queryForm" @submit.native.prevent>
          <el-form-item v-if="report" label="单位名称">
            <el-input v-model="queryForm.snapshotname" placeholder="请输入单位名称" clearable/>
          </el-form-item>
          <template v-if="!over && !report">
              <el-form-item label="事项类别">
                 <el-select v-model="queryForm.typeid" placeholder="请选择事项类别" clearable>
                  <el-option v-for="item in typeData" :key="item.pid" :value="item.pid" :label="item.name"></el-option>
                </el-select>
              </el-form-item>
           </template>
           <template v-if="!report">
              <el-form-item label="开始时间">
                  <el-date-picker v-model="queryForm.startdate" type="date" value-format="yyyy-MM-dd" placeholder="请选择开始时间" clearable></el-date-picker>
              </el-form-item>
              <el-form-item label="结束时间">
                  <el-date-picker v-model="queryForm.enddate" type="date" value-format="yyyy-MM-dd" placeholder="请选择结束时间" clearable></el-date-picker>
              </el-form-item>
            </template>
            <template v-if="!over && !report">
              <el-form-item label="人员情况">
                <el-select v-model="queryForm.uptype" placeholder="请选择人员情况" clearable>
                  <el-option :value="0" label="实名"></el-option>
                  <el-option :value="1" label="匿名"></el-option>
                </el-select>
              </el-form-item>
            </template>
            <el-form-item>
              <el-button icon="el-icon-search" type="primary" size="medium" @click="queryClick">查询</el-button>
            </el-form-item>
          </el-form>
        </vab-query-form-left-panel>
      </vab-query-form>
    </div>
</template>
<script>
import VabQueryForm from "@/vab/components/VabQueryForm";
import VabQueryFormLeftPanel from "@/vab/components/VabQueryForm/components/VabQueryFormLeftPanel";
import {getTaskCategory} from "@/views/Taskwork/api/taskwork";
export default {
  name: "queryForm",
  data(){
    return {
      queryForm:{},
      typeData:[]
    }
  },
  props:['over','report'],
  components: {VabQueryFormLeftPanel, VabQueryForm},
  mounted() {
    this.getType()
  },
  methods: {
      async getType(){
        let res = await getTaskCategory()
        this.typeData = res.data
      },
      queryClick(){
        this.$emit('queryClick',this.queryForm)
      },
      clearClick(){
        this.queryForm = this.$options.data().queryForm
      },
  }

}
</script>
<style scoped lang="scss">
.query-container{
  ::v-deep{
    .el-form{
      .el-form-item{
        margin-left: 15px!important;
        &:first-child{
          margin-left: 0!important;
        }
        .el-input,.el-select{
          width: 170px;
        }
        .el-range-editor--small.el-input__inner{
          height: 36px;
        }
        .el-input--small .el-input__inner{
          height:36px;
          line-height:36px;
        }
      }
    }
  }
}
</style>
