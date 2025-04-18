<template>
  <el-menu-item v-if="redcon ? itemOrMenu.childmenuindex == childMenuIndex && itemOrMenu.showMenuIndex == showMenuIndex : itemOrMenu.showMenuIndex == showMenuIndex" :index="itemOrMenu.path" @click="handleLink">
    <!-- <vab-icon
      v-if="itemOrMenu.meta && itemOrMenu.meta.icon"
      :icon="itemOrMenu.meta.icon"
      :is-custom-svg="itemOrMenu.meta.isCustomSvg"
      :title="translateTitle(itemOrMenu.meta.title)"
    /> -->
    <i v-if="itemOrMenu.meta && itemOrMenu.meta.icon" :class="itemOrMenu.meta.icon" :title="translateTitle(itemOrMenu.meta.title)"></i>
    <span :title="translateTitle(itemOrMenu.meta.title)">
      {{ translateTitle(itemOrMenu.meta.title) }}
    </span>
    <el-tag v-if="itemOrMenu.meta && itemOrMenu.meta.badge" effect="dark" type="danger">
      {{ itemOrMenu.meta.badge }}
    </el-tag>
    <span v-if="itemOrMenu.meta && itemOrMenu.meta.dot" class="vab-dot vab-dot-error"></span>
  </el-menu-item>
</template>

<script>
  import variables from '@/vab/styles/variables/variables.scss'
  import { routerMode } from '@/config'
  import { translateTitle } from '@/utils/i18n'
  import { isExternal } from '@/utils/validate'
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'MenuItem',
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
    computed: {
      variables() {
        return variables
      },
      ...mapGetters({
        device: 'settings/device',
      }),
    },
    mounted(){
      this.showMenuIndex = localStorage.getItem('showMenuIndex')
      this.childMenuIndex = localStorage.getItem('childMenuIndex')
    },
    methods: {
      translateTitle,
      ...mapActions({
        foldSideBar: 'settings/foldSideBar',
      }),
      handleLink() {
        const routePath = this.itemOrMenu.path
        const target = this.itemOrMenu.meta.target
        if (target === '_blank') {
          if (isExternal(routePath)) window.open(routePath)
          else if (this.$route.fullPath !== routePath)
            routerMode === 'hash'
              ? window.open('/#' + routePath)
              : window.open(routePath)
        } else {
          if (isExternal(routePath)) window.location.href = routePath
          else if (this.$route.fullPath !== routePath) {
            if (this.device === 'mobile') this.foldSideBar()
            this.$router.push(routePath)
          }
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  ::v-deep {
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
    i.icon-xinwen{
      font-size: 22px;
      top: 0;
    }
    i.icon-yingxiaoguanli-dingdanguanli{
      font-size: 22px;
      top: 0;
    }
    .el-tag {
      float: right;
      height: 16px;
      padding-right: 4px;
      padding-left: 4px;
      margin-top: ($base-menu-item-height - 16) / 2;
      line-height: 16px;
      border: 0;
    }
  }

  .vab-dot {
    float: right;
    margin-top: ($base-menu-item-height - 6) / 2 + 1;
  }
</style>
