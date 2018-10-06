## vue.use

`vue`插件必须通过 `vue.use`进行注册，`vue.use`的代码位于 `vue`源码的 `src/core/global-api/use.js`文件中，此方法的主要作用有两个：

- 对注册的组件进行缓存，避免多次注册同一个插件

```js
if (installedPlugins.indexOf(plugin) > -1) {
  return this
}
```
- 调用插件的 `install`方法或者直接运行插件，以实现插件的 `install`

```js
if (typeof plugin.install === 'function') {
  plugin.install.apply(plugin, args)
} else if (typeof plugin === 'function') {
  plugin.apply(null, args)
}
```

## 路由安装

`vue-router`的 `install`方法位于 `vue-router`源码的`src/install.js`中
主要是通过 `vue.minxin`混入 `beforeCreate` 和 `destroyed`钩子函数，并全局注册 `router-view` 和 `router-link`组件

```js
// src/install.js
Vue.mixin({
  beforeCreate () {
    if (isDef(this.$options.router)) {
      this._routerRoot = this
      this._router = this.$options.router
      this._router.init(this)
      Vue.util.defineReactive(this, '_route', this._router.history.current)
    } else {
      this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
    }
    registerInstance(this, this)
  },
  destroyed () {
    registerInstance(this)
  }
})
...
// 全局注册 `router-view` 和 `router-link`组件
Vue.component('RouterView', View)
Vue.component('RouterLink', Link)
```

## 路由模式

`vue-router`支持三种路由模式(`mode`)：`hash`、`history`、`abstract`，其中 `abstract`是在非浏览器环境下使用的路由模式，例如`weex`

路由内部会对外部指定传入的路由模式进行判断，例如当前环境是非浏览器环境，则无论传入何种`mode`，最后都会被强制指定为 `abstract`，如果判断当前环境不支持 `HTML5 History`，则最终会被降级为 `hash`模式

```js
// src/index.js
let mode = options.mode || 'hash'
this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false
if (this.fallback) {
  mode = 'hash'
}
if (!inBrowser) {
  mode = 'abstract'
}
```

最后会对符合要求的 `mode`进行对应的初始化操作
```js
// src/index.js
switch (mode) {
  case 'history':
    this.history = new HTML5History(this, options.base)
    break
  case 'hash':
    this.history = new HashHistory(this, options.base, this.fallback)
    break
  case 'abstract':
    this.history = new AbstractHistory(this, options.base)
    break
  default:
    if (process.env.NODE_ENV !== 'production') {
      assert(false, `invalid mode: ${mode}`)
    }
}
```

## 路由解析

通过递归的方式来解析嵌套路由
```js
// src/create-route-map.js
function addRouteRecord (
  pathList: Array<string>,
  pathMap: Dictionary<RouteRecord>,
  nameMap: Dictionary<RouteRecord>,
  route: RouteConfig,
  parent?: RouteRecord,
  matchAs?: string
) {
  ...
  route.children.forEach(child => {
    const childMatchAs = matchAs
      ? cleanPath(`${matchAs}/${child.path}`)
      : undefined
    addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs)
  })
  ...
}
```

解析完毕之后，会通过 `key-value`对的形式对解析好的路由进行记录，所以如果声明多个相同路径(`path`)的路由映射，只有第一个会起作用，后面的会被忽略

```js
// src/create-route-map.js
if (!pathMap[record.path]) {
  pathList.push(record.path)
  pathMap[record.path] = record
}
```
例如如下路由配置，路由 `/bar` 只会匹配 `Bar1`，`Bar2`这一条配置会被忽略
```js
const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar1 },
  { path: '/bar', component: Bar2 },
];
```

## 路由切换

当访问一个 `url`的时候，`vue-router`会根据路径进行匹配，创建出一个 `route`对象，可通过 `this.$route`进行访问
```js
// src/util/route.js
const route: Route = {
  name: location.name || (record && record.name),
  meta: (record && record.meta) || {},
  path: location.path || '/',
  hash: location.hash || '',
  query,
  params: location.params || {},
  fullPath: getFullPath(location, stringifyQuery),
  matched: record ? formatMatch(record) : []
}
```

`src/history/base.js`源码文件中的 `transitionTo()`是路由切换的核心方法
```js
transitionTo (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  const route = this.router.match(location, this.current)
  this.confirmTransition(route, () => {
  ...
}
```

路由实例的`push` 和 `replace`等路由切换方法，都是基于此方法实现路由切换的，例如 `hash`模式的 `push`方法：
```js
// src/history/hash.js
push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  const { current: fromRoute } = this
  // 利用了 transitionTo 方法
  this.transitionTo(location, route => {
    pushHash(route.fullPath)
    handleScroll(this.router, route, fromRoute, false)
    onComplete && onComplete(route)
  }, onAbort)
}
```

