<template>
  <div class="vab-app-main">
    <section>
      <transition mode="out-in" name="fade-transform">
        <vab-keep-alive v-if="routerView" />
      </transition>
    </section>
<!--    <vab-footer />-->
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import VabProgress from 'nprogress'

  export default {
    name: 'VabAppMain',
    data() {
      return {
        routerView: true,
      }
    },
    computed: {
      ...mapGetters({
        theme: 'settings/theme',
        extra: 'settings/extra',
        visitedRoutes: 'tabs/visitedRoutes',
      }),
      changeData() {
        return [
          ...new Set(
            this.visitedRoutes
              .filter(
                (item) =>
                  !item.meta.noKeepAlive &&
                  item.name !== this.extra.transferRouteName
              )
              .flatMap((item) => item.matched)
          ),
        ]
      },
    },
    watch: {
      changeData: {
        handler(visitedRoutes) {
          this.setCachedRoutes(visitedRoutes)
        },
      },
    },
    created() {
      const { showProgressBar } = this.theme
      // 单页面情况下重载路由
      this.$baseEventBus.$on('reload-router-view', () => {
        this.routerView = false
        if (showProgressBar) VabProgress.start()
        this.$nextTick(() => {
          this.routerView = true
          setTimeout(() => {
            if (showProgressBar) VabProgress.done()
          }, 200)
        })
      })
    },
    methods: {
      ...mapActions({
        setCachedRoutes: 'routes/setCachedRoutes',
      }),
    },
  }
</script>
