## vue.use

`vue`插件必须通过 `vue.use`进行注册，`vue.use`的代码位于 `vue`源码的 `src/core/global-api/use.js`文件中，此方法的主要作用有两个：

- 对注册的组件进行缓存，避免多次注册

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
Vue.component('RouterView', View)
Vue.component('RouterLink', Link)
```