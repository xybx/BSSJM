<template>
  <div :class="{['logo-container-' + theme.layout]: true,}" class="logo-container" :style="pages ? 'background:transparent!important' : ''">
<!--    <router-link to="/">-->
<!--      <span class="logo">-->
<!--        <vab-icon v-if="logo" :icon="logo" is-custom-svg />-->
<!--      </span>-->
<!--    </router-link>-->
    <span :class="{ 'hidden-xs-only': theme.layout === 'horizontal' , 'pagetit': pages}" class="title animate__animated animate__bounceInLeft">
        {{title }}
      </span>
      <el-button class="menubtn animate__animated animate__bounceInRight" @click="backClick">返回主菜单</el-button>
    <vab-fold class="animate__animated animate__fadeInDown" v-if="layout === 'common'" />
    <!-- <vab-breadcrumb class="hidden-xs-only" />-->
    <!--<vab-breadcrumb />-->
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'VabLogo',
    props:{
      pages:{
        type:Boolean,
        default:false
      },
      layout: {
        type: String,
        default: 'horizontal',
      },
    },
    computed: {
      ...mapGetters({
        logo: 'settings/logo',
        title: 'settings/title',
        theme: 'settings/theme',
      }),
    },
    methods:{
      backClick(){
        this.$router.push('/')
        // window.location.reload()
      },
    },
  }
</script>

<style lang="scss" scoped>
  @mixin container {
    position: relative;
    height: $base-top-bar-height;
    overflow: hidden;
    line-height: $base-top-bar-height;
    background: transparent;
    display: flex;
    align-items: center;
    flex-direction: row;
  }

  @mixin logo {
    display: inline-block;
    width: 32px;
    height: 32px;
    color: $base-title-color;
    vertical-align: middle;
  }

  @mixin title {
    display: inline-block;
    margin-left: 5px;
    overflow: hidden;
    //font-size: 20px;
    font-size: 1.9vw;
    line-height: 75px;
    color: $base-title-color;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
    font-weight: bold;
    //-webkit-line-clamp: 2;
    //background-image: -webkit-linear-gradient(bottom, #97DAED,#ffffff);
    //-webkit-background-clip: text;
    //-webkit-text-fill-color: transparent;
  }
  .logo-container {
    &-horizontal,
    &-common {
      @include container;

      .logo {
        svg,
        img {
          @include logo;
        }
      }
      .title {
        @include title;
      }
      ::v-deep {
        .fold-unfold {
          margin-left:15px;
          color: #fff;
          font-size: 22px;
        }
      }
      .pagetit{
        font-size: 40px!important;
        color: $base-title-color;
        -webkit-line-clamp:0;
        background-image: none;
        -webkit-background-clip: inherit;
        -webkit-text-fill-color: inherit;
      }
      .menubtn{
        margin-left:20px;
        background-color: rgba(255,255,255,.2);
        color:#fff;
        font-size: 13px;
      }
    }

    &-vertical,
    &-column,
    &-comprehensive {
      @include container;

      height: $base-logo-height;
      line-height: $base-logo-height;
      text-align: center;

      .logo {
        svg,
        img {
          @include logo;
        }
      }

      .title {
        @include title;
        max-width: $base-left-menu-width - 60;
      }
    }

    &-column {
      background: $base-column-second-menu-background !important;

      .logo {
        position: fixed;
        top: 0;
        display: block;
        width: $base-left-menu-width-min;
        height: $base-logo-height;
        margin: 0;
        background: $base-column-first-menu-background;
      }

      .title {
        padding-right: 15px;
        padding-left: 15px;
        margin-left: $base-left-menu-width-min !important;
        color: $base-color-black !important;
        background: $base-column-second-menu-background !important;
        @include title;
      }
    }
    .router-link-active{
      display: inline-block;
      float: left;
    }
  }
</style>
