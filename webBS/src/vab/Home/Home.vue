<template>
  <el-container class="homebox animate__animated animate__fadeInLeft">
    <el-header class="animate__animated animate__delay-1s">
      <vabHeader :pages="pages"></vabHeader>
    </el-header>
    <el-main>
      <h3 class="animate__animated animate__flipInX animate__delay-1s" :title="titleName">{{titleName}}</h3>
      <ul class="mlist">
        <li v-for="(item,index) in moduleData" :key="index" class="animate__animated animate__delay-1s" :class="item.class" @click="menuClick(item.rindex)">
          <i class="iconfont" :class="item.icon"></i>
          <div class="cesium" v-if="item.rindex == 1">
            <span>{{item.name1}}</span>
            <span>{{item.name2}}</span>
          </div>
          <span v-else>{{item.name}}</span>
        </li>
      </ul>
    </el-main>
  </el-container>
</template>
<script>
export { default } from './Home'
</script>
<style scoped lang="scss">
@import "@/vab/styles/home/home.scss";
</style>
