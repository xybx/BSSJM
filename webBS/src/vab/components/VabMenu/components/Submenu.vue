<template>
  <el-submenu
    ref="subMenu"
    :index="itemOrMenu.path"
    :popper-append-to-body="false"
    v-if="redcon ? itemOrMenu.childmenuindex == childMenuIndex && itemOrMenu.showMenuIndex == showMenuIndex : itemOrMenu.showMenuIndex == showMenuIndex"
    :class="{'is-collapse': collapse}"
  >
    <template #title>
      <!-- <vab-icon
        v-if="itemOrMenu.meta && itemOrMenu.meta.icon"
        :icon="itemOrMenu.meta.icon"
        :is-custom-svg="itemOrMenu.meta.isCustomSvg"
        :title="translateTitle(itemOrMenu.meta.title)"
      /> -->
      <i v-if="itemOrMenu.meta && itemOrMenu.meta.icon" :class="itemOrMenu.meta.icon" :title="translateTitle(itemOrMenu.meta.title)"></i>
      <span :title="translateTitle(itemOrMenu.meta.title)">{{ translateTitle(itemOrMenu.meta.title) }}</span>
    </template>
    <slot />
  </el-submenu>
</template>

<script>
  import variables from '@/vab/styles/variables/variables.scss'
  import { translateTitle } from '@/utils/i18n'
  import {mapGetters} from "vuex";

  export default {
    name: 'Submenu',
    props: {
      itemOrMenu: {
        type: Object,
        default() {
          return null
        },
      },
      redcon:Boolean
    },
    data(){
      return {
        showMenuIndex: 1,
        childMenuIndex:1
      }
    },
    computed:{
      variables() {
        return variables
      },
      ...mapGetters({
        collapse: 'settings/collapse',
      }),
    },
    mounted() {
      this.showMenuIndex = localStorage.getItem('showMenuIndex')
      this.childMenuIndex = localStorage.getItem('childMenuIndex')
    },
    methods: {
      translateTitle,
    },
  }
</script>
<style lang="scss" scoped>
::v-deep{
  i.iconfont{
    font-size: 18px;
    position: relative;
    top: -1px;
    line-height: 75px;
  }
  i.icon-Clapatwill{
    font-size: 24px;
    top: 1px;
  }
  i.icon-yonghuguanli{
    font-size: 24px;
    top: 1px;
  }
  i.icon-xinwenguanli{
    font-size: 22px;
    top: 0;
  }
  i.icon-xinfang{
    font-size: 24px;
    top: 0;
  }
  i.icon-renwuguanli{
    font-size: 22px;
    top: 0;
  }
  i.icon-wuzhihuanjingjiance{
    font-size: 22px;
    top: 0;
  }
}
</style>
