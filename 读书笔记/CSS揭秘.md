# CSS揭秘

---

## `CSS` 兼容

- 回退机制

优雅降级的一种，使用浏览器支持的样式，确保网站不会在低版本浏览器中挂掉，只是看起来没有那么炫。 
比如渐变(`gradient`) 需要 `IE 10` 及以上版本的支持，那么在编写渐变效果的时候， 
可能就需要用到。

```css
/* 写在最前面 */
background: rgb(255, 128, 0);

background:-moz-linear-gradient(0deg, yellow, red);
background:-o-linear-gradient(0deg, yellow, red);
background:-webkit-linear-gradient(0deg, yellow, red);
background:linear-gradient(0deg, yellow, red);
```

-  `@supports`

可以使用 `@supports` 检测浏览器的支持情况，不过这同时要求浏览器也支持 `@supports` 属性才行：

```css
h1 {
  color:gray;
}
/* 如果浏览器支持 text-shadow 属性，则应用下面样式 */
@supports (text-shadow: 0 0.3em gray) {
  h1 {
    color:transparent;
    text-shadow:0 0.3em gray;
  }
}
```

- 使用 `JavaScript` 检测浏览器对属性的支持

```js
function testProperty(property) {
  var root=element||document.documentElement;
  if(property in root.style) {
    root.classList.add(property.toLowerCase());
    return true;
  } 
  
  root.classList.add('no-'+property.toLowerCase());
  return false;
}
// 用法示例，比如检测浏览器对 text-shadow 的支持
testProperty('text-shadow');

```
以上，如果浏览器支持 `text-shadow` 这个属性，则将会在文档根元素上添加 `text-shadow` 这个类名， 
否则就添加 `no-text-shadow`，然后在编写 `CSS` 代码的时候就可以对这两种情况分别定义样式了。

比如对上面的 `text-shadow` 定义样式：

```css
.no-text-shadow .header {
  color:gray;
}

.text-shadow .header {
  color:transparent;
  text-shadow:0 0.3em gray;
}
```

## 检测对某个具体的属性值的支持

如果我们想要检测某个具体的属性值是否支持，那就需要把它赋给对应的属性，
然后再检查浏览器是不是还保存着这个值。很显然，这个过程会改变元素的样式，因此我们需要一个隐藏元素 

```js
function testValue(classname, value, property, element){
  var dummy=document.createElement(element);
  dummy.style[property]=value;
  
  if(dummy.style[property]){
    document.querySelector(element).classList.add(classname);
    return true;
  }
  element.classList.add('no-'+classname);
    return false;
}

// 检测浏览器对 h1 的 text-shadow:0 0.3em gray; 的支持
testValue('red','text-shadow','0 0.3em gray','h1');
```

## 减少代码重复(`DRY`)

- 尽量减少改动时要编辑的地方，减少使用绝对值

```css
button {
  padding: 6px 16px;
  border:1px solid #446d88;
  background: #58a linear-gradient(#77a0bb, #58a);
  border-radius:4px;
  box-shadow:0 1px 5px gray;
  color:#fff;
  text-shadow:0 -1px 1px #335166;
  font-size: 20px;
  line-height: 30px;
}
```
上述代码中，几乎全都用到了绝对值(指得是各自定死了的值)，这导致如果修改一处， 
可能导致其他地方也都要被修改，以使用被修改的那一个样式，牵一发而动全身。
最好修改成以下 `相对` 确定值的情况：

```css
button {
  // 使用 em 相对父级字体大小确定值
  padding: 0.3em 0.8em;
  border:1px solid #446d88;
  background: #58a linear-gradient(#77a0bb, #58a);
  border-radius:0.2em;
  box-shadow:0 0.05em 0.25em gray;
  color:#fff;
  text-shadow:0 -0.05px 0.05em #335166;
  // 根据父级字体大小确定值
  font-size: 125%;
  // 根据当前字体大小确定值
  line-height: 1.5;
}

```

- `currentColor` 

`CSS` 中有史以来的第一个变量 ，用于自动获取当前文本的颜色

```html
<div class="box1">
  nice
  <hr>
</div>
```
```css
.box1{
  color:skyblue;
  font-size: 2em;
}
hr{
  height:0.2em;
  // 这里的 currentColor 就代表 skyblue
  background:currentColor;
}
```

- 继承属性 `inherit` 
```css
a {
  font-size: inherit;
  color: inherit;
}
```

- 避免不必要的媒体查询

