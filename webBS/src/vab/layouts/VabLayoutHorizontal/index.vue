<template>
  <!-- 横向布局 -->
  <div
    :class="{
      fixed: fixedHeader,
      'no-tabs-bar': !showTabs,
    }"
    class="vab-layout-horizontal"
  >
    <div
      :class="{
        'fixed-header': fixedHeader,
      }"
      class="vab-layout-header"
    >
      <vab-header />
      <div
        v-show="showTabs"
        :class="{
          'vab-tabs-horizontal': showTabs,
        }"
      >
        <div class="vab-main">
          <vab-tabs />
        </div>
      </div>
    </div>
    <div class="vab-main main-padding">
      <vab-app-main />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'VabLayoutHorizontal',
    props: {
      collapse: {
        type: Boolean,
        default() {
          return false
        },
      },
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
  }
</script>

<style lang="scss" scoped>
  .vab-layout-horizontal {
    .vab-layout-header{
      ::v-deep {
        .vab-header{
          background: url('~@/assets/headerbg.png') top center no-repeat!important;
          background-size: 100% 100%!important;
          .vab-main {
            width: 100% !important;
            margin: auto;
            .logo-container-horizontal{
              background: transparent!important;
            }
          }
        }
      }
    }
    ::v-deep {
      .vab-main {
        width: 100% !important;
        margin: auto;
        .vab-app-main{
          padding: 0!important;
          section{
            background: none!important;
          }
        }
      }
    }
    .vab-tabs-horizontal {
      background: $base-color-white;
      box-shadow: $base-box-shadow;
    }

    .vab-nav {
      .fold-unfold {
        display: none;
      }
    }
  }
</style>
