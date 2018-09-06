# HTML5 与 CSS3 权威指南(上)
---

## `HTML5` 的结构元素

- 主体结构元素:

```
  article section nav aside time pubdate
```

- 非主体结构元素：

```
  header footer address main
```

- 表单新增元素
- 图形绘制：`Canvas`
- 多媒体相关 `API`
  ```
  video audio
  ```
- 浏览器历史记录： `History API`
- 本地存储
```
(1) Web Storage:
  I. localStorage
  II. sessionStorage

(2) 本地数据库
  I. SQLite
  II. IndexedDB

(3) 离线应用程序
  I. manifest 文件
  II. applicationCache 对象
```

- 文件 `API`

```
(1) FileList 对象与 file 对象
(2) ArrayBuffer 对象与 ArrayBufferView 对象
(3) Blob 对象
(4) FileReader 对象
(5) FileSystem API: 包括对文件以及文件目录的空间申请、创建、写入、读取、复制、删除
(6) Base64 编码支持
```
- 通信`API`


## 具有 `boolean` 值的属性 (例如 `disable readonly` ) 写法

```html
<!--不写属性名默认属性为 false-->
<input type="checkbox">

<!--只写属性名，代表属性值为 true-->
<input type="checkbox" checkbox>

<!--属性值 等于 属性名，代表属性为 true-->
<input type="checkbox" checkbox='checkbox'>

<!--属性值 等于 空字符串 ""，代表属性为 true-->
<input type="checkbox" checkbox="">
```

## 属性值引号省略

当属性值不包括空字符串、`<、>、=、`单引号、双引号等字符时，属性值两边的引号可以省略。
```html
<!--以下三种写法效果完全相同-->
<input type='text'>
<input type="text">
<input type=text>
```

## `artile` 与  `section` 标签

`article` 元素代表文档、页面或应用程序中**独立的、完整的、可以独自被外部引用的内容**，
例如一篇博客、报纸上的文章、论坛帖子、用户评论等独立内容。

一个标准完整的 `article` 示例如下：

```html
<article>
  <header>
    <h1>苹果</h1>
    <p>发表日期:</p><time pubdate='pubdate'>2010/10/09</time>
  </header>
  <p><b>苹果</b>，植物类水果...</p>
  <footer>
    <p><small>著作权归xxx公司所有</small></p>
  </footer>
</article>
```

以上代码中，`article` 元素中包括头部`header`、标题`h1`、段落`p`、页脚`footer`
等元素，`article` 内容相对比较独立、完整，适合使用`article`标签元素。

- `section`
  相对于 `article` 来说，`section` 元素适用于对页面上的内容进行分块，或者说对文章进行分段，

- `artile` 与  `section` 之间的区别在于，`artile`可以看成是一种特殊种类的 `section`，
但是比 `section` 更加强调**独立性**，**二者可以互相嵌套使用**。

- 需要注意的事情

(1) 不要将 section 用作设置样式的页面容器，也就是说，如果一个页面容器元素，
其主要表现都由 CSS 来进行规范，那么直接使用 div 。
(2) 如果 article 元素、aside 元素或者 nav 元素更符合状况，那么不要使用 section 。
(3) 不要为没有标题的内容区块使用 section 元素。

- 非主体结构元素

>1. `header  footer  address` 标签元素都可以在同一个网页内存在多个，
比如为每个`article`内容区加一个`header` 和 `footer`.

>2. 每个网页内部职能防止一个 `main` 元素，不能将 `main` 元素放置在任何
`article aside  footer  header nav` 等元素内部。

- 对新的结构元素使用样式

由于很多浏览器尚未对 `HTML5` 中新增的结构元素提供支持，所以可能需要使用 `CSS` 追加
以下声明，目的是通知浏览器页面中使用的 `HTML5` 新增元素都是以块方式显示的。
```
article, aside, dialog, figure, header, legend, nav, section, main {
  display: block;
}
```
另外，IE 8及之前的浏览不支持使用 `CSS` 的方法来使用这些尚未支持的结构元素，
这就需要用到 `JavaScript` 脚本动态创建元素标签。
```
<script>
  document.createElement('nav');
  document.createElement('article');
  document.createElement('footer');
  document.createElement('main');
</script>
```

- `WebStorage`

>1. 利用 `storage` 事件监视 `Web Storage` 中的数据

```js
window.addEventListener('storage', function(event){
  // 当sessionStorage 或 localStorage 的值发生变动时所要执行的处理
}, false)
```
以上代码，其中 `event` 事件属性：
```
  (1) event.key: 被修改的数据的键值
  (2) event.oldValue: 被修改的数据在修改之前的值
  (3) event.oldValue: 被修改的数据在修改之后的值
  (4) event.url: 被修改的数据值的URL地址
  (5) event.storageArea: 被修改的 sessionStorage 或 localStorage 对象
```

