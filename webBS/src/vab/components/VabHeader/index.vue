<template>
  <div class="vab-header">
    <div class="vab-main">
      <el-row :gutter="20">
        <template v-if="pages">
          <el-col :span="24">
              <div class="right-panel">
                <vab-avatar/>
              </div>
          </el-col>
        </template>
        <template v-else>
          <el-col :span="9">
            <vab-logo :layout="layout"/>
          </el-col>
          <el-col :span="15">
            <div class="right-panel">
              <el-menu
                v-if="'horizontal' === layout"
                :active-text-color="variables['menu-color-active']"
                :background-color="variables['menu-background']"
                :default-active="activeMenu"
                :text-color="variables['menu-color']"
                menu-trigger="hover"
                mode="horizontal">
                <template v-for="route in handleRoutes">
                  <vab-menu v-if="!route.hidden && route.showMenuIndex !=23" :key="route.path" :item="route" :layout="layout"/>
                </template>
              </el-menu>
              <vab-avatar/>
            </div>
          </el-col>
        </template>
      </el-row>
    </div>
  </div>
</template>

<script>
  import variables from '@/vab/styles/variables/variables.scss'
  import { mapGetters } from 'vuex'
  import { handleActivePath } from '@/utils/routes'
  export default {
    name: 'VabHeader',
    props: {
      layout: {
        type: String,
        default: 'horizontal',
      },
      pages:{
        type:Boolean,
        default:false
      },
      redpage:Boolean,
      sflex:Number,
    },
    data() {
      return {
        activeMenu: '',
        menuTrigger: 'hover',
        baseurl:''
      }
    },
    created() {
      this.baseurl = this.$baseUrl
    },
    computed: {
      ...mapGetters({
        routes: 'routes/routes',
      }),
      variables() {
        return variables
      },
      handleRoutes() {
        return this.routes.flatMap((route) => {
          return route.menuHidden === true && route.children
            ? route.children
            : route
        })
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
  .vab-header {
    display: flex;
    align-items: center;
    justify-items: flex-end;
    height: $base-top-bar-height;
    //background: $base-menu-background;
    .vab-main {
      padding: 0 10px;
      .el-col-9{
        &.rhead{
          height: 80px;
          display: flex;
          align-items: center;
        }
        .flogo{
          width:508px;
          height:46px;
          background-size: 100% 100%!important;
        }
      }
      .el-col-15{
        padding-right: 15px!important;
        &.rhead{
          padding-right:10px!important;
        }
      }
      .right-panel {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: $base-top-bar-height;
        ::v-deep {
          > .el-menu--horizontal.el-menu
            > .el-submenu
            > .el-submenu__title
            > .el-submenu__icon-arrow {
            float: right;
            margin-top: ($base-top-bar-height - 11) / 2 !important;
          }

          > .el-menu--horizontal.el-menu > .el-menu-item {
            .el-tag {
              margin-top: $base-top-bar-height / 2 - 7.5 !important;
              margin-left: 5px;
            }

            .vab-dot {
              float: right;
              margin-top: ($base-top-bar-height - 6) / 2 + 1;
            }

            @media only screen and (max-width: 1199px) {
              .el-tag {
                display: none;
              }
            }
          }

          .el-menu {
            &.redpage{
              .el-menu-item {
                background: transparent!important;
                &.is-active {
                  background: $base-color-red !important;
                }
              }
              .el-submenu{
                &.is-active {
                  background: $base-color-red !important;
                }
                .el-submenu__title{
                  background: transparent!important;
                }
              }
              .el-menu--horizontal .el-menu{
                background:#ff0707 !important;
              }
            }
            &.el-menu--horizontal {
              display: flex;
              align-items: center;
              justify-content: flex-end;
              height: $base-top-bar-height;
              border-bottom: 0 solid transparent !important;
              //border-bottom: 3px solid #1a7bd4 !important;
              background: transparent!important;
              .el-menu-item{
                height: $base-top-bar-height/1.6;
                padding: 0 $base-padding;
                line-height: $base-top-bar-height/1.6;
              }
              .el-submenu__title {
                //height: $base-top-bar-height/1.3;
                //line-height: $base-top-bar-height/1.3;
                height: $base-top-bar-height;
                padding: 0 $base-padding;
                line-height: $base-top-bar-height;
              }

              > .el-menu-item,
              > .el-submenu {
                height: $base-top-bar-height;
                line-height: $base-top-bar-height;

                .el-submenu__icon-arrow {
                  float: right;
                  margin-top: ($base-menu-item-height - 16) / 2;
                }

                > .el-submenu__title {
                  height: $base-top-bar-height;
                  //line-height: $base-top-bar-height;
                }
              }
              .el-menu-item,.el-submenu__title{
                transition: none!important;
              }
            }

            [class*='ri-'] {
              margin-left: 0;
              color: rgba($base-color-white, 0.9);
              cursor: pointer;
            }

            .el-submenu,
            .el-menu-item {
              i {
                color: inherit;
              }

              &.is-active {
                border-bottom: 0 solid transparent;
                //border-bottom: 4px solid #c7e2fb !important;

                .el-submenu__title {
                  border-bottom: 0 solid transparent;
                }
              }
            }

            .el-menu-item {
              &.is-active {
                background: $base-color-blue !important;
              }
            }
          }

          .user-name {
            color: rgba($base-color-white, 0.9);
          }

          .user-name + i {
            color: rgba($base-color-white, 0.9);
          }

          [class*='ri-'] {
            margin-left: $base-margin;
            color: rgba($base-color-white, 0.9);
            cursor: pointer;
          }

          button {
            svg {
              margin-right: 0;
              color: rgba($base-color-white, 0.9);
              cursor: pointer;
              fill: rgba($base-color-white, 0.9);
            }
          }
        }
      }

    }
  }
</style>
