## install

`vuex`提供了一个 `install`方法，用于给 `vue.use`进行注册，`install`方法对 `vue`的版本做了一个判断，`1.x`版本和 `2.x`版本的插件注册方法是不一样的：
```js
// vuex/src/mixin.js
if (version >= 2) {
  Vue.mixin({ beforeCreate: vuexInit })
} else {
  // override init and inject vuex init procedure
  // for 1.x backwards compatibility.
  const _init = Vue.prototype._init
  Vue.prototype._init = function (options = {}) {
    options.init = options.init
      ? [vuexInit].concat(options.init)
      : vuexInit
    _init.call(this, options)
  }
}
```
对于 `1.x`版本，直接将`vuexInit`方法混入到 `vueInit`方法中，当 `vue`初始化的时候，`vuex`也就随之初始化
而对于 `2.x`版本，则是通过混入 `mixin`的方式，全局混入了一个 `beforeCreated`钩子函数，这个钩子函数就是把 `options.store` 保存在所有组件的 `this.$store`中，这个`options.store` 就是`Store`对象的实例，所以可以在组件中通过 `this.$store`访问到这个实例

## Store

每一个 `Vuex` 应用的核心就是 `store`，所以需要有 `Store`的初始化过程，下面是一个最简单的 `Store`示例(来源于 [vuex的官网](https://vuex.vuejs.org/zh/guide/))：
```js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
```
`Store`的源码位于 `vuex/src/store.js`，在这个类的 `constructor`中，`new`了一个 `vue`实例，所以说 `vuex`对于数据的观测其实就是借助了 `vue`的响应式逻辑

初始化`Store`的过程中，其实也是对 `modules`、`dispatch`、`commit`等进行了初始化过程

## Module

