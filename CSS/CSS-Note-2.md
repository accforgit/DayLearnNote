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