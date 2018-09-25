## `nth-child`负值

`nth-child`可以接受负值
```css
/* 第 1 到 3个元素字体颜色为 red */
li:nth-child(-n+3) {
  color: red;
}
```

可以配合 `:not()`
```css
/* 选择除前3个之外的所有元素，设置颜色为 red */
li:not(:nth-child(-n+3)) {
  color: red;
}
```

`:nth-of-type`同上用法

## 利用属性选择器来选择空链接

当 <a> 元素没有文本内容，但有 `href` 属性的时候，显示它的 `href` 属性：
```css
a[href^="http"]:empty::before {
  content: attr(href);
}
```

## 图片链接无效的处理

当 `img`元素 `src`指向的地址无效时，会呈现为一种不太友好的样子，例如破碎图片的图标或者干脆什么都不显示，利用下述 `css`可以在图片链接失效时，呈现指定的内容：
```css
img::before {
  /* 显示文字 */
  content: "We're sorry, the image below is broken :(";
  display: block;
  margin-bottom: 10px;
}

img::after {
  /* 显示链接 */
  content: "(url: " attr(src) ")";
  display: block;
  font-size: 12px;
}
```

上述原理是，当 `src`地址无效，则显示 `::before` 和 `::after`的内容，否则这两个伪元素将不显示

## 相同属性就近覆盖原则

```html
<div class="red blue">first</div>
<div class="blue red">second</div>
```
```css
.red {
  color: red;
}
.blue {
  color: blue;
}
```

上述两个元素中的 字体分别是什么颜色？答案：都是 blue

原因是元素最终应用的 class是 **定义在样式表最靠后位置的那个**，跟元素 `class`属性值的书写顺序无关

## 提前加载体积较大图片

有些懒加载图片，需要等到我们触发了相应操作才进行加载，例如点击某个按钮，但是由于图片体积较大，或者网络信号不好，操作完毕之后，图片需要一定的时间才能完全加载完毕并显示，用户体验不好，这里有一个小技巧可应用于提前加载此图片

```css
.box:before {
  display: none;
  content: url(https://dummyimage.com/200x200/fafff0)
}
```

通过这种手段，不会在页面上添加额外的 `DOM`元素，也不会对页面显示产生什么影响，但浏览器会提前缓存 `https://dummyimage.com/200x200/fafff0`，需要使用的时候可以实现即时地展现，提升用户体验

## 借助 `wbr`标签实现连续英文字符的精准换行

既能换行，又不影响单词阅读，借助 `<wbr>`标签，相比于直接设置 `word-break:break-all` 或 `word-wrap:break-word`更加智能

```html
<div style="width:150px; background:#cd0000; word-wrap:break-word;">
  CanvasRenderingContext2D.globalCompositeOperation
</div>
```

除了 `IE`不支持此属性外，其他浏览器支持度很好，对于 `IE`浏览器，可以通过 `css`进行兼容
```css
wbr:after { content: '\00200B'; }
```

## CSS Sub-pixel

指当给元素设置一个浮点数的 `css`属性时，例如 `width: 3.2px;`，某些浏览器会将浮点数四舍五入，实际给元素设置了一个整数值

另外，`canvas`绘图时，可能也会出现这种问题，例如计算某个元素持续性移动的坐标，可能会得到浮点数值的坐标 `(20.3, 30.8)`，当给某些 `api`，例如 `drawImage`传入 这种浮点数值的时候，实际渲染出来的坐标就会变成 `(20, 31)`，导致元素出现抖动

解决的办法是尽量让计算出来的坐标为整数

## 是否阻塞文档

使用`link`标签引用的  `css`文件，不会阻塞 `DOM`的 **解析**，但是会阻塞 `DOM`的 **渲染**

