# 一些有关 Webpack 的知识点

## sideEffects

>来源 [Webpack 中的 sideEffects 到底该怎么用？](https://zhuanlan.zhihu.com/p/40052192)

`webpack v4` 开始新增了一个 `sideEffects` 特性，通过给 `package.json` 加入 `sideEffects`声明该 包/模块 是否包含 `sideEffects(副作用)`，从而可以为 `tree-shaking` 提供更大的优化空间。

_注：v4 beta 版时叫 `pure module`, 后来改成了 `sideEffects`_

```js
// package.json
{
  "name": "your-project",
  "sideEffects": false
}
```

**_结论_：只要你的包不是用来做 `polyfill` 或 `shim` 之类的事情，就尽管放心的给 ta加上 `sideEffects: false` 吧！**