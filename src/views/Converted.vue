/**
 * @author: Evan Deng
 * @desc: 活动结束后，主播已经兑奖后的界面
 * @Date: 2018-10-26 11:17:57
 */
<template>
  <div class="box">
    <div class="simple-rule">
      Informasi telah diterima. Hadiah akan dikirim dalam waktu 15 hari kerja (peserta yang curang akan didiskualifikasi dan tidak akan mendapat hadiah)
    </div>
    <div class="award-box">
      <div class="money">Rp {{ activityDatas.money }}</div>
      <div class="tip">Hadiah kamu sedang disiapkan, mohon sabar</div>
    </div>
    <div class="footer" />
  </div>
</template>

<script>
import { uploadLog } from '~/core/utils'

export default {
  props: {
    activityDatas: {
      type: Object,
      required: true
    }
  },
  mounted() {
    uploadLog(5, 1)
  }
}
</script>

<style lang="less" scoped>
@images: '../assets/images';

.simple-rule {
  margin-top: 200px;
  background: url('@{images}/line4-border.png') no-repeat;
  background-size: contain;
  padding: 12px 7px 2px 15.5px;
  width: 304px;
  height: 70px;
  font-size: 13px;
  line-height: 16px;
}
.award-box {
  margin: 49.5px 0 62px;
  padding: 5px;
  width: 247px;
  height: 162.5px;
  background: url('@{images}/awarded-show.png') no-repeat;
  background-size: contain;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  text-align: center;
}
.money {
  font-size: 34px;
}
.tip {
  font-size: 20px;
}
.footer {
  width: 200px;
  height: 27px;
  background: url('@{images}/footer.png') no-repeat center center;
  background-size: contain;
  margin-bottom: 10px;
}
</style>