- `input` 文件类型

>为 `file` 类型的 `input` 标签添加 `multiple` 属性，则允许一次性放置多个文件，以数组类型呈现。

```
HTML:
  <!--size 限制上传文件大小，multiple 表明允许一个 input 控件中放置多个文件-->
  <input type="file" id='file' size='80' multiple>
  <input type="button" onclick='ShowFileInfo()' value='显示文件信息'>

JS:
  function ShowFileInfo() {
    var file;
    // 获取 input 标签中所有放置的文件
    var uploadFiles=document.getElementById('file');
    for(var i=0; i<uploadFiles.files.length; i++) {
      file=uploadFiles.files[i];
      // 输出每个上传文件的名称
      console.log(file.name)
      // 输出每个上传文件的类型
      console.log(file.type)
      // 输出每个上传文件的字节大小
      console.log(file.size)
    }
  }
```

**对于图片类型的文件，其 `type` 都是以 `image/`为前缀，根据此特性，可以直接判断上传文件**
**是否为图片文件**

- `Blob` 对象
>`Blob` 是 `HTML5` 中新增的对象，代表原始二进制数据，`file` 对象就继承了 `Blob` 对象。
此对象有两个属性， `size` 属性表示一个 `Blob` 对象的字节长度，`type` 属性表示`Blob` 对象的
`MIME` 类型，如果是未知类型，则返回一个空字符串。

创建 `Blob` 对象
```
HTML:
  <textarea name="" id="text" cols="30" rows="10"></textarea>
  <button id="btndownload" onclick='Blob_test()'>create</button>
  <output id='result'></output>

JS:
  function Blob_test() {
    var text = document.getElementById('text').value;
    var blob;
    var result = document.getElementById('result');
    if(!window.Blob){
      result.innerHTML = '您的浏览器不支持使用Blob对象！';
    } else {
      // Blob 第一个参数值为一个数组，其中放置任意数量的类型对象，
      // 例如 String 对象、ArrayBuffer对象、ArrayBufferView 对象、Blob对象
      // 这里很明显是一个 String 对象
      blob = new Blob([text]);
    }
    
    if(window.URL){
      var temp = window.URL.createObjectURL(blob);
      result.innerHTML = '<a download href="'+temp+'" target="_blank">文件下载</a>';
    }
  }
```

上述代码，在 `textarea` 中输入任意字符后，点击按钮，将在按钮后追加一个带有`download` 属性的 `a` 标签,
其`href` 值类似于`blob:http%3A//null.jsbin.com/c8e1bd7b-5cc4-4c9c-a476-6c192dba6f68`，点击此链接之后，
将会下载文件到本地，用编辑器打开，文件里的内容就是刚才输入在 `textarea` 里的内容。

- `Base64` 编码

>`Base64` 编码是一种使用`64`个可打印字符(大部分情况下指得是 A-Z、 a-z、0-9、"+"、"/")来表示二进制数据的一种编码方法
编码后的数据比原始数据略长。
在 `HTML5` 中，新增`btoa()`与`atob()` 方法来支持`Base64` 编码，在这两个方法的命名中，
`b` 可以被理解为一串二进制数据，`a` 可以被理解为一个`ASCII`码字符串，**分别用来编码和解码**。

```js
// 编码
var result = window.btoa(data);

// 解码
var result = window.atob(data);
```

>1. `btoa()` 编码方法应用。
> 让 `img` 标签的 `src` 属性指向一个以 `data:` 开头的 `Base64` 图片，这对于数据库中保存的二进制图片文件的显示，
  或者统一指定使用的图片文件的格式非常有用。

```
HTML:
  <p>
    <label>选择文件:</label>
    <input type="file" name="" id="file" onchange='file_onchange()'>
    <input type="button" id="btnReadPicture" value='显示图片' onclick='readPicture()' disabled>
  </p>
  <div name='result' id="result"></div>

JS:
  var result=document.getElementById('result');
  var file=document.getElementById('file');
  if(typeof FileReader==='undefined'){
    result.innerHTML='<p>您的浏览器不支持FileReader</p>';
    file.setArribute('disabled','disabled');
  }

  function file_onchange() {
    document.getElementById('btnReadPicture').disabled=false;
  }
  function readPicture() {
    var file=document.getElementById('file').files[0];
      if(!/image\/\w+/.test(file.type)){
        console.log('选取的不是图片文件！');
        return false;
      }
    // 使用 FileReader 读取图片文件
    var reader=new FileReader();
    reader.readAsBinaryString(file);
    reader.onload=function(f){
      // 对选择的图片文件使用 btoa 编码为 Base64 格式
      var src='data:'+file.type+';base64,'+window.btoa(this.result);
      result.innerHTML='<img src="'+src+'" alt=""/>';
    }
  }
```

