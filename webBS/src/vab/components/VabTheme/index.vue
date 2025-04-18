<!--
 * @Author: xybx
 * @Date: 2022-03-15 09:17:07
 * @LastEditTime: 2023-03-10 13:39:51
 * @LastEditors: xybx
 * @Description: WEB OR VUE Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <span v-if="theme.showTheme">
    <!-- <vab-icon icon="brush-2-line" @click="handleOpenTheme" /> -->
    <i class="iconfont icon-brush--line" @click="handleOpenTheme"></i>
  </span>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'VabTheme',
    computed: {
      ...mapGetters({
        theme: 'settings/theme',
      }),
    },
    methods: {
      handleOpenTheme() {
        this.$baseEventBus.$emit('theme')
      },
    },
  }
</script>
