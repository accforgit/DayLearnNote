# CSS运用技巧
*部分摘自 《图解CSS3核心技术与案例实战》*

---

## 使用`img`标签作为背景图片

设置背景最恰当的方案，就是给对应的元素设置一个`background-image`的`CSS`属性，<br>
但是有的时候这种方法无法派上用场，比如元素的背景并不是固定的，而是通过其他数据或者例如`JS`计算得来，<br>
只能在`html`页面中才能获取这个计算而来的路径，那么就只能借助于`img`标签了。

```html
<div class="wrapperBox">
	<div class="bgBox">
		<img height="100%" width="100%" src="./image/bg.png">
	</div>
</div>
```

```css
.wrapperBox {
	/* 需要使用position定位 */
	position:relative;
	/* 需要高度和宽度，可以自定义也可以是由子元素撑开 */
	height: 100px;
	width: 100%;
}
.bgBox{
	position: absolute;
	width: 100%;
	height: 100%;
}

```
## `clearfix`

如果用了浮动，浮动的父层不会跟着浮动框的高度增加而增加，在 `Firefox`等符合 `W3C`标准的浏览器中，
如果有一个 `DIV`作为外部容器，内部的 `DIV`如果设置了 `float`样式，则外部的容器DIV因为内部没有 `clear`，
导致不能被撑开。这个时候我们可以用 `clearfix`清除浮动。

以下代码可以兼容到IE6+
```css
.clearfix:after {       
   content: ".";     /*内容为“.”就是一个英文的句号而已，可以是任何内容。*/
	display: block;   /*加入的这个元素转换为块级元素。*/
	clear: both;     /*清除左右两边浮动。*/
	height: 0;     /*高度为0；*/
	overflow:hidden;
	visibility: hidden;      /*可见度设为隐藏。注意它和display:none;是有区别的。visibility:hidden;仍然占据空间，只是看不到而已；*/
	line-height: 0;    /*行高为0，可以不写这一句*/
   font-size:0;    /*字体大小为0，可以不写这一句*/
}

.clearfix { *zoom:1;}   /*这是针对于IE6和IE&的，因为IE6不支持:after伪类，这个神奇的zoom:1让IE6的元素可以清除浮动来包裹内部元素。*/
```

## Sticky footers

```html
<div class="box1">
	<div class="text">
		这里是内容
	</div>
</div>
<div class="box2">
  这里是底部元素
</div>
```

```css
.box1{
  width:100vh;
  min-height:100vh;
}
.text{
  /* 这个padding-bottom 很重要，主要是为了防止内容被 box2 覆盖 */
  padding-bottom:60px;
}
.box2{
  /* 设置宽高只是为了居中 */
  width:30px;
  height:30px;
  margin:-60px auto 0 auto;
}
```

## 使用 `padding`让元素宽高呈现比例

如果一个块级元素，只设置宽，但是无法精确确定宽的大小，又想让高度与宽度呈现一定比例，
那么可以设置 `padding-top` 或者 `padding-bottom` 达到这一目的

```css
div {
	width: 100%;
	padding-top: 100%;
}
```

以上代码，div宽度与外层元素相同，设置了`padding-top: 100%`，就等于让元素高度与宽度相同，
如果换成`padding-bottom: 100%` 同样具有此种效果。

## 设置 `placeholder` 的属性

>在 `HTML5` 中，可以向其他文本内容那样，对输入框(`input`)的`placeholder` 属性进行定制。

```css
#field4::-webkit-input-placeholder {
	font-style:italic;
	text-decoration:overline;
	letter-spacing:3px;
	color:#999;
}
```

## `input` 输入框获得焦点，或者`button`被点击时等情况，隐藏系统出现自带的蓝色边框。

```css
input:focus{
  outline:0;
}
```

## 转换文本大小写。

```css
text-transform: none | uppercase | lowercase | capitalize | inherit
```

## CSS最佳实践

- CSS选择器运行效率

>ID选择器： #id
class选择器： .class
标签选择器：div
相邻选择器： a + li
子元素选择器：ul > li
通用选择器： *
属性选择器：input[tyoe='text']
伪类选择器：a:hover

- CSS选择器从右向左解析，所以选择器越短解析速度越快