`transitionTo`方法内部通过一种异步函数队列化执⾏的模式来更新切换路由，通过 `next`函数执行异步回调，并在异步回调方法中执行相应的钩子函数(即 导航守卫) `beforeEach`、`beforeRouteUpdate`、`beforeRouteEnter`、`beforeRouteLeave`

通过 `queue`这个数组保存相应的路由参数：
```js
// src/history/base.js
const queue: Array<?NavigationGuard> = [].concat(
  // in-component leave guards
  extractLeaveGuards(deactivated),
  // global before hooks
  this.router.beforeHooks,
  // in-component update hooks
  extractUpdateHooks(updated),
  // in-config enter guards
  activated.map(m => m.beforeEnter),
  // async components
  resolveAsyncComponents(activated)
)
```

通过 `runQueue`以一种递归回调的方式来启动异步函数队列化的执⾏：
```js
// src/history/base.js
// 异步回调函数
runQueue(queue, iterator, () => {
  const postEnterCbs = []
  const isValid = () => this.current === route
  // wait until async components are resolved before
  // extracting in-component enter guards
  const enterGuards = extractEnterGuards(activated, postEnterCbs, isValid)
  const queue = enterGuards.concat(this.router.resolveHooks)
  // 递归执行
  runQueue(queue, iterator, () => {
    if (this.pending !== route) {
      return abort()
    }
    this.pending = null
    onComplete(route)
    if (this.router.app) {
      this.router.app.$nextTick(() => {
        postEnterCbs.forEach(cb => { cb() })
      })
    }
  })
})
```

通过 `next`进行导航守卫的回调迭代，所以如果在代码中显式声明了导航钩子函数，那么就必须在最后调用 `next()`，否则回调不执行，导航将无法继续
```js
// src/history/base.js
const iterator = (hook: NavigationGuard, next) => {
  ...
  hook(route, current, (to: any) => {
    ...
    } else {
      // confirm transition and pass on the value
      next(to)
    }
  })
...
}
```

## 路由同步

在路由切换的时候，`vue-router`会调用 `push`、`go`等方法实现视图与地址`url`的同步

### 地址栏 `url`与视图的同步

当进行点击页面上按钮等操作进行路由切换时，`vue-router`会通过改变 `window.location.href`来保持视图与 `url`的同步，例如 `hash`模式的路由切换：
```js
// src/history/hash.js
function pushHash (path) {
  if (supportsPushState) {
    pushState(getUrl(path))
  } else {
    window.location.hash = path
  }
}
```
上述代码，先检测当前浏览器是否支持 `html5`的 `History API`，如果支持则调用此 `API`进行 `href`的修改，否则直接对`window.location.hash`进行赋值
`history`的原理与此相同，也是利用了 `History API`

### 视图与地址栏 `url`的同步

当点击浏览器的前进后退按钮时，同样可以实现视图的同步，这是因为在路由初始化的时候，设置了对浏览器前进后退的事件监听器

下述是 `hash`模式的事件监听：
```js
// src/history/hash.js
setupListeners () {
  ...
  window.addEventListener(supportsPushState ? 'popstate' : 'hashchange', () => {
    const current = this.current
    if (!ensureSlash()) {
      return
    }
    this.transitionTo(getHash(), route => {
      if (supportsScroll) {
        handleScroll(this.router, route, current, true)
      }
      if (!supportsPushState) {
        replaceHash(route.fullPath)
      }
    })
  })
}
```
`history`模式与此类似：
```js
// src/history/html5.js
window.addEventListener('popstate', e => {
  const current = this.current

  // Avoiding first `popstate` event dispatched in some browsers but first
  // history route not updated since async guard at the same time.
  const location = getLocation(this.base)
  if (this.current === START && location === initLocation) {
    return
  }

  this.transitionTo(location, route => {
    if (supportsScroll) {
      handleScroll(router, route, current, true)
    }
  })
})
```

无论是 `hash`还是 `history`，都是通过监听事件最后来调用 `transitionTo`这个方法，从而实现路由与视图的统一

另外，当第一次访问页面，路由进行初始化的时候，如果是 `hash`模式，则会对`url`进行检查，如果发现访问的 `url`没有带 `#`字符，则会自动追加，例如初次访问 `http://localhost:8080`这个 `url`，`vue-router`会自动置换为 `http://localhost:8080/#/`，方便之后的路由管理：
```js
// src/history/hash.js
function ensureSlash (): boolean {
  const path = getHash()
  if (path.charAt(0) === '/') {
    return true
  }
  replaceHash('/' + path)
  return false
}
```

## scrollBehavior

