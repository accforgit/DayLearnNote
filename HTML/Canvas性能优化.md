最近对 `html5`小游戏有点兴趣，因为我感觉将来这个东西或许是前端一个重要的应用场景，例如现在每到某些节假日，像支付宝、淘宝或者其他的一些 `APP`可能会给你推送通知，然后点进去就是一个小游戏，基本上点进去的人，只要不是太抵触，都会玩上一玩的，如果要是恰好 `get`到用户的 `G`点，还能进一步增强业务，无论是用户体验，还是对业务的发展，都是一种很不错的提升方式。

另外，我说的这个 `html5`小游戏是包括 `WebGL`、`WebVR`等在内的东西，不仅限于游戏，也可以是其他用到相关技术的场景，例如商品图片 `360°`在线查看这种，之所以从小游戏入手，是因为小游戏需要的技术包罗万象，能把游戏做好，再用相同的技术去做其他的事情，就比较信手拈来了

查找资料，发现门道还是蛮多的，看了一圈下来，决定从基础入手，先从较为简单的 `canvas` 游戏看起，看了一些相关文章和书籍，发现这个东西虽然用起来很简单，但是真想用好，发挥其该有的能力还是有点难度的，最好从实战入手

于是最近准备写个 `canvas`小游戏练手，相关 `UI`素材已经搜集好了，不过俗话说 **工欲善其事必先利其器**，由于对这方面没什么经验，所以为了避免过程中出现的各种坑点，特地又看了一些相关的踩坑文章，其中性能我感觉是必须要注意的地方，而且门道很多，所以整理了一下

## 使用 `requestNextAnimationFrame`进行动画循环

`setTimeout` 和 `setInterval`并非是专为连续循环产生的 `API`，所以可能无法达到流畅的动画表现，故用 `requestNextAnimationFrame`，可能需要 `polyfill`：

`requestNextAnimationFrame`:
```js
const raf = requestAnimationFrame
  || webkitRequestAnimationFrame
  || mozRequestAnimationFrame
  || function(callback) {
    setTimeout(callback, 1000 / 60)
  }
```

`requestAnimationFrame`:
```js
const cancelRaf = cancelAnimationFrame
  || webkitCancelAnimationFrame
  || mozCancelAnimationFrame
  || (handler => {
    clearTimeout(handler)
  })
```

## 利用剪辑区域来处理动画背景或其他不变的图像

如果只是简单动画，那么每一帧动画擦除并重绘画布上所有内容是可取的操作，但如果背景比较复杂，那么可以使用 **剪辑区域**技术，通过每帧较少的绘制来获得更好的性能

利用剪辑区域技术来恢复上一帧动画所占背景图的执行步骤：

- 调用 `context.save()`，保存屏幕 `canvas`的状态
- 通过调用 `beginPath`来开始一段新的路径
- 在 `context`对象上调用 `arc()`、`rect()`等方法来设置路径
- 调用 `context.clip()`方法，将当前路径设置为屏幕 `canvas`的剪辑区域
- 擦除屏幕 `canvas`中的图像（实际上只会擦除剪辑区域所在的这一块范围）
- 将背景图像绘制到屏幕 `canvas`上（绘制操作实际上只会影响剪辑区域所在的范围，所以每帧绘制图像像素数更少）
- 恢复屏幕 `canvas`的状态参数，重置剪辑区域

## 离屏缓冲区(离屏canvas)

先绘制到一个离屏 `canvas`中，然后再通过 `drawImage`把离屏 `canvas` 画到主 `canvas`中，就是把离屏 `canvas`当成一个缓存区。把需要重复绘制的画面数据进行缓存起来，减少调用 `canvas`的 `API`的消耗

```js
const cacheCanvas = document.createElement('canvas')
const cacheCtx = cacheCanvas.getContext('2d')
cacheCtx.width = 200
cacheCtx.height = 200
// 绘制到主canvas上
ctx.drawImage(0, 0)
```

虽然离屏 `canvas`在绘制之前视野内看不到，但其宽高最好设置得跟缓存元素的尺寸一样，避免资源浪费，也避免绘制多余的不必要图像，同时在 `drawImage`时缩放图像也将耗费资源
必要时，可以使用多个离屏 `canvas`
另外，离屏 `canvas`不再使用时，最好把手动将引用重置为 `null`，避免因为 `js`和 `dom`之间存在的关联，导致垃圾回收机制无法正常工作，占用资源

## 尽量利用 `CSS`

### 背景图

如果有大的静态背景图，直接绘制到 `canvas`可能并不是一个很好的做法，如果可以，将这个大背景图作为 `background-image` 放在一个 `DOM`元素上(例如，一个  `div`)，然后将这个元素放到 `canvas`后面，这样就少了一个  `canvas`的绘制渲染

