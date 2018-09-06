# HTML5与CSS3权威指南(下)

---

- `before` 与 `after`

>1. `before` 是在元素标签内容的前面插入，`after` 则是在元素标签内容的后面插入

>2. 可插入的元素：<br>
    (1) 文本字符串: `content:'text'` <br>
    (2) 图片文件：`content:url(mark.png)`<br>
    (3) 项目编号：`content: counter(mycounter)`<br>

>3. 插入项目编号扩充

(1) 插入连续编号的时候，需要在元素上设置 `counter-increment`<br>
```css
h1:before{
  content: counter(mycounter);
}
/* 可以在项目编号前后增加其他文本字符串 */
h1.sp.before{
  content: '第'counter(mycounter)'个';
  /* 应用样式 */
  color:skyblue;
}
h1{
  counter-increment:mycounter;
}
```

(2) 指定编号的种类：数字编码(默认)、字母编号(大小写)、罗马数字(大小写)编号：<br>
&emsp;&emsp;`content:counter(mycounter, type)`
```css
h1:before {
  /* 指定大写英文字母 */
  content:counter(mycounter, upper-alpha);
  color:greenyellow;
}
h2:brfore {
  /* 指定小写罗马字母 */
  content:counter(mycounter, lower-roman);
  font-size: 18px;
}
```

(3) 编号嵌套


>4. 使用 `content: none` 或者 `content: normal` 指定个别元素不进行插入
```css
h2:before {
  content:'text';
  color:skyblue;
}
h2.foo:before {
  content:none;
}
/* 与 none 所起的作用完全相同，但是 normal 在其他方面还有更多的用处，这里只是其中之一 */
h2.bar:before {
  content:normal;
}
```

- 字体
>1. 使用客户端字体
使用客户端字体的好处是，可以让浏览在显示字体的时候，首先在用户客户端查找，如果存在就直接使用<br>
客户端的字体，否则才下载服务器端的字体，**优化性能和用户体验**。
```css
@font-face {
  font-family: MyHelvetica;
  /* 指定客户端本地的字体 */
  src: local('Helvetica Neue');
  /* 如果客户端没有找到，才会下载服务器上的字体 */
  url(MyOpenModernaRegular.ttf);
}
```

>2. 修改字体种类而保持字体尺寸不变 : `font-size-adjust`
```css
div{
  font-size: 16px;
  font-family: Times New Romans;
  font-size-adjust: 0.46;
}
```
**`font-size-adjust` 的值就是当前字体的 `aspect` 值，根据这个值就可以计算字体的大小。**

>3. 使用 `rem` 单位定义字体大小
一般浏览器中，默认字体大小为 `16px`，可以用以下方法获取：
```css
var ele=document.getElementById('bdshare_l');
/* 兼容 IE 和 webkit */
var size = ele.currentStyle ?
	         ele.currentStyle['font-size'] :
           window.getComputedStyle(ele, null)['font-size'];
console.log(size);
```
可以根据默认字体大小(例如 `16px` )将根元素字体大小设置为 `10px`， 便于计算使用。
```css
html {
  /* 可以进行微调 */
  font-size: 62.5%;
}
small {
  /* 兼容 IE8 及之前的浏览器 */
  font-size: 18px;
  /* 相当于 10px */
  font-size: 1.8rem;
}
```

- 盒模型
>1. `inline-table` <br>
    此元素会作为内联表格来显示(一般用于 `<table>` )，表格前后没有换行符。

```css
table{
  display: inline-table;
  /*由于各浏览器对于此元素的对齐方式不同，所以这里统一指定底部对齐 */
  vertical-align: bottom;
}
```

>2. `list-item` <br>
    此元素会作为列表显示，效果类似于 `<li>`
```css
div {
  display: list-item;
  /* 指定列表样式，这里指定小圆点，有的浏览器可能不支持 */
  list-style-type: circle;
}
```

- 渐变
>Internet Explorer 9 及之前的版本不支持渐变。

```css
/* 线性渐变 */
div {
  /* 从左到右进行红、绿渐变 */
  background: linear-gradient(to right, red, blue);
  /* 可以指定渐变开始的位置 */
  /* 从 div 顶端往下 20% 的位置处开始渐变，之前背景为 red 不渐变 */
  /* 渐变持续到 div 元素 100%-30%=70% 的位置处停止，后面使用 blue 不渐变 */
  background: linear-gradient(to right, red 20%, blue 30%);
  /* 使用自定义角度渐变, 180deg 表示从上到下的垂直渐变 */
  background: linear-gradient(180deg, red, blue);
  /* 重复渐变 */
  background: repeating-linear-gradient(red, blue);
}

/* 径向渐变 */
div {
  background: radial-gradient(red, blue);
  /* 指定渐变的形状， ellipse 表示圆形渐变 */
  background: radial-gradient(ellipse, red, blue);
  /* 使用 at 指定渐变开始的位置 */
  background: radial-gradient(at 130px 50px, red, blue);
  /* 渐变尺寸 */
  background: radial-gradient(circle closest-side at 130px 50px, red, blue);
  background: radial-gradient(circle 20px at 130px 50px, red, blue);
  /* 重复渐变 */
  background: repeating-radial-gradient(red, blue);
}

```

- 动画<br>
  支持 `IE9` 及以上

>1. `transition` 与 `transform`<br>
  这种动画方法只能进行起始点与结束点之间的平滑过渡，易于完成简单动画，但是不使用于复杂动画。
```css
/* 可以单独对需要变化的样式进行指定 */
div {
  transition: background-color 1s linear, color 0.5s ease, width 0.8s linear;
}
```

>2. `animations` 与 `@keyframes`<br>
  适合制作复杂动画
```css
div {
  position: absolute;
  background-color:yellow;
  top:100px;
  width:500px;
}
/* 指定动画名称 : mycolor */
@keyframes mycolor{
  0% {
    background-color: red;
    transform: rotate(0deg);
  }
  40% {
    background-color: darkblue;
    transform: rotate(-30deg);
  }
  100% {
    background-color: skyblue;
    transform: rotate(0deg);
  }
}
div:hover {
  animation-name: mycolor;
  animation-duration: 5s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  /* 或者进行缩写 */
  animation: mycolor 5s linear infinite;
}
```

- 布局

>1. 多栏布局<br>
  支持 `IE9` 及以上

```css
div {
  /* 指定列数 */
  column-count: 3;
  /* 指定列之间的间距 */
  column-width: 20px;
}
```

>2. 盒布局
```css
/* 这种是 2009 年之前的标准，现在已经过时 */
div {
  display: box;
}
/* 这种是 2012 年的标准，最新写法，又称为弹性盒布局 */
div {
  display: flex;
}
```

>3. `calc()` 计算属性
```css
div {
  width: calc(50% - 100px);
}
```

- 其他属性和样式

>1. `outline`

属性：
```
outline-color
outline-style : 轮廓线样式，例如 solid dashed dotted
outline-width : 指定的宽度值，或者 thin  medium  thick, 默认为 medium
outline-offset : CSS3 新增属性，表示轮廓线与元素边框之间的间距
```

>2. 使用 `initial` 属性值 <br> 
    取消对元素样式的指定，让各种属性使用默认值，类似于 删除元素的自定义样式
```css
div {
  color: initial;
}
```

>3. 滤镜
```css
div {
  /* 一个灰度滤镜 */
  filter: grayscale(100%);
}
```

