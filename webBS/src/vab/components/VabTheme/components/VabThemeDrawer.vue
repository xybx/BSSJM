<template>
  <el-drawer
    :title="translateTitle('主题配置')"
    :visible.sync="drawerVisible"
    append-to-body
    custom-class="vab-drawer"
    direction="rtl"
    size="280px"
  >
    <el-scrollbar class="theme-scrollbar">
      <div class="el-drawer__body">
        <el-form ref="form" :model="theme" label-position="left">
          <el-divider content-position="left">
            <!-- <vab-icon icon="settings-3-line" /> -->
            <i class="iconfont icon-settings--line"></i> 
            {{ translateTitle('常用设置') }}
          </el-divider>
          <el-form-item>
            <template #label>
              <label class="el-form-item__label">
                {{ translateTitle('布局') }}
                <el-tooltip
                  :content="
                    translateTitle(
                      '布局配置仅在电脑视窗下生效，手机视窗时将默认锁定为纵向布局'
                    )
                  "
                  effect="dark"
                  placement="top"
                >
                  <!-- <vab-icon icon="question-line" /> -->
                  <i class="iconfont icon-question-line"></i> 
                </el-tooltip>
              </label>
            </template>
            <el-select v-model="theme.layout" :disabled="device === 'mobile'">
              <el-option
                key="column"
                :label="translateTitle('分栏')"
                value="column"
              />
              <el-option
                key="comprehensive"
                :label="translateTitle('综合')"
                value="comprehensive"
              />
              <el-option
                key="vertical"
                :label="translateTitle('纵向')"
                value="vertical"
              />
              <el-option
                key="horizontal"
                :label="translateTitle('横向')"
                value="horizontal"
              />
              <el-option
                key="common"
                :label="translateTitle('常规')"
                value="common"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="translateTitle('主题')">
            <el-select v-model="theme.themeName" @change="setTheme">
              <el-option
                key="default"
                :label="translateTitle('默认')"
                value="default"
              />
              <el-option
                key="ocean"
                :label="translateTitle('海洋之心')"
                value="ocean"
              />
              <el-option
                key="green"
                :label="translateTitle('绿荫草场')"
                value="green"
              />
              <el-option
                key="white"
                :label="translateTitle('碰触纯白')"
                value="white"
              />
              <!-- 月上重火主题请查看vip群文档，【彩蛋-赏金任务】模块获取 ，如不需要直接注释即可-->
              <el-option
                key="red"
                :label="translateTitle('月上重火') + '（非内置）'"
                value="red"
              />
              <!-- 月上重火主题请查看vip群文档，【彩蛋-赏金任务】模块获取 ，如不需要直接注释即可-->
            </el-select>
          </el-form-item>
          <el-form-item :label="translateTitle('标签')">
            <el-switch v-model="theme.showTabs" />
          </el-form-item>
          <el-form-item>
            <template #label>
              <label class="el-form-item__label">
                {{ translateTitle('标签图标') }}
                <el-tooltip
                  :content="translateTitle('标签开启时生效')"
                  effect="dark"
                  placement="top"
                >
                  <!-- <vab-icon icon="question-line" /> -->
                  <i class="iconfont icon-question-line"></i> 
                </el-tooltip>
              </label>
            </template>
            <el-switch
              v-model="theme.showTabsBarIcon"
              :disabled="!theme.showTabs"
            />
          </el-form-item>
          <el-form-item>
            <template #label>
              <label class="el-form-item__label">
                {{ translateTitle('标签风格') }}
                <el-tooltip
                  :content="translateTitle('标签开启时生效')"
                  effect="dark"
                  placement="top"
                >
                  <!-- <vab-icon icon="question-line" /> -->
                  <i class="iconfont icon-question-line"></i> 
                </el-tooltip>
              </label>
            </template>
            <el-select v-model="theme.tabsBarStyle" :disabled="!theme.showTabs">
              <el-option
                key="card"
                :label="translateTitle('卡片')"
                value="card"
              />
              <el-option
                key="smart"
                :label="translateTitle('灵动')"
                value="smart"
              />
              <el-option
                key="smooth"
                :label="translateTitle('圆滑')"
                value="smooth"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <template #label>
              <label class="el-form-item__label">
                {{ translateTitle('分栏风格') }}
                <el-tooltip
                  :content="translateTitle('分栏布局时生效')"
                  effect="dark"
                  placement="top"
                >
                  <!-- <vab-icon icon="question-line" /> -->
                  <i class="iconfont icon-question-line"></i> 
                </el-tooltip>
              </label>
            </template>
            <el-select
              v-model="theme.columnStyle"
              :disabled="theme.layout !== 'column'"
            >
              <el-option
                key="vertical"
                :label="translateTitle('纵向')"
                value="vertical"
              />
              <el-option
                key="horizontal"
                :label="translateTitle('横向')"
                value="horizontal"
              />
              <el-option
                key="card"
                :label="translateTitle('卡片')"
                value="card"
              />
            </el-select>
          </el-form-item>
          <el-divider content-position="left" style="margin-top: 20px">
            <!-- <vab-icon icon="settings-3-line" /> -->
            <i class="iconfont icon-settings--line"></i> 
            {{ translateTitle('其它设置') }}
          </el-divider>
          <el-form-item :label="translateTitle('头部固定')">
            <el-switch
              v-model="theme.fixedHeader"
              :disabled="theme.layout === 'common'"
            />
          </el-form-item>
          <el-form-item :label="translateTitle('国际化')">
            <el-switch v-model="theme.showLanguage" />
          </el-form-item>
          <el-form-item :label="translateTitle('进度条')">
            <el-switch v-model="theme.showProgressBar" />
          </el-form-item>
          <el-form-item :label="translateTitle('刷新')">
            <el-switch v-model="theme.showRefresh" />
          </el-form-item>
          <el-form-item :label="translateTitle('搜索')">
            <el-switch v-model="theme.showSearch" />
          </el-form-item>
          <el-form-item :label="translateTitle('通知')">
            <el-switch v-model="theme.showNotice" />
          </el-form-item>
          <el-form-item :label="translateTitle('全屏')">
            <el-switch v-model="theme.showFullScreen" />
          </el-form-item>
        </el-form>
      </div>
    </el-scrollbar>
    <div class="el-drawer__footer">
      <el-button type="primary" @click="handleSaveTheme">
        {{ translateTitle('保存') }}
      </el-button>
      <el-button @click="setDefaultTheme">
        {{ translateTitle('恢复默认') }}
      </el-button>
    </div>
  </el-drawer>
