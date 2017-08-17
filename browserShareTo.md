
 >网页端分享功能，只支持 qq浏览器 和 UC浏览器（uc 可能有的版本不支持）
 >支持分享到 新浪微博 微信好友 微信朋友圈 QQ好友 QQ空间

```
class SocialShare {
  constructor () {
    this.init()
  }

  init () {
    this.initLocal()
    this.getPlantform()
    this.getCanShare()

    // this.supportShare && this.html()
  }

  initLocal () {
    this.qApiSrc = {
      lower: '//3gimg.qq.com/html5/js/qb.js',
      higher: '//jsapi.qq.com/get?api=app.share'
    }

    // 支持分享到的 手机app
    this.appList = {
      sinaWeibo: ['kSinaWeibo', 'SinaWeibo', 11, '新浪微博'],
      weixin: ['kWeixin', 'WechatFriends', 1, '微信好友'],
      weixinFriend: ['kWeixinFriend', 'WechatTimeline', '8', '微信朋友圈'],
      QQ: ['kQQ', 'QQ', '4', 'QQ好友'],
      QZone: ['kQZone', 'QZone', '3', 'QQ空间']
    }

    this.bLevel = {
      qq: {
        forbid: 0,
        lower: 1,
        higher: 2
      },
      uc: {
        forbid: 0,
        allow: 1
      }
    }

    this.UA = navigator.appVersion.toLowerCase()
    this.isqqBrowser = (this.UA.split('mqqbrowser/').length > 1) ? this.bLevel.qq.higher : this.bLevel.qq.forbid
    this.isucBrowser = (this.UA.split('ucbrowser/').length > 1) ? this.bLevel.uc.allow : this.bLevel.uc.forbid
    
    this.version = {
      uc: this.isucBrowser ? this.getVersion(this.UA.split('ucbrowser/')[1]) : 0,
      qq: this.isqqBrowser ? this.getVersion(this.UA.split('mqqbrowser/')[1]) : 0
    }

    this.isWxOrQQ = this.isWxOrQQ()

    this.platform_os = this.getPlantform()

    this.supportShare = false
  }

  getPlantform () {
    let nu = navigator.userAgent
    if ((nu.indexOf('iPhone') > -1 || nu.indexOf('iPod') > -1)) {
      return 'iPhone'
    }
    return 'Android'
  }

  getVersion (versionInfo) {
    let realVersion = versionInfo.split('.')
    return parseFloat(realVersion[0] + '.' + realVersion[1])
  }

  isWxOrQQ () {
    // 判断是否是 微信 或者 QQ app
    let ua = this.UA
    if ((/mobile\smqqbrowser/i).test(ua)) {
      if ((/micromessenger/i).test(ua)) {
        // 是微信 app
        return 'wxApp'
      }
      // 是 QQ App
      return 'qqApp'
    }
    return false
  }

  initConfig (config) {
    let url = config.url || document.location.href || ''
    let title = config.title || document.title || ''
    let desc = config.desc || document.title || ''
    let img = config.img || document.getElementsByTagName('img').length > 0 && document.getElementsByTagName('img')[0].src || ''
    let img_title = config.img_title || document.title || ''
    let from = config.from || window.location.host || ''

    this.config = {
      url,
      title,
      desc,
      img,
      img_title,
      from
    }
  }

  share (to_app) {
    let {
      url,
      title,
      desc,
      img,
      img_title,
      from
    } = this.config

    let appList = this.appList
    let isWxOrQQ = this.isWxOrQQ

    if (this.isucBrowser) {
      // uc浏览器
      to_app = to_app === '' ? '' : (this.platform_os === 'iPhone' ? appList[to_app][0] : appList[to_app][1])
      if (to_app === 'QZone') {
        let shareToUrl = 'mqqapi://share/to_qzone?src_type=web&version=1&file_type=news&req_type=1&image_url=' + img + '&title=' + title + '&description=' + desc + '&url=' + url + '&app_name=' + from
        let shareEle = document.createElement('div')
        shareEle.style.visibility = 'hidden'
        shareEle.innerHTML = '<iframe src="' + shareToUrl + '" scrolling="no" width="1" height="1"></iframe>'
        document.body.appendChild(shareEle)
        setTimeout(() => {
          shareEle && shareEle.parentNode && shareEle.parentNode.removeChild(shareEle)
        }, 5E3)
      }
      if (typeof ucweb !== 'undefined') {
        ucweb.startRequest('shell.page_share', [title, img, url, to_app, '', '', ''])
      } else {
        if (typeof ucbrowser !== 'undefined') {
          web_share(title, img, url, to_app, '', '@' + from, '')
        }
      }
    } else if (this.isqqBrowser && !this.isWxOrQQ) {
      // qq浏览器，并且不是微信app 或者 QQ app
      let isqqBrowser = this.isqqBrowser
      to_app = to_app === '' ? '' : appList[to_app][2]
      let shareConfig = {
        url: url,
        title: title,
        description: desc,
        img_url: img,
        img_title: img_title,
        to_app: to_app, // 微信好友1,腾讯微博2,QQ空间3,QQ好友4,生成二维码7,微信朋友圈8,啾啾分享9,复制网址10,分享到微博11,创意分享13
        cus_txt: '请输入此时此刻想要分享的内容'
      }

      shareConfig = to_app === '' ? '' : shareConfig
      if (typeof browser !== 'undefined') {
        if (typeof browser.app !== 'undefined' && isqqBrowser === this.bLevel.qq.higher) {
          browser.app.share(shareConfig)
        }
      } else {
        if (typeof window.qb !== 'undefined' && isqqBrowser === this.bLevel.qq.lower) {
          window.qb.share(shareConfig)
        }
      }
      
    }
  }

  isloadqqApi () {
    let qApiSrc = this.qApiSrc
    var version = (this.version.qq < 5.4) ? qApiSrc.lower : qApiSrc.higher
    var scriptEle = document.createElement('script')
    var body = document.querySelector('body')
    scriptEle.setAttribute('src', version)
    body.appendChild(scriptEle)
  }

  html () {
    // 以下为使用的 DOM示例
    // let ele = document.getElementById(this.elementNode)
    let html = `
        <div class="label">分享到</div>
        <div class="list clearfix">
        <span data-app="sinaWeibo" class="nativeShare weibo"><i></i>新浪微博</span>
        <span data-app="weixin" class="nativeShare weixin"><i></i>微信好友</span>
        <span data-app="weixinFriend" class="nativeShare weixin_timeline"><i></i>微信朋友圈</span>
        <span data-app="QQ" class="nativeShare qq"><i></i>QQ好友</span>
        <span data-app="QZone" class="nativeShare qzone"><i></i>QQ空间</span>
        <span data-app="" class="nativeShare more"><i></i>更多</span>
        </div>`
    document.body.innerHTML = html
  }

  getCanShare () {
    let isqqBrowser = this.isqqBrowser
    let isucBrowser = this.isucBrowser
    let versionQQ = this.version.qq
    let versionUC = this.version.uc

    let platform_os = this.platform_os

    if ((isqqBrowser && versionQQ < 5.4 && platform_os === 'iPhone') || (isqqBrowser && versionQQ < 5.3 && platform_os === 'Android')) {
      this.isqqBrowser = this.bLevel.qq.forbid
    } else {
      if (isqqBrowser && versionQQ < 5.4 && platform_os === 'Android') {
        this.isqqBrowser = this.bLevel.qq.lower
      } else {
        if (isucBrowser && ((versionUC < 10.2 && platform_os === 'iPhone') || (versionUC < 9.7 && platform_os === 'Android'))) {
          this.isucBrowser = this.bLevel.uc.forbid
        }
      }
    }
    this.isqqBrowser && this.isloadqqApi()

    if ((this.isqqBrowser && !this.isWxOrQQ) || this.isucBrowser) {
      this.supportShare = true
      // this.html()
    } else {
      this.supportShare = false
      // document.getElementById(this.elementNode).innerHTML = '目前该分享插件仅支持手机UC浏览器和QQ浏览器'
    }
  }

  goShare (shareEle, config) {
    if (this.supportShare) {
      this.initConfig(config)

      let items = document.querySelectorAll(shareEle)
      let len = items.length
      let that = this
      for (let i = 0; i < len; i++) {
        items[i].addEventListener('click', function() {
          that.share(this.getAttribute('data-app'))
        })
      }
    }
  }
}

export default SocialShare

```

用法示例：

```
const mshare = () => {
  const socialShare = new SocialShare()
  
  // 检测是否是在 微信 或者 QQ app 内置的浏览器中
  const isWxOrQQ = socialShare.isWxOrQQ
  // 检测浏览器是否支持分享
  const isSupportShare = socialShare.supportShare
  if (!socialShare.isWxOrQQ) {
    if (isSupportShare) {
      // 当前浏览器支持分享
      let config = this.shareInfos
      config.img_title = config.name
      config.from = '58二手'
      socialShare.goShare('.share-item', config)
    } else {
      console.log('当前浏览器不支持分享')
    }
  }
}
```