>2. `atoa()` 解码方法应用。
>获取 `canvas` 元素 `URL`地址中的 `Base64` 格式的字符串，并将其解码为一串二进制数据，保存到数据库。

```
HTML:
  <body onload="draw('canvas')">
    <input type="button" value="上传图片" onclick='imgSave()'>
    <canvas id="canvas" width='400' height='300'></canvas>
</body>

JS:
  var canvas;
  function draw(id) {
    canvas=document.getElementById(id);
    var context=canvas.getContext('2d');
    context.fillStyle='rgb(0,0,255)';
    context.fillRect(0,0,canvas.width,canvas.height);
    context.fillStyle='rgb(255,255,0)';
    context.fillRect(10,20,50,50);
  }

  function imgSave() {
    // toDataURL: 获取canvas的URL地址，并设置格式为jpeg
    var data=canvas.toDataURL('image/jpeg');
    data=data.replace('dat:image/jpeg;base64,','');
    // 使用 ajax 将二进制数据发送到服务器
    var xhr=new XMLHttpRequest();
    xhr.open('POST','uploadImage.php');
    xhr.sendAsBinary(window.atob(data));
  }
```

- 通信 `API`

>1. `WebSocket`：服务器与客户端之间的 **双向** 通信机制
>2. `Server-Sent Events`：服务器发送到客户端的 **单向** 通信机制

- `WebRTC` 通信
>视频与音频的实时通信

>1. `getUserMedia()` 方法访问本地设备(摄像头、麦克风)

浏览器开启视频实例：
```
HTML:
  <video id='myVideo' width='400' height='300' autoplay></video>

JS:
  navigator.getUserMedia=navigator.getUserMedia || navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia;
  window.URL=window.URL || window.webkitURL;

  var video=document.getElementById('myVideo');
  // video: true  表示开启摄像头
  // audio:false  表示不使用麦克风
  navigator.getUserMedia({video:true,audio:false},function(stream){
    video.src=window.URL.createObjectURL(stream)
  },function(err){
    console.log(err);
  })
```

借助 `canvas` 截取摄像头中的图像实现拍照功能：
```
HTML5:
  <video id='myVideo' width='400' height='300' autoplay></video>
  <img src="" id='img'>
  // canvas 起到一个暂存的作用，可选择性的将其 display:none; 隐藏起来
  <canvas id="canvas" width='400' height='300'></canvas>

JS:
  navigator.getUserMedia=navigator.getUserMedia || navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia;
  window.URL=window.URL || window.webkitURL;

  var video=document.getElementById('myVideo');
  video.addEventListener('click',snapshot,false);
  var canvas = document.getElementById('canvas');
  var ctx=canvas.getContext('2d');
  var localMediaStream=null;

  navigator.getUserMedia({video:true,audio:false},function(stream){
    video.src=window.URL.createObjectURL(stream);
    localMediaStream=stream;
  },function(err){
    console.log(err);
  });

  function snapshot() {
    if(localMediaStream) {
      // 首先将数据流绘制在 canvas上
      ctx.drawImage(video,0,0,400,300);
      // 然后利用 canvas 的toDataUrl 方法将绘制出来的图片解码为 base64格式，输出到 img 标签
      document.getElementById('img').src=canvas.toDataURL();
    }
  }
```

- `Web Worker`

>适用场合
```
(1) 预先抓取并缓存一些数据以供后期使用
(2) 代码高亮处理货其他一些页面上的文字格式化处理
(3) 拼写检查
(4) 分析视频或音频数据
(5) 后台 I/O 处理
(6) 大数据量分析或计算处理
(7) canvas 元素中的图像数据的运算及生成处理
(8) 本地数据库中数据的存取及处理
```

- 其他 `API`

>1. `Web` 页面可见性 `API`:`Page Visibility API`
需要为不同的内核单独指定私有属性。

应用场合：
```
(1) 图片、视频、音频等连续播放多媒体，当页面处于不可见状态时，控制停止播放。
(2) 实时显示服务器端信息的应用程序，当页面处于不可见状态时，停止向服务器请求数据的处理。
```

>2. `FullScreen API` : 将页面整体或页面中某个局部区域设为全屏显示状态
需要为不同的内核单独指定私有属性，同时可以使用伪类 `:fullscreen` 来为全屏元素单独设定 `CSS` 样式。

>3. 鼠标指针锁定 `API` : `pointerlockchange`
>4. JS动画: `requestAnimationFrame`
>5. 检测页面变化: `MutationObserve()`
```
var mo=new window.MutationObserver(onchange);
var options={childList:true};
mo.observe(div, options);
```
>6. `Promise`

>7. `Beacon API` : 允许开发者在离开页面触发的 `unload` 事件回调函数中向服务器端发送携带少量数据的异步请求，
并且此请求不会阻塞 `unload` 事件回调中的其他代码，不需要用户做出任何等待就可以立即看见下一个页面。
