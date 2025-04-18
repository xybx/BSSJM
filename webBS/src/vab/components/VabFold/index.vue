<!--
 * @Author: xybx
 * @Date: 2022-03-15 09:17:07
 * @LastEditTime: 2023-03-10 14:01:06
 * @LastEditors: xybx
 * @Description: WEB OR VUE Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <!-- <vab-icon
    :icon="collapse ? 'menu-unfold-line' : 'menu-fold-line'"
    class="fold-unfold"
    @click="toggleCollapse"
  /> -->
  <span class="fold-unfold iconfont" :class="collapse ? 'icon-menu-unfold' : 'icon-menu-fold'" @click="toggleCollapse"></span>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'VabFold',
    data() {
      return {}
    },
    computed: {
      ...mapGetters({
        collapse: 'settings/collapse',
      }),
    },
    methods: {
      ...mapActions({
        toggleCollapse: 'settings/toggleCollapse',
      }),
    },
  }
</script>

<style lang="scss" scoped>
  .fold-unfold {
    color: $base-color-grey;
    cursor: pointer;
  }
</style>
