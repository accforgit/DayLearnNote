## 函数重定义

最基本、最常用的代码反调试技术，一般代码调试很可能会用到 `console.log`来输出调试结果，
如果对此函数进行重定义，则可以修改调试输出的结果

```js
window['console']['log'] = () =>{}
// 执行了一个空函数，所以无任何输出
console.log('Great')
```

## 断点干扰

`debugger`函数会在控制台被打开的时候运行，控制台关闭后不会产生任何作用，
所以可以在代码中设置一个能够干扰调试的 `debugger`方法，例如无限循环 `debugger`

```js
setTimeout(function(){while (true) {eval("debugger")
```

## 时间差异

当脚本在DevTools等工具环境下执行时，运行速度会非常慢（时间久），所以我们就可以根据运行时间来判断脚本当前是否正在被调试。比如说，我们可以通过测量代码中两个设置点之间的运行时间，然后用这个值作为参考，如果运行时间超过这个值，说明脚本当前在调试器中运行。

```js
set Interval(function(){
  var startTime = performance.now(), check,diff;
  for (check = 0; check < 1000; check++){
    console.log(check);
    console.clear();
  }
  diff = performance.now() - startTime;
  if (diff > 200){
    alert("Debugger detected!");
  }
},500);
```

## DevTools检测（Chrome）

这项技术利用的是div元素中的id属性，当div元素被发送至控制台（例如 `console.log(div)`）时，浏览器会自动尝试获取其中的元素 `id`。如果代码在调用了`console.log`之后又调用了 `getter`方法，说明控制台当前正在运行。

```js
let div = document.createElement('div');
let loop = setInterval(() => {
    console.log(div);
    console.clear();
});
Object.defineProperty(div,"id", {get: () => {
    clearInterval(loop);
    alert("Dev Tools detected!");
}});
```