### transform变幻

`CSS`的 `transform`性能优于 `canvas`的 `transfomr API`，因为前者基于可以很好地利用 `GPU`，所以如果可以，`transform`变幻请使用 `CSS`来控制

## 关闭透明度

创建 `canvas`上下文的 `API`存在第二个参数：
```js
canvas.getContext(contextType, contextAttributes)
```

`contextType` 是上下文类型，一般值都是 `2d`，除此之外还有 `webgl`、`webgl2`、`bitmaprenderer`三个值，只不过后面三个浏览器支持度太低，一般不用

`contextAttributes` 是上下文属性，用于初始化上下文的一些属性，对于不同的 `contextType`，`contextAttributes`的可取值也不同，对于常用的 `2d`，`contextAttributes`可取值有：

- alpha

`boolean`类型值，表明 `canvas`包含一个 `alpha`通道. 默认为 `true`，如果设置为 `false`, 浏览器将认为 `canvas`背景总是不透明的, 这样可以加速绘制透明的内容和图片

- willReadFrequently

`boolean`类型值，表明是否有重复读取计划。经常使用 `getImageData()`，这将迫使软件使用 `2D canvas` 并节省内存（而不是硬件加速）。这个方案适用于存在属性 `gfx.canvas.willReadFrequently`的环境。并设置为 `true` (缺省情况下,只有`B2G / Firefox OS`)

支持度低，目前只有 `Gecko`内核的浏览器支持，不常用

- storage

`string` 这样表示使用哪种方式存储(默认为：持久（`persistent`）)

支持度低，目前只有 `Blink`内核的浏览器支持，不常用

上面三个属性，看常用的 `alpha`就行了，如果你的游戏使用画布而且不需要透明，当使用 `HTMLCanvasElement.getContext()` 创建一个绘图上下文时把` alpha` 选项设置为 `false` ，这个选项可以帮助浏览器进行内部优化

```js
const ctx = canvas.getContext('2d', { alpha: false })
```

## 尽量不要频繁地调用比较耗时的API

 例如
 
 `shadow`相关 `API`，此类 `API`包括 `shadowOffsetX`、`shadowOffsetY`、`shadowBlur`、`shadowColor`

绘图相关的 `API`，例如 `drawImage`、`putImageData`，在绘制时进行缩放操作也会增加耗时时间

当然，上述都是尽量避免 **频繁**调用，或用其他手段来控制性能，需要用到的地方肯定还是要用的

## 避免浮点数的坐标

利用 `canvas`进行动画绘制时，如果计算出来的坐标是浮点数，那么可能会出现 `CSS Sub-pixel`的问题，也就是会自动将浮点数值四舍五入转为整数，那么在动画的过程中，由于元素实际运动的轨迹并不是严格按照计算公式得到，那么就可能出现抖动的情况，同时也可能让元素的边缘出现抗锯齿失真
这也是可能影响性能的一方面，因为一直在做不必要的取证运算

## 渲染绘制操作不要频繁调用

渲染绘制的 `api`，例如 `stroke()`、`fill`、`drawImage`，都是将 `ctx`状态机里面的状态真实绘制到画布上，这种操作也比较耗费性能

例如，如果你要绘制十条线段，那么先在 `ctx`状态机中绘制出十天线段的状态机，再进行一次性的绘制，这将比每条线段都绘制一次要高效得多

```js
for (let i = 0; i < 10; i++) {
  context.beginPath()
  context.moveTo(x1[i], y1[i])
  context.lineTo(x2[i], y2[i])
  // 每条线段都单独调用绘制操作，比较耗费性能
  context.stroke()
}

for (let i = 0; i < 10; i++) {
  context.beginPath()
  context.moveTo(x1[i], y1[i])
  context.lineTo(x2[i], y2[i])
}
// 先绘制一条包含多条线条的路径，最后再一次性绘制，可以得到更好的性能
context.stroke()
```

## 尽量少的改变状态机 ctx的里状态

`ctx`可以看做是一个状态机，例如 `fillStyle`、`globalAlpha`、`beginPath`，这些 `api`都会改变 `ctx`里面对于的状态，频繁改变状态机的状态，是影响性能的

可以通过对操作进行更好的规划，减少状态机的改变，从而得到更加的性能，例如在一个画布上绘制几行文字，最上面和最下面文字的字体都是 `30px`，颜色都是 `yellowgreen`，中间文字是 `20px pink`，那么可以先绘制最上面和最下面的文字，再绘制中间的文字，而非必须从上往下依次绘制，因为前者减少了一次状态机的状态改变