如果使用 `Jquery` 操作DOM，则遵循 `Jquery`最佳实践
尽量只对 `position` 为 `absolute / fixed` 的元素设置动画
在页面滚动时禁用 `:hover`样式效果

```css
.disable-hover {
	/*  这个属性只对 IE10+ 有效 */
   pointer-events: none;
}
```

```js
var body = document.body,timer;
window.addEventListener('scroll',function(){
	cleearTimeout(timer);
	if(!body.classList.contains('disable-hover')){
		body.classList.add('disable-hover');
	}
	timer = setTimeout(function(){
		body.classList.remove('disable-hover');
	},500)
},false)
```

## 文本过长用省略号裁切

```css
/* 必须指定宽度 */
width: 100px;
/* 必须声明文本不换行 */
white-space: nowrap;
/* 必须设置文本溢出隐藏 */
overflow: hidden;
/* 设置为省略号展示溢出内容 */
text-overflow: ellipsis;
```

## 常见的开启硬件加速的 CSS属性

`transform`、`opacity`、`SVG filters`、`will-change`

开启硬件加速的坑：
- 如果你为太多元素使用css3硬件加速，会导致内存占用较大，会有性能问题。
- 在 `GPU`渲染字体会导致抗锯齿无效。这是因为 `GPU`和 `CPU`的算法不同。因此如果你不在动画结束的时候关闭硬件加速，会产生字体模糊。

## CSS3动画开启硬件加速

```css
.box{
  /* 使用CSS3动画 */
  transition:width 2s ease,height 2s ease;

  /* 使用  transiform 属性开启硬件加速 */
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  -ms-transform: translateZ(0);
  -o-transform: translateZ(0);
  transform: translateZ(0);

  /* 或者下面这样也可以开启硬件加速 */
  transform: translate3d(0, 0, 0);
}
```

**注意事项**

- 避免滥用
硬件加速虽然好用，但是也不能乱用，小心使用这些方法，如果通过你的测试，结果确是提高了性能，<br>
你才可以使用这些方法。使用 `GPU`可能会导致严重的性能问题，因为它增加了内存的使用，而且它会减少移动端设备的电池寿命。<br>

- 给硬件加速的元素设置 `z-index`，人为干扰复合层的排序

使用硬件加速时，尽可能的设置 `z-index`，防止浏览器默认给后续的元素创建复合层渲染

具体的原理时这样的：
如果有一个元素，它的兄弟元素在复合层中渲染，而这个兄弟元素的 `index` （注意，这个 `index`指的是层叠上下文的层级，不是 `z-index`）比较小，那么这个元素（不管是不是应用了硬件加速样式）也会被放到复合层中。

最可怕的是，浏览器有可能给复合层之后的所有相对或绝对定位的元素都创建一个复合层来渲染

即，**你可能会在无意间在页面上创建了大量的启用了硬件加速的符合浮层**

必要的时候，使用3D硬件加速提升动画性能时，最好给元素增加一个 `z-index`属性（值要大于 `1`），人为干扰复合层的排序，<br>
可以有效减少浏览器创建不必要的复合层，提升渲染性能，移动端优化效果尤为明显。

