<script>
  export default {
    name: 'Analysis',
  }
</script>

<template>
  <div class="mapContainer">
    <!-- 地图 -->
    <div id="map"></div>
    <!-- 热力图 -->
    <div id="heatMap" v-show="false"></div>
    <!-- 工具栏 -->
    <map-tool></map-tool>
    <!-- 图层树 -->
    <el-popover
      popper-class="popoverLayer"
      placement="right-start"
      :visible-arrow="false"
      width="50%"
      trigger="manual"
      v-model="layerDialog.visible"
    >
      <div class="layerType">
        <!-- <div class="layerTypeItem" v-for="(item, index) in typelist" :key="index">
          <el-checkbox v-model="item.checked" @change="layerChange">
            {{ item.name }}
          </el-checkbox>
        </div> -->
        <!-- <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
          >全选</el-checkbox
        > -->
        <el-checkbox-group
          v-model="selectTypes"
          @change="layerChange"
          style="display: grid"
        >
          <el-checkbox
            :checked="item.checked"
            class="layerTypeItem"
            v-for="(item, index) in typelist"
            :label="item.pid"
            :key="index"
          >
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>

        <!-- <div class="layerTypeItem"><el-checkbox>交通事故</el-checkbox></div>
        <div class="layerTypeItem"><el-checkbox>紧急诉求</el-checkbox></div>
        <div class="layerTypeItem"><el-checkbox>投诉举报</el-checkbox></div> -->
      </div>
      <!-- <el-button slot="reference">click 激活</el-button> -->
      <div
        class="layerTreeIcon"
        @click="loadLayer"
        slot="reference"
        :class="layerDialog.visible ? 'layerTreeIconFocus' : ''"
      >
        <!-- <svg class="icon svg-icon" aria-hidden="true">
            <use xlink:href="#icon-anquan11"></use>
          </svg> -->
        <i class="iconfont icon-shaixuan"></i>
      </div>
    </el-popover>

    <!--搜索-->
    <el-popover
      popper-class="popoverLayer"
      placement="right-start"
      :visible-arrow="false"
      width="100%"
      trigger="manual"
      v-model="searchDialog.visible"
    >
      <div class="searchBox">
        <el-form
          label-position="right"
          label-width="80px"
          :model="searchDialog.searchForm"
        >
          <el-form-item label="事项类型">
            <el-select
              clearable
              v-model="searchDialog.searchForm.typeid"
              placeholder="请选择事项类型"
            >
              <el-option
                v-for="(item, index) in typelist"
                :key="index"
                :label="item.name"
                :value="item.pid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出警人员">
            <el-input
              v-model="searchDialog.searchForm.username"
              placeholder="输入出警人员"
            ></el-input>
          </el-form-item>
          <el-form-item label="报警时间">
            <el-date-picker
              style="width: 330px"
              v-model="searchDialog.searchForm.querydate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="处置状态">
            <el-select
              v-model="searchDialog.searchForm.type"
              placeholder="请选择处置状态"
            >
              <el-option label="待办" value="0"></el-option>
              <el-option label="已办" value="1"></el-option>
              <el-option label="作废" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-button
          style="width: 100%"
          type="primary"
          icon="el-icon-search"
          @click="getListData"
        >
          开始检索
        </el-button>
      </div>
      <div class="searchResultBox">
        <div
          v-for="(item, index) in searchDialog.searchResult"
          class="dataItem"
          @click="locationPoint(item)"
          :class="
            searchDialog.curLocationPid == item.pid ? 'dataItemFocus' : ''
          "
        >
          <span class="xuhao">{{ index + 1 }}</span>
          <el-image class="typeImageBox" :src="item.imgurl"></el-image>
          <span class="content">
            {{ item.typename }}&nbsp;{{ item.startdate }}
          </span>
        </div>
      </div>

      <div
        class="searchIcon"
        @click="loadSearchDialog"
        slot="reference"
        :class="searchDialog.visible ? 'layerTreeIconFocus' : ''"
      >
        <i class="iconfont icon-sousuowenjian"></i>
        <!-- <div>
          <svg class="icon svg-icon" aria-hidden="true">
            <use xlink:href="#icon-liebiaosousu"></use>
          </svg>
        </div> -->
      </div>
    </el-popover>

    <!--热力图-->
    <div :class="heatmapSelectVisible ? 'relituIcon' : ''">
      <!-- <div>
        <svg class="icon svg-icon" aria-hidden="true">
          <use xlink:href="#icon-relitu"></use>
        </svg>
      </div> -->
      <div
        @click="selctHeatMap"
        class="relituIcon-select"
        :class="relituIconFocus ? 'relituIcon-selectFocus' : ''"
      >
        <i class="iconfont icon-chartheat"></i>
      </div>
      <div v-if="heatmapSelectVisible">
        <div
          class="relituIcon-type"
          :class="heatmapTypeFocus ? 'relituIcon-Focus' : ''"
          @click="loadHeatMap(1)"
        >
          <i class="iconfont icon-anjian1"></i>
          <br />
          <span>类型</span>
        </div>
        <div
          class="relituIcon-midu"
          :class="heatmapMiduFocus ? 'relituIcon-midu-Focus' : ''"
          @click="loadHeatMap(2)"
        >
          <i class="iconfont icon-midutu"></i>
          <br />
          <span>密度</span>
        </div>
      </div>
    </div>

    <!--属性弹框  :visible.sync="true"-->
    <div class="attrBox">
      <el-dialog
        :visible.sync="attr.visible"
        :modal="false"
        width="20%"
        :close-on-click-modal="false"
        class="tool-basemap"
        title="属性信息"
        v-dialogDrag
      >
        <el-select
          class="timebox"
          v-model="attr.currData"
          placeholder="请选择"
          @change="attrChange"
        >
          <el-option
            v-for="(item, index) in attr.List"
            :key="index"
            :label="item.startdate"
            :value="item.pid"
          ></el-option>
        </el-select>
        <el-table
          :data="attr.SelData.attrTable"
          border
          stripe
          size="small"
          empty-text="暂无数据"
          max-height="300"
          :show-header="false"
        >
          <el-table-column prop="label" label="字段" align="center" />
          <el-table-column prop="value" label="值" align="center">
            <template slot-scope="scope">
              <el-link
                type="primary"
                v-if="scope.row.label === '操作'"
                style="color: #c8ff18"
                @click="lookDetils(scope.row.pid)"
              >
                {{ scope.row.value }}
              </el-link>
              <span v-else-if="scope.row.label === '处理类型'">
                {{
                  scope.row.value == 2
                    ? '作废'
                    : scope.row.value == 1
                    ? '已办'
                    : '待办'
                }}
              </span>
              <span v-else>
                {{ scope.row.value }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>

    <!--属性详细弹框  :visible.sync="true"-->
    <div class="attrDetailBox">
      <el-dialog
        :visible.sync="attr.detailVisible"
        :modal="false"
        width="35%"
        :close-on-click-modal="false"
        class="tool-basemap"
        title="属性信息详细"
        v-dialogDrag
      >
        <el-radio-group
          v-model="tabCard"
          class="radiogroup"
          @change="tabChange"
          size="medium"
          style="margin-bottom: 10px"
        >
          <el-radio-button label="baseinfo">基本信息</el-radio-button>
          <el-radio-button label="flowover">办理流程</el-radio-button>
        </el-radio-group>

        <el-form
          v-if="tabCard === 'baseinfo'"
          ref="formData"
          :model="formData"
          status-icon
          label-width="80px"
          class="el-formBox"
        >
          <el-form-item label="事项类别">
            <el-input v-model="formData.typename" readonly />
          </el-form-item>
          <el-form-item label="是否匿名" style="text-align: left">
            <el-select v-model="formData.uptype" disabled clearable>
              <el-option :value="0" label="否"></el-option>
              <el-option :value="1" label="是"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="formData.username" readonly />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="formData.pphone" readonly />
          </el-form-item>
          <el-form-item label="所属派出所">
            <el-input v-model="formData.selareaname" readonly />
          </el-form-item>
          <!-- <el-form-item label="家庭住址">
            <el-input v-model="formData.paddress" readonly placeholder="请输入家庭住址" />
          </el-form-item> -->
          <el-form-item label="事项内容">
            <el-input
              v-model="formData.repconten"
              readonly
              type="textarea"
              :rows="5"
              disabled
            />
          </el-form-item>
          <el-form-item label="上报时间" style="text-align: left">
            <el-date-picker
              v-model="formData.startdate"
              readonly
              type="date"
              value-format="yyyy-MM-dd hh:mm:ss"
              clearable
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="上报位置">
            <el-input v-model="formData.address" readonly disabled />
          </el-form-item>
          <el-form-item label="图片展示">
            <div v-if="!imgdata.length" class="imagebox">
              <i class="el-icon-picture-outline"></i>
              <u>暂无图片</u>
            </div>
            <div v-for="item in imgdata" v-else>
              <el-image
                :src="item"
                :preview-src-list="imgdata"
                :z-index="2999"
              ></el-image>
            </div>
          </el-form-item>
          <el-form-item label="驳回意见" v-if="formData.rejection">
            <el-input
              v-model="formData.rejection"
              type="textarea"
              :rows="5"
              disabled
            />
          </el-form-item>
          <el-form-item label="回复意见" v-if="formData.admincontent">
            <el-input
              v-model="formData.admincontent"
              type="textarea"
              :rows="5"
              disabled
            />
          </el-form-item>
          <el-form-item
            label="回复图片"
            v-if="formData.adminimages && formData.adminimages.length"
          >
            <div v-if="!urldata.length" class="imagebox">
              <i class="el-icon-picture-outline"></i>
              <u>暂无图片</u>
            </div>
            <div v-for="item in urldata" v-else>
              <el-image
                :src="item"
                :preview-src-list="urldata"
                :z-index="2999"
              />
            </div>
          </el-form-item>
          <!--          <el-form-item label="音频文件">-->
          <!--            <aplayer :music="audioList[0]" :list="audioList" :show-lrc="true" />-->
          <!--          </el-form-item>-->
          <el-form-item label="视频文件">
            <video-player
              ref="videoPlayer"
              :playsinline="true"
              :options="playerOptions"
            />
          </el-form-item>
        </el-form>
        <div v-if="tabCard === 'flowover'">
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in flowData"
              :key="index"
              placement="top"
              :timestamp="item.date ? item.date : ''"
            >
              <div class="timehead">
                <span>{{ item.username }}</span>
                <i class="blue">{{ item.stagename }}</i>
              </div>
              <div class="timebody">
                <span>{{ item.opinion ? item.opinion : '暂无办理意见' }}</span>
              </div>
              <!--              <div class="timefoot">-->
              <!--                <span class="nextman" v-if="item.nextstatename != ''">-->
              <!--                  <label>下阶段办理状态：</label>-->
              <!--                  <i class="org">{{ item.nextstatename }}</i>-->
              <!--                </span>-->
              <!--                <span class="nextman" v-if="item.nextusername != ''">-->
              <!--                  <label>办理人:</label>-->
              <!--                  {{ item.nextusername }}-->
              <!--                </span>-->
              <!--              </div>-->
            </el-timeline-item>
            <span class="notime" v-if="flowData.length === 0">暂无流程</span>
          </el-timeline>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<style lang="scss">
  @import './analysis.scss';
</style>
<script>
  export { default } from './js/Analysis.js'
</script>
