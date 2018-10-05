## nextTick

内部分为 `macroTask` 和 `microTask`，一般用户外部调用 `nextTick`都是调用的 `microTask`
`macroTask`依次通过 `setImmediate`、`MessageChannel`、`setTimeout`降级实现，`microTask`先尝试通过 `Promise`来实现，如果当前浏览器环境不支持 `Promise`，则降级为 `macroTask`

```js
// 将 microTask降级为 macroTask
// fallback to macro
microTimerFunc = macroTimerFunc
```

## keep-alive

`Vue`内置组件，其代码定义在 `src/core/components/keep-alive.js`

`keep-alive` 同样也是通过渲染一个组件来实现，只不过相比于我们手写的组件，其 `DOM`是直接通过一个 `render`函数渲染获得而非 `template`：

```js
// src/core/components/keep-alive.js
render () {
  const slot = this.$slots.default
  const vnode: VNode = getFirstComponentChild(slot)
  const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
  ...
}
```

其在内部制定了一个 `abstract`属性，使得在组件实例建立父子关系的时候被忽略，`keep-alive`的子组件的父组件被设定为 `keep-alive`的父组件：
```js
// src\core\instance\lifecycle.js
let parent = options.parent
if (parent && !options.abstract) {
  while (parent.$options.abstract && parent.$parent) {
    parent = parent.$parent
  }
  parent.$children.push(vm)
}
```

并且 `keep-alive`最后返回的组件也是其子组件：
```js
render () {
  const slot = this.$slots.default
  const vnode: VNode = getFirstComponentChild(slot)
  ...
  return vnode || (slot && slot[0])
}
```

`keep-alive`每次只会渲染其第一个子元素，所以诸如 `v-for`等能够渲染出多个子组件的方式都是不生效的：
```js
// 只获取第一个子组件实例
const vnode: VNode = getFirstComponentChild(slot)
```

如果指定了 `keep-alive`的 `max`属性，则其将在内部通过 `LRU`(最新最少使用)算法来管理缓存的组件：
```js
// src/core/components/keep-alive.js
if (cache[key]) {
  vnode.componentInstance = cache[key].componentInstance
  // make current key freshest
  remove(keys, key)
  keys.push(key)
}
```

## transition

代码在 `src\platforms\web\runtime\components\transition.js` 和 `src/platforms/web/modules/transition.js`中

`<transition>` 组件和 `<keep-alive>` 组件有⼏点实现类似，同样是抽象组件，同样直接实现 `render` 函数，同样利⽤了默认插槽(`slot`)

通过 `autoCssTransition` 处理 `name` 属性，⽣成⼀个⽤来描述各个阶段的 `class` 名称的对象，扩展到 `def` 中并返回给`data`  ，这样我们就可以从 `data` 中获取到过渡
相关的所有数据，`vue`后续通过对这些 `class`名的处理，结合用户自定义的 `css`来控制动画的实现
```js
const autoCssTransition: (name: string) => Object = cached(name => {
  return {
    enterClass: `${name}-enter`,
    enterToClass: `${name}-enter-to`,
    enterActiveClass: `${name}-enter-active`,
    leaveClass: `${name}-leave`,
    leaveToClass: `${name}-leave-to`,
    leaveActiveClass: `${name}-leave-active`
  }
})
```

通过 `requestAnimationFrame`(降级为 `setTimeout`)来控制动画间的过渡状态，以及控制动画钩子函数的执行
```js
// binding to window is necessary to make hot reload work in IE in strict mode
const raf = inBrowser
  ? window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : setTimeout
  : /* istanbul ignore next */ fn => fn()

export function nextFrame (fn: Function) {
  raf(() => {
    raf(fn)
  })
}
```

## 编译

除去一部分对 `platform`、缓存等逻辑外，编译的核心分为三步：

- 解析模板字符串生成 `AST`

```js
const ast = parse(template.trim(), options)
```

主要是通过大量的正则表达式、压栈出栈等算法对 `template`字符串进行一段段的逐步解析，来构造初步的 `AST Tree`

- 优化语法树

```js
optimize(ast, options)
```

对上一步构造出的 `AST Tree`进行优化，例如标记静态节点、增加缓存等手段，来提升 `AST Tree`的解析速度

- 生成代码

```js
const code = generate(ast, options)
```

将上一步的 `AST Tree`转换成可执行的代码，

## v-once

这个指令的内部实现，就是先调用了一次 `v-on`绑定事件，等到事件执行一遍之后，再通过回调函数调用 `v-off`来取消事件实现的
```js
Vue.prototype.$once = function (event: string, fn: Function): Component {
  const vm: Component = this
  function on () {
    vm.$off(event, on)
    fn.apply(vm, arguments)
  }
  on.fn = fn
  vm.$on(event, on)
  return vm
}
```
## v-model

`v-model `实际上都是语法糖，通过给 `$el`增加对应的 `prop`变量，以及绑定响应事件来实现的，
`v-html` 以及`v-text`同样有异曲同工之妙

```js
// v-model
// input textarea
addProp(el, 'value', `(${value})`)
// check
addProp(el, 'checked',
  `Array.isArray(${value})` +
  `?_i(${value},${valueBinding})>-1` + (
    trueValueBinding === 'true'
      ? `:(${value})`
      : `:_q(${value},${trueValueBinding})`
  )
)
```

## composition

`v-model`内部借助了 `compositionstart` 和 `compositionend`事件来处理输入，所以能够更好地处理拼音字符的输入
在不支持 `composition` 事件的浏览器上，则降级为 `change`事件

```js
el.addEventListener('compositionstart', onCompositionStart)
el.addEventListener('compositionend', onCompositionEnd)
// Safari < 10.2 & UIWebView doesn't fire compositionend when
// switching focus before confirming composition choice
// this also fixes the issue where some browsers e.g. iOS Chrome
// fires "change" instead of "input" on autocomplete.
el.addEventListener('change', onCompositionEnd)
```