(1) 使用百分比长度来取代固定长度，或者尝试使用于视口相关的单位(vw,vh,vmin,vmax) 
(2) 当你需要在较大分辨率下得到固定宽度时，使用 `max-width` 而不是 `width` ，因为它可以适应 
  较小的分辨率而无需进行媒体查询。 
(3) 不要忘记为替换元素(例如 `img  object video iframe` 等)设置一个 `max-width: 100%`。 
(4) 使用弹性盒布局(`display:flex;`) 
(5) 使用多行文本时，指定 `column-width` 而不是 `column-count` 


## 元素背景

- 背景图片定位

指定一个背景图片，并且为了兼容不支持 `background-position` 的浏览器，
加上了` bottom right `属性
```css
background: url(bg.png) no-repeat bottom right #58a;
background-position: right 20px bottom 10px;
```

**默认情况下，`background-position` 是以 `padding-box` 进行定位，** 
**如果想改变默认值，可以使用 `background-clip`**

- `calc()` 计算值

```css
background: url(bg.png) no-repeat;
// 为了向前兼容，运算符(这里是 + 和 -) 的两侧必须存在一个**空白符**
background-position: calc(100% - 20px) calc(100% - 10px)
```

- `linear-gradient`

如果多个色标具有相同的位置，它们会产生一个无限小的过渡区域，过渡的起止色分别是第一个和最后一个指定值。 
从效果上看，颜色会在那个位置突然变化，而不是一个平滑的渐变过程。

```css
/* 这将形成上下两条颜色分别为 skyblue 和 yellowgreen 的条文，没有过渡色 */
background: linear-gradient:(skyblue 50%, yellowgreen 50%);
/* 渐变是一种由代码生成的图像，所以能够应用背景图像的一些属性 */
background-size: 100% 30px;
```

如果某个色标的位置值比整个列表中在它之前的色标的位置值都要 
小，则该色标的位置值会被设置为它前面所有色标位置值的最大值。

```css
由于 yellowgreen 的色标值为 0，小于前面 skyblue 的色标值 50%，
所以实际上浏览器会把 yellowgreen 的色标值当成 50% 而不是 0 来处理
background:linear-gradient(skyblue 50%,yellowgreen 0);
```

## 形状

- 切角效果

元素的一个角被切掉的效果，运用到渐变的角度：

```css
/* 这一行是回退机制，为了兼容性考虑 */
background: #58a;

/* 这里如果角度为 45deg ，那么就是左下角被切掉的效果 */
background: linear-gradient(-45deg, transparent 15px,#58a 0);
```

- 梯形

```css
.box1 {
  width:100px;
  height:100px;
  // 相对定位
  position: relative;
}
.box1::before{
  content: '';
  // 绝对定位
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  background: #ccc;
  // 利用到了 3D 透视变换
  transform: perspective(10px) rotateX(5deg);
  // 以底部为基准进行 X轴 旋转
  transform-origin: bottom;
}
```

- 饼状图

实现一个饼图从 `0` 变化到 `100%` 的动画

伪元素版本
```html
  <div class="pie"></div>
```
```css
  @keyframes spin{
  to{transform:rotate(0.5turn);}
}
@keyframes bg{
  50%{background-color: #655;}
}

.pie{
  width:100px;
  height:100px;
  border-radius:50%;
  background:yellowgreen;
  background-image:linear-gradient(to right,transparent 50%,#655 0);
  
}

.pie::before{
  content:'';
  display: block;
  margin-left: 50%;
  height: 100%;
  border-radius:0 100% 100% 0 / 50%;
  background-color: inherit;
  transform-origin:left;
  animation:spin 3s linear infinite,
            bg 6s step-end infinite;
}
```

`SVG` 版本

```html
  <svg viewbox='0 0 32 32'>
    <circle r='16' cx='16' cy='16'></circle>
  </svg>
```
```css
  @keyframes fillup{
    to{stroke-dasharray:100 100;}
  }
  svg{
    width:100px;
    height:100px;
    transform:rotate(-90deg);
    background-color:yellowgreen;
    border-radius:50%;
  }

  circle{
    fill:yellowgreen;
    stroke:#655;
    stroke-width:32;
    stroke-dasharray:0 100;
    animation: fillup 5s linear infinite;
  }
```

## 视觉效果

- 毛玻璃效果

