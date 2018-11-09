/**
 * @author: Evan Deng
 * @desc: 入口文件，判断是端内端外打开，活动进行中还是结束等逻辑
 * @Date: 2018-10-26 10:11:12
 */

<template>
  <div
    class="view-box"
  >
    <div
      v-if="dataPending"
      class="global-loading"
    >
      <loading />
      <div v-if="error">{{ error }}</div>
    </div>
    <div
      v-else-if="webviewBridge.appInner && !dataPending"
    >
      <progressing
        v-if="activityInProgress"
        class="same-bg"
        :activity-datas="activityDatas"
        :webview-bridge="webviewBridge"
        @refresh="fetchUserStatus"
      />
      <before-convert
        v-else-if="convertStatus === 0"
        class="same-bg"
        :activity-datas="activityDatas"
        @convert="readyConvert"
      />
      <converting
        v-else-if="convertStatus === 1"
        class="same-bg"
        :activity-datas="activityDatas"
        :webview-bridge="webviewBridge"
        @refresh="fetchUserStatus"
      />
      <converted
        v-else-if="convertStatus === 2"
        class="same-bg"
        :activity-datas="activityDatas"
      />
    </div>
    <share-invite-code
      v-else
      class="same-bg"
      :invite-code="inviteCode"
    />
  </div>
</template>

<script>
import axios from 'axios'
import {
  getUrlQuery,
  getWebviewBridge,
  moneyStyle,
  getApiUrl
} from '~/core/utils'
import Loading from '~/components/ui/Loading'

export default {
  components: {
    loading: Loading,
    progressing: () =>
      import(/* webpackChunkName: "inner" */ '~/views/Processing'),
    'before-convert': () =>
      import(/* webpackChunkName: "inner" */ '~/views/BeforeConvert'),
    converting: () =>
      import(/* webpackChunkName: "inner" */ '~/views/Converting.vue'),
    converted: () =>
      import(/* webpackChunkName: "inner" */ '~/views/Converted.vue'),
    'share-invite-code': () =>
      import(/* webpackChunkName: "outer" */ '~/views/ShareInviteCode.vue')
  },
  data() {
    return {
      webviewBridge: {},
      error: '',
      inviteCode: getUrlQuery().invite_code,
      fromApp: !getUrlQuery().invite_code,
      dataPending: true,
      activityInProgress: this.checkActivityStatus(),
      activityDatas: null,
      convertStatus: 0,
      counter: 2
    }
  },
  mounted() {
    getWebviewBridge()
      .then(webviewBridge => {
        this.webviewBridge = webviewBridge
        this.dataPending = false
        if (webviewBridge.appInner) {
          return this.fetchUserStatus()
        }
      })
      .catch(error => {
        this.error = error
      })
  },
  methods: {
    checkActivityStatus() {
      const now = new Date()
      const deadTime = new Date('2018-11-30')
      return +now < +deadTime
    },
    fetchUserStatus() {
      this.dataPending = true
      // this.webviewBridge.userInfo.uid = 'dy16064272'
      axios
        .get(
          `${getApiUrl('service')}getUserActiStatus?userId=${
            this.webviewBridge.userInfo.uid
          }`
        )
        .then(({ data }) => {
          if (data.code === '0' && data.data) {
            this.dataPending = false
            const statusData = data.data
            // 这里不能用属性statusData.invitedCount因为刚报名时为0，导致判断为负
            if ('invitedCount' in statusData) {
              statusData.money = moneyStyle(
                10000 + 10000 * statusData.invitedCount
              )
            }
            this.activityDatas = statusData
            this.convertStatus = statusData.isAward ? 2 : 0
          } else {
            this.error = data.msg
          }
        })
        .catch(error => {
          this.error = error
        })
    },
    readyConvert() {
      this.convertStatus = 1
    }
  }
}
</script>


<style lang="less">
@images: 'assets/images';

html {
  margin: 0;
  padding: 0;
  height: 100%;
}
body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: '-apple-system', 'BlinkMacSystemFont', 'Helvetica Neue',
    'PingFang SC', 'Microsoft YaHei', 'Source Han Sans SC', 'Noto Sans CJK SC',
    'WenQuanYi Micro Hei', 'sans-serif';
}
.view-box {
  width: 100%;
  height: 100%;
  background: #ff834f;
}
.global-loading {
  width: 100%;
  height: 100%;
  color: #fff;
  padding: 0 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.same-bg {
  background: #ff834f url('@{images}/background.png') no-repeat center center;
  background-size: 360px auto;
  background-position: 0 0;
  min-height: 100%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
