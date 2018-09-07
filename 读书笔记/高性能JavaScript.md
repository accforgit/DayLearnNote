# 高性能 JavaScript

---

## 加载和运行

### 将脚本放在页面底部，避免阻塞浏览器对 `DOM` 的解析与显示。

### 合并请求

下载一个 100KB 的文件比下载四个 25KB 的文件要快，所以将对多个 `script` 脚本的加载请求，
合并在一条请求中，减少请求的次数，需要服务端的支持。

### 页面加载完成(`window.onload()`)之后再加载脚本文件。 

当前脚本文件太大时，就算请求数量较少，同样也会阻塞文档加载，
所以需要异步并行加载脚本。

### 延迟脚本 : `defer  async`

相同点
- 加载文件时不会阻塞页面渲染
- 对于 inline 的 script 无效
- 使用这两个属性的脚本不能调用 document.write 方法
- 有脚本的 onload 的事件回调

区别
- html4.0 定义了 defer； html5.0 定义了 async
- 每一个 async 属性的脚本都在它下载结束之后立刻执行，同时会在 window 的 load 事件之前执行，
  所以就有可能出现脚本执行顺序被打乱的情况；每一个defer属性的脚本都是在页面解析完毕之后，
  按照原本的顺序执行，同时会在 document 的 DOMContentLoaded 之前执行。

### 动态脚本元素

下面是一种常用的推荐方法

```js
// 兼容 IE 和 标准浏览器
// 因为这段代码体积很小，也可以将这个函数放到另外一个脚本文件中，保证页面的简洁性，
// 不过这样一来就多了一次 http 请求，根据情况权衡即可
function loadScript(url, callback) {
  var script = document.createElement('script');
  script.type='text/javascript';
  // 兼容 IE
  if(script.readyState) {
    script.onreadystatechange = function() {
      if(script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null;
        callback();
      }
    }
  } else {
    // 标准浏览器
    script.onload = function() {
      callback();
    }
  }
  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
}
// 调用
loadScript('file.js', function(){
  // 执行函数
});

// 最好将以上代码放在 `</body>` 之前。
```

由于以上使用了一个回调函数，每个脚本所需的加载时间不同，所以无法保证所加载的脚本按照顺序执行，
要想让脚本按照顺序执行，可以串联脚本：

```js
loadScript('file1.js', function(){
  loadScript('file2.js', function(){
    loadScript('file2.js', function(){
      // ...
    })
  })
})
```

这样一来就能保证脚本按照顺序执行，但是如果脚本太多可能比较麻烦，可以将多个脚本整合成一个大的脚本文件，
由于动态加载脚本是异步执行，所以就算脚本文件很大，也不会产生阻塞的后果。

### `XMLHttpRequest` 脚本注入

```js
var xhr = new XMLHttpRequest();
xhr.open('get','file.js', true);
xhr.onreadystatechange = function() {
  if(xhr.readyState === 4) {
    if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
      var script = document.createElement('script');
      script.type = 'text/script';
      script.text = xhr.responseText;
      document.body.appendChild(script);
    }
  }
};
xhr.send(null);
```

这种方法优点在于能够适合所有的现代浏览器而不用考虑兼容性的问题，
限制在于 跨域限制 以及 无法使用 `CDN` 加速，所以一般很少使用。


## 数据访问

### 全局变量本地化

```js
for (var i=0; i<document.getElementById('li').length; i++) {
  document.getElementById('foo').appendChild('<span>'+i+'</span>');
}
```

以上代码每次为 `id` 为 `foo`的元素添加子元素，都需要首先在`window`全局中查找一次，  
当次数过多，会对性能产生很大的影响，这个时候就需要用到变量本地化操作了。

将上面那段代码改为：
```js
var len = document.getElementById('li').length;
var foo = '';
for (var i=0; i<len; i++) {
  foo += '<span>'+i+'</span>';
}
document.getElementById('foo').appendChild(foo);
```

### 对象属性成员本地化

使用诸如点号 `.` 的形式访问对象，每多加一个点号，就会导致对象多进行一次搜索，
所以将需要多次使用的成员属性本地化，以提升性能。

```js
function hasEitherClassName(element, className1, className2) {
  return element.className === className1 || element.className === className2;
}

// 修改为
function hasEitherClassName(element, className1, className2) {
  var currentClassName = element.className;
  return currentClassName === className1 || currentClassName === className2;
}
```

