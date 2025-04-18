<template>
  <div class="phoneage">
       <el-card class="box-card">
        <div slot="header" class="clearfix">
          <i></i>
          <span>便民电话管理</span>
        </div>
        <div class="text item">
          <el-button class="addbtn" type="primary" size="medium" @click="addphone">添加</el-button>
          <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
            <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
            <el-table-column v-for="item in tableColumns" :key="item.prop" align="center" show-overflow-tooltip :label="item.label">
              <template #default="{ row, $index }">
                <template>
                  {{ row[item.prop] ? row[item.prop] : '暂无数据'}}
                </template>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="400px">
              <template v-slot="scope">
                <el-button type="success" plain size="small" @click="editClick(scope.row.pid)">编辑</el-button>
                <el-button type="danger" plain size="small" @click="delClick(scope.row.pid)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
        </div>
    </el-card>
    <conventlog ref="convent" :isphone="true" @getData="getListData" />
  </div>
</template>
<script>
export { default } from './js/phoneage'
</script>
<style scoped lang="scss">
@import "./style/phoneage.scss";
</style>
