# 一些有关 Webpack 的知识点

## Source Map

通过 [devtool](https://www.webpackjs.com/configuration/devtool/) 进行配置

- `eval`：通过 `eval`关键字进行映射，将每个模块转化为字符串，使用eval包裹，并将打包前每个模块的sourcemap信息转换为Base64编码，拼接在每个打包后文件的结尾，效率最高，但不复杂代码下错误提示信息量较少
- `source-map`：如果包含此值，会自动打包出一个 `.map`的文件
- `inline`：如果包含此值，会将 `source map`映射关系直接放到打包出来的目标文件(例如 `main.js`)中（一般是文件的最底部）
- `cheap`：如果包含此值，则错误信息中只包含出错的行数而不包括列数，并且值提示业务代码中的错误，而不提示第三方库（例如 `vue-router`）中的错误
- `module`：如果包含此值，则错误信息中也包含第三方库（例如 `vue-router`）中的错误

>开发环境推荐 `cheap-module-source-map`
>
>线上环境推荐 `source-map`

## Babel

### 业务代码配置

使用 `presets`

```js
module: {
  rules: [{
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
    options: {
      presets: [['@babel/preset-env', {
        targets: '> 0.25%, not dead',
        useBuiltIns: 'usage'
      }]]
    }
  }]
}
```

### 库项目（第三方包）

使用 `plugins`，这样 `polyfill`的代码将会通过闭包的方式提供使用，避免污染全局环境

```js
module: {
  rules: [{
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
    options: {
      plugins: [['@babel/plugin-transform-runtime', {
        "absoluteRuntime": false,
        "corejs": false,
        "helpers": true,
        "regenerator": true,
        "useESModules": false
      }]]
    }
  }]
}
```

如果 `options`的配置项比较多，推荐将 `options`的内容直接放到 `.babelrc` 文件中，例如：
```js
// .babelrc
{
  plugins: [["@babel/plugin-transform-runtime", {
    "absoluteRuntime": false,
    "corejs": false,
    "helpers": true,
    "regenerator": true,
    "useESModules": false
  }]]
}
```
## Tree-Shaking

依赖于 `ES2015` 模块系统中的 **静态结构特性**，即 只有`ES Module`风格的代码才能被 `shaking`，例如 `import export`，而对于其他风格的代码不适用，例如 `const module = require('module')`，这种是无法 `shaking`的

## optimization.splitChunks

### 配置解析

```js
splitChunks: {
  // async：只对异步引入代码进行分割（例如 import进来的代码）；initial：只对同步代码进行分割；all：对异步和同步引入的代码都进行分割
  chunks: "async",
  // 只有当文件体积大于 minSize 字节时才进行分割
  minSize: 30000,
  // 只有当文件被引用的次数不小于 minChunks才进行分割
  minChunks: 1,
  // 按需加载时候最大的并行请求数（如果需要分割的文件超过此值，则只分割前面 maxAsyncRequests个文件，超过的则不分割）
  maxAsyncRequests: 5,
  // 入口文件所引入的文件最多只分割三个出去，多出的不分割（例如入口文件引入了 10个文件，这10个文件都符合分割的规则，但maxInitialRequests的值为 3，则只有前 3 个引入的文件才会被分割，多出的不分割）
  maxInitialRequests: 3,
  // 如果 cacheGroups 的组没有显示指定 fileName参数，则被分割出去的文件的文件名由原文件名与 cacheGroups 组名称连接而成，这个连接符就是 automaticNameDelimiter的值，例如 `vendors~lodash.js`
  automaticNameDelimiter: '~',
  // 分割打包出来的文件的文件名由 cacheGroups 指定
  name: true,
  // 代码分割的规则
  cacheGroups: {
    // node_modules 文件下的代码按照此规则（vendors组）进行分割
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      // 如果一个文件同时符合多个组的 test规则，则优先按照 priority值大的那个组
      // 例如 lodash同时满足 vendors 和 default，但vendors组的 priority更大，所以 lodash按照 vendors的规则进行分割
      priority: -10,
      // fileName: 'vendors'
    },
    // 如果要分割的代码没有显式声明分割的规则（不符合 vendors等规则），则按照此 default规则进行分割
    default: {
      minChunks: 2,
      priority: -20,
      // 如果一个模块已经被打包过了，则忽略当前打包，直接复用之前已经被打包过的
      // 例如，index.js中引入了 a.js 和  b.js 两个文件，并且 a.js中也引入了 b.js，则在打包 a.js的时候就已经打包了 b.js，那么在 index.js中想要打包 b.js的时候发现 a.js中已经对 b.js打包了，所以就忽略这次打包，直接复用之前的
      reuseExistingChunk: true
    }
  }
}
```

### bundle 分析(bundle analysis)

>下述摘自 [webpack 官网 bundle-分析-bundle-analysis-](https://www.webpackjs.com/guides/code-splitting/#bundle-%E5%88%86%E6%9E%90-bundle-analysis-)

如果我们以分离代码作为开始，那么就以检查模块作为结束，分析输出结果是很有用处的。[官方分析工具](https://github.com/webpack/analyse) 是一个好的初始选择。下面是一些社区支持(`community-supported`)的可选工具：

- [webpack-chart](https://alexkuz.github.io/webpack-chart/): webpack 数据交互饼图。
- [webpack-visualizer](https://chrisbateman.github.io/webpack-visualizer/): 可视化并分析你的 `bundle`，检查哪些模块占用空间，哪些可能是重复使用的。
- [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer): 一款分析 bundle 内容的插件及 CLI 工具，以便捷的、交互式、可缩放的树状图形式展现给用户。

### Prefetching/Preloading modules

对于一些首页非必须立即加载执行的代码，可以设为异步加载（`import`），但是如果当只有使用的时候才去加载，可能会导致交互的卡顿，所以需要在页面加载完必须的首屏代码之后，在网络空闲时段将这些代码就下载下来，以保证使用的时候能够即时响应，这就需要借助 `webpack`的 `Prefetching/Preloading`能力

`Prefetching`：只有当页面所必须的核心代码加载完毕后，才会加载 `prefecth`的代码，通常用于加载辅助类非必须资源
`Preloading`：会与页面所必须的核心代码一同并行请求加载，通常用于加载关键 `js`、字体、`css`等

### Progressive Web Application(PWA)

`webpack`能够让你很轻松地将项目构建成离线状态依旧可运行的，只需要借助一些简单的配置即可，详细参见：[渐进式网络应用程序](https://www.webpackjs.com/guides/progressive-web-application/#%E7%8E%B0%E5%9C%A8%E6%88%91%E4%BB%AC%E5%B9%B6%E6%B2%A1%E6%9C%89%E7%A6%BB%E7%BA%BF%E7%8E%AF%E5%A2%83%E4%B8%8B%E8%BF%90%E8%A1%8C%E8%BF%87)

### DllPlugin

`DllPlugin` 和 `DllReferencePlugin` 用某种方法实现了拆分 `bundles`，同时还大大提升了构建的速度。主要思想在于，将一些不做修改的依赖文件（例如第三方库等），提前打包，这样我们开发代码发布的时候就不需要再对这部分代码进行打包，从而节省了打包时间。

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
