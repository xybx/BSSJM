<template>
  <el-scrollbar
    :class="{ 'is-collapse': collapse, 'side-bar-common': layout === 'common' , 'side-bar-red': redcommon }"
    class="vab-side-bar"
  >
    <vab-logo v-if="layout === 'vertical' || layout === 'comprehensive'" />
    <el-menu
      :active-text-color="variables['menu-color-active']"
      :background-color="variables['menu-background']"
      :collapse="collapse"
      :collapse-transition="false"
      :default-active="activeMenu"
      :default-openeds="defaultOpeneds"
      :text-color="variables['menu-color']"
      :unique-opened="uniqueOpened"
      menu-trigger="click"
      mode="vertical"
      :class="redcommon ? 'redcon' : ''">
      <template v-for="(route,index) in handleRoutes">
        <vab-menu v-if="!route.hidden" :key="index" :item="route" :redcommon="redcommon" />
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script>
  import variables from '@/vab/styles/variables/variables.scss'
  import { mapGetters } from 'vuex'
  import { defaultOpeneds, uniqueOpened } from '@/config'
  import { handleActivePath } from '@/utils/routes'
  export default {
    name: 'VabSideBar',
    props: {
      layout: {
        type: String,
        default: 'vertical',
      },
      redcommon:Boolean,
    },
    data() {
      return {
        activeMenu: '',
        defaultOpeneds,
        uniqueOpened,
        variables,
      }
    },
    computed: {
      ...mapGetters({
        collapse: 'settings/collapse',
        extra: 'settings/extra',
        routes: 'routes/routes',
      }),
      handleRoutes() {
        return this.layout === 'comprehensive'
          ? this.handlePartialRoutes
          : this.routes.flatMap((route) =>
              route.menuHidden === true && route.children
                ? route.children
                : route
            )
      },
      handlePartialRoutes() {
        const activeMenu = this.routes.find((_) => _.name === this.extra.first)
        return activeMenu ? activeMenu.children : []
      },
    },
    watch: {
      $route: {
        handler(route) {
          this.activeMenu = handleActivePath(route)
        },
        immediate: true,
      },
    },
  }
</script>

<style lang="scss" scoped>
  @mixin active {
    &:hover {
      color: $base-color-white;
      background-color: $base-menu-background-active !important;
    }
    &.is-active {
      color: $base-color-white;
      background-color: $base-menu-background-active !important;
    }
  }
  @mixin redactive{
    &:hover {
      color:#333!important;
      background-color:rgba(255,255,255,.98)!important;
      i{
        color:#E93326;
      }
    }
    &.is-active {
      color:#333!important;
      background-color:rgba(255,255,255,.98)!important;
      i{
        color:#E93326;
      }
    }
  }
  .vab-side-bar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: $base-z-index + 1;
    width: $base-left-menu-width;
    height: 100vh;
    overflow: hidden;
    //background: $base-menu-background;
    box-shadow: $base-box-shadow;
    transition: $base-transition;

    &.side-bar-common {
      top: $base-top-bar-height;
      height: calc(100vh - #{$base-top-bar-height});
      background:linear-gradient(to right, #0672ce, #0CA9E2)!important;
    }

    &.side-bar-red{
      background:linear-gradient(to bottom, #e36038, #eb2520)!important;
    }
    &.is-collapse {
      width: $base-left-menu-width-min;
      border-right: 0;

      ::v-deep {
        .el-menu--collapse.el-menu {
          > .el-menu-item,
          > .el-submenu {
            text-align: center;
            .el-tag {
              display: none;
            }
          }
        }
        .el-menu-item,
        .el-submenu {
          text-align: left;
        }

        .el-menu--collapse {
          border-right: 0;

          .el-submenu__icon-arrow {
            right: 10px;
            margin-top: -3px;
          }
        }
      }
    }

    ::v-deep {
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }

      .el-menu {
        border: 0;
        background: none!important;
        .el-menu-item{
          background: none!important;
        }
        .el-submenu{
          .el-menu{
            background: rgba(255,255,255,.25)!important;
          }
          &.is-active.is-collapse:hover,&.is-active.is-collapse{
            background-color:$base-menu-background-active;
          }
          .el-submenu__title{
            //background: rgba(0,0,0,.3)!important;
            background: none!important;
            &:hover{
              background-color: #399efd !important;
            }
          }
          .el-menu--vertical{
            .el-menu{
              background:linear-gradient(to right, #0672ce, #0CA9E2)!important;
            }
          }
        }
      }

      .el-menu-item,
      .el-submenu__title {
        height: $base-menu-item-height;
        overflow: hidden;
        line-height: $base-menu-item-height;
        //text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
        i {
          color: inherit;
          line-height: normal;
          //margin-right: 8px;
        }
        span{
          margin-left: 8px;
        }
        .el-submenu__icon-arrow{
          line-height: normal;
        }
        &:hover{
          i.iconfont{
            transform: rotateY(360deg) translate(4px) scale(0.9);
            transition: all 0.5s linear;
          }
        }
      }
      .el-menu-item {
        @include active;
      }
      .redcon{
        .el-menu-item{
          @include redactive
        }
        .el-menu-item,
        .el-submenu__title{

        }
      }
    }
  }
</style>
