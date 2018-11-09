/**
 * @author: Evan Deng
 * @desc: 活动结束后，主播仍未兑奖的界面
 * @Date: 2018-10-26 11:16:48
 */
<template>
  <div class="box">
    <div class="simple-rule">
      Ambil Rp10,000 kamu dengan ikut serta, dan ambil Rp10,000 lainnya dengan mengajak temanmu ikutan event ini
    </div>
    <div class="total-award-box">
      <div class="content">
        <div class="total-award">Rp {{ activityDatas.money || 0 }}</div>
        <div class="unit">Rupiah</div>
        <button
          class="convert-btn"
          @click="convertAward"
        >Tukar</button>
        <div class="letter">Event udah selesai，makasi ya kak</div>
      </div>
    </div>
    <modal
      :modal-type="modalType"
      @close-modal="closeModal"
    />
  </div>
</template>

<script>
import Modal from '~/components/Modal'
import { uploadLog } from '~/core/utils'

export default {
  components: {
    modal: Modal
  },
  props: {
    activityDatas: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      modalType: 0
    }
  },
  mounted() {
    uploadLog(3, 1)
  },
  methods: {
    convertAward() {
      if (!this.activityDatas.inviteCode) {
        this.modalType = 5
      } else {
        this.$emit('convert')
        uploadLog(3, 6)
      }
    },
    closeModal() {
      this.modalType = 0
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
  padding: 12px 8px 2px 16px;
  width: 304px;
  height: 50px;
  font-size: 13px;
  line-height: 16px;
}
.total-award-box {
  background: url('@{images}/total-award.png') no-repeat;
  background-size: contain;
  margin: 20px 0 0 12px;
  width: 348px;
  height: 375px;
  position: relative;
}
.content {
  position: absolute;
  top: 130px;
  bottom: 62px;
  left: 48px;
  right: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.total-award {
  font-size: 35px;
  font-weight: bold;
}
.unit {
  font-size: 18px;
  margin-bottom: 30px;
}
.convert-btn {
  background-image: linear-gradient(0deg, #9345ff 0%, #a176ff 100%);
  border: 3px solid rgba(255, 255, 255, 0.51);
  border-radius: 35px;
  width: 155px;
  height: 43px;
  box-sizing: border-box;
  color: #fff;
  font-size: 25px;
  font-weight: bold;
}
.letter {
  font-size: 12px;
}
</style>
