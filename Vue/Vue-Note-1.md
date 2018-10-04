## nextTick

内部分为 `macroTask` 和 `microTask`，一般用户外部调用 `nextTick`都是调用的 `microTask`
`macroTask`依次通过 `setImmediate`、`MessageChannel`、`setTimeout`降级实现，`microTask`先尝试通过 `Promise`来实现，如果当前浏览器环境不支持 `Promise`，则降级为 `macroTask`

```js
// 将 microTask降级为 macroTask
// fallback to macro
microTimerFunc = macroTimerFunc
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