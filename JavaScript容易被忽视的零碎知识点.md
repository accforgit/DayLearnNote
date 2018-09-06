## node程序 `require` 引入文件时带上文件名

```js
const myUtil = require('./myUtil')
```

对于上述引入文件的方法，如果所引入的文件是 `.json`或者 `.node`类型，则最好带上扩展名，即 `myUtil.json`，原因在于如果不加扩展名，`Node`会依次尝试 `.js` `.node` `.json`的扩展名，如果指定了扩展名，就省去了这一步尝试，在引入文件量较大的情况下，可以提升性能

## exports  与 module.exports

`module.exports` 是 `exports`对象的一个引用，`exports`对象是通过形参的方式引入的，所以不能直接对 `exports`进行赋值，这会改变形参的引用，但是可以对 `module.exports`进行赋值，因为其本来就是一个引用

```js
// 错误用法
exports = function() {}
// 正确用法
module.exports = function() {}
```