`Tips`
- 直接量和局部变量访问速度非常快，数组项和对象成员需要更长时间
- 局部变量比域外变量访问速度更快，因为局部变量位于作用域链的第一个对象中，而全局变量通常嵌套的比较深
-避免使用 `with` 表达式
- 嵌套对象成员会造成重大性能影响，尽量少用
- 一个属性或方法在原型链中的位置越深，访问它的速度就越慢

## `DOM` 编程

### `innerHTML` 与 `createElement`

在 IE6 浏览器中， `innerHTML` 比 `createElement` 快三倍，
但是在 `chrome` 中，反而慢于后者，使用哪种方法自行决定

### 节点克隆 

大多数情况下，克隆节点的效率要比直接创建一个新的节点效率要高。
```js
var itm=document.getElementById("myList2").lastChild;
// 参数 true 表示深度复制，包括节点的所有属性以及它们的值全部复制一遍
// 如果为 false 则表示浅复制，只复制元素标签本身，其子元素包括文本元素都不用复制
var cln=itm.cloneNode(true);
document.getElementById("myList1").appendChild(cln);
```

### `DOM` 集合与数组 

遍历 `DOM` 集合的速度，要比遍历数组的慢，如果需要对所产生的 `DOM` 集合进行多次便利查询，则最好将 `DOM` 集合缓存到数组中。
  
```js
// 将 `DOM` 集合缓存到数组中
function toArray(coll) {
  var a = [], len = coll.length;
  for(var i=0; i<len; i++) {
    a[i] = coll[i];
  }
  return a;
}

var coll = document.getElementById('div');
var arr = toArray(coll);
```
需要注意的是，将 `DOM` 集合转为数组算是一个额外的操作，如果对 `DOM` 集合的操作并不是太多， 
那么无需使用数组。

### `IE` 浏览器中，使用 `nextSibling` 而非 `childNode` 抓取与当前元素有关的元素集合，因为前者速度更快

```js
// 考虑一下情况，采用非递归的方式遍历一个元素的子节点

// 第一种，使用 nextSibling
function testNextSibling() {
  var el = document.getElementById('mydiv);
  ch = el.firstChild;
  name = '';
  do {
    name += ch.nodeName;
  } while (ch = ch.nextSibling);
  return name;
}

// 第二种，使用 childNodes
function testChildNodes() {
  var el = document.getElementById('mydiv);
  ch = el.childNodes;
  len = ch.length;
  name = '';
  for(var count = 0; count < len; count++) {
    name = ch[count].nodeName;
  }
  return name;
}
```

### 元素节点 

`DOM` 属性诸如 `childNodes firstChild nextSibling` 不区分元素节点和其他类型的节点，
如注释节点和文本节点，而大多数情况下，我们只需要元素节点，所以对于其他类型节点的遍历都是不必要的。

许多现代浏览器提供了只返回元素节点的`API`，能够高效地过滤掉其他节点。

|自带过滤功能的浏览器 `API`|原生属性|
|---|---|
|`children`|`childNodes`|
|`childElementCount`|`childNodes.length`|
|`firstElementChild`|`firstChild`|
|`lastElementChild`|`lastChild`|
|`nextElementSibling`|`nextSibling`|
|`previousElementSibling`|`previousSibling`|

以上所有属性被所有标准浏览器支持，`IE 6, 7, 8` 只支持 `children` 格式的。

### 使用 `querySelector` 与 `querySelectorAll` 

需要 `IE8` 及以上支持

### 页面文档重绘与回流

与位置和尺寸等属性相关的修改会引起回流，颜色、背景灯属性引起重绘，页面文档的重绘与重排版比较影响性能，最好将多个`DOM` 操作和样式的改变合并到一次操作中完成

```js
var el=document.getElementById('mydiv');

// 重绘了3 次
el.style.borderLeft='1px';
el.style.borderRight='2px';
el.style.padding='5px';

// 合并操作，速度更快
el.style.cssText='border-left:1px; border-right:2px;padding:5px';
```

如果只是改变很多样式的话，那么还可以选择直接替换类名的方法:
```js
var el = document.getElementById('mydiv');
el.className = 'active';
```

当需要对 `DOM` 元素进行多次修改时，可以通过以下步骤减少重绘和重排版的次数：
(1) 从文档流中摘除该元素
(2) 对其进行操作
(3) 将元素返回到文档流中


为了达到以上目的，可以使用以下手段

- 隐藏元素 : `diplay: none;`，进行修改，然后再显示它 : `diplay: block;`

