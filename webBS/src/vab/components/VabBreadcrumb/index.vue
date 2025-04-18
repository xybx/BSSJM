<template>
  <el-breadcrumb class="vab-breadcrumb" separator=">">
    <el-breadcrumb-item v-for="(item, index) in levelList" :key="index">
      <a @click.prevent="handleLink(item.redirect)">
        <!-- <vab-icon v-if="item.meta && item.meta.icon" :icon="item.meta.icon" /> -->
        <i v-if="item.meta && item.meta.icon" :class="item.meta.icon"></i>
        {{ translateTitle(item.meta.title) }}
      </a>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  import { translateTitle } from '@/utils/i18n'
  export default {
    name: 'VabBreadcrumb',
    data() {
      return {
        levelList: [],
      }
    },
    watch: {
      $route: {
        handler() {
          this.levelList = this.getBreadcrumb()
        },
        immediate: true,
      },
    },
    methods: {
      translateTitle,
      getBreadcrumb() {
        return this.$route.matched.filter(
          (item) => item.meta && item.meta.title
        )
      },
      handleLink(redirect) {
        this.$router.push(redirect)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .vab-breadcrumb {
    height: $base-nav-height;
    font-size: $base-font-size-default;
    line-height: $base-nav-height;
    display:inline-block;
    margin-left:1vw;
    ::v-deep {
      .el-breadcrumb__item {
        .el-breadcrumb__separator{
          color: #fff;
        }
        .el-breadcrumb__inner {
          a {
            font-weight: normal;
            font-size:0.8vw;
            //color: #515a6e;
            color:#fff;
            i{
              line-height: 40px!important;
              position: relative;
              top: -2px;
              font-size: 1vw;
            }
            i.icon-Clapatwill{
              font-size: 1.2vw;
              top: 0;
            }
            i.icon-yonghuguanli{
              font-size: 1.2vw;
              top: 0;
            }
            i.icon-xinwenguanli{
              font-size: 1.2vw;
              top: 0;
            }
          }
        }

        &:last-child {
          .el-breadcrumb__inner {
            a {
              //color: #999;
              color:#fff;
            }
          }
        }
      }
    }
  }
</style>