```js
const c = document.getElementById("myCanvas")
const ctx = c.getContext("2d")

ctx.font = '30 sans-serif'
ctx.fillStyle = 'yellowgreen'
ctx.fillText("大家好，我是最上面一行", 0, 40)

ctx.font = '20 sans-serif'
ctx.fillStyle = 'red'
ctx.fillText("大家好，我是中间一行", 0, 80)

ctx.font = '30 sans-serif'
ctx.fillStyle = 'yellowgreen'
ctx.fillText("大家好，我是最下面一行", 0, 130)
```

下面的代码实现的效果和上面相同，但是代码量更少，同时比上述代码少改变了一次状态机，性能更加
```js
ctx.font = '30 sans-serif'
ctx.fillStyle = 'yellowgreen'
ctx.fillText("大家好，我是最上面一行", 0, 40)
ctx.fillText("大家好，我是最下面一行", 0, 130)

ctx.font = '20 sans-serif'
ctx.fillStyle = 'red'
ctx.fillText("大家好，我是中间一行", 0, 80)
```

## 尽量少的调用 `canvas API`

嗯，`canvas`也是通过操纵 `js`来绘制的，但是相比于正常的 `js`操作，调用 `canvas API`将更加消耗资源，所以在绘制之前请做好规划，通过 **适量** `js`原生计算减少 `canvas API`的调用是一件比较划算的事情

当然，请注意 **适量**二字，如果减少一行 `canvas API`调用的代价是增加十行 `js`计算，那这事可能就没必要做了

## 避免阻塞

在进行某些耗时操作，例如计算大量数据，一帧中包含了太多的绘制状态，大规模的 `DOM`操作等，可能会导致页面卡顿，影响用户体验，可以通过以下两种手段：

### web worker

`web worker`最常用的场景就是大量的频繁计算，减轻主线程压力，如果遇到大规模的计算，可以通过此 `API`分担主线程压力，此 `API`兼容性已经很不错了，既然 `canvas`可以用，那 `web worker`也就完全可以考虑使用

### 分解任务

将一段大的任务过程分解成数个小型任务，使用定时器轮询进行，想要对一段任务进行分解操作，此任务需要满足以下情况：

- 循环处理操作并不要求同步
- 数据并不要求按照顺序处理

分解任务包括两种情形：

- 根据任务总量分配

例如进行一个千万级别的运算总任务，可以将其分解为 `10`个百万级别的运算小任务
```js
// 封装 定时器分解任务 函数
function processArray(items, process, callback) {
  // 复制一份数组副本
  var todo=items.concat();
  setTimeout(function(){
    process(todo.shift());
    if(todo.length>0) {
      // 将当前正在执行的函数本身再次使用定时器
      setTimeout(arguments.callee, 25);
    } else {
      callback(items);
    }
  }, 25);
}

// 使用
var items=[12,34,65,2,4,76,235,24,9,90];
function outputValue(value) {
  console.log(value);
}
processArray(items, outputValue, function(){
  console.log('Done!');
});
```

优点是任务分配模式比较简单，更有控制权，缺点是不好确定小任务的大小

有的小任务可能因为某些原因，会耗费比其他小任务更多的时间，这会造成线程阻塞；而有的小任务可能需要比其他任务少得多的时间，造成资源浪费

- 根据运行时间分配

例如运行一个千万级别的运算总任务，不直接确定分配为多少个子任务，或者分配的颗粒度比较小，在每一个或几个计算完成后，查看此段运算消耗的时间，如果时间小于某个临界值，比如 `10ms`，那么就继续进行运算，否则就暂停，等到下一个轮询再进行进行

```js
function timedProcessArray(items, process, callback) {
  var todo=items.concat();
  setTimeout(function(){
    // 开始计时
    var start = +new Date();
    // 如果单个数据处理时间小于 50ms ，则无需分解任务
    do {
      process(todo.shift());
    } while (todo.length && (+new Date()-start < 50));

    if(todo.length > 0) {
      setTimeout(arguments.callee, 25);
    } else {
      callback(items);
    }
  });
}
```

优点是避免了第一种情况出现的问题，缺点是多出了一个时间比较的运算，额外的运算过程也可能影响到性能


## 总结

我准备做的 `canvas`游戏似乎需要的制作时间有点长，每天除了上班之外，剩下的时间实在是不多，不知道什么时候能搞完，如果一切顺利，我倒是还想再用一些游戏引擎，例如 `Egret`、`LayaAir`、`Cocos Creator` 将其重制一遍，以熟悉这些游戏引擎的用法，然后到时候写个系列教程出来……

诶，这么看来，似乎是要持久战了啊

