## node程序 `require` 引入文件时带上文件名

```js
const myUtil = require('./myUtil')
```

对于上述引入文件的方法，如果所引入的文件是 `.json`或者 `.node`类型，则最好带上扩展名，即 `myUtil.json`，原因在于如果不加扩展名，`Node`会依次尝试 `.js` `.node` `.json`的扩展名，如果指定了扩展名，就省去了这一步尝试，在引入文件量较大的情况下，可以提升性能

## exports  与 module.exports

`module.exports` 是 `exports`对象的一个引用，`exports`对象是通过形参的方式引入的，所以不能直接对 `exports`进行赋值，这会改变形参的引用，但是可以对 `module.exports`进行赋值，因为其本来就是一个引用

```js
// 错误用法
exports = function() {}
// 正确用法
module.exports = function() {}
```

## `setTimout`方法的第三个参数

绝大部分情况下，大家都只是使用了 `setTimeout`的前两个参数，很少有人知道此方法还有第三个参数

```js
/**
 * fn: 必需。要调用一个代码串，也可以是一个函数。
 * milliseconds: 可选。执行或调用 code/function 需要等待的时间，以毫秒计。默认为 0
 * param1, param2, ...: 可选。 传给执行函数的其他参数（IE9 及其更早版本不支持该参数）。
 */
setTimeout(fn, milliseconds, param1, param2, ...)
```

所以对于一个经典的面试题：

```js
for (var i = 1; i <= 5; i++) {
  (function(j) {
    setTimeout(function timer() {
      console.log(j);
    }, j * 1000);
  })(i);
}
```

上述代码，就是利用闭包实现输出 `1 2 3 4 5`

解决方法除了闭包以及使用 `let`关键字之外，还可以利用 `setTimeout`方法的第三个参数解决：
```js
for ( var i=1; i<=5; i++) {
	setTimeout(function timer(j) {
		console.log(j);
	}, i*1000, i);
}
```

## new 操作符干了什么

做了以下 4件事

- 创建一个空对象

```js
var obj = new Object()
```

- 将构造函数的作用域给新对象（因此 `this`就指向了这个新对象）

```js
obj.__proto__ = Func.prototype
```

- 执行构造函数中的代码

```js
var result = Func.call(obj)
```

- 判断`Func`的返回值类型，如果是值类型，返回 `obj`。如果是引用类型，就返回这个引用类型的对象

```js
if (typeof result === 'object') {
  return result
}
return obj
```

## 浏览器渲染与 Event Loop

对于以下代码：
```js
document.body.appendChild(el)
el.style.display = 'none'
```

这段代码的意思是，给 `body`追加一个元素，并隐藏此元素，有的人可能下意识认为这会导致页面闪动，从而交换这两行代码的书写顺序，即：
```js
el.style.display = 'none'
document.body.appendChild(el)
```

实际上，无论是哪种顺序，最后的渲染效果都是一样的，因为这两行代码都是同步代码，浏览器会把这两行代码合并，然后一次性渲染出结果，而不是一步步执行

对于下述代码：
```js

```

本意是 让 `box` 元素的位置从 `0` 一下子 移动到 `1000`，然后 动画移动 到 `500`，但是由于浏览器的渲染机制，所以实际情况是从 `0` 动画移动 到 `500`，中间那一步的 `1000`直接被跳过了，想要让上述代码达到预期的效果，那就必须让上述操作不发生在一次渲染中，可以使用 `setTimeout`、`requestAnimationFrame`、强制浏览器分别渲染

- setTimeout

这是最常用的方法了：
```js
box.style.transform = 'translateX(1000px)'
setTimeout(() => {
  box.style.tranition = 'transform 1s ease'
  box.style.transform = 'translateX(500px)'
})
```

- requestAnimationFrame

`requestAnimationFrame`与 `setTimeout`的实现方式是不一样的， `requestAnimationFrame`可以看做是 `microtask`，而 `setTimeout` 是 `macrotask`，`requestAnimationFrame`将会在浏览器进行渲染之前完成，而 `setTimeout`则是在下一帧执行，所以如果你这么写：
```js
box.style.transform = 'translateX(1000px)'
requestAnimationFrame(() => {
  box.style.tranition = 'transform 1s ease'
  box.style.transform = 'translateX(500px)'
})
```

其实实现的效果和不加 `requestAnimationFrame`是一样的，但是如果是两个 `requestAnimationFrame`嵌套那就可以了：
```js
box.style.transform = 'translateX(1000px)'
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    box.style.tranition = 'transform 1s ease'
    box.style.transform = 'translateX(500px)'
  })
})
```
第一个 `requestAnimationFrame`在第一帧随同第一行代码一同被浏览器执行并渲染，然后在下一帧才会执行第二个 `requestAnimationFrame`中的内容

- 强制浏览器分别渲染

例如：
```js
box.style.transform = 'translateX(1000px)'
getComputedStyle(box) // 伪代码，只要获取一下当前的计算样式，就可以打断浏览器合并渲染的过程
box.style.tranition = 'transform 1s ease'
box.style.transform = 'translateX(500px)'
```

## addEventListener

对于以下代码：
```js
button.addEventListener('click', () => {
  Promise.resolve().then(() => console.log('microtask 1'))
  console.log('listener 1')
})
button.addEventListener('click', () => {
  Promise.resolve().then(() => console.log('microtask 2'))
  console.log('listener 2')
})
// button.click()
```

如果执行上述代码，然后在浏览器中用鼠标点击 `button`这个元素，那么将输出：
```js
listener 1
microtask 1
listener 2
microtask 2
```

但是如果不是手动触发，而是使用代码触发，例如打开上述代码中的 `button.click()`注释，然后执行代码，将输出：
```js
listener 1
listener 2
microtask 1
microtask 2
```

原因如下：

- 用户直接点击的时候，浏览器先后触发 `2` 个 `listener`。第一个 `listener` 触发完成 (`listener 1`) 之后，队列空了，就先打印了 `microtask 1`。然后再执行下一个 `listener`。重点在于浏览器并不实现知道有几个 `listener`，因此它发现一个执行一个，执行完了再看后面还有没有。

- 而使用 `button.click()` 时，浏览器的内部实现是把 `2` 个 `listener` 都同步执行。因此 `listener 1 `之后，执行队列还没空，还要继续执行 `listener 2` 之后才行。所以 `listener 2` 会早于 `microtask 1`。重点在于浏览器的内部实现，`click` 方法会先采集有哪些 `listener`，再依次触发。

## __defineGetter__ && __defineSetter__

每个对象都有 `__defineGetter__` 和 `__defineSetter__` 方法，这两个方法可以 在对象定义后来给对象追加 `getter`与 `setter`的定义(但是如果已经定义过了，就不能覆盖，会报错)

```js
const obj = { a: 2 }
obj.__defineGetter__('a', () => {
  return 10
})
console.log(obj.a)  // => 10
```

>该方法是非标准方法，已从标准中删除，不要使用