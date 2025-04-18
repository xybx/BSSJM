<template>
  <div class="taskverify">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>公众事项审核</span>
      </div>
      <div class="hflex">
        <el-radio-group v-model="tabCard" class="radiogroup" @change="tabChange" size="—">
          <el-radio-button label="over">待审</el-radio-button>
          <el-radio-button label="end">已审</el-radio-button>
        </el-radio-group>
      </div>
      <div class="text item">
        <queryForm :over="true" @queryClick="queryClick"/>
        <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column v-for="item in tableColumns" :key="item.prop" align="center" show-overflow-tooltip :label="item.label">
              <template #default="{ row, $index }">
                <template v-if="item.prop == 'uptype'">
                  {{row[item.prop] == 1 ? '匿名' :'实名'}}
                </template>
                <template v-else-if="item.prop == 'areaname'">
                  {{row[item.prop] ? row[item.prop] :'(区级)无法自动判断'}}
                </template>
                <template v-else-if="item.prop == 'apprank'">
                  <el-tag :type="row[item.prop] == 1 ? 'success' : row[item.prop] == 2 ? 'danger' : ''">{{row[item.prop] == 1 ? '通过' : row[item.prop] == 2 ? '打回' : '待审核' }}</el-tag>
                </template>
                <template v-else>
                  {{ row[item.prop] ? row[item.prop] : '暂无数据'}}
                </template>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="400px">
              <template #default="{ row, $index }">
                <template v-if="tabCard == 'over'">
                  <el-button type="success" plain size="small" @click="passClick(row.pid)">通过</el-button>
                  <el-button type="danger" plain size="small" @click="repulse(row.pid)">打回</el-button>
                </template>
                <el-button type="warning" plain size="small" @click="Look(row.pid)">查看详情</el-button>
              </template>
            </el-table-column>
        </el-table>
        <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
        </div>
    </el-card>
    <taskDialog ref="tasklog" />
    <overdialog ref="overlog" :verify="true" @getData="getData" />
  </div>

</template>
<script>
export { default } from './js/Taskverify'
</script>

<style scoped lang="scss">
@import './style/Taskwork.scss';
</style>
