/**
 * @author: Evan Deng
 * @desc: 活动结束后，主播填写兑奖信息界面
 * @Date: 2018-10-26 11:17:57
 */
<template>
  <div class="box">
    <div class="simple-rule">
      Selamat! Kamu menang total {{ activityDatas.money }} Rupiah. Silahkan masukkan biodatamu untuk pengiriman hadiah. Hadiah akan dikirim dalam waktu 15 hari kerja
    </div>
    <div class="form-box">
      <div class="input-wrapper">
        <label for="form-name">Nama:</label>
        <input
          id="form-name"
          v-model="name"
          type="text"
          autocorrect="off"
          spellcheck="false"
        >
      </div>
      <div class="input-wrapper">
        <label for="form-telephone">No Telepon:</label>
        <input
          id="form-telephone"
          v-model="phoneNumber"
          type="number"
          pattern="[0-9]*"
          @input="inputPhone"
        >
      </div>
      <div class="input-wrapper email-wrapper">
        <label for="form-email">Email:</label>
        <input
          id="form-email"
          v-model="email"
          type="text"
          autocorrect="off"
          spellcheck="false"
        >
      </div>
      <div
        :class="['submit-btn', { gray: !formDataReady }]"
        @click="submit"
      >Kirim</div>
    </div>
    <div class="footer" />
    <modal
      :modal-type="modalType"
      @confirm-modal="handleModal('confirm')"
      @close-modal="handleModal('close')"
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
      modalType: 0,
      name: '',
      phoneNumber: '',
      email: '',
      btnClock: false
    }
  },
  computed: {
    formDataReady() {
      return Boolean(this.name && this.phoneNumber && this.email)
    }
  },
  mounted() {
    uploadLog(4, 1)
  },
  methods: {
    inputPhone(e) {
      // 移动端即使写了type=number仍可以输入非数字，但是v-model检测不到值
      // 所以手动检测到没有值时，将值赋值为空
      if (!e.target.value) e.target.value = ''
    },
    submit() {
      if (this.formDataReady) {
        this.modalType = 6
      }
    },
    handleModal(action) {
      if (!this.btnClock) {
        if (action === 'close') {
          this.modalType = 0
          return
        }
        this.btnClock = true
        const postData = {
          userId: this.webviewBridge.userInfo.uid,
          name: this.name,
          phoneNumber: this.phoneNumber,
          email: this.email,
          inviteCode: this.inviteCode
        }
        uploadLog(4, 7)
        axios
          .post(`${getApiUrl('service')}convert`, postData)
          .then(({ data }) => {
            this.btnClock = false
            if (data.code === '0') {
              this.modalType = 0
              this.$emit('refresh')
              uploadLog(4, 8)
            } else {
              this.modalType = 7
            }
          })
          .catch(() => {
            this.btnClock = false
            this.modalType = 7
          })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@images: '../assets/images';

.simple-rule {
  margin-top: 184px;
  background: url('@{images}/line4-border.png') no-repeat;
  background-size: contain;
  padding: 12px 7px 2px 15.5px;
  width: 304px;
  height: 70px;
  font-size: 13px;
  line-height: 16px;
}
.form-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 62px;
}
.input-wrapper {
  margin-top: 25px;
  padding: 0 12px;
  width: 226px;
  line-height: 48px;
  height: 48px;
  font-size: 18px;
  color: #fff;
  background: #ff9b59;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 0 5px 1px rgba(238, 103, 35, 0.5) inset;
  label {
    flex-shrink: 0;
  }
  input {
    margin-left: 12px;
    border: none;
    outline: none;
    background: #ff9b59;
    color: #fff;
    font-size: 18px;
    flex-shrink: 1;
    min-width: 0;
    appearance: none;
    -webkit-tap-highlight-color: transparent;
  }
}
.submit-btn {
  margin-top: 30px;
  width: 250px;
  height: 43px;
  box-sizing: border-box;
  background-image: linear-gradient(0deg, #9345ff 0%, #a176ff 100%);
  border: 3px solid rgba(255, 255, 255, 0.51);
  border-radius: 35px;
  color: #fff;
  font-size: 23px;
  line-height: 37px;
  text-align: center;
  position: relative;
  &.gray:after {
    content: '';
    position: absolute;
    left: -3px;
    right: -3px;
    top: -3px;
    bottom: -3px;
    border-radius: 35px;
    border: 3px solid rgba(255, 255, 255, 0.51);
    background: rgba(0, 0, 0, 0.3);
  }
}
.footer {
  width: 200px;
  height: 27px;
  background: url('@{images}/footer.png') no-repeat center center;
  background-size: contain;
  margin-bottom: 10px;
}
</style>