```js
var ul = document.getElementById('mydiv');
// 隐藏元素
ul.style.display = 'none';
// DOM 或 样式修改 等操作
appendDataToElement(ul,data);
ul.style.display = 'block';
```

- 使用一个文档片段在已存`DOM` 之外创建一个子树，然后将它复制到文档中 (推荐使用)

```js
var ul = document.getElementById('mydiv');
// 创建一个文档片段
var fragment = document.createDocumentFragment();
// DOM 或 样式修改 等操作
appendDataToElement(fragment,data);
// 只需要进行一次 DOM 重绘
ul.appendChild(fragment);
```

- 将原始元素复制到一个脱离文档的节点中,修改副本，然后覆盖原始元素

```js
var ul = document.getElementById('mydiv');
// 复制元素
var clone = ul.cloneNode(true);
// DOM 或 样式修改 等操作
appendDataToElement(clone,data);
// 替换旧元素
ul.parentNode.replaceChild(clone, ul);
```

### 缓存布局信息

当进行查询布局信息，例如偏移量、滚动条位置或者样式属性等，浏览器都会刷新队列重新绘制，
以获取最新的数据，所以最好减少直接操作。

```js
// 使用 setTimeout 进行平移动画

// 这里进行多次查询，导致多次重绘
myElement.style.left=1 + myElement.offsetLeft +'px';
if(myElement.offsetLeft >= 500) {
  stopAnimation()
}

// 将初始值缓存到局部变量中，提高性能
myElement.style.left=current+'px';
if(current >= 500) {
  stopAnimation();
}
current++;
```

### 显示/隐藏动画

位于文档流中的显示/隐藏动画会将页面其他部分推离原来的位置，导致页面重新计算。

解决方法：
(1) 给动画元素使用绝对定位，使其脱离文档流布局
(2) 让动画元素进行覆盖操作时，直接覆盖到其他元素上面，而不是推移其他元素
(3) 动画结束时，重新定位，从而只一次下移文档其他元素的位置

### `hover`

>在 `IE` 浏览器中，如果大量使用伪类 `hover` 将会降低浏览器的反应速度

## 事件冒泡托管

### 算法和流程控制

循环语句
- `for(...)` 
- `while()` 
- `do...while()`

以上三种循环速度相差不多，根据情况随意选择使用

- `for...in` 

此循环可枚举任何对象的命名属性，包括对象的实例属性和它从原型链继承而来的属性
此循环比其他三种循环都**明显要慢**
一般情况下，只在需要对数目不详的对象属性进行操作，否则避免使用此循环

- 倒序循环 

倒序循环能够加快速度，前提是你能够消除因此而产生的额外操作， 
因为与升序循环相比，从原先的两次比较(迭代少于总数吗？它等于 `true` 吗？)，减少到一次比较(它等于 `true` 吗？) 
例如，查询数组或属性长度的操作
    
```js
let len = items.length;

for(var i=len; i--;){
  /// ...
}

while(len--) {
  // ...
}

do {
  // ...
} while(len--)
```

- 达夫设备(`Duff's Device`) 

达夫设备是一个循环体展开技术，在一次迭代中实际上执行了多次迭代操作。 
如果循环次数少于 `1000` 次，那么没有必要采用这种方法，而如果超过了 `1000` 次，
那么使用此方法将会大幅度提升循环速度，循环迭代的次数越多，性能提升得就越明显。

原因是减少了大约 **8倍**的 是否遍历完毕的判断 
  
```js
var iterations=Math.floor(items.length/8);
var startAt=item.length%8;
var i=0;
do {
  // 注意，这里没有 break
  switch(startAt) {
    case 0: process(items[i++]);
    case 7: process(items[i++]);
    case 6: process(items[i++]);
    case 5: process(items[i++]);
    case 4: process(items[i++]);
    case 3: process(items[i++]);
    case 2: process(items[i++]);
    case 1: process(items[i++]);
  }
  startAt=0;
} while(--iterations)
```

以下是根据 达夫设备 改进的更快版本，增加了一个 `while` 循环，但是减去了 `switch` 语句， 
并且使用倒序循环

```js
var i=items.length%8;
while(i) {
  process(items[i--]);
}

i=Math.floor(items.length/8);
while(i){
  process(items[i--]);
  process(items[i--]);
  process(items[i--]);
  process(items[i--]);
  process(items[i--]);
  process(items[i--]);
  process(items[i--]);
  process(items[i--]);
}
```

- `if...else` 和 `switch`

