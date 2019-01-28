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

## new 与 构造函数

一道有意思的题目，如下：

```js
function Foo() {
  getName = function () { console.log (1); };
  return this;
}
Foo.getName = function () { console.log (2);};
Foo.prototype.getName = function () { console.log (3);};
var getName = function () { console.log (4);};
function getName() { console.log (5);}

// 输出 2
// 就是Foo上的静态方法getName()
Foo.getName();

// 输出 4
// 变量与函数都有提升能力，但函数提升将在变量提升前面，所以最后两句相当于
// function getName() { console.log (5);}
// var getName
// getName = function () { console.log (4);};
getName();

// 输出 1
// 先执行Foo()，返回this，但此时没有实例对象，所以指向 window，没有调用 new 关键字的 function作用域内的 this都指向 window，执行 Foo()就相当于在全局环境执行了 `getName = function () { console.log (1); };`，所以原先全局环境中的 `getName`函数被重写，this.getName() === window.getName() === getName()，最后的 getName就是重写后的，所以输出 1
Foo().getName();

// 输出 1
// 因为前面执行了 Foo().getName()，导致全局 getName被重写，所以这里输出 1，如果没有上一句，则输出 4
getName();

// 输出 2
// 下面代码相当于 new (Foo.getName())
new Foo.getName();

// 输出 3
// 下面代码相当于 (new Foo()).getName()，new Foo()创建了一个匿名实例，再对这个匿名实例调用 getName方法，这个实例本身没有 getName，所以向上寻找原型链上的 getName，找到了 Foo.prototype.getName
new Foo().getName();
```

>Tips:
>如果没加括号，例如 `new Foo` ，这种时候 `new`的优先级是仅次于括号（点和括号是同级别的）
>如果加了括号，例如 `new Foo()`，即使构造函数的参数为空，这种情况下 `new` 就有括号的性质，即 `(new Foo())`

## [前端日志上报的新姿势 Beacon](https://github.com/berwin/Blog/issues/27)

一般简单的日志上报，都会选择使用 `img`标签：
```js
(new Image).src = `/haopv.gif?a=xx&b=xxx`
```

优点如下：
- 无跨域问题
- 日志上报不需要关心服务器响应问题

但很多包括 `img`在内的日志上报方案，都存在可能会与主线程抢夺资源的情况，所以需要一种既不会阻塞线程又能即时上报的手段：`Beacon`

```js
var data = JSON.stringify({
  name: 'Berwin'
});
navigator.sendBeacon('/haopv', data)
```

- 信标(`Beacon`)请求优先避免与关键操作和更高优先级的网络请求竞争。
- 信标请求可以有效地合并，以优化移动设备上的能量使用。
- 保证页面卸载之前启动信标请求，并允许运行完成且不会阻塞请求或阻塞处理用户交互事件的任务

还有一个需要注意的是，通过信标发送的请求，请求方法均为 `POST`，且不支持修改

>此 `API`兼容性不太好（Android 6.x，IOS 11.4）

## requestAnimationFrame && requestIdleCallBack

`React 16`实现了新的调度策略(`Fiber`), 新的调度策略提到的异步、可中断，其实就是基于浏览器的 `requestIdleCallback`和 `requestAnimationFrame`两个 `API`

- requestAnimationFrame

会在每一帧确定执行，属于高优先级任务

- requestIdleCallBack

低优先级任务，执行的前提条件是当前浏览器处于空闲状态，利用的是帧的空闲时间，所以如果浏览器一直处于繁忙状态，那么回调将一直无法执行

## fetch无法拦截 302

[当fetch遇到302状态码，会发生什么？](https://zcfy.cc/article/what-will-happen-when-fetch-meets-a-302-status-code)

`fetch`无法拦截 `302`重定向，导致页面重定向失败，但可以通过修改 `302`为其他可拦截的状态码，来让前端自行重定向：
```js
fetch('http://www.somecompany.com/someapi')
  .then(response => {
    if (response.ok) {
      // process the data
    } else if (response.status == 401) { // something bad happened...
      // do something like throwing an Error, or making a jump
    } else { // some other status like 400, 403, 500, etc
      // take proper actions
    }
  })
  .catch(error => {
    // do some clean-up job
  })
```