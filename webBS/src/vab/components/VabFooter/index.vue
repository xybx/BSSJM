<!--
 * @Author: xybx
 * @Date: 2022-03-15 09:17:07
 * @LastEditTime: 2023-03-10 13:24:33
 * @LastEditors: xybx
 * @Description: WEB OR VUE Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <footer class="vab-footer">
    Copyright
    <!-- <vab-icon icon="copyright-line" /> -->
    <i class="iconfont icon-copyright"></i>
    {{ title }} {{ fullYear }}
  </footer>
</template>

<script>
  import { title } from '@/config'

  export default {
    name: 'VabFooter',
    data() {
      return {
        fullYear: new Date().getFullYear(),
        title,
      }
    },
  }
</script>

<style lang="scss" scoped>
  .vab-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 55px;
    padding: 0 $base-padding 0 $base-padding;
    color: rgba(0, 0, 0, 0.45);
    background: $base-color-white;
    border-top: 1px dashed $base-border-color;

    i {
      margin: 0 5px;
    }
  }
</style>