大多数情况下，`switch` 比 `if...else` 更快，但是只有当条件体数量很大时才更加明显， 
当条件体数量较大时(多于 2个或3个)，无论是从代码可读性还是性能方面，都要首先考虑使用 `switch`

- 优化 `if...else`

将出现频率更高的条件放在前面

```js
// 这里假设 value < 5 出现的可能性最高，所以放在最前面
if(value < 5) {
  // ...
} else if (value > 5 && value < 10) {
  // do ...
} else {
  // ...
}
```

- 二分法

如果条件值的出现频率均匀分布，或是无法判断可能性的高低，可将多个直连的 `else if` 语句改成嵌套的 `else if` ，可以按照二分法来达到减少判断次数的目的。

```js
// 这种直连的形式可能会进行 5 次判断
if(value == 0){
  // ...
} else if(value == 1){
  // ...
} else if(value == 2){
  // ...
} else if(value == 3){
  // ...
} else if(value == 4){
  // ...
} else{
  // ...
}
// 使用二分法嵌套条件语句,最多只需要判断 3 次
if(value < 3){
  if(value == 2){
    // ...
  } else if(value == 1){
    // ...
  } else {
    // ...
  }
} else {
  if(value == 3){
    // ...
  } else if(value == 4){
    // ...
  } else {
    // ...
  }
}
```

- 查表法

当有大量离散值需要测试时，查表法将比 `if...else` 和 `switch` 都要快得多，并且数据越多就越明显 
查表法可用 **数组** 或者 **普通** 对象实现。

```js
var results=[a1,a2,a3,a4,a5,a6,a7,a8,a9,a10];
function search(key) {
  return results[key];
}
```

- 递归

- 制表 

指得是将已经执行过的计算的结果保存下来，下次再碰到同样的计算，可以直接从缓存表中获取结果，不需要进行重复的计算

```js
// 为 阶乘 函数制表
function memfactorial(n) {
  if(!memfactorial.cache) {
    memfactorial.cache={
      '0':1,
      '1':1
    };
  }
  if(!memfactorial.cache.hasOwnProperty(n)) {
    memfactorial.cache[n]=n*memfactorial(n-1);
  }
  return memfactorial.cache[n];
}
// 像常规的阶乘函数那样直接使用，只不过速度更快
var fact6=memfactorial(6);    // 720
```

## 字符串和正则表达式

### 连接字符串 

当连接少量字符串时， `+  += join()  concat()` 操作的速度相差不大

需要避免在内存中创建临时字符串
```js
// 这种表达形式，会在内存中创建一个值为 `onetwo` 的临时字符串，
// 然后再与 str 连接
str += 'one' + 'two';

// 应该改成这样，少去了创建临时字符串的步骤， 速度提升 10%~40% (IE8及之前无效)
str += 'one';
str += 'two';

// 或者下面这种也可以避免创建字符串(IE8及之前无效)
// 注意将基本字符串，也就是 str 放在最前面
str = str + 'one' + 'two';
```

### 数组连接 

在大多数浏览器上，数组连接(`join()`) 比连接字符串的其他方法更慢，但是在 `IE7` 及之前的版本上， 
它是连接大量字符串唯一的高效途径(特别是在 IE7 及之前版本上)

### 原生连接函数(`concat()`) 

连接字符串最灵活的方法，但大多数情况下是 3 种连接方法中最慢的，并且如果涉及到大量的字符串连接， 
性能将会受到显著影响

### 正则表达式

- 正则表达式本地化 

创建了一个正则表达式之后，浏览器会检查其是否存在错误，然后转换成一个本地代码例程，如果所创建的正则表达式 
不只使用一次，那么最好用一个变量将此正则表达式缓存起来
  
```js
var reg = /\w{3}/;
```

- 正则表达式具体化 

例如使用更具体的 `[^"\rn]*` 取代宽泛的 `.*?`

- `Tips`

(1) 最好以简单的、必须的字元开始 
  例如 `^` 或 `$` ，或者简单的特定字符，例如字母 `x` 或 `\u363A`,字符串,例如 `[a-z]`， 
  特定类型的字符，例如 `\d`，以及单词边界 `\b`，避免以分组或选字元开头，例如 `a|b|c`

(2) 减少模糊的量词 
  例如在 `FireFox` 中，用 `\s\s*` 替代 `\s+` 或 `\s{1,}`

(3) 减少分支 `|` 

|不推荐|推荐|
|---|---|
|`cat|bat`|`[cb]at`|
|`red|read`|`rea?d`|
|`red|raw`|`r(?:ed|aw)`|
|`(.|\r|\n)`|`[\s\S]`|