```css
body,main::before{
  // 背景图片
  background: url('tiger.jpg') 0 / cover fiexd;
}

main{
  position:relative;
  background: hsla(0,0%,100%,0.3);
  // 这是为了裁剪掉超出元素盒子以外的模糊效果
  overflow:hidden;
}
// 在主元素上覆盖一层伪元素，将模糊滤镜加载伪元素上，避免文字模糊
main::before{
  content: '';
  position: absolute;
  top:0;right: 0;bottom: 0;left: 0;
  filter: blur(20px);
  // 这是为了扩大阴影模糊的尺寸
  margin: -30px;
}
```

- 折角效果

```css
/* 45° 书页折角效果 */
.box1{
  width:200px;
  height:200px;
  background-color: #58a;
  background:linear-gradient(to left bottom,transparent 50%,rgba(0,0,0,0.4) 0) no-repeat 100% 0 / 2em 2em,
             linear-gradient(-135deg,transparent 1.5em,#58a 0);
}
```

## 字体排印

- 连字符断行

```css
hyphens: auto;
```

- 斑马条纹(或者也叫 隔行变色)

(1) 使用伪类 `:nth-child()`

(2) 使用渐变

```css
padding:0.5em;
line-height:1.5;
background: beige;
background-size: auto 3em;
/* 让渐变从文字内容开始和结束而不是整个元素 */
background-origin: content-box;
background-image:linear-gradient(rgba(0,0,0,0.2) 50%,transparent 0);
```

- 自定义下划线

```css
/* 利用线性渐变 */
p{
  background:linear-gradient(gray,gray) no-repeat;
  background-size: 100% 1px;
  background-position:0 1.15em;
  // 让下划线在遇到类似于 p y 这样的字母时，自动断开避让其降部
  text-shadow:0.05em 0 #fff,-0.05em 0 #fff;
}
```

## 文字效果

- 凸版印刷效果

```css
/* 利用 text-shadow */
p{
  font-size: 30px;
  background-color: hsl(210,13%,60%);
  color:hsl(210,13%,30%);
  text-shadow: 0 1px 1px hsla(0,0%,100%,0.8);
}
```

- 文字空心
```css
/* text-shadow 描边 */
p {
  font-size: 30px;
  background: deeppink;
  color:#fff;
  text-shadow: 1px 1px #000,-1px -1px #000,
               1px -1px #000,-1px 1px #000;
}
```

- 文字外发光
```css
p {
  font-size: 30px;
  background: #203;
  color:#ffc;
  text-shadow: 0 0 0.1em,0 0 0.3em;
}
```

- 文字凸起效果

```css
p {
  font-size: 50px;
  font-weight: 700;
  background: #58a;
  color:#fff;
  text-shadow: 0 1px hsl(0,0%,85%), 
               0 2px hsl(0,0%,80%), 
               0 3px hsl(0,0%,75%), 
               0 4px hsl(0,0%,70%), 
               0 5px hsl(0,0%,65%),
               // 最后在底部加一层投影
               0 5px 10px #000; 
               
}
```

- 环形文字

```html
  <div class='circular'>
    <svg viewbox='0 0 100 100'>
      <path d='M 20,50 a 30,30 0 1,1 0,1 z' id='circle'/>
      <text><textPath xlink:href='#circle'>
        Circle reasoning workds
      </textPath></text>
    </svg>
  </div>
```

```css
  path{
    fill:none;
  }
```

## 鼠标光标

- 隐藏光标  

应用在播放视频或者PC触屏设备

```css
video {
  /* `CSS 2.1` 规范，使用一张 `1x1` 的透明 `GIF` 图片，作为回退机制 */
  cursor: url('transparent.gif');

  /* `CSS 3` 规范 */
  cursor: none;
}
```

- 增大可点击区域

```css
.box1 {
  width:50px;
  height: 50px;
  /* 圆形 */
  border-radius:50%;
  background-color: #58a;
  /* 边框变宽并使用透明，功能上是增加了可点击区域 */
  border:10px solid transparent;
  /* 为了不让元素因为边框的变宽而变大，裁剪到内边距 */
  background-clip: padding-box;

  /* 另外的效果，这是在原有的边框上再加一个圆环 */
  box-shadow: 0 0 0 1px rgba(0,0,0,0.3) inset;
  cursor:pointer;
}

```

## 复选框 `checkbox` 样式美化

