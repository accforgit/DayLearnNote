# HTML5 Canvas 核心技术

- `Canvas` 元素的尺寸

`Canvas` 元素实际上有两套尺寸：
```
(1) 元素本身的大小
(2) 元素绘图表面的大小
```
`Canvas` 默认的大小是 `300px*150px`，当设置元素的 `width` 与 `height` 属性时，<br>
实际上是同时修改了该元素本身的大小，  以及元素绘图表面的大小。 <br>
如果通过 `CSS` 来修改宽高，则只会修改元素本身的大小，不会影响绘图表面，<br> 
**当`Canvas` 元素的绘图表面大小与元素本身的大小不同时，浏览器就会对绘图表面进行缩放，** <br>
**使其符合元素本身的大小，一般情况下，为了方便计算，最好使用直接设置属性的方法**


- 浏览器支持

`Chrome IE9+ FireFox Opera Safari` 都对 `Canvas` 提供了广泛的支持， <br>
想要在 `IE9` 以下的版本上支持 `Canvas` ，那么有两个选择：
```
(1) 使用 explorecanvas : 它可以在老版本的 IE 中增加对于 Canvas 的支持
(2) 使用 Google Chrome Frame : 它将 IE 引擎替换成 Chrome 的引擎
```