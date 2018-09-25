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

## new操作符干了什么

做了一下 4件事

- 创建一个空对象

```js
var obj = new Object()
```

- 设置原型链，对象原型指向构造函数的 `prototype`

```js
obj.__proto__ = Func.prototype
```

- 让 `Func`中的 `this`指向 `obj`，并执行 `Func`的函数体，也即将对象作为函数的 `this`传进去

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
