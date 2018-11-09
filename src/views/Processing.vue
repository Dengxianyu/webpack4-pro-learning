/**
 * @author: Evan Deng
 * @desc: 活动正在进行中的界面
 * @Date: 2018-10-26 11:16:48
 */
<template>
  <div class="box">
    <div
      v-if="!participated"
      class="unparticipated-display"
    >
      <input
        v-model.trim="inviteCode"
        class="input-invite-code"
        placeholder="Kode Verifikasi （Pilihan）"
        type="number"
        maxlength="6"
        pattern="[0-9]*"
        @input="inputCode"
      >
      <button
        class="participate"
        @click="participate"
      >Berpartisipasi
      </button>
    </div>
    <div
      v-if="participated"
      class="participated-display"
    >
      <span class="important-info">{{ activityDatas.invitedCount }}</span> teman sudah berhasil diundang, total hadiah
      <span class="important-info">{{ activityDatas.money }}</span> rupiah
    </div>
    <div class="common-content">
      <div class="simple-rule">
        Ambil Rp10,000 kamu dengan ikut serta, dan ambil Rp10,000 lainnya dengan mengajak temanmu ikutan event ini
      </div>
      <div class="total-participated">{{ activityDatas.totalParticipants }} orang telah berpartisipasi</div>
      <button
        class="invite-friends"
        @click="inviteFriends"
      >Undang teman</button>
      <div class="rule-details">
        <div class="rule-header">Syarat dan Kondisi</div>
        <div class="rule-paragraph">1. Mulai 1-30 November, peserta bisa mendapatkan Rp 10.000 per hari dengan menginstall Doyo dan mengundang teman untuk berpartisipasi, batas hadiah adalah 2 juta rupiah per hari.</div>
        <div class="rule-paragraph">2. Penebusan hadiah akan dimulai pada 1 Desember s/d 3 Desember, dan akan ditutup pada 4 Desember pkl 00:00.</div>
        <div class="rule-paragraph">3. Peserta wajib membagikan tautan untuk menginstall Doyo pada teman, lalu peserta bisa mendapatkan Rp10,000, s/d Rp2 juta per hari.</div>
        <div class="rule-paragraph">4. Dilarang curang. Seluruh kecurangan yang ditemukan akan langsung berakibat diskualifikasi pada peserta.</div>
      </div>
    </div>
    <modal
      :modal-type="modalType"
      :invite-name="inviteName"
      :invite-code="activityDatas.inviteCode"
      @close-modal="closeModal"
      @copy-code="copyCode"
      @share-code="shareCode"
    />
  </div>
</template>

<script>
import axios from 'axios'
import { getApiUrl, uploadLog } from '~/core/utils'
import Modal from '~/components/Modal'

export default {
  components: {
    modal: Modal
  },
  props: {
    activityDatas: {
      type: Object,
      required: true
    },
    webviewBridge: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      participated: Boolean(this.activityDatas.inviteCode),
      inviteCode: '',
      shareUrl: `${window.location.href}?invite_code=${
        this.activityDatas.inviteCode
      }`,
      modalType: 0,
      inviteName: '',
      btnClock: false
    }
  },
  mounted() {
    // 只有参与的用户才调起app右上角的分享按钮
    if (this.participated) {
      this.webviewBridge.showShareBtn(this.shareUrl, 'TraktiranTemanDoyo')
      uploadLog(2, 1)
    } else {
      uploadLog(1, 1)
    }
  },
  methods: {
    inputCode(e) {
      // 移动端即使写了type=number仍可以输入非数字，但是v-model检测不到值
      // 所以手动检测到没有值时，将值赋值为空
      if (!e.target.value) e.target.value = ''
    },
    participate() {
      if (this.btnClock) return
      this.btnClock = true
      const postData = {
        userId: this.webviewBridge.userInfo.uid,
        inviteCode: this.inviteCode
      }
      uploadLog(1, 2)
      axios
        .post(`${getApiUrl('service')}participate`, postData)
        .then(({ data }) => {
          this.btnClock = false
          if (data.code) {
            switch (data.code) {
              case '0':
                if (data.data.inviteName) {
                  this.modalType = 2
                  this.inviteName = data.data.inviteName
                } else {
                  this.modalType = 1
                }
                break
              case '4002':
                this.modalType = 3
                break
              default:
                this.modalType = 7
            }
          }
        })
        .catch(() => {
          this.btnClock = false
          this.modalType = 7
        })
    },
    inviteFriends() {
      if (!this.participated) {
        this.modalType = 4
      } else {
        this.modalType = 8
        uploadLog(2, 3)
      }
    },
    copyCode() {
      const input = document.createElement('input')
      input.setAttribute('readonly', 'readonly')
      input.setAttribute(
        'value',
        `Ayo live bareng aku! Pakai kode ${
          this.activityDatas.inviteCode
        } ini dan menangkan uang tunai! klik tautan: ${this.shareUrl}`
      )
      document.body.appendChild(input)
      input.select()
      input.setSelectionRange(0, 9999)
      if (document.execCommand('copy')) {
        document.execCommand('copy')
      }
      document.body.removeChild(input)
      this.modalType = 0
      uploadLog(2, 4)
    },
    shareCode() {
      this.webviewBridge.pullAppShare(this.shareUrl, 'TraktiranTemanDoyo')
      this.modalType = 0
      uploadLog(2, 5)
    },
    closeModal() {
      const shouldRefresh = [1, 2, 3, 6].includes(this.modalType)
      if (shouldRefresh) this.$emit('refresh')
      this.modalType = 0
    }
  }
}
</script>

