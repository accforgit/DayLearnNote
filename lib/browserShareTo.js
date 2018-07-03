
 /*
 *网页端分享功能，只支持 qq浏览器 和 UC浏览器（uc 可能有的版本不支持）
  支持分享到 新浪微博 微信好友 微信朋友圈 QQ好友 QQ空间
*/
// es6 实现
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



// 用法示例：

const mshare = () => {
  const socialShare = new SocialShare()
  
  // 检测是否是在 微信 或者 QQ app 内置的浏览器中
  const isWxOrQQ = socialShare.isWxOrQQ
  // 检测浏览器是否支持分享
  const isSupportShare = socialShare.supportShare
  if (!socialShare.isWxOrQQ) {
    if (isSupportShare) {
      // 当前浏览器支持分享
      let title = '分享的标题' // 标题
      let url = 'http://example.com/index.html' // 分享的网页链接
      let img = 'http://example.com/share.png' // 分享的图片链接
      let desc = '分享的内容描述' // 描述
      let img_title = '分享的图片描述'
      let from = '分享的来源' // 一般此项都是由浏览器自动设置
      
      socialShare.goShare('.share-item', { title, url, img, desc, img_title, from })
    } else {
      console.log('当前浏览器不支持分享')
    }
  }
}

// 调用分享函数
mshare()



// es5实现
var funParabola = function (element, target, options) {
  var defaults = {
    // 每帧移动的像素大小，每帧（对于大部分显示屏）大约16~17毫秒
    speed: 2,
    // 实际指焦点到准线的距离，可以抽象成曲率,绝对值越大，则抛物弧度越小
    //如果大于0，则抛物线开口向下，否则向上
    curvature: 0.006,
    // 抛物线的进度, type: function
    progress: null,
    // 完成抛物后的回调, type: function
    complete: null
  };

  var params = {};
  options = options || {};

  for (var key in defaults) {
    params[key] = options[key] || defaults[key];
  }

  var expose = {
    stopRun: false,
    mark: function () {
      return this;
    },
    position: function () {
      return this;
    },
    move: function () {
      return this;
    },
    init: function () {
      return this;
    }
  };

  /* 确定移动的方式 
   * IE6-IE8 是margin位移
   * IE9+使用transform
   */
  var moveStyle = "margin",
    testDiv = document.createElement("div");
  if ("oninput" in testDiv) {
    ["", "ms", "webkit"].forEach(function (prefix) {
      var transform = prefix + (prefix ? "T" : "t") + "ransform";
      if (transform in testDiv.style) {
        moveStyle = transform;
      }
    });
  }

  // 根据两点坐标以及曲率确定运动曲线函数（也就是确定a, b的值）
  // 为了方便计算，将抛物点换算为原点(0, 0)
  /* 公式： y = a*x*x + b*x + c;
   */
  var a = params.curvature,
    b = 0,
    c = 0;
  // 是否执行运动的标志量
  var flagMove = true;

  if (element && target && element.nodeType == 1 && target.nodeType == 1) {
    var rectElement = {},
      rectTarget = {};

    // 移动元素的中心点位置，目标元素的中心点位置
    var centerElement = {},
      centerTarget = {};

    // 目标元素的坐标位置
    var coordElement = {},
      coordTarget = {};

    // 标注当前元素的坐标
    expose.mark = function () {
      if (flagMove === false) return this;
      if (typeof coordElement.x === "undefined") this.position();
      return this;
    }

    expose.position = function () {
      if (flagMove === false) return this;

      var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft,
        scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

      // 初始位置
      if (moveStyle === "margin") {
        element.style.marginLeft = element.style.marginTop = "0px";
      } else {
        element.style[moveStyle] = "translate(0, 0)";
      }

      // 四边缘的坐标
      rectElement = element.getBoundingClientRect();
      rectTarget = target.getBoundingClientRect();

      // 移动元素的中心点坐标
      centerElement = {
        x: rectElement.left + (rectElement.right - rectElement.left) / 2 + scrollLeft,
        y: rectElement.top + (rectElement.bottom - rectElement.top) / 2 + scrollTop
      };

      // 目标元素的中心点位置
      centerTarget = {
        x: rectTarget.left + (rectTarget.right - rectTarget.left) / 2 + scrollLeft,
        y: rectTarget.top + (rectTarget.bottom - rectTarget.top) / 2 + scrollTop
      };

      // 转换成相对坐标位置
      coordElement = {
        x: 0,
        y: 0
      };
      coordTarget = {
        x: -1 * (centerElement.x - centerTarget.x),
        y: -1 * (centerElement.y - centerTarget.y)
      };

      /*
       * 因为经过(0, 0), 因此c = 0
       * 于是：
       * y = a * x*x + b*x;
       * y1 = a * x1*x1 + b*x1;
       * y2 = a * x2*x2 + b*x2;
       * 利用第二个坐标：
       * b = (y2+ a*x2*x2) / x2
       */
      // 于是
      b = (coordTarget.y - a * coordTarget.x * coordTarget.x) / coordTarget.x;

      return this;
    };

    // 按照这个曲线运动
    expose.move = function () {
      // 如果曲线运动还没有结束，不再执行新的运动
      if (flagMove == false) return this;

      var startx = 0,
        rate = coordTarget.x > 0 ? 1 : -1;

      var step = function () {
        // 切线 y'=2ax+b
        var tangent = 2 * a * startx + b;
        // y*y + x*x = speed
        // (tangent * x)^2 + x*x = speed
        // x = Math.sqr(speed / (tangent * tangent + 1));
        startx = startx + rate * Math.sqrt(params.speed / (tangent * tangent + 1));

        // 防止过界
        if ((rate == 1 && startx > coordTarget.x) || (rate == -1 && startx < coordTarget.x)) {
          startx = coordTarget.x;
        }
        var x = startx,
          y = a * x * x + b * x;


        // x, y目前是坐标，需要转换成定位的像素值
        if (moveStyle === "margin") {
          element.style.marginLeft = x + "px";
          element.style.marginTop = y + "px";
        } else {
          element.style[moveStyle] = "translate(" + [x + "px", y + "px"].join() + ")";
        }

        if (startx !== coordTarget.x && !expose.stopRun) {
          // 当前进度，这里的两个参数只是一个示范
          params.progress && params.progress(x, y);
          // 继续进行沿抛物线运动
          window.requestAnimationFrame(step);
        } else {
          // 运动结束，回调执行
          params.complete && params.complete();
          flagMove = true;
        }
      };
      window.requestAnimationFrame(step);
      flagMove = false;

      return this;
    };
    
    expose.stop = function (stopCompleteFn) {
      this.stopRun = true
      // 清除结束运动后的回调函数
      stopCompleteFn && (params.complete = null)
    }

    // 初始化方法
    expose.init = function () {
      this.mark().move();
    };
  }

  return expose;
};

// 使用
// 假设 .box1是进行抛物线运动的元素， .box2是抛物线的终点元素
// 结束回调
function completeFn() {
  console.log('over');
}
// 进度回调
function progressFn(x, y) {
  console.log('progress:', x,y)
}
var element = document.querySelector(".box1"),
  target = document.querySelector(".box2");

// 抛物线元素的的位置标记
var parabola = funParabola(element, target, {complete: completeFn, progress: progressFn});

// 抛物线运动的触发
document.body.onclick = function () {
  parabola.init();
}
// 可以随时停止
target.onclick=function() {
  parabola.stop(true)
}

