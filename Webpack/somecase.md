# 一些有关 Webpack 的知识点

## 可视化分析插件

以一种可视化的方式，呈现 webpack输出文件的相关信息（例如源文件体积、压缩后体积、文件路径、包含的子文件、项目结构等），代表有 [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)、[webpack-chart](https://github.com/alexkuz/webpack-chart)、[webpack-analyse](https://github.com/webpack/analyse)等，推荐使用 [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)

## webpackchunkname

可以通过指定 `webpackchunkname` 来自定义文件打包后的名字
这里有个小技巧，如果两个文件使用了相同的 `webpackchunkname`，那么这两个文件就会被打包到同一个文件中，适用以下场景：

`A`页面功能较为复杂，于是将其分成了 `c`、`d`、`e`三个模块，这三个模块都必须要在首页加载时立即加载，为了减少 `http`请求，就可以通过 `webpackchunkname` 将三个文件最终打包到一个文件中，只需要一次 `http`请求即可

## HappyPack/thread-loader

`HappyPack` 可以将原有的 `webpack` 对 `loader` 的执行过程，从单一进程的形式扩展为多进程的模式，从而加速代码构建

```js
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

// ...
module: {
  loaders: [{
    test: /\.less$/,
    loader: ExtractTextPlugin.extract(
      'style', path.resolve(__dirname, './node_modules', 'happypack/loader') + '?id=less'
    )
  }]
},
plugins: [
  new HappyPack({
    id: 'less',
    loaders: ['css!less'],
    threadPool: happyThreadPool,
    cache: true,
    verbose: true
  })
]
```

`Vue-loader` 不支持 `happypack`，可以使用 `thread-loader` 来进行加速
```js
module: {
  rules: [{
    test: /\.vue$/,
    use: [
      'thread-loader',
      'vue-loader'
    ]
  }]
}
```

>`v4` 版本中的 `UglifyjsWebpackPlugin` 已经可以通过 设置 `parallel`选项来自动开启多线程

## 缓存loader的执行结果(cacheDirectory/cache-loader)

两种方法缓存 `loader`

- 直接配置

```js
loader: 'babel-loader?cacheDirectory=true'
```

- [cache-loader](https://webpack.docschina.org/loaders/cache-loader/)

推荐这种方法

首先需要安装 
```js
npm install --save-dev cache-loader
```
然后使用
```js
rules: [{
  test: /\.vue$/,
  use: [
    'cache-loader',
    'vue-loader'
  ]
}]
```

>Note: 保存和读取这些缓存文件会有一些时间开销，所以请只对性能开销较大的 `loader` 使用此 `loader`

## splitChunks

`v4`新增特性，用于取代之前的 `CommonsChunkPlugin`，`splitChunks` 的默认配置已经足够我们日常使用，没有特殊需求可以不必特意处理

```js
optimization: {
  splitChunks: {
    cacheGroups: {
      commons: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all'
      },
      styles: {
        name: 'index',
        test: /.stylus|css$/,
        chunks: 'all',
        enforce: true
      }
    }
  }
}
```
`commons` 部分的作用是分离出 `node_modules` 中引入的模块，`styles` 部分则是合并 CSS 文件

## 使用 DllPlugin拆分模块

开发过程中，我们经常需要引入大量第三方库，这些库并不需要随时修改或调试，我们可以使用 `DllPlugin`和 `DllReferencePlugin`单独构建它们

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: {
    vendor: [
      'axios',
      'vue-i18n',
      'vue-router',
      'vuex'
    ]
  },
  output: {
    path: path.resolve(__dirname, '../static/'),
    filename: '[name].dll.js',
    library: '[name]_library'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'build', '[name]-manifest.json'),
      name: '[name]_library'
    })
  ]
}
```

执行 `webpack`命令，`build`目录下即可生成 `dll.js` 文件和对应的 `manifest` 文件，使用 `DLLReferencePlugin` 引入

```js
plugins: [
  new webpack.DllReferencePlugin({
    context: __dirname,
    manifest: require('./build/vendor-manifest.json')
  })
]
```

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

**_结论_：只要你的包不是用来做 `polyfill` 或 `shim` 之类的事情，就尽管放心的给它加上 `sideEffects: false` 吧！**

## `preload-webpack-plugin`

给外联资源加上 `preload`标识：
```js
const preloadWebpackPlugin = require('preload-webpack-plugin')
...

// webpack配置
plugins: [
  new htmlWebpackPlugin(),
  new preloadWebpackPlugin({
    as(entry) {
      if (/\.woff2$/.test(entry)) return 'font';
      return 'script';
    },
    include: 'allAssets',
    rel: 'preload',
    fileWhitelist: [/\.woff2/]
  })
]
```

编译出的字体标签链接为：
```html
<link as="font" crossorigin href='/dist/static/font.woff2' rel="preload" />
```

## 全局组件注册

对于如下结构：
```
components
│ componentRegister.js
├─BasicTable
│ BasicTable.vue
├─MultiCondition
│ index.vue
```

```js
import Vue from 'vue'

/**
 * 首字母大写
 * @param str 字符串
 * @example heheHaha
 * @return {string} HeheHaha
 */
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 对符合'xx/xx.vue'组件格式的组件取组件名
 * @param str fileName
 * @example abc/bcd/def/basicTable.vue
 * @return {string} BasicTable
 */
function validateFileName(str) {
  return /^\S+\.vue$/.test(str) &&
    str.replace(/^\S+\/(\w+)\.vue$/, (rs, $1) => capitalizeFirstLetter($1))
}

const requireComponent = require.context('./', true, /\.vue$/)

// 找到组件文件夹下以.vue命名的文件，如果文件名为index，那么取组件中的name作为注册的组件名
requireComponent.keys().forEach(filePath => {
  const componentConfig = requireComponent(filePath)
  const fileName = validateFileName(filePath)
  const componentName = fileName.toLowerCase() === 'index'
    ? capitalizeFirstLetter(componentConfig.default.name)
    : fileName
  Vue.component(componentName, componentConfig.default || componentConfig)
})
```