当从一个路由 `/a`跳转到另外的路由 `/b`后，如果在路由 `/a`的页面中进行了滚动条的滚动行为，那么页面跳转到`/b`时，会发现浏览器的滚动条位置和 `/a`的一样（如果 `/b`也能滚动的话），或者刷新当前页面，浏览器的滚动条位置依旧不变，不会直接返回到顶部的
而如果是通过点击浏览器的前进、后退按钮来控制路由切换时，则部门浏览器(例如微信)滚动条在路由切换时都会自动返回到顶部，即`scrollTop=0`的位置
这些都是浏览器默认的行为，如果想要定制页面切换时的滚动条位置，则可以借助 `scrollBehavior`这个 `vue-router`的 `options`

当路由初始化时，`vue-router`会对路由的切换事件进行监听，监听逻辑的一部分就是用于控制浏览器滚动条的位置：
```js
// src/history/hash.js
setupListeners () {
  ...
  if (supportsScroll) {
    // 进行浏览器滚动条的事件控制
    setupScroll()
  }
  ...
}
```
这个 `set`方法定义在 `src/util/scroll.js`，这个文件就是专门用于控制滚动条位置的，通过监听路由切换事件从而进行滚动条位置控制：
```js
// src/util/scroll.js
window.addEventListener('popstate', e => {
  saveScrollPosition()
  if (e.state && e.state.key) {
    setStateKey(e.state.key)
  }
})
```

通过 `scrollBehavior`可以定制路由切换的滚动条位置，`vue-router`的 [github](http://vuejs.github.io/vue-router)上的源码中，有相关的 `example`，源码位置在 `vue-router/examples/scroll-behavior/app.js`

## router-view & router-link

`router-view` 和 `router-link`这两个 `vue-router`的内置组件，源码位于 `src/components`下

### router-view

`router-view`是无状态(没有响应式数据)、无实例(没有 `this`上下文)的函数式组件，其通过路由匹配获取到对应的组件实例，通过 `h`函数动态生成组件，如果当前路由没有匹配到任何组件，则渲染一个注释节点

```js
// vue-router/src/components/view.js
...
const matched = route.matched[depth]
// render empty node if no matched route
if (!matched) {
  cache[name] = null
  return h()
}
const component = cache[name] = matched.components[name]
...
return h(component, data, children)
```

每次路由切换都会触发 `router-view`重新 `render`从而渲染出新的视图，这个触发的动作是在 `vue-router`初始化 `init`的时候就声明了的：
```js
// src/install.js
Vue.mixin({
  beforeCreate () {
    if (isDef(this.$options.router)) {
      this._routerRoot = this
      this._router = this.$options.router
      this._router.init(this)
      // 触发 router-view重渲染
      Vue.util.defineReactive(this, '_route', this._router.history.current)
      ...
})
```
将 `this._route`通过 `defineReactive`变成一个响应式的数据，当路由发生变化时，将会调用 `router-view`的 `render`函数，此函数中访问了 `this._route`这个数据，也就相当于是调用了 `this._route`的 `getter`方法，触发依赖收集，建立一个 `Watcher`，执行 `_update`方法，从而让页面重新渲染
```js
// vue-router/src/components/view.js
render (_, { props, children, parent, data }) {
  // used by devtools to display a router-view badge
  data.routerView = true

  // directly use parent context's createElement() function
  // so that components rendered by router-view can resolve named slots
  const h = parent.$createElement
  const name = props.name
  // 触发依赖收集，建立 render watcher
  const route = parent.$route
  ...
}
```

这个 `render watcher`的派发更新，也就是 `setter`的调用，位于 `src/index.js`：
```js
history.listen(route => {
  this.apps.forEach((app) => {
    // 触发 setter
    app._route = route
  })
})
```

### router-link

`router-link`在执行 `render`函数的时候，会根据当前的路由状态，给渲染出来的`active`元素添加 `class`，所以你可以借助此给`active`路由元素设置样式等：
```js
// src/components/link.js
render (h: Function) {
  ...
  const globalActiveClass = router.options.linkActiveClass
  const globalExactActiveClass = router.options.linkExactActiveClass
  // Support global empty active class
  const activeClassFallback = globalActiveClass == null
    ? 'router-link-active'
    : globalActiveClass
  const exactActiveClassFallback = globalExactActiveClass == null
    ? 'router-link-exact-active'
    : globalExactActiveClass
    ...
}
```
`router-link`默认渲染出来的元素是 `<a>`标签，其会给这个 `<a>`添加 `href`属性值，以及一些用于监听能够触发路由切换的事件，默认是 `click`事件：
```js
// src/components/link.js
data.on = on
data.attrs = { href }
```
当触发这些路由切换事件时，会调用响应的方法来切换路由刷新视图：
```js
// src/components/link.js
const handler = e => {
  if (guardEvent(e)) {
    if (this.replace) {
      // replace路由
      router.replace(location)
    } else {
      // push 路由
      router.push(location)
    }
  }
}
```