/**
 * @author: Evan Deng
 * @desc: 封装出业务中出现的几种弹框
 * @params：modalType为0表示关闭，
            为1表示未填好友邀请码下参加活动的成功提示
            为2表示填好友邀请码下参加活动的成功提示
            为3表示邀请码错误时候的提示
            为4表示在未参加活动的情况下点击邀请好友的提示
            为5表示在未参加活动的情况下点击兑换奖金的提示
            为6表示兑换奖金的提交提示
            为7表示接口返回报错时的提示
            为8表示邀请好友时的弹框选择方式的弹框
 * @Date: 2018-10-30 16:06:58
 */
<template>
  <div>
    <global-dialog
      v-if="modalType"
      :extra-class="modalType === 8 ? 'with-bg': ''"
      :show-header="modalType === 8 ? false: true"
      :show-close="modalType !== 6"
      @close-dialog="emitEvent('close-modal')"
    >
      <div v-if="modalType === 1">Selamat! Anda menang <span style="font-weight: bold; color: color: #666">Rp 10,000.</span> Undang banyak teman untuk dapat lebih banyak hadiah</div>
      <div v-if="modalType === 2">Selamat! Kamu dan temanmu {{ inviteName }} menang <span style="font-weight: bold; color: color: #666">Rp 10,000.</span> Ajak lebih banyak teman untuk dapat hadiah lainnya.</div>
      <div v-if="modalType === 3">Kode Verifikasi error</div>
      <div v-if="modalType === 4">Kamu harus mengklik berpartisipasi sebelum berbagi</div>
      <div v-if="modalType === 5">Maaf，kamu belum ikut events ini</div>
      <div v-if="modalType === 6">
        <div class="content-msg-6">Informasi tidak bisa diubah. Tetap masukkan?</div>
        <div class="dialog-btn-6">
          <span
            class="confirm"
            @click="emitEvent('confirm-modal')"
          >Ya</span>
          <span
            class="cancel"
            @click="emitEvent('close-modal')"
          >Tidak</span>
        </div>
      </div>
      <div v-if="modalType === 7">request failed, please try again</div>
      <div v-if="modalType === 8">
        <div
          class="modal-8-close"
          @click="emitEvent('close-modal')"
        />
        <div class="modal-8-title">Kode verifikasi saya</div>
        <div class="modal-8-code">{{ inviteCode }}</div>
        <div class="modal-8-btn-box">
          <button
            class="copy"
            @click="emitEvent('copy-code')"
          >Salin</button>
          <button
            class="share"
            @click="emitEvent('share-code')"
          >Bagikan</button>
        </div>
      </div>
    </global-dialog>
  </div>
</template>

<script>
import Dialog from '~/components/ui/Dialog'

export default {
  components: {
    'global-dialog': Dialog
  },
  props: {
    modalType: {
      required: true,
      type: Number
    },
    inviteName: {
      type: String,
      default: ''
    },
    inviteCode: {
      type: String,
      default: ''
    }
  },
  methods: {
    emitEvent(eventName) {
      this.$emit(eventName)
    }
  }
}
</script>

<style lang="less">
@images: '../assets/images';

.content-msg-6 {
  height: 60px;
}
.dialog-btn-6 {
  height: 21px;
  line-height: 21px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  span {
    width: 60px;
    text-align: center;
    margin-right: 18px;
    font-weight: bold;
  }
  .confirm {
    margin-right: 45px;
    color: #ff8a4f;
  }
}
.g-dialog-box.with-bg .dialog-main {
  width: 296px;
  height: 167px;
  background: url('@{images}/share-dialog.png');
  background-size: contain;
  border-radius: 15px;
  position: relative;
  text-align: center;
  color: #fff;
}
.modal-8-close {
  position: absolute;
  top: 0;
  right: 0;
  width: 36px;
  height: 36px;
  background: url('@{images}/white-close.png') center center no-repeat;
  background-size: 28px 28px;
}
.modal-8-title {
  font-size: 20px;
  line-height: 24px;
}
.modal-8-code {
  margin-top: 16px;
  font-size: 40px;
  line-height: 40px;
  text-shadow: 3.5px 1px 3px rgba(255, 155, 31, 0.96);
}
.modal-8-btn-box {
  margin-top: 24px;
  display: flex;
  justify-content: space-around;
  button {
    width: 112px;
    height: 32px;
    background-image: linear-gradient(0deg, #9345ff 0%, #a176ff 100%);
    border: 2px solid rgba(255, 255, 255, 0.51);
    border-radius: 28px;
    box-sizing: border-box;
    outline: none;
    font-size: 18px;
    color: #fff;
  }
}
</style>