```html
  <input type="checkbox" id='awesome'>
  <label for="awesome">Awesome!</label>
```
```css
  input[type='checkbox']+label::before{
    /* 不换行的空格 */
    content:'\a0';
    display: inline-block;
    vertical-align: 0.10em;
    width: 0.8em;
    height: 0.8em;
    margin-right: 0.2em;
    border-radius:0.2em;
    /* 伪元素改造成复选框的背景颜色 */
    background-color: silver;
    text-indent:0.15em;
    line-height: 0.65;
  }
  input[type='checkbox']:checked+label::before{
    /* 更加优雅的对号符号 */
    content:'\2713';
    background-color: yellowgreen;
  }
  input[type='checkbox']{
    /* 使用裁切的方式将原有的checkbox隐藏，相对于直接 display:none； 的好处是， */
    /* 不会将复选框从键盘的 tab 键切换焦点的队列中完全删除，人机交互性更好 */
    clip:rect(0,0,0,0);
  }
```

## 开关式按钮(借助 `checkbox`)

```css
input[type='checkbox']{
  position:absolute;
  clip:rect(0,0,0,0);
}
input[type='checkbox']+label{
  display: inline-block;
  padding: .3em .5em;
  background-color: #ccc;
  background-image: linear-gradient(#ddd,#bbb);
  border:1px solid rgba(0,0,0,0.2);
  border-radius:0.3em;
  box-shadow:0 1px #fff inset;
  text-align: center;
  text-shadow: 0 1px 1px #fff;
}
input[type='checkbox']:checked+label,
input[type='checkbox']:active+label{
  box-shadow: 0.05em 0.1em 0.2em rgba(0,0,0,0.6) inset;
  border-color:rgba(0,0,0,0.3);
  background-color: #bbb;
}
```

## 遮罩层

- 使用额外的 `HTML` 元素

```css
/* 这一层是暗色遮挡背景 */
.overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0,0,0,0.8);
}
/* 这一层是需要在暗色背景之上显示的元素 */
.lightbox {
  position: absolute;
  z-index: 1;
}
```

- 直接使用 `body` 的伪元素设置遮罩层

```css
body.diimed::before {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0,0,0,0.8);
}
```

- 使用 `box-shadow`

```css
div {
  box-shadow: 0 0 0 100vmax rgba(0,0,0,0.3);
}
```

## 滚动框顶部阴影提示效果

```html
  <ul>
    <li>Ada Catlace</li>
    <li>Alan Purring</li>
    <li>Schr ö dingcat</li>
    <li>Tim Purrners-Lee</li>
    <li>WebKitty</li>
    <li>Json</li>
    <li>Void</li>
    <li>Neko</li>
    <li>NaN</li>
    <li>Cat5</li>
    <li>Vector</li>
  </ul>
```

```css
  ul{
    overflow: auto;
    width: 10em;
    height: 8em;
    padding: 0.3em 0.5em;
    border: 1px solid silver;
    background: linear-gradient(#fff,hsla(0,0%,100%,0)),
                radial-gradient(at top,rgba(0,0,0,0.2), transparent 70%);
    background-repeat:no-repeat;
    background-size: 100% 50px,100% 15px;
    background-attachment: local,scroll;
  }
```

## 图片对比

```html
  <div class="image-slider">
    <div>
      <img src="a.jpg" alt="jpg">
    </div>
    <img src="a_after.jpg" alt="after">
  </div>
```

```css
  .image-slider {
    position: relative;
    display: inline-block;
  }
  .image-slider>div {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 50%;
    max-width: 100%;
    overflow: hidden;
    resize: horizontal;
  }
  .image-slider>div::before {
    content:'';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 12px;
    height: 12px;
    padding: 5px;
    background: linear-gradient(-45deg,#fff 50%,transparent 0);
    background-clip: content-box;
    cursor: ew-resize;
  }
  .image-slider img {
    display: block;
    user-select: none;
  }
```

## 元素垂直居中

### 基于绝对定位

- 传统方式，元素的宽高必须确定，适应性不太好

```html
  <main>
      <h1>Am I centered yet?</h1>
      <p>Center me,please!</p>
    </main>
```
```css
  main{
    position: absolute;
    // 注意 calc() 参数操作符号两边要有空格的存在
    // 这里如果不使用 calc() 函数，可以使用 margin-left 和 margin-top 代替
    top:calc(50% - 150px);
    left:calc(50% - 250px);
    // 元素宽、高必须确定
    width:500px;
    height:300px;
  }
```

- 使用 `transform` 进行百分比确定位置

```css
  main{
    border:1px dashed;
    position: absolute;
    top:50%;
    left:50%;
    /* 不需要元素确定宽高，适应性较好 */
    transform:translate(-50%,-50%);
  }
```