(4) 如果不需要一个后向引用，那么使用非捕获组 (`(?:)`) 代替捕获组(`()`)， 
    因为捕获组需要花费时间和内存用于记录后向引用

(5) 暴露起始字符
  例如，使用 `/^(ab|cd)/` 代替 `/^ab|^cd/`

(6) 尽量使用适当的量词，避免模糊

(7) 将复杂的正则表达式拆分为简单的片段，避免一个正则表达式做太多的工作

(8) 如果需要编写 `trim` 去除字符串头尾空格，则使用正则表达式修建头部空格，使用非正则表达式修建尾部空格
```js
String.prototype.trim=function() {
  var str=this.replace(/^\s+/,'');
  var end=str.length-1;
  var ws=/\s/;
  while(ws.test(str.charAt(end))){
    end--;
  }
  return str.slice(0,end+1);
}
```

## 响应接口

### 限制任何 `JavaScript` 任务在 `100ms` 内完成

### 定时器函数 `setTimeout()` 

- 让出线程

如果某些复杂的 `JavaScript` 任务无法在 `100ms` 内完成，理想方法是让出对 `UI` 线程的控制 ，
使`UI` 更新可以进行，这也就意味着停止 `JavaScript`任务的运行，当 `UI` 更新完成后，再继续运行 `JS` 任务 
由浏览器的原因，所以定时器的时间往往并不完全精确，大多会有几毫秒的偏移，并且需要最少设置定时器时间不小于 `15ms`

- 定时器分解

如果循环操作运行时间过长，可能造成 `UI` 阻塞,并且满足以下两个条件：

I. 循环处理操作并不要求同步
II. 数据并不要求按照顺序处理

那么可以考虑使用 定时器分解任务，避免 `UI` 被阻塞太长时间
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


- 限时运行

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

在网页应用中使用定时器，尽量限制高频率重复定时器的数量，另外，为了减少定时器数量 ， 
可以用一个定时器每次执行多个操作。

- 充分利用 `web worker`

## `Ajax` 和 `XML`

### `5` 种技术用于向服务器请求数据

常用：
- XMLHttpRequest(XHR)
- Dynamic script tag insertion 动态脚本标签插入
- Multipart XHR 多部分的XHR，只用一个请求就可以从服务器获取多个资源

极少使用：
- iframes
- Comet

### 缓存数据

- 在服务器端，设置 `HTTP` 头，确保返回报文将被缓存在浏览器中

I. 使用 GET 方法请求服务器
II. 服务器端设置过期时间

例如在 `PHP` 中：
```js
$lifetime=7*24*60*60;     // 代表 7 天
header("Expires".gmdate('D,d M Y H:i:s',time()+$lifetime).'GMT');
```

- 在客户端，于本地缓存已获取的数据，不要多次请求统一数据 

以 `URL` 为键值索引报文对象，使用 `XHR` 封装


## 编程实践

### 避免二次评估

```js
var num1=5, num2=6;

// 以下全部为二次评估，应当避免使用
// 大多数情况下，也无需使用以下两种写法
var result = eval("num1+num2");
var sum = new Function('arg1','arg2','return arg1+arg2');
// 第一个参数用一个函数，而非字符串
setTimeout('sum=num1+num2',100);
setInterval('sum=num1+num2',100);
```

### 使用对象/数组直接量

### 延迟加载

```js
// 覆写函数
function addHandler(target,eventType,handler) {
  if(target.addEventlistener) {
    // 标准浏览器
    addHandler=function(target,eventType,handler) {
      target.addEventlistener(eventType,handler,false);
    }
  } else {
    // IE
    addHandler=function(target,eventType,handler) {
      target.attachEvent('on'+eventType,handler);
    }
  }
}
```

### 条件预加载

```js
// 使用 三目运算符
var addHandler=document.body.addEventlistener ? 
  function(target,eventType,handler) {
    target.addEventlistener(eventType,handler,false);
  } :
  function(target,eventType,handler) {
    target.attachEvent('on'+eventType,handler);
  }
```

### 使用原生内置的函数，比如数学运算(`Math`) 

## 创建并部署高性能 `JavaScript` 应用程序

### 预处理 `JavaScript` 文件

### `JavaScript` 压缩

### 调试

```js
// 测试时间
var name=0;
console.time('go')
for(var i=1000000;i--;){
  if(i&1){
    name++;
  } else {
    name++;
  }
}
console.timeEnd('go')
```