<style lang="less" scoped>
@images: '../assets/images';

.unparticipated-display {
  z-index: 10;
  height: 155px;
  margin-top: 184px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.input-invite-code {
  width: 249.5px;
  height: 48.5px;
  font-size: 18px;
  color: #fff;
  background: #ff9b59;
  text-align: center;
  border: none;
  box-shadow: 0 0 5px 1px rgba(238, 103, 35, 0.5) inset;
  outline: none;
  appearance: none;
  -webkit-tap-highlight-color: transparent;
  &::placeholder {
    color: #fff;
    text-decoration: underline;
  }
}
button {
  background-image: linear-gradient(-180deg, #ffe23d 0%, #ffc11d 100%);
  border: 3px solid rgba(255, 255, 255, 0.51);
  box-sizing: border-box;
  color: #fff;
  outline: none;
}
.participate {
  width: 216px;
  height: 69.5px;
  font-size: 25px;
  font-weight: bold;
  border-radius: 69.5px;
}
.participated-display {
  z-index: 10;
  width: 304.5px;
  height: 125px;
  box-sizing: border-box;
  margin-top: 185px;
  background-image: linear-gradient(0deg, #9345ff 0%, #a176ff 100%);
  border: 3px solid rgba(255, 255, 255, 0.51);
  border-radius: 35px;
  font-size: 20px;
  color: #fff;
  padding: 20px 23px;
  .important-info {
    font-size: 22px;
    font-weight: bold;
  }
}
.common-content {
  background: url('@{images}/pipeline.png') 0 0 no-repeat;
  background-size: contain;
  margin: -40px 6px 0 14px;
  padding-bottom: 80px;
  width: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.simple-rule {
  background: url('@{images}/line3-border.png') no-repeat;
  background-size: contain;
  margin: 90px 0 0;
  padding: 12px 7px 2px 15.5px;
  width: 304px;
  height: 50px;
  font-size: 13px;
  line-height: 16px;
}
.total-participated {
  margin-top: 85px;
  background: url('@{images}/total-participated.png') no-repeat;
  background-size: contain;
  width: 300px;
  height: 40px;
  line-height: 40px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}
.invite-friends {
  margin-top: 32px;
  width: 239.5px;
  height: 56px;
  font-size: 24px;
  font-weight: bold;
  border-radius: 56px;
  z-index: 10;
}
.rule-details {
  background-image: linear-gradient(
    -180deg,
    rgba(197, 197, 197, 0.24) 0%,
    rgba(255, 255, 255, 0.2) 100%
  );
  border: 1.5px solid #9669ff;
  border-radius: 8px;
  width: 290px;
  height: 409px;
  margin: -28px 2px 0 -2px;
  font-size: 16px;
  line-height: 18px;
  padding: 36px 8px 15px;
  margin-left: -8px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.rule-header {
  text-align: center;
  line-height: 18px;
  font-size: 18px;
}
</style>
