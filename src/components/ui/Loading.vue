/**
 * @author: Evan Deng
 * @desc: 用lottie实现的简单loading动图
 * @Date: 2018-10-29 09:53:30
 */
<template>
  <div class="loading-box" />
</template>

<script>
import lottie from 'lottie-web'
import loading from '~/assets/images/loading.json'

export default {
  mounted() {
    lottie.loadAnimation({
      container: document.querySelector('.loading-box'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: loading
    })
  }
}
</script>

<style>
.loading-box {
  width: 96px;
  height: 48px;
}
</style>