</template>

<script>
  import { translateTitle } from '@/utils/i18n'
  import { mapActions, mapGetters } from 'vuex'
  import _ from 'lodash'

  export default {
    name: 'VabThemeDrawer',
    data() {
      return {
        drawerVisible: false,
      }
    },
    computed: {
      ...mapGetters({
        theme: 'settings/theme',
        device: 'settings/device',
      }),
    },
    created() {
      this.$baseEventBus.$on('theme', () => {
        this.handleOpenTheme()
      })
      this.$baseEventBus.$on('random-theme', () => {
        this.randomTheme()
      })
      this.setTheme()
    },
    methods: {
      translateTitle,
      ...mapActions({
        saveTheme: 'settings/saveTheme',
        resetTheme: 'settings/resetTheme',
      }),
      handleOpenTheme() {
        this.drawerVisible = true
      },
      async setDefaultTheme() {
        await this.resetTheme()
        this.drawerVisible = false
      },
      async handleSaveTheme() {
        await this.saveTheme()
        this.drawerVisible = false
      },
      async randomTheme() {
        const loading = this.$baseColorfullLoading(0)
        // 随机换肤重置移除主题，防止代码更新影响样式
        await this.resetTheme()
        const themeNameArray = [
          'default',
          'ocean',
          'green',
          'white' /* , 'red' */,
        ]
        this.theme.themeName = _.sample(
          _.pull(themeNameArray, [this.theme.themeName])
        )
        const columnStyleArray = ['vertical', 'horizontal', 'card']
        this.theme.columnStyle = _.sample(
          _.pull(columnStyleArray, [this.theme.columnStyle])
        )
        const tabsBarStyleArray = ['card', 'smart', 'smooth']
        this.theme.tabsBarStyle = _.sample(
          _.pull(tabsBarStyleArray, [this.theme.tabsBarStyle])
        )
        const showTabsBarIconArray = [true, false]
        this.theme.showTabsBarIcon = _.sample(
          _.pull(showTabsBarIconArray, [this.theme.showTabsBarIcon])
        )
        if (this.device === 'desktop') {
          const layoutArray = [
            'horizontal',
            'vertical',
            'column',
            'comprehensive',
            'common',
          ]
          this.theme.layout = _.sample(_.pull(layoutArray, [this.theme.layout]))
        } else this.theme.layout = 'vertical'
        await this.setTheme()
        await this.saveTheme()
        setTimeout(() => {
          loading.close()
        }, 1000)
      },
      setTheme() {
        document.getElementsByTagName(
          'body'
        )[0].className = `vab-theme-${this.theme.themeName}`
      },
    },
  }
</script>

<style lang="scss" scoped>
  .theme-scrollbar {
    height: calc(100vh - 118px) !important;
    overflow: hidden;
  }
</style>
<style lang="scss">
  .vab-drawer {
    .el-drawer__header {
      margin-bottom: $base-margin;
    }

    .el-drawer__body {
      padding: 0 $base-padding/2 $base-padding/2 $base-padding/2;

      .el-divider--horizontal {
        margin: 20px 0 20px 0;
      }

      .el-form-item {
        display: flex;
        align-items: center;

        .el-form-item__label {
          flex: 1 1;
        }

        .el-form-item__content {
          flex: 0 0 auto;
        }
      }

      .el-form-item--small.el-form-item {
        .el-input__inner {
          width: 115px;
        }
      }
    }

    .el-drawer__footer {
      padding: $base-padding/2;
      border-top: 1px solid $base-border-color;
    }
  }
</style>
