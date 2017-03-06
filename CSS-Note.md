# CSS运用技巧
*部分摘自 《图解CSS3核心技术与案例实战》*

---

- 使用`img`标签作为背景图片
设置背景最恰当的方案，就是给对应的元素设置一个`background-image`的`CSS`属性，<br>
但是有的时候这种方法无法派上用场，比如元素的背景并不是固定的，而是通过其他数据或者例如`JS`计算得来，<br>
只能在`html`页面中才能获取这个计算而来的路径，那么就只能借助于`img`标签了。

```
HTML:

<div class="wrapperBox">
    <div class="bgBox">
        <img height="100%" width="100%" src="./image/bg.png">
    </div>
</div>
```

```
CSS:
.wrapperBox {
    // 需要使用position定位
    position:relative;
    // 需要高度和宽度，可以自定义也可以是由子元素撑开
    height: 100px;
    width: 100%;
}
.bgBox{
    position: absolute;
    width: 100%;
    height: 100%;
}

```
- `clearfix`
如果用了浮动，浮动的父层不会跟着浮动框的高度增加而增加，在Firefox等符合W3C标准的浏览器中，<br>
如果有一个DIV作为外部容器，内部的DIV如果设置了float样式，则外部的容器DIV因为内部没有clear，<br>
导致不能被撑开。这个时候我们可以用clearfix清除浮动。
```
.clearfix:after {       
    content: ".";     /*内容为“.”就是一个英文的句号而已。也可以不写。*/
    display: block;   /*加入的这个元素转换为块级元素。*/
    clear: both;     /*清除左右两边浮动。*/
    visibility: hidden;      /*可见度设为隐藏。注意它和display:none;是有区别的。visibility:hidden;仍然占据空间，只是看不到而已；*/
    line-height: 0;    /*行高为0；*/
    height: 0;     /*高度为0；*/
    font-size:0;    /*字体大小为0；*/
}

.clearfix { *zoom:1;}   /*这是针对于IE6的，因为IE6不支持:after伪类，这个神奇的zoom:1让IE6的元素可以清除浮动来包裹内部元素。*/
```

- Sticky footers
```
HTML:
<div class="box1">
    <div class="text">
        这里是内容
    </div>
</div>
<div class="box2">
    这里是底部元素
</div>

CSS:
.box1{
  width:100vh;
  min-height:100vh;
}
.text{
  // 这个padding-bottom 很重要，主要是为了防止内容被 box2 覆盖
  padding-bottom:60px;
}
.box2{
  // 设置宽高只是为了居中
  width:30px;
  height:30px;
  margin:-60px auto 0 auto;
}
```

- 使用 `padding`让元素宽高呈现比例
```
如果一个块级元素，只设置宽，但是无法精确确定宽的大小，又想让高度与宽度呈现一定比例，
那么可以设置padding-top 或者 padding-bottom 达到这一目的

div{
    width: 100%
    padding-top: 100%
}

以上代码，div宽度与外层元素相同，设置了`padding-top: 100%`，就等于让元素高度与宽度相同，
如果换成`padding-bottom: 100%` 同样具有此种效果。
```

- 设置 `placeholder` 的属性
>在 `HTML5` 中，可以向其他文本内容那样，对输入框(`input`)的`placeholder` 属性进行定制。
```
#field4::-webkit-input-placeholder {
    font-style:italic;
    text-decoration:overline;
    letter-spacing:3px;
    color:#999;
}
```
- `input` 输入框获得焦点，或者`button`被点击时等情况，隐藏系统出现自带的蓝色边框。
```
input:focus{
    outline:0;
}
```

- 转换文本大小写。
```
text-transform: none | uppercase | lowercase | capitalize | inherit
```
- CSS最佳实践

>CSS选择器运行效率
```
ID选择器： #id
class选择器： .class
标签选择器：div
相邻选择器： a + li
子元素选择器：ul > li
通用选择器： *
属性选择器：input[tyoe='text']
伪类选择器：a:hover
```
>CSS选择器从右向左解析，所以选择器越短解析速度越快

>如果使用 `Jquery` 操作DOM，则遵循 `Jquery`最佳实践

>尽量只对 `position` 为 `absolute / fixed` 的元素设置动画

>在页面滚动时禁用 `:hover`样式效果

