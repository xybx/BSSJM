<template>
  <!--常规布局 -->
  <el-container :class="{fixed: fixedHeader,'no-tabs-bar': !showTabs,}" class="vab-layout-common">
    <el-header :class="{'fixed-header': fixedHeader,}" class="vab-layout-header">
      <vab-header layout="common" :redcon="true" />
    </el-header>
    <el-container>
      <el-aside :class="{'is-collapse': collapse}">
        <vab-side-bar layout="common" :redcommon="true" />
      </el-aside>
      <el-main :class="{'is-collapse-main': collapse,}" class="vab-main main-padding">
        <vab-app-main />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import variables from '@/vab/styles/variables/variables.scss'
  import {mapGetters} from "vuex";
  export default {
    name: 'VabLayoutCommon',
    data(){
      return {
        variables,
      }
    },
    props: {
      // collapse: {
      //   type: Boolean,
      //   default() {
      //     return false
      //   },
      // },
      fixedHeader: {
        type: Boolean,
        default() {
          return true
        },
      },
      showTabs: {
        type: Boolean,
        default() {
          return true
        },
      },
      device: {
        type: String,
        default() {
          return 'desktop'
        },
      },
    },
    computed:{
      ...mapGetters({
        collapse: 'settings/collapse',
      }),
    },
  }
</script>

<style lang="scss" scoped>
  .vab-layout-common {
    position:relative;
    min-height: 100%;
    .fixed-header {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      width:100%;
      overflow: hidden;
      z-index:1998;
      height: 80px!important;
      padding: 0;
      background: url('~@/assets/headerbgred.png') top center no-repeat!important;
      background-size: 100% 100%!important;
      ::v-deep{
        .vab-header {
          .vab-main {
            width: 100%;
          }
        }
      }
    }
    .el-container{
      position: absolute;
      top:80px;
      left:0;
      right: 0;
      bottom: 0;
      overflow:hidden;
      .el-aside{
        width: $base-left-menu-width!important;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), border 0s, color 0.1s, font-size 0s;
        &.is-collapse{
          width: $base-left-menu-width-min!important;
          border-right: 0;
        }
      }
      .el-main{
        padding: 0;
        width:$base-right-content-width;
        &.is-collapse-main{
          width:$base-right-content-width-min;
        }
      }
    }


    ::v-deep {
      .vab-tabs-content {
        width: calc(100% - 60px - #{$base-font-size-default} - #{$base-padding} - 2px) !important;
        .el-tabs__header{
          margin-bottom: 0;
        }
      }
      .vab-app-main{
        overflow-y:auto!important;
        padding:10px!important;
        height:100%;
        section{
          height: auto;
          background:none!important;
        }
      }
    }
  }
</style>