更具体参加 [CSS3硬件加速也有坑](http://web.jobbole.com/83575/)

##  `Responsive`(响应式)布局

NO:
>尽量少用无关紧要的div
>不要使用内联元素(inline)
>尽量少用 JS 或 Flash
>丢弃没用的绝对定位和浮动样式
>摒弃任何冗余结构和不使用 100% 设置
>在页面布局的关键部分，不要过分依赖现在技巧实战，比如CSS3特效或者JS脚本

YES:
>重置样式(CSS Reset)
>简单而有语义的核心布局
>给重要的网页元素使用简单的技巧，比如导航菜单之类元素


## CSS3圆角边框属性：`border-radius`

### 写法

此属性可接收 1~4 个参数

如果设置 1 个值，则 `top-left top-right bottom-right bottom-left`四个值相等。
如果设置 2 个值，则`top-left bottom-right `取第一个值， `top-right bottom-left`取第二个值。
如果设置 3 个值，则`top-left`取第一个值， `top-right bottom-lef` 取第二个值，`bottom-right` 取第三个值。
如果设置 4 个值，则 `top-left top-right bottom-right bottom-left `依次取值

`border-radius` 和 `border` 属性一样，可以将四个角单独拆分出来，派生出四个子属性：

```
border-top-lef-radius
border-top-right-radius
border-bottom-right-radius
border-bottom-left-radius
```

上面的写法并非通用，不同的浏览器厂商可能并不一致，如果需要使用子属性，那么为了兼容性，
必须兼容各个浏览器，其实这大可不必，因为这完全可以使用`border-radius`这种标准写法代替，
而不需要考虑兼容问题。

另外还可以使用斜线 `/` 来单独设置水平和垂直半径值：

```css
border-radius:5px 10px / 20px 40px;
```

上述代码表示，给元素的`top-left bottom-right` 的水平半径设为`5px`，而垂直半径为`10px`，
并且元素的`top-right bottom-left` 的水平半径设为`20px`，而垂直半径为`40px`
这种单独设置水平和垂直半径的写法，只适用于标准写法，而用在四个子属性上是错误的。

### 使用 `border-radius` 制作圆形、半圆、扇形、椭圆。

- 制作圆形

只需要保证元素宽高相等，`border-radius` 设为`50%` 或宽高的一半即可。

```css
border-radius:50%;
```

- 制作半圆

首先要让高宽比`2:1`或者`1:2`，然后`border-radius` 需要设置两个值，值设为比例较小的那一个值，剩下的两个值设置 0,

```css
.top{
	width: 100px;
	height: 50px;
	border-radius: 50px 50px 0 0;
}
```

- 制作扇形

遵循“三同，一不同”：元素的宽度、高度、圆角半径值相同，圆角位置不同。

```css
.top{
	width:100px;
	height:100px;
	border-radius: 100px 0 0 0;
}
```
- 制作椭圆，需要单独设置水平半径和垂直半径。

```css
.ver{
	width: 50px;
	height: 100px;
	border-radius:50px / 100px;
}
```
  
## 等宽单元格
 
让 `table`的单元格等宽
```css
table {
	table-layout: fixed;
}
```


## 基于vw等viewport视区单位配合rem响应式排版和布局

摘自 by [张鑫旭](http://www.zhangxinxu.com/wordpress/2016/08/vw-viewport-responsive-layout-typography/)

根据屏幕缩放的大小，使用 `calc` 自动计算字体大小，精确到每一像素界别，避免出现到达临界点时大幅度地页面变化。

```css
html {
    font-size: 16px;
}

@media screen and (min-width: 375px) {
	html {
		/* iPhone6的375px尺寸作为16px基准，414px正好18px大小, 600 20px */
		font-size: calc(100% + 2 * (100vw - 375px) / 39);
		font-size: calc(16px + 2 * (100vw - 375px) / 39);
	}
}
@media screen and (min-width: 414px) {
	html {
		/* 414px-1000px每100像素宽字体增加1px(18px-22px) */
		font-size: calc(112.5% + 4 * (100vw - 414px) / 586);
		font-size: calc(18px + 4 * (100vw - 414px) / 586);
	}
}
@media screen and (min-width: 600px) {
	html {
		/* 600px-1000px每100像素宽字体增加1px(20px-24px) */
		font-size: calc(125% + 4 * (100vw - 600px) / 400);
		font-size: calc(20px + 4 * (100vw - 600px) / 400);
	}
}
@media screen and (min-width: 1000px) {
	html {
		/* 1000px往后是每100像素0.5px增加 */
		font-size: calc(137.5% + 6 * (100vw - 1000px) / 1000);
		font-size: calc(22px + 6 * (100vw - 1000px) / 1000);
	}
}
```

## CSS实现跨浏览器兼容性的盒阴影效果

*摘自 by [张鑫旭](http://www.zhangxinxu.com/wordpress/2010/04/css%E5%AE%9E%E7%8E%B0%E8%B7%A8%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%BC%E5%AE%B9%E6%80%A7%E7%9A%84%E7%9B%92%E9%98%B4%E5%BD%B1%E6%95%88%E6%9E%9C/)*

```css
.shadow {
	-moz-box-shadow: 3px 3px 4px #000;
	-webkit-box-shadow: 3px 3px 4px #000;
	box-shadow: 3px 3px 4px #000;
	/* For IE 8 */
   /* 这里的颜色值不能缩写，例如不能缩写成 #000 */
	-ms-filter: "progid:DXImageTransform.Microsoft.Shadow(Strength=4, Direction=135, Color='#000000')";
	/* For IE 5.5 - 7 */
	filter: progid:DXImageTransform.Microsoft.Shadow(Strength=4, Direction=135, Color='#000000');
}
```

## 修复中文 Chrome 浏览器下，字号最小只能是12px

首先，如果 chome版本大于 chrome 27，则 `-webkit-text-size-adjust:none;` 是没有用的

正确解决方法如下：

```css
  /* 元素必须是块级元素，例如inline-block 和 block */
  display:inline-block;
  /* 其他浏览器才能正确解析小于12px的字号，所以下面这个字号9px对 Chrome是没用的 */
  font-size:9px; 
  /* 当字号12px时，Chrome自动将字号一律设置为12px，所以下面这句设置，是在12px上进行缩小的，12px*0.7 */
  -webkit-transform: scale(0.70);
```

>Note: Chrome在 [设置](chrome://settings/) 里必须放开字体最小值的选项，否则单靠代码设置是没用的

## 大小不固定的图片垂直居中

*摘自[张鑫旭](http://www.zhangxinxu.com/wordpress/2010/09/after%E4%BC%AA%E7%B1%BBcontent%E5%86%85%E5%AE%B9%E7%94%9F%E6%88%90%E5%B8%B8%E8%A7%81%E5%BA%94%E7%94%A8%E4%B8%BE%E4%BE%8B/)*
以下代码兼容到IE6+

```html
<div class="pic_box">
    <img data-src="http://image.zhangxinxu.com/image/study/s/s256/mm1.jpg" />
</div>
```
```css
.pic_box{width:300px; height:300px; background-color:#beceeb; font-size:0; *font-size:200px; text-align:center;}
.pic_box img{vertical-align:middle;}
.pic_box:after{display:inline-block; width:0; height:100%; content:"center"; vertical-align:middle; overflow:hidden;}
```

## 滚动条跳动

问题描述：
>开始只有头部一些信息加载，此时页面高度有限，没有滚动条；然后，更多内容显示，滚动条出现，占据可用宽度，`margin: 0 auto`，
主体元素自然会做偏移——跳动产生

解决方案：

- CSS3计算calc和vw单位**

`.wrap-outer`指的是居中定宽主体的父级，如果没有，创建一个，兼容到 `IE9+`
```css
.wrap-outer {
  margin-left: calc(100vw - 100%);
}
/* 或者 */
.wrap-outer {
  padding-left: calc(100vw - 100%);
}
```

- overflow & 100vw

```css
html {
 /*  IE9 以下浏览器，因为不支持下面的 vm单位，直接让其出现滚动条 */
  overflow-y: scroll;
}

:root {
  overflow-y: auto;
  overflow-x: hidden;
}

:root body {
  position: absolute;
}

body {
  width: 100vw;
  overflow: hidden;
}
```

## 为了更好的可访问性，使用 `clip` 隐藏内容

```css
.visually-hidden {
	position: absolute;
	clip: rect(1px 1px 1px 1px); /* IE6,IE7 */
	clip: rect(1px , 1px, 1px, 1px);
   /* 解决 webkit/Opare/IE 下可能出现的滚动条 */
	height: 1px;
	width: 1px;
	overflow:hidden;
}
```

即使屏幕上看不到此元素，但屏幕访问器依旧可以读取

## 元素垂直居中

- 单行行内元素

行内元素的行高等于父容器的高度

```html
<span>123</span>
```
```css
span {
  display: inline-block;
  width: 50px;
  height: 50px;
  background-color: lightblue;
  line-height: 60px;
}
```

- 多行元素垂直居中（包括inline  inline-block block元素）

父容器设置 `table-cell`，然后使用`vertical-align: middle`对子元素进行垂直居中控制

```html
<div class="wrap">
	<span>1212323121e2dmkwefmkwlefm</span>
	<span>1212323121e2dmkwefmkwlefm</span>
	<p>1212323121e2dmkwefmkwlefm</p>
	<p>1212323121e2dmkwefmkwlefm</p>
	<div>1212323121e2dmkwefmkwlefm</div>
	<div>1212323121e2dmkwefmkwlefm</div>
</div>
```

```css
.wrap {
	display: table-cell;
	vertical-align:middle;
	height: 500px;
	background-color: skyblue;
}
```
