/**
 * @author: Evan Deng
 * @desc: 活动被分享出去在端外显示的界面
 * @Date: 2018-10-26 11:16:48
 */
<template>
  <div class="box">
    <div class="simple-rule">
      Ambil Rp10,000 kamu dengan ikut serta, dan ambil Rp10,000 lainnya dengan mengajak temanmu ikutan event ini
    </div>
    <div class="invite-code-wrapper">
      <div class="invite-code">
        <span
          v-for="(value, key) in inviteCode"
          :key="key"
        >{{ value }}</span>
      </div>
      <div class="invite-tip">Jangan lupa untuk masukkan</div>
      <button
        class="participate-btn"
        @click="openInApp"
      >Berpartisipasi</button>
    </div>
  </div>
</template>

<script>
import { getOpenAppUrl, uploadLog } from '~/core/utils'

export default {
  props: {
    inviteCode: {
      type: String,
      required: true
    }
  },
  mounted() {
    uploadLog(6, 1)
  },
  methods: {
    openInApp() {
      window.open(getOpenAppUrl())
    }
  }
}
</script>

<style lang="less" scoped>
@images: '../assets/images';

.simple-rule {
  margin-top: 184px;
  background: url('@{images}/line3-border.png') no-repeat;
  background-size: contain;
  padding: 12px 7px 2px 15.5px;
  width: 304px;
  height: 70px;
  font-size: 13px;
  line-height: 16px;
}
.invite-code-wrapper {
  background: url('@{images}/invite-code.png') no-repeat;
  background-size: contain;
  margin: 0 5px 0 10px;
  width: 345px;
  height: 554px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.invite-code {
  margin-top: 180px;
  font-size: 50px;
  font-weight: bold;
  display: flex;
  width: 220px;
  justify-content: space-between;
}
.invite-tip {
  margin-top: 30px;
}
.participate-btn {
  background-image: linear-gradient(-180deg, #ffe23d 0%, #ffc11d 100%);
  border: 3px solid rgba(255, 255, 255, 0.51);
  border-radius: 35px;
  box-sizing: border-box;
  width: 216px;
  height: 69.5px;
  color: #fff;
  font-size: 25px;
  margin-top: 96px;
  font-weight: bold;
}
</style>
