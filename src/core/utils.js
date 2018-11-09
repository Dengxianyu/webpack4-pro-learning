import axios from 'axios'
/**
 * @desc 获取url所带的query参数
 */
export const getUrlQuery = () => {
  const search = decodeURI(window.location.search)
  const pattern = /\??(\w+)=(\w+)&?/g
  const query = {}
  let res = {}
  /* eslint no-cond-assign: off */
  while ((res = pattern.exec(search)) !== null) {
    const key = res[1]
    const value = res[2]
    const findInQuery = query[key]
    if (findInQuery) {
      if (Array.isArray(findInQuery)) {
        findInQuery.push(value)
      } else {
        query[key] = [findInQuery, value]
      }
    } else {
      query[key] = value
    }
  }
  return query
}
/**
 * @desc webview层一些bridge api
 */
export const getWebviewBridge = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (window.android || window.getUserinfo) {
        const u = window.navigator.userAgent
        const isAndriod = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
        if (isAndriod) {
          try {
            const userInfo = JSON.parse(window.android.getUserinfo())
            window.notFristGetBridge = true
            resolve({
              appInner: Boolean(userInfo),
              userInfo,
              showShareBtn(url, msg) {
                window.android.showShareBtn(url, msg)
              },
              pullAppShare(url, msg) {
                window.android.pullAppShare(url, msg)
              }
            })
          } catch (err) {
            reject(err)
          }
        } else {
          try {
            const userInfo = JSON.parse(window.getUserinfo())
            window.notFristGetBridge = true
            resolve({
              appInner: Boolean(userInfo),
              userInfo,
              showShareBtn(url, msg) {
                window.showShareBtn(url, msg)
              },
              pullAppShare(url, msg) {
                window.pullAppShare(url, msg)
              }
            })
          } catch (err) {
            reject(err)
          }
        }
      } else {
        resolve({ appInner: false })
        window.notFristGetBridge = true
      }
    }, window.notFristGetBridge ? 0 : 500)
  })

/**
 * @desc 转换数字为金额形式的字符串
 */
export const moneyStyle = originNum => {
  const str = String(originNum)
  const strArray = str.split('').reverse()
  strArray.forEach((v, i, array) => {
    if ((i + 1) % 3 === 0 && i !== array.length - 1) {
      /* eslint no-param-reassign: "off" */
      array[i] = `,${v}`
    }
  })
  return strArray.reverse().join('')
}
/**
 * @desc 获取调起本地app的地址
 */
export const getOpenAppUrl = () => {
  /* eslint camelcase: off */
  const { share_id, share_from } = getUrlQuery()
  return `https://doyo.page.link?apn=com.doyo.game.live&ibi=com.douyu.doyo&isi=1435279138&link=https%3A%2F%2Fwww.doyo.tv%2Fhome%3Fshare_id%3D${share_id}%26share_from%3D${share_from}%26utm_source%3Dshare_home%26utm_medium%3Dshare_home%26utm_campaign%3Dshare_home%26utm_term%3Dshare_home%26utm_content%3Dshare_home%26pt%3Dshare_home%26at%3Dshare_home%26ct%3Dshare_home`
}
/**
 * @desc 获取不同环境下的后台接口地址
 */
export const getApiUrl = type => {
  const apiConfig = {
    development: {
      service: 'https://tapi.doyo.tv/v1/activity/',
      log: 'https://tdata.doyo.tv/doyodata-sdk/log?lt=activity'
    },
    production: {
      service: 'https://api.doyo.tv/v1/activity/',
      log: 'https://data.doyo.tv/doyodata-sdk/log?lt=activity'
    }
  }
  return apiConfig[process.env.NODE_ENV][type]
}
/**
 * @desc 获取当前本地时间，格式为2019-09-27 15:34
 */
export const getNowTimeStr = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const time = now.toTimeString().slice(0, 8)
  return `${year}-${month < 10 ? `0${month}` : month}-${
    day < 10 ? `0${day}` : day
  } ${time}`
}
/**
 * @desc 在相应埋点下上传log的函数
 * @param {*} userInfo 页面访问用户信息
 * @param {*} $route 当前vue-router路由
 * @param {*} type 操作动作
 */
export const uploadLog = (pageCode, actionCode) => {
  getWebviewBridge().then(({ appInner, userInfo }) => {
    /* eslint camelcase: off */
    const { share_id, share_from } = getUrlQuery()
    const time = getNowTimeStr()
    const config4UpLogs = {
      pageName: {
        1: '活动进行中未参与时主页面',
        2: '活动进行中参与页面',
        3: '活动结束未兑奖页面',
        4: '活动兑奖页面',
        5: '活动结束已兑奖页面',
        6: '活动在端外打开界面'
      },
      actionType: {
        1: '打开当前页面',
        2: '点击参与按钮',
        3: '点击邀请好友按钮',
        4: '复制邀请码方式分享',
        5: '客户端社交媒体方式分享',
        6: '点击前往兑奖按钮',
        7: '点击提交兑奖信息按钮',
        8: '成功提交兑奖信息'
      },
      shareFrom: {
        1: 'facebook',
        2: 'whatsapp',
        3: 'line'
      }
    }
    const options = {
      page_url: window.location.href,
      page_from: appInner ? 'APP inner' : 'APP outer',
      share_id: share_id || null,
      action_code: config4UpLogs.actionType[actionCode],
      action_time: time,
      action_from: config4UpLogs.shareFrom[share_from] || '其他',
      activity_type: '人拉人活动',
      page_name: config4UpLogs.pageName[pageCode]
    }
    const headers = {
      uid: userInfo ? userInfo.uid : null,
      nickname: userInfo ? userInfo.nickname : null
    }
    axios
      .post(getApiUrl('log'), options, {
        headers
      })
      .catch(() => {
        /* eslint no-console: off */
        console.error('upload log failed')
      })
  })
}