```
.disable-hover {
    // 这个属性只对 IE10+ 有效
    pointer-events: none;
}

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

- 文本过长用省略号裁切
```
// 必须指定宽度
width: 100px;
// 必须声明文本不换行
white-space: nowrap;
// 必须设置文本溢出隐藏
overflow: hidden;
// 设置为省略号展示溢出内容
text-overflow: ellipsis;
```

- CSS3动画开启硬件加速
```
.box{
  // 使用CSS3动画
  transition:width 2s ease,height 2s ease;

  // 使用  transiform 属性开启硬件加速
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  -ms-transform: translateZ(0);
  -o-transform: translateZ(0);
  transform: translateZ(0);

  // 或者下面这样也可以开启硬件加速
  transform: translate3d(0, 0, 0);
}
```
>硬件加速虽然好用，但是也不能乱用，小心使用这些方法，如果通过你的测试，结果确是提高了性能，<br>
你才可以使用这些方法。使用GPU可能会导致严重的性能问题，因为它增加了内存的使用，而且它会减少移动端设备的电池寿命。<br>
必要的时候，使用3D硬件加速提升动画性能时，最好给元素增加一个`z-index`属性，人为干扰复合层的排序，<br>
可以有效减少chrome创建不必要的复合层，提升渲染性能，移动端优化效果尤为明显。

-  `Responsive`(响应式)布局
```
NO:
    - 尽量少用无关紧要的div
    - 不要使用内联元素(inline)
    - 尽量少用 JS 或 Flash
    - 丢弃没用的绝对定位和浮动样式
    - 摒弃任何冗余结构和不使用 100% 设置
    - 在页面布局的关键部分，不要过分依赖现在技巧实战，比如CSS3特效或者JS脚本

YES:
    - 重置样式(CSS Reset)
    - 简单而有语义的核心布局
    - 给重要的网页元素使用简单的技巧，比如导航菜单之类元素
```

- CSS3圆角边框属性：`border-radius`
```
此属性可接收 1~4 个参数
如果设置 1 个值，则top-left top-right bottom-right bottom-left四个值相等。
如果设置 2 个值，则top-left bottom-right 取第一个值， top-right bottom-left取第二个值。
如果设置 3 个值，则top-left取第一个值， top-right bottom-left取第二个值，bottom-right 取第三个值。
如果设置 4 个值，则top-left top-right bottom-right bottom-left 依次取值
```
`border-radius` 和 `border` 属性一样，可以将四个角单独拆分出来，派生出四个子属性：
```
border-top-left-radius
border-top-right-radius
border-bottom-right-radius
border-bottom-left-radius
```
>上面的写法并非通用，不同的浏览器厂商可能并不一致，如果需要使用子属性，那么为了兼容性，<br>
必须兼容各个浏览器，其实这大可不必，因为这完全可以使用`border-radius`这种标准写法代替，<br>
而不需要考虑兼容问题。

另外还可以使用斜线 `/` 来单独设置水平和垂直半径值：
```
border-radius:5px 10px / 20px 40px;
```
>上述代码表示，给元素的`top-left bottom-right` 的水平半径设为`5px`，而垂直半径为`10px`，<br>
并且元素的`top-right bottom-left` 的水平半径设为`20px`，而垂直半径为`40px`<br>
这种单独设置水平和垂直半径的写法，只适用于标准写法，而用在四个子属性上是错误的。

- 使用 `border-radius` 制作圆形、半圆、扇形、椭圆。
  1. 制作圆形比较简单，只需要保证元素宽高相等，`border-radius` 设为`50%` 或宽高的一半即可。
  ```
  border-radius:50%;
  ```
  2. 制作半圆，首先要让高宽比`2:1`或者`1:2`，然后`border-radius` 需要设置两个值，<br>
  值设为比例较小的那一个值，剩下的两个值设置 0,
  ```
  .top{
    width: 100px;
    height: 50px;
    border-radius: 50px 50px 0 0;
  }
  ```
  3. 制作扇形，遵循“三同，一不同”：元素的宽度、高度、圆角半径值相同，圆角位置不同。
  ```
  .top{
    width:100px;
    height:100px;
    border-radius: 100px 0 0 0;
  }
  ```
  4. 制作椭圆，需要单独设置水平半径和垂直半径。
  ```
  .ver{
    width: 50px;
    height: 100px;
    border-radius:50px / 100px;
  }
  ```
