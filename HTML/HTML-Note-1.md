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


