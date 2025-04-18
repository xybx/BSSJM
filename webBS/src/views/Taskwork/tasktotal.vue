<template>
  <el-row :gutter="10">
    <el-col :span="10">
      <ul class="plist">
        <li v-for="(item,index) in proData" :key="index">
          <i class="iconfont" :class="item.icon"></i>
          <div class="fontbox">
            <span>{{item.title}}</span>
            <span><u>{{item.num}}</u>件</span>
          </div>
        </li>
      </ul>
      <div class="itembox downitem">
          <div class="itemhead">
            <span>处理事项回复率</span>
          </div>
          <div class="itembody">
            <div id="matter" class="echartbox"></div>
          </div>
      </div>
      <div class="itembox downitem">
         <div class="itemhead">
            <span>本年度类别事项统计</span>
         </div>
         <div class="itembody">
           <div id="category" class="echartbox"></div>
         </div>
      </div>
    </el-col>
    <el-col :span="14">
      <div class="itembox">
        <div class="itemhead">
            <span>本年度月事项上报情况</span>
            <div class="condition">
              <div class="citem">
                <label>年月：</label>
                <el-date-picker v-model="months" type="month" value-format="yyyy-MM" placeholder="请选年月" clearable @change="monthChange"></el-date-picker>
              </div>
            </div>
        </div>
        <div class="itembody">
          <div id="report" class="echartbox"></div>
        </div>
      </div>
      <div class="itembox">
        <div class="itemhead">
            <span>本年度镇街扫码分析</span>
            <div class="condition single">
              <div class="citem">
                <label>镇街：</label>
                <el-select v-model="areaval" placeholder="请选择镇街" clearable @change="areaChange" @clear="areaClear">
                  <el-option v-for="item in areaData" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
                </el-select>
              </div>
            </div>
        </div>
        <div class="itembody">
          <div id="analysis" class="echartbox"></div>
        </div>
      </div>
    </el-col>
  </el-row>

</template>
<script>
export { default } from './js/Tasktotal'
</script>
<style scoped lang="scss">
@import './style/Tasktotal.scss';
</style>
