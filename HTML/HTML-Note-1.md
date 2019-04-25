## 防盗链

对于一些根据 `referrer`进行防盗链的简单手段，可以通过删除请求 `Header`中的 `Referrer`来解决，一种手段是给页面添加一个额外的 `meta`标签。

```html
<meta referrer="never" />
```

设置 `referrer`属性的值为 `never`，即可删除请求 `Header`中的 `Referrer`，不过这种写法的标准目前已经不建议使用了，虽然暂时支持度还是很不错的，除此之外，目前标准的写法是：

```html
<meta referrer="no-referrer" />
```

这种写法在 `IE/Edge`中可能不被支持，所以实际情况中，最好两个都写上

上述写法相当于对文档中的所有链接都取消了 `Referrer`，如果只是想精确地指定取消某一个或几个，则可以使用 `referrerPolicy`：

```html
<img src="xxx.png" referrerPolicy="no-referrer" />
```

## base标签

`<base> `标签为页面上的所有链接规定默认地址或默认目标

通常情况下，浏览器会从当前文档的 `URL` 中提取相应的元素来填写相对 `URL` 中的空白。

使用 `<base>` 标签可以改变这一点。浏览器随后将不再使用当前文档的 `URL`，而使用指定的基本 `URL` 来解析所有的相对 `URL`。这其中包括`<a>、<img>、<link>、<form>` 标签中的 `URL`。

```html
<html>
  <head>
    <base href="https://user-gold-cdn.xitu.io/" />
    <base target="_blank" />
  </head>
  <body>
    <img src="2018/12/25/167e378b5af48d99?imageView2/1/w/180/h/180/q/85/format/webp/interlace/1" />
    <a href="2018/12/25/167e378b5af48d99?imageView2/1/w/180/h/180/q/85/format/webp/interlace/1">跳转</a>
  </body>
</html>
```

## title标签

`<title>` 标签是 `<head>` 标签中唯一要求包含的东西