- `margin:auto;`，适应性较好(且是水平垂直都居中)

```css
.element {
    width: 600px; 
    height: 400px;
    position: absolute; 
    /* 四个值全是 0 */
    left: 0; top: 0; right: 0; bottom: 0;
    /* 有了这个就自动居中了 */
    margin: auto;    
}
```

### 基于视口的解决方案

```css
main{
  /* 只适用于在视口中居中的场景 */
  margin:50vh auto 0;
  transform:translateY(-50%);
}
```

### 基于`Flexbox` 的解决方案
```css
body{
  display: flex;
  min-height: 100vh;
  margin: 0;
}
main{
  border:1px dashed;
  margin:auto;
}
```


## `sticky footer`

```html
  <header>
    <h1>Site name</h1>
  </header>
  <main>
    <p>Bacon Ipsum dolor amet...</p>
  </main>
  <footer>
    <p>@2016 No rights reserve.</p>
    <p>Made with ❤ by a good-boy.</p>
  </footer>
```

```css
  body{
    background-color: #ee7354;
    margin:0;
    text-align: center;
    /* flex 布局 */
    display: flex;
    /* 垂直布局 */
    flex-direction:column;
    /* 高度需要完全撑开 */
    min-height: 100vh;
  }
  main{
    background-color: skyblue;
    /* 1 表示占据尽可能大的空间，这样才能将 footer 挤到页脚去 */
    flex:1;
  }
  footer{
    background-color: #58a;
    color:#fff;
  }
```

## 弹跳动画

### 小球弹跳

```css
@keyframes bounce{
  60%,80%,to{
    transform:translateY(350px);
    animation-timing-function:ease;
  }
  70% {transform:translateY(200px);}
  90% {transform:translateY(350px)};
}
.ball{
  width:30px;
  height:30px;
  background-color: #58a;
  border-radius:50%;
  animation:bounce 3s cubic-bezier(0.755,0.05,0.855,0.06) infinite;
}
```

### 文字闪烁

- 平滑闪烁
```css
/* 第一种方法 */
@keyframes blink-smooth{
  to {color:transparent;}
}
.highlight{
  /* alternate : 反转动画，在这里是为了起到让文字隐藏与显示都是平滑过渡而非生硬出现的效果 */
  animation: 1s blink-smooth infinite alternate;
}

/* 第二种方法 */
@keyframes blink-smooth{
   /* 50% : 让文字显示平滑出现 */
  50% {color:transparent;}
}
.highlight{
  animation: 1s blink-smooth infinite;
}
```

- 普通闪烁

```css
@keyframes blink{
  50% {color:transparent;}
}
.highlight{
  animation: 1s blink infinite steps(1);
}
```

### 打字动画效果

```html
  <h1 class="highlight">CSS is awesome!</h1>
```
```css
  @keyframes typing{
    from{width:0}
  }
  @keyframes caret{
    /* 此动画是为了模拟光标的右边框产生闪动的效果，显得更加逼真 */
    50%{border-color:transparent;}
  }
  h1{
    /* ch 指得是一个 字符 0 的宽度 */
    width:15ch;
    overflow: hidden;
    white-space:nowrap;
    /* border-right 是为了模拟光标 */
    border-right:1px solid;
    animation:typing 6s infinite steps(15),
              caret 1s infinite steps(1);
  }
```

## 卡片元素两侧锯齿效果

```html
<div class="card_coupon"></div>
```

```css
.card_coupon{position:relative;width:100px;height:100px;background:#f60;display:inline-block;}
.card_coupon:before,
.card_coupon:after{content: "";position: absolute;display: block;width:10px;height: 100%;background-size: 20px 10px;}
.card_coupon:before{
  left: -10px;
  background-position: 100% 0;
  background-image: linear-gradient(-45deg, #f60 25%, transparent 25%, transparent),
    linear-gradient(-135deg, #f60 25%, transparent 25%, transparent),
    linear-gradient(-45deg, transparent 75%, #f60 75%),
    linear-gradient(-135deg, transparent 75%, #f60 75%);
}
.card_coupon:after{
  right: -10px;
  background-color: #f60;background-position: 100% 15%;
  background-image: linear-gradient(-45deg, #fff 25%, transparent 25%, transparent),
      linear-gradient(-135deg, #fff 25%, transparent 25%, transparent),
      linear-gradient(-45deg, transparent 75%, #fff 75%),
      linear-gradient(-135deg, transparent 75%, #fff 75%);
}
```
