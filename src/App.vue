<template>
  <div id="app">
    <!-- <PageLoading class="app-loading" name="line-scale-pulse-out" color="#776455" /> -->
    <router-view />
  </div>
</template>

<script>
import { httpUrl } from '@/module/systemConfig/SystemConfig.module.js'
export default {
  name: 'App',

  mounted() {
    this.bindEvent()

    if (!!localStorage.getItem('isLogin')) {
      this.$store.dispatch('requestUserInfo').then(({ data }) => {
        if (data.code === 0 && data.userfront) {
          this.systemInit(data.userfront)
        }
      })
    }
  },

  methods: {
    bindEvent() {
      this.$customEvent.on('login_success', data => {
        this.systemInit(data)
      })
    },
    systemInit(userfront) {

    }
  }
}
</script>
<style lang="less">
</style>