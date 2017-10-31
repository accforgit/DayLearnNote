最近想稍稍看下 `React`的 `SSR`框架 [Next.js](https://github.com/zeit/next.js)，因为不想看二手资料，
所以自己跑到 [Github](https://github.com/zeit/next.js)上看，`Next.js`的文档是英文的，看倒是大概也能看得懂，
但有些地方不太确定，而且英文看着毕竟不太爽你懂得，所以在网上搜了几圈发现好像好像还没有中文翻译，想着长痛不如短痛，
索性一边看一边翻译，自己翻译的东西自己看得也爽，不过毕竟能力有限，有些地方我也不知道该怎么翻译才好，所以翻译得不太通畅，
或者有几句干脆不翻译了。

so，各位若是觉得我哪点翻译得不太准确，或者对于那几句我没翻译的地方有更好的见解，欢迎提出~

以下是全文翻译的 [Next.js](https://github.com/zeit/next.js)的 [README.md](https://github.com/zeit/next.js/blob/canary/readme.md)文件，版本是 `v4.1.4`

另外，本文档已经放在我的 [github](https://github.com/accforgit/DayLearnNote/tree/master/translation/Next.js-README.md)上了，有兴趣的去看下，别忘了 `star`哦~

---

<img width="112" alt="screen shot 2016-10-25 at 2 37 27 pm" src="https://cloud.githubusercontent.com/assets/13041/19686250/971bf7f8-9ac0-11e6-975c-188defd82df1.png">

[![NPM version](https://img.shields.io/npm/v/next.svg)](https://www.npmjs.com/package/next) 
[![Build Status](https://travis-ci.org/zeit/next.js.svg?branch=master)](https://travis-ci.org/zeit/next.js)
[![Build status](https://ci.appveyor.com/api/projects/status/gqp5hs71l3ebtx1r/branch/master?svg=true)](https://ci.appveyor.com/project/arunoda/next-js/branch/master)
[![Coverage Status](https://coveralls.io/repos/zeit/next.js/badge.svg?branch=master)](https://coveralls.io/r/zeit/next.js?branch=master)
[![Slack Channel](http://zeit-slackin.now.sh/badge.svg)](https://zeit.chat)

Next.js是一个用于React应用的极简的服务端渲染框架。

**请访问 [learnnextjs.com](https://learnnextjs.com) 以获取更多详细内容.**

---

- [如何使用](#如何使用)
  - [安装](#安装)
  - [代码自动分割](#代码自动分割)
  - [CSS](#css)
    - [嵌入式样式(Built-in-CSS)](#嵌入式样式-built-in-css)
    - [内联式样式(CSS-in-JS)](#内联式样式-css-in-js)
  - [静态文件服务 (例如: images)](#静态文件服务)
  - [自定义 `<head>` 头部元素](#自定义-head-头部元素)
  - [数据获取及组件生命周期](#数据获取及组件生命周期)
  - [路由](#路由)
    - [`<Link>`](#link)
    - [命令式路由](#命令式路由)
      - [路由事件](#路由事件)
      - [浅层路由(Shallow Routing)](#浅层路由)
    - [使用高阶函数(HOC)](#使用高阶函数-hoc)
  - [预获取页面(Prefetching Pages)](#预获取页面-prefetching-pages)
    - [通过 `<Link>`组件](#通过-link-组件)
    - [通过命令的方式](#通过命令的方式)
  - [自定义服务器和路由](#自定义服务器和路由)
  - [异步导入(Dynamic Import)](#异步导入-dynamic-import)
  - [自定义 `<Document>`](#自定义-document)
  - [自定义错误处理](#自定义错误处理)
  - [自定义配置](#自定义配置)
  - [自定义 webpack 配置](#自定义-webpack-配置)
  - [自定义 babel 配置](#自定义-babel-配置)
  - [CDN支持](#cdn-支持)
- [项目部署](#项目部署)
- [导出静态 HTML 页面面](#导出静态-html-页面)
- [相关技巧](#相关技巧)
- [FAQ](#faq)
- [contributing](#contributing)
- [authors](#authors)


## 如何使用

### 安装

安装方法:

```bash
npm install --save next react react-dom
```

> `Next.js 4` 只支持 [React 16](https://reactjs.org/blog/2017/09/26/react-v16.0.html).<br/>
> 由于 `React 16` 和 `React 15` 的工作方式以及使用方法不尽相同，所以我们不得不移除了对 `React 15` 的支持

在你的 `package.json`文件中添加如下代码：
```json
{
  "scripts": {
    "dev": "next",
    "build": "next build",
    "start": "next start"
  }
}
```

接下来，大部分事情都交由文件系统来处理。每个 `.js` 文件都变成了一个自动处理和渲染的路由。

在项目中新建 `./pages/index.js`：

```jsx
export default () => <div>Welcome to next.js!</div>
```

然后，在控制台输入 `npm run dev`命令，打开 `http://localhost:3000`即可看到程序已经运行，你当然也可以使用其他的端口号，可以使用这条命令：`npm run dev -- -p <your port here>`。

目前为止，我们已经介绍了:

- 自动编译和打包 (使用 `webpack` 和 `babel`)
- 代码热更新
- 以 `./pages`目录作为页面渲染目录的的服务器端渲染
- 静态文件服务(`./static/` 被自动定位到 `/static/`)

想要亲自试试这些到底有多简单， `check out` [sample app - nextgram](https://github.com/zeit/nextgram)

### 代码自动分割

你所声明的每个 `import`命令所导入的文件会只会与相关页面进行绑定并提供服务，也就是说，页面不会加载不需要的代码。

```jsx
import cowsay from 'cowsay-browser'

export default () =>
  <pre>
    {cowsay.say({ text: 'hi there!' })}
  </pre>
```

### CSS

#### 嵌入式样式 Built-in-CSS

<p><details>
  <summary><b>Examples</b></summary>
  <ul><li><a href="https://github.com/zeit/next.js/blob/canary/examples/basic-css">Basic css</a></li></ul>
</details></p>

我们提供 [style-jsx](https://github.com/zeit/styled-jsx)来支持局部独立作用域的 `CSS`(`scope CSS`)，目的是提供一种类似于 `Web`组件的 `shadow CSS`，不过，后者(即`shadow CSS`)并不支持服务器端渲染(`scope CSS`是支持的)。

```jsx
export default () =>
  <div>
    Hello world
    <p>scoped!</p>
    <style jsx>{`
      p {
        color: blue;
      }
      div {
        background: red;
      }
      @media (max-width: 600px) {
        div {
          background: blue;
        }
      }
    `}</style>
    <style global jsx>{`
      body {
        background: black;
      }
    `}</style>
  </div>
```

更多示例可见 [styled-jsx documentation](https://www.npmjs.com/package/styled-jsx)

>译者注：
>1. `scope CSS`的作用范围，如果添加了 `jsx`属性，则是不包括子组件的当前组件；如果添加了 `global` 和 `jsx`属性，则是包括了子组件在内的当前组件；如果没添加任何属性，则作用与 添加了 `global` 和 `jsx`的作用类似，只不过 `next`不会对其进行额外的提取与优化打包
>2. `scope CSS`的位置必须是当前组件顶级 `DOM`下的第一个层级(即当前组件顶级 `DOM`元素的直接子元素)
>3. `scope CSS`的实现原理，其实就是在编译好的代码的对应元素上，添加一个以 `jsx`开头的类名(`class`)，然后将对应的样式代码提取到此类名下

#### 内联式样式 CSS-in-JS

<p><details>
  <summary>
    <b>Examples</b>
    </summary>
  <ul><li><a href="./examples/with-styled-components">Styled components</a></li><li><a href="./examples/with-styletron">Styletron</a></li><li><a href="./examples/with-glamor">Glamor</a></li><li><a href="./examples/with-glamorous">Glamorous</a></li><li><a href="./examples/with-cxs">Cxs</a></li><li><a href="./examples/with-aphrodite">Aphrodite</a></li><li><a href="./examples/with-fela">Fela</a></li></ul>
</details></p>

几乎可以使用所有的内联样式解决方案，最简单一种如下：

```jsx
export default () => <p style={{ color: 'red' }}>hi there</p>
```

为了使用更多复杂的 `CSS-in-JS` 内联样式方案，你可能不得不在服务器端渲染的时候强制样式刷新。我们通过允许自定义包裹着每个页面的 `<Document>` 组件的方式来解决此问题。

### 静态文件服务

在你的项目的根目录新建 `static` 文件夹，然后你就可以在你的代码通过 `/static/` 开头的路径来引用此文件夹下的文件：

```jsx
export default () => <img src="/static/my-image.png" />
```

### 自定义 `<head>` 头部元素

<p><details>
  <summary><b>Examples</b></summary>
  <ul>
    <li><a href="./examples/head-elements">Head elements</a></li>
    <li><a href="./examples/layout-component">Layout component</a></li>
  </ul>
</details></p>

我们暴露了一个用于将元素追加到 `<head>` 中的组件。

```jsx
import Head from 'next/head'

export default () =>
  <div>
    <Head>
      <title>My page title</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <p>Hello world!</p>
  </div>
```

_注意：当组件卸载的时候，组件内定义的 `<Head>`将会被清空，所以请确保每个页面都在其各自的 `<Head>`内声明了其所有需要的内容，而不是假定这些东西已经在其他页面中添加过了。_

>译者注：
>1. `next` 框架自带 `<head>`标签，作为当前页面的 `<head>`，如果在组件内自定义了 `<Head>`，则自定义 `<Head>`内的元素(例如 `<title>`、`<meta>`等)将会被追加到框架自带的 `<head>`标签中
>2. 每个组件自定义的 `<Head>`内容只会应用在各自的页面上，子组件内定义的 `<Head>`也会追加到当前页面的 `<head>`内，如果有重复定义的标签或属性，则子组件覆盖父组件，位于文档更后面的组件覆盖更前面的组件。

### 数据获取及组件生命周期

<p><details>
  <summary><b>Examples</b></summary>
  <ul><li><a href="./examples/data-fetch">Data fetch</a></li></ul>
</details></p>

你可以通过导出一个基于 `React.Component`的组件来获取状态(`state`)、生命周期或者初始数据（而不是一个无状态函数(`stateless`)，就像上面的一段代码）
```jsx
import React from 'react'

export default class extends React.Component {
  static async getInitialProps({ req }) {
    const userAgent = req ? req.headers['user-agent'] : navigator.userAgent
    return { userAgent }
  }

  render() {
    return (
      <div>
        Hello World {this.props.userAgent}
      </div>
    )
  }
}
```

你可能已经注意到了，当加载页面获取数据的时候，我们使用了一个异步([`async`](https://zeit.co/blog/async-and-await))的静态方法 `getInitialProps`。此静态方法能够获取所有的数据，并将其解析成一个 `JavaScript`对象，然后将其作为属性附加到 `props`对象上。

当初始化页面的时候，`getInitialProps`只会在服务器端执行，而当通过 `Link`组件或者使用命令路由 `API`来将页面导航到另外一个路由的时候，此方法就只会在客户端执行。

_注意：`getInitialProps` **不能** 在子组件上使用，只能应用于当前页面的顶层组件。_

<br/>

>如果你在 `getInitialProps` 中引入了一些只能在服务器端使用的模块(例如一些 `node.js`的核心模块)，请确保通过正确的方式来导入它们 [import them properly](https://arunoda.me/blog/ssr-and-server-only-modules)，否则的话，那很可能会拖慢应用的速度。

<br/>

你也可以为无状态(`stateless`)组件自定义 `getInitialProps`生命周期方法：

```jsx
const Page = ({ stars }) =>
  <div>
    Next stars: {stars}
  </div>

Page.getInitialProps = async ({ req }) => {
  const res = await fetch('https://api.github.com/repos/zeit/next.js')
  const json = await res.json()
  return { stars: json.stargazers_count }
}

export default Page
```

`getInitialProps` 接收的上下文对象包含以下属性：
- `pathname` - `URL`的 `path`部分
- `query` - `URL`的 `query string`部分，并且其已经被解析成了一个对象
- `asPath` - 在浏览器上展示的实际路径(包括 `query`字符串)
- `req` - `HTTP request` 对象 (只存在于服务器端)
- `res` - `HTTP response` 对象 (只存在于服务器端)
- `jsonPageRes` - 获取的响应数据对象 [Fetch Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) (只存在于客户端)
- `err` - 渲染时发生错误抛出的错误对象

>译者注：
>基于 `getInitialProps`在服务器端和客户端的不同表现，例如 `req`的存在与否，可以通过此来区分服务器端和客户端。

### 路由

#### `<Link>`

<p><details>
  <summary><b>Examples</b></summary>
  <ul>
    <li><a href="./examples/hello-world">Hello World</a></li>
  </ul>
</details></p>

可以通过 `<Link>` 组件来实现客户端在两个路由间的切换功能，例如下面两个页面：

```jsx
// pages/index.js
import Link from 'next/link'

export default () =>
  <div>
    Click{' '}
    <Link href="/about">
      <a>here</a>
    </Link>{' '}
    to read more
  </div>
```

```jsx
// pages/about.js
export default () => <p>Welcome to About!</p>
```

_注意：可以使用 [`<Link prefetch>`](#prefetching-pages) 来让页面在后台同时获取和预加载，以获得最佳的页面加载性能_

客户端路由行为与浏览器完全相同：

1. 获取组件
2. 如果组件定义了 `getInitialProps`，那么进行数据的获取，如果抛出异常，则将渲染`_error.js`
3. 在步骤`1`和步骤`2`完成后，`pushState`开始执行，接着新组件将会被渲染

每一个顶层组件都会接收到一个 `url`属性，其包括了以下 `API`:

- `pathname` - 不包括 `query`字符串在内的当前链接地址的 `path`字符串(即`pathname`)
- `query` - 当前链接地址的 `query`字符串，已经被解析为对象，默认为 `{}`
- `asPath` - 在浏览器地址栏显示的当前页面的实际地址(包括 `query`字符串)
- `push(url, as=url)` - 通过 `pushState`来跳转路由到给定的 `url`
- `replace(url, as=url)` - 通过 `replaceState`来将当前路由替换到给定的路由地址 `url`上

`push` 以及 `replace`的第二个参数 `as`提供了额外的配置项，当你在服务器上配置了自定义路由的话，那么此参数就会发挥作用。

>译者注1：
>上面那句话的意思是，`as`可以根据服务器端路由的配置作出相应的 路由改变，例如，在服务器端，你自定义规定当获取 `/a`的 `path`请求的时候，返回一个位于 `/b`目录下的页面，则为了配合服务器端的这种指定，你可以这么定义 `<Link/>`组件： `<Link href='/a' as='/b'><a>a</a></Link>`

>译者注2：
>`<Link>`组件主要用于路由跳转功能，其可以接收一个必须的子元素(`DOM`标签或者纯文字等)
>1. 如果添加的子元素是 `DOM`元素，则 `Link`会为此子元素赋予路由跳转功能；
>2. 如果添加的元素是纯文字，则 `<Link>`默认转化为 `a`标签，包裹在此文字外部(即作为文字的父元素)，如果当前组件有 `jsx`属性的 `scope CSS`，这个 `a`标签是不会受此 `scope CSS`影响的，也就是说，不会加上以 `jsx`开头的类名。<br>
>需要注意的是，直接添加纯文字作为子元素的做法如今已经不被赞成了(**deprecated**)。


##### URL 对象

<p><details>
  <summary><b>Examples</b></summary>
  <ul>
    <li><a href="./examples/with-url-object-routing">With URL Object Routing</a></li>
  </ul>
</details></p>

`<Link>`组件可以接收一个 `URL`对象，此 `URL`对象将会被自动格式化为 `URL`字符串。

```jsx
// pages/index.js
import Link from 'next/link'

export default () =>
  <div>
    Click{' '}
    <Link href={{ pathname: '/about', query: { name: 'Zeit' } }}>
      <a>here</a>
    </Link>{' '}
    to read more
  </div>
```

上述代码中 `<Link>`组件的将会根据 `href`属性的对象值生成一个 `/about?name=Zeit`的 `URL`字符串，你也可以在此 `URL`对象中使用任何已经在 [Node.js URL module documentation](https://nodejs.org/api/url.html#url_url_strings_and_url_objects) 中定义好了的属性来配置路由。

##### 替换 (`replace`)而非追加(`push`)路由 `url`

`<Link>`组件默认将新的 `URL`追加 (`push`)到路由栈中，但你可以使用 `replace`属性来避免此追加动作(直接替换掉当前路由)。

```jsx
// pages/index.js
import Link from 'next/link'

export default () =>
  <div>
    Click{' '}
    <Link href="/about" replace>
      <a>here</a>
    </Link>{' '}
    to read more
  </div>
```

##### 让组件支持 `onClick`事件

`<Link>` supports any component that supports the `onClick` event. In case you don't provide an `<a>` tag, it will only add the `onClick` event handler and won't pass the `href` property.
`<Link>`标签支持所有支持 `onClick`事件的组件(即只要某组件或者元素标签支持 `onClick`事件，则 `<Link>`就能够为其提供跳转路由的功能)。如果你没有给 `<Link>`标签添加一个 `<a>`标签的子元素的话，那么它只会执行给定的 `onClick`事件，而不是执行跳转路由的动作。

```jsx
// pages/index.js
import Link from 'next/link'

export default () =>
  <div>
    Click{' '}
    <Link href="/about">
      <img src="/static/image.png" />
    </Link>
  </div>
```

##### 将 `<Link>`的 `href`暴露给其子元素(`child`)

如果 `<Link>`的子元素是一个 `<a>`标签并且没有指定 `href`属性的话，那么我们会自动指定此属性(与 `<Link>`的 `herf`相同)以避免重复工作，然而有时候，你可能想要通过一个被包裹在某个容器(例如组件)内的 `<a>`标签来实现跳转功能，但是 `Link`并不认为那是一个超链接，因此，就不会把它的 `href`属性传递给子元素，为了避免此问题，你应该给 `Link`附加一个 `passHref`属性，强制让 `Link`将其 `href`属性传递给它的子元素。

```jsx
import Link from 'next/link'
import Unexpected_A from 'third-library'

export default ({ href, name }) =>
  <Link href={href} passHref>
    <Unexpected_A>
      {name}
    </Unexpected_A>
  </Link>
```

#### 命令式路由

<p><details>
  <summary><b>Examples</b></summary>
  <ul>
    <li><a href="./examples/using-router">Basic routing</a></li>
    <li><a href="./examples/with-loading">With a page loading indicator</a></li>
  </ul>
</details></p>

你可以使用 `next/router`来实现客户端侧的页面切换

```jsx
import Router from 'next/router'

export default () =>
  <div>
    Click <span onClick={() => Router.push('/about')}>here</span> to read more
  </div>
```

上述代码中的 `Router`对象拥有以下 `API`：

- `route` - 当前路由字符串
- `pathname` - 不包括查询字符串(`query string`)在内的当前路由的 `path`(也就是 `pathname`)
- `query` - `Object` with the parsed query string. Defaults to `{}`
- `asPath` - 在浏览器地址栏显示的当前页面的实际地址(包括 `query`字符串)
- `push(url, as=url)` - 通过 `pushState`来跳转路由到给定的 `url`
- `replace(url, as=url)` - 通过 `replaceState`来将当前路由替换到给定的路由地址 `url`上

`push` 以及 `replace`的第二个参数 `as`提供了额外的配置项，当你在服务器上配置了自定义路由的话，那么此参数就会发挥作用。

_为了使用编程的方式而不是触发导航和组件获取的方式来切换路由，可以在组件内部使用 `props.url.push` 和 `props.url.replace`_

>译者注：
>除非特殊需要，否则在组件内部不赞成(**deprecated**)使用 `props.url.push` 和 `props.url.replace`，而是建议使用 `next/router`的相关 `API`。

##### URL 对象
命令式路由 (`next/router`)所接收的 `URL`对象与 `<Link>`的 `URL`对象很类似，你可以使用相同的方式来`push` 和 `replace`路由`URL`
```jsx
import Router from 'next/router'

const handler = () =>
  Router.push({
    pathname: '/about',
    query: { name: 'Zeit' }
  })

export default () =>
  <div>
    Click <span onClick={handler}>here</span> to read more
  </div>
```

命令式路由 (`next/router`)的 `URL`对象的属性及其参数的使用方法和 `<Link>`组件的完全一样。

##### 路由事件

你还可以监听到与 `Router`相关的一些事件。

以下是你所能够监听的 `Router`事件:

- `routeChangeStart(url)` - 当路由刚开始切换的时候触发
- `routeChangeComplete(url)` - 当路由切换完成时触发
- `routeChangeError(err, url)` - 当路由切换发生错误时触发
- `beforeHistoryChange(url)` - 在改变浏览器 `history`之前触发
- `appUpdated(nextRoute)` - 当切换页面的时候，应用版本刚好更新的时触发(例如在部署期间切换路由)

> Here `url` is the URL shown in the browser. If you call `Router.push(url, as)` (or similar), then the value of `url` will be `as`.
>上面 `API`中的 `url`参数指的是浏览器地址栏显示的链接地址，如果你使用 `Router.push(url, as)`(或者类似的方法)来改变路由，则此值就将是 `as`的值

下面是一段如何正确地监听路由事件 `routeChangeStart`的示例代码：
```js
Router.onRouteChangeStart = url => {
  console.log('App is changing to: ', url)
}
```

如果你不想继续监听此事件了，那么你也可以很轻松地卸载掉此监听事件，就像下面这样：
```js
Router.onRouteChangeStart = null
```

如果某个路由加载被取消掉了(例如连续快速地单击两个链接)，`routeChangeError` 将会被执行。此方法的第一个参数 `err`对象中将包括一个值为 `true`的 `cancelled`属性。
```js
Router.onRouteChangeError = (err, url) => {
  if (err.cancelled) {
    console.log(`Route to ${url} was cancelled!`)
  }
}
```

如果你在一次项目新部署的过程中改变了路由，那么我们就无法在客户端对应用进行导航，必须要进行一次完整的导航动作(译者注：意思是无法像正常那样通过 `PWA`的方式进行导航)，我们已经自动帮你做了这些事。
不过，你也可以通过 `Route.onAppUpdated`事件对此进行自定义操作，就像下面这样：

```js
Router.onAppUpdated = nextUrl => {
  // persist the local state
  location.href = nextUrl
}
```

>译者注：<br>
>一般情况下，上述路由事件的发生顺序如下：
>1. `routeChangeStart`
>2. `beforeHistoryChange`
>3. `routeChangeComplete`

##### 浅层路由

<p><details>
  <summary><b>Examples</b></summary>
  <ul>
    <li><a href="./examples/with-shallow-routing">Shallow Routing</a></li>
  </ul>
</details></p>

浅层路由(`Shallow routing`)允许你在不触发 `getInitialProps`的情况下改变路由(`URL`)，你可以通过要加载页面的 `url`来获取更新后的 `pathname` 和 `query`，这样就不会丢失路由状态(`state`)了。

你可以通过调用 `Router.push` 或 `Router.replace`，并给它们加上 `shallow: true`的配置参数来实现此功能，下面是一个使用示例：
```js
// Current URL is "/"
const href = '/?counter=10'
const as = href
Router.push(href, as, { shallow: true })
```

现在，`URL`已经被更新到了 `/?counter=10`，你可以在组件内部通过 `this.props.url`来获取此 `URL`

你可以在 [`componentWillReceiveProps`](https://facebook.github.io/react/docs/react-component.html#componentwillreceiveprops)钩子函数中获取到 `URL`的变化，就像下面这样：

```js
componentWillReceiveProps(nextProps) {
  const { pathname, query } = nextProps.url
  // fetch data based on the new query
}
```

> 注意:
>
> 浅层路由只会在某些页面上起作用，例如，我们可以假定存在另外一个名为 `about`的页面，然后执行下面这行代码：
> ```js
> Router.push('/about?counter=10', '/about?counter=10', { shallow: true })
> ```
> 因为这是一个新的页面(`/about?counter=10`)，所以即使我们已经声明了只执行浅层路由，但当前页面仍然会被卸载掉(`unload`)，然后加载这个新的页面并调用 `getInitialProps`方法

#### 使用高阶函数 HOC

<p><details>
  <summary><b>Examples</b></summary>
  <ul>
    <li><a href="./examples/using-with-router">Using the `withRouter` utility</a></li>
  </ul>
</details></p>

如果你想在应用的任何组件都能获取到 `router`对象，那么你可以使用 `withRouter`高阶函数，下面是一个使用此高阶函数的示例：
```jsx
import { withRouter } from 'next/router'

const ActiveLink = ({ children, router, href }) => {
  const style = {
    marginRight: 10,
    color: router.pathname === href? 'red' : 'black'
  }

  const handleClick = (e) => {
    e.preventDefault()
    router.push(href)
  }

  return (
    <a href={href} onClick={handleClick} style={style}>
      {children}
    </a>
  )
}

export default withRouter(ActiveLink)
```

上述代码中的 `router`对象拥有和 [`next/router`](#命令式路由) 相同的 `API`。

### 预获取页面 Prefetching Pages

(下面就是一个小例子)

<p><details>
  <summary><b>Examples</b></summary>
  <ul><li><a href="./examples/with-prefetching">Prefetching</a></li></ul>
</details></p>

`Next.js`自带允许你预获取(`prefetch`)页面的 `API`

因为 `Next.js`在服务器端渲染页面，所以应用的所有将来可能发生交互的相关链接路径可以在瞬间完成交互，事实上 `Next.js`可以通过预下载功能来达到一个绝佳的加载性能。[更多详细可见]([Read more](https://zeit.co/blog/next#anticipation-is-the-key-to-performance).)

>由于 `Next.js`只会预加载 `JS`代码，所以在页面加载的时候，你可以还需要花点时间来等待数据的获取。

#### 通过 `<Link>` 组件

你可以为任何一个 `<Link>`组件添加 `prefetch`属性，`Next.js`将会在后台预加载这些页面。

```jsx
import Link from 'next/link'

// example header component
export default () =>
  <nav>
    <ul>
      <li>
        <Link prefetch href="/">
          <a>Home</a>
        </Link>
      </li>
      <li>
        <Link prefetch href="/about">
          <a>About</a>
        </Link>
      </li>
      <li>
        <Link prefetch href="/contact">
          <a>Contact</a>
        </Link>
      </li>
    </ul>
  </nav>
```

#### 通过命令的方式

大部分预获取功能都需要通过 `<Link>`组件来指定链接地址，但是我们还暴露了一个命令式的 `API`以方便更加复杂的场景：

```jsx
import Router from 'next/router'

export default ({ url }) =>
  <div>
    <a onClick={() => setTimeout(() => url.pushTo('/dynamic'), 100)}>
      A route transition will happen after 100ms
    </a>
    {// but we can prefetch it!
    Router.prefetch('/dynamic')}
  </div>
```

### 自定义服务器和路由

<p><details>
  <summary><b>Examples</b></summary>
  <ul>
    <li><a href="https://github.com/accforgit/next.js/blob/canary/examples/custom-server">Basic custom server</a></li>
    <li><a href="https://github.com/accforgit/next.js/blob/canary/examples/custom-server-express">Express integration</a></li>
    <li><a href="https://github.com/accforgit/next.js/blob/canary/examples/custom-server-hapi">Hapi integration</a></li>
    <li><a href="https://github.com/accforgit/next.js/blob/canary/examples/custom-server-koa">Koa integration</a></li>
    <li><a href="https://github.com/accforgit/next.js/blob/canary/examples/parameterized-routing">Parameterized routing</a></li>
    <li><a href="https://github.com/accforgit/next.js/blob/canary/examples/ssr-caching">SSR caching</a></li>
  </ul>
</details></p>

一般来说，你可以使用 `next start`命令启动 `next`服务，但是，你也完全可以使用编程(`programmatically`)的方式，例如路由匹配等，来定制化路由。

下面就是一个将 `/a`匹配到 `./page/b`，以及将 `/b`匹配到 `./page/a`的例子：

```js
// This file doesn't not go through babel or webpack transformation.
// Make sure the syntax and sources this file requires are compatible with the current node version you are running
// See https://github.com/zeit/next.js/issues/1245 for discussions on Universal Webpack or universal Babel
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    if (pathname === '/a') {
      app.render(req, res, '/b', query)
    } else if (pathname === '/b') {
      app.render(req, res, '/a', query)
    } else {
      handle(req, res, parsedUrl)
    }
  }).listen(3000, err => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
```

`next API`如下所示：
- `next(path: string, opts: object)` - `path`是 `Next`应用当前的路由位置
- `next(opts: object)`

上述 `API`中的 `opt`对象存在如下属性：
- `dev` (`bool`) 是否使用开发模式(`dev`)来启动 `Next.js` - 默认为 `false`
- `dir` (`string`) 当前 `Next`应用的路由位置 - 默认为 `'.'`
- `quiet` (`bool`) 隐藏包括服务器端消息在内的错误消息 - 默认为 `false`
- `conf` (`object`) 和`next.config.js` 中的对象是同一个 - 默认为 `{}`

然后，将你(在 `package.json`中配置)的 `start`命令(`script`)改写成 `NODE_ENV=production node server.js`。

### 异步导入 Dynamic Import

<p><details>
  <summary><b>Examples</b></summary>
  <ul>
    <li><a href="./examples/with-dynamic-import">With Dynamic Import</a></li>
  </ul>
</details></p>

`Next.js`支持 `JavaScript TC39` 的[dynamic import proposal](https://github.com/tc39/proposal-dynamic-import)规范，所以你可以动态导入(`import`) `JavaScript` 模块(例如 `React Component`)。

你可以将动态导入理解为一种将代码分割为更易管理和理解的方式。
由于 `Next.js`支持服务器端渲染侧(`SSR`)的动态导入，所以你可以用它来做一些炫酷的东西。

#### 1. 基本用法（同样支持 `SSR`）

```jsx
import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(import('../components/hello'))

export default () =>
  <div>
    <Header />
    <DynamicComponent />
    <p>HOME PAGE is here!</p>
  </div>
```

#### 2. 自定义 加载组件

```jsx
import dynamic from 'next/dynamic'

const DynamicComponentWithCustomLoading = dynamic(
  import('../components/hello2'),
  {
    loading: () => <p>...</p>
  }
)

export default () =>
  <div>
    <Header />
    <DynamicComponentWithCustomLoading />
    <p>HOME PAGE is here!</p>
  </div>
```

#### 3. 禁止 `SSR`

```jsx
import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(import('../components/hello3'), {
  ssr: false
})

export default () =>
  <div>
    <Header />
    <DynamicComponentWithNoSSR />
    <p>HOME PAGE is here!</p>
  </div>
```

#### 4. 一次性加载多个模块

```jsx
import dynamic from 'next/dynamic'

const HelloBundle = dynamic({
  modules: props => {
    const components = {
      Hello1: import('../components/hello1'),
      Hello2: import('../components/hello2')
    }

    // Add remove components based on props

    return components
  },
  render: (props, { Hello1, Hello2 }) =>
    <div>
      <h1>
        {props.title}
      </h1>
      <Hello1 />
      <Hello2 />
    </div>
})

export default () => <HelloBundle title="Dynamic Bundle" />
```

### 自定义 `<Document>`

<p><details>
  <summary><b>Examples</b></summary>
  <ul><li><a href="./examples/with-styled-components">Styled components custom document</a></li></ul>
  <ul><li><a href="./examples/with-amp">Google AMP</a></li></ul>
</details></p>

`Next.js`帮你自动跳过了在为页面添加文档标记元素的操作，例如， 你从来不需要主动添加 `<html>`、`<body>`这些文档元素。如果你想重定义这些默认操作的话，那么你可以创建(或覆写) `./page/_ducument.js`文件，在此文件中，对 `Document`进行扩展：

```jsx
// ./pages/_document.js
import Document, { Head, Main, NextScript } from 'next/document'
import flush from 'styled-jsx/server'

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const { html, head, errorHtml, chunks } = renderPage()
    const styles = flush()
    return { html, head, errorHtml, chunks, styles }
  }

  render() {
    return (
      <html>
        <Head>
          <style>{`body { margin: 0 } /* custom! */`}</style>
        </Head>
        <body className="custom_class">
          {this.props.customValue}
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
```

在以下前提下，所有的 [`getInitialProps`](#fetching-data-and-component-lifecycle) 钩子函数接收到的 `ctx`都指的是同一个对象：

- 回调函数 `renderPage` (`Function`)是真正执行 `React`渲染逻辑的函数(同步地)，这种做法有助于此函数支持一些类似于 `Aphrodite's`的 [`renderStatic`](https://github.com/Khan/aphrodite#server-side-rendering)等一些服务器端渲染容器。

_注意：`<Main/>`之外的 `React`组件都不会被浏览器初始化，如果你想在所有的页面中使用某些组件(例如菜单栏或者工具栏)，首先保证不要在其中添加有关应用逻辑的内容，然后可以看看[这个例子](https://github.com/zeit/next.js/tree/master/examples/layout-component)_

### 自定义错误处理

客户端和服务器端都会捕获并使用默认组件 `error.js`来处理 `404` 和 `500`错误。如果你希望自定义错误处理，可以对其进行覆写：

```jsx
import React from 'react'

export default class Error extends React.Component {
  static getInitialProps({ res, jsonPageRes }) {
    const statusCode = res
      ? res.statusCode
      : jsonPageRes ? jsonPageRes.status : null
    return { statusCode }
  }

  render() {
    return (
      <p>
        {this.props.statusCode
          ? `An error ${this.props.statusCode} occurred on server`
          : 'An error occurred on client'}
      </p>
    )
  }
}
```

### 使用内置的错误页面

如果你想使用内置的错误页面，那么你可以通过 `next/error`来实现：
```jsx
import React from 'react'
import Error from 'next/error'
import fetch from 'isomorphic-fetch'

export default class Page extends React.Component {
  static async getInitialProps() {
    const res = await fetch('https://api.github.com/repos/zeit/next.js')
    const statusCode = res.statusCode > 200 ? res.statusCode : false
    const json = await res.json()

    return { statusCode, stars: json.stargazers_count }
  }

  render() {
    if (this.props.statusCode) {
      return <Error statusCode={this.props.statusCode} />
    }

    return (
      <div>
        Next stars: {this.props.stars}
      </div>
    )
  }
}
```

> 如果你想使用自定义的错误页面，那么你可以导入你自己的错误(`_error`)页面组件而非内置的 `next/error`

### 自定义配置

为了对 `Next.js`进行更复杂的自定义操作，你可以在项目的根目录下(和 `pages/`以及 `package.json`属于同一层级)新建一个 `nexr.config.js`文件

注意：`next.confgi.js`是一个标准的 `Node.js`模块，而不是一个 `JSON`文件，此文件在 `Next`项目的服务端以及 `build`阶段会被调用，但是在浏览器端构建时是不会起作用的。
```js
// next.config.js
module.exports = {
  /* config options here */
}
```

#### 设置一个自定义的构建(`build`)目录

你可以自行指定构建打包的输出目录，例如，下面的配置将会创建一个 `build`目录而不是 `.next`作为构建打包的输出目录，如果没有特别指定的话，那么默认就是 `.next`

```js
// next.config.js
module.exports = {
  distDir: 'build'
}
```

#### Configuring the onDemandEntries

`Next` 暴露了一些能够让你自己控制如何部署服务或者缓存页面的配置：
```js
module.exports = {
  onDemandEntries: {
    // 控制页面在内存`buffer`中缓存的时间，单位是 ms
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  }
}
```

### 自定义 webpack 配置

<p><details>
  <summary><b>Examples</b></summary>
  <ul><li><a href="./examples/with-webpack-bundle-analyzer">Custom webpack bundle analyzer</a></li></ul>
</details></p>

你可以通过 `next.config.js`中的函数来扩展 `webpack`的配置
```js
// This file is not going through babel transformation.
// So, we write it in vanilla JS
// (But you could use ES2015 features supported by your Node.js version)

module.exports = {
  webpack: (config, { buildId, dev }) => {
    // Perform customizations to webpack config

    // Important: return the modified config
    return config
  },
  webpackDevMiddleware: config => {
    // Perform customizations to webpack dev middleware config

    // Important: return the modified config
    return config
  }
}
```


*警告：不推荐在 `webpack`的配置中添加一个支持新文件类型(`css less svg`等)的 `loader`，因为 `webpack`只会打包客户端代码，所以(`loader`)不会在服务器端的初始化渲染中起作用。`Babel`是一个很好的替代品，因为其给服务器端和客户端提供一致的功能效果(例如，[babel-plugin-inline-react-svg](https://github.com/kesne/babel-plugin-inline-react-svg))。*

### 自定义 Babel 配置

<p><details>
  <summary><b>Examples</b></summary>
  <ul><li><a href="./examples/with-custom-babel-config">Custom babel configuration</a></li></ul>
</details></p>

为了扩展对 `Babel`的使用，你可以在应用的根目录下新建 `.babelrc`文件，此文件是非必须的。
如果此文件存在，那么我们就认为这个才是真正的`Babel`配置文件，因此也就需要为其定义一些 `next`项目需要的东西， 并将之当做是`next/babel`的预设配置(`preset`)
这种设计是为了避免你有可能对我们能够定制 `babel`配置而感到诧异。

下面是一个 `.babelrc`文件的示例：

```json
{
  "presets": ["next/babel", "stage-0"]
}
```

### CDN 支持

你可以设定 `assetPrefix`项来配置 `CDN`源，以便能够与 `Next.js`项目的 `host`保持对应。
```js
const isProd = process.env.NODE_ENV === 'production'
module.exports = {
  // You may only need to add assetPrefix in the production.
  assetPrefix: isProd ? 'https://cdn.mydomain.com' : ''
}
```

注意：`Next.js`将会自动使用所加载脚本的 `CDN`域(作为项目的 `CDN`域)，但是对 `/static`目录下的静态文件就无能为力了。如果你想让那些静态文件也能用上`CDN`，那你就不得不要自己指定 `CDN`域，有种方法也可以让你的项目自动根据运行环境来确定 `CDN`域，可以看看[这个例子](https://github.com/zeit/next.js/tree/master/examples/with-universal-configuration)

## 项目部署

构建打包和启动项目被分成了以下两条命令：
```bash
next build
next start
```

例如，你可以像下面这样为 [`now`](https://zeit.co/now)项目配置 `package.json`文件：
```json
{
  "name": "my-app",
  "dependencies": {
    "next": "latest"
  },
  "scripts": {
    "dev": "next",
    "build": "next build",
    "start": "next start"
  }
}
```

然后就可以直接启动 `now`项目了！

`Next.js`也可以使用其他的托管方案，更多详细可以看一下这部分内容 ['Deployment'](https://github.com/zeit/next.js/wiki/Deployment)
注意：我们推荐你推送 `.next`，或者你自定义的打包输出目录(到托管方案上)(Please have a look at ['Custom Config'](https://github.com/zeit/next.js#custom-configuration)，你还可以自定义一个专门用于放置配置文件(例如 `.npmignore`或 `.gitignore`)的文件夹。否则的话，使用 `files`或者 `now.files`来选择要部署的白名单(很明显要排除掉 `.next`或你自定义的打包输出目录)

## 导出静态 HTML 页面

<p><details>
  <summary><b>Examples</b></summary>
  <ul><li><a href="./examples/with-static-export">Static export</a></li></ul>
</details></p>

你可以将你的 `Next.js`应用当成一个不依赖于 `Node.js服务的`静态应用。此静态应用支持几乎所有的 `Next.js`特性，包括 异步导航、预获取、预加载和异步导入等。

### 使用

首先，`Next.js`的开发工作没什么变化，然后创建一个 `Next.js`的配置文件 [config](#自定义配置)，就像下面这样：

```js
// next.config.js
module.exports = {
  exportPathMap: function() {
    return {
      '/': { page: '/' },
      '/about': { page: '/about' },
      '/readme.md': { page: '/readme' },
      '/p/hello-nextjs': { page: '/post', query: { title: 'hello-nextjs' } },
      '/p/learn-nextjs': { page: '/post', query: { title: 'learn-nextjs' } },
      '/p/deploy-nextjs': { page: '/post', query: { title: 'deploy-nextjs' } }
    }
  }
}
```

>需要注意的是，如果声明的路径表示的是一个文件夹的话，那么最终将会导出一份类似于 `/dir-name/index.html`的文件，如果声明的路径是一个文件的话，那么最终将会以指定的文件名导出，例如上述代码中，就会导出一个 `readme.md`的文件。如果你使用了一个不是以 `.html`结尾的文件，那么在解析此文件的时候，你需要给 `text/html`设置一个 `Content-Type`头(`header`)


通过上述的类似代码，你可以指定你想要导出的静态页面。

接着，输入以下命令：

```sh
next build
next export
```

或许，你还可以在 `package.json`文件中多添加一条命令：

```json
{
  "scripts": {
    "build": "next build && next export"
  }
}
```

现在就只需要输入这一条命令就行了：

```sh
npm run build
```

这样，你在 `out`目录下就有了一个当前应用的静态网站了。

>你也可以自定义输出目录，更多帮助可以在命令行中输入 `next export -h` 获取

现在，你就可以把输出目录(例如`/out`)部署到静态文件服务器了，需要注意的是，如果你想要部署到 `Github`上的话，那么需要需要增加一个[步骤](https://github.com/zeit/next.js/wiki/Deploying-a-Next.js-app-into-GitHub-Pages)

例如，只需要进入 `out`目录，然后输入以下命令，就可以把你的应用部署到 [ZEIT now](https://zeit.co/now)
```sh
now
```

### 局限性

当你输入 `next export`命令时，我们帮你构建了应用的 `HTML`静态版本，在此阶段，我们将会执行页面中的  `getInitialProps`函数。

所以，你只能使用 `context`对象传递给 `getInitialProps`的 `pathname`、`query`和 `asPath` 字段，而 `req` 或 `res`则是不可用的(`res`和 `res`只在服务器端可用)。

> 基于此，你也无法在我们预先构建 `HTML`文件的时候，动态的呈现 `HTML`页面，如果你真的想要这么做(指动态构建页面)的话，请使用  `next start`

## 相关技巧

- [Setting up 301 redirects](https://www.raygesualdo.com/posts/301-redirects-with-nextjs/)
- [Dealing with SSR and server only modules](https://arunoda.me/blog/ssr-and-server-only-modules)

## FAQ

<details>
  <summary>可用在生产环境使用吗?</summary>
  https://zeit.co 就是使用 `Next.js`构建的。

  无论是开发者体验还是终端表现，它都超出预期，所以我们决定将它共享到社区中。
</details>

<details>
  <summary>体积有多大?</summary>

客户端包的大小根据每个应用程序的功能等不同而不尽相同。
一个最简单的 `Next`程序包在 `gzip`压缩后可能只有 65kb 大小。

</details>

<details>
  <summary>它(指Next.js) 和 `create-react-app`是差不多的吗?</summary>

是也不是。
说是，是因为二者都让你的开发变得更轻松。
说不是，则是因为 `Next.js`强制规定了一些目录结构，以便我们能实现更多高级的操作，例如：
- 服务器端渲染(`SSR`)
- 代码自动分割

此外，`Next.js`还内置了两个对于单页应用来说比较重要的特性：
- Routing with lazy component loading: `<Link>` (by importing `next/link`)
- 修改 `<head>`元素的方法(通过导入 `next/head`)

如果你想在 `Next.js`或其他 `React`应用中复用组件，则使用  `create-react-app`是一个很好的选择，你可以稍后将其导入以保证代码库的纯净。

</details>

<details>
  <summary>如何使用嵌入式CSS(`CSS-in-JS`)方案？</summary>

`Next.js`自带的库 [styled-jsx](https://github.com/zeit/styled-jsx)支持 局部(`scoped`)`css`，当然，你也可以在 `Next`应用中添加[上面所提到的](#内联式样式-css-in-js)任何你喜欢的代码库来使用你想要的 `CSS-in-JS`解决方案。
</details>

<details>
  <summary>如何使用类似于 SASS / SCSS / LESS 之类的 CSS 预处理器？</summary>

`Next.js`自带的库 [styled-jsx](https://github.com/zeit/styled-jsx)支持 局部(`scoped`)`css`，当然，你也可以在 `Next`应用中使用以下示例中的任何一种 `CSS`预处理器方案：

- [with-external-scoped-css](https://github.com/zeit/next.js/blob/canary/examples/with-external-scoped-css)
- [with-scoped-stylesheets-and-postcss](https://github.com/zeit/next.js/blob/canary/examples/with-scoped-stylesheets-and-postcss)
- [with-global-stylesheet](https://github.com/zeit/next.js/blob/canary/examples/with-global-stylesheet)

</details>


<details>
  <summary>What syntactic features are transpiled? How do I change them?</summary>

(语法特性)我们参照 `V8`引擎，因为 `V8`广泛支持  `ES6` 和 `async` 以及 `await`，所以我们也就支持这些，因为 `V8`还不支持类装饰器(`class decorator`)，所以我们也就不支持它(类装饰器)

可以看看 [这些](https://github.com/zeit/next.js/blob/master/server/build/webpack.js#L79) 以及 [这些](https://github.com/zeit/next.js/issues/26)

</details>

<details>
  <summary>Why a new Router?</summary>

Next.js is special in that:

- Routes don’t need to be known ahead of time
- Routes are always lazy-loadable
- Top-level components can define `getInitialProps` that should _block_ the loading of the route (either when server-rendering or lazy-loading)

基于上述几个特点，我们能够构造出一个具有以下两个功能的简单路由：
- 每个顶级组件都会接收到一个 `url`对象来检查 `url` 或者 修改历史记录
- `<Link />`组件作为类似于 `<a/>`等标签元素的容器以便进行客户端的页面切换。

我们已经在一些很有意思的场景下测试了路由的灵活性，更多相信可以[看这里 nextgram](https://github.com/zeit/nextgram)
</details>

<details>
<summary>如何自定义路由?</summary>

`Next.js`[提供](#自定义服务器和路由)了一个 `request handler`，利用其我们能够让任意 `URL`与 任何组件之间产生映射关系。
在客户端，`<Link />`组件有个 `as`属性，它能够改变获取到的 `URL`
</details>

<details>
<summary>如何获取数据？</summary>

这由你决定， `getInitialProps` 是一个 异步(`async`)函数(或者也可以说是一个返回 `Promise`的标准函数)，它能够从任意位置获取数据。
</details>

<details>
  <summary>能够配合使用 `GraphQL`吗</summary>

当然，这还有个用 [Apollo](https://github.com/zeit/next.js/blob/canary/examples/with-apollo) 的例子呢。
</details>

<details>
<summary>能够配合使用 `Redux`吗？</summary>

当然，这也有个[例子](https://github.com/zeit/next.js/blob/canary/examples/with-redux)。
</details>

<details>
<summary>为什么我不能在开发服务器中访问我的静态导出路由呢？</summary>

这是一个已知的 `Next.js`架构问题，在解决方案还没内置到框架中之前，你可以先看看这一个[例子](https://github.com/zeit/next.js/wiki/Centralizing-Routing)中的解决方法来集中管理你的路由。
</details>

<details>
<summary>我可以在 Next应用中使用我喜欢的 JavaScript库或工具包吗？</summary>

我们在发布第一版的时候就已经提供了很多例子，你可以看看[这个目录](https://github.com/zeit/next.js/blob/canary/examples/)
</details>

<details>
<summary>你们是怎么做出这个框架的?</summary>

我们力求达到的目标大部分都是从 由 `Guillermo Rauch`给出的[设计富Web应用的 7个原则]中受到启发，`PHP`的易用性也是一个很棒的灵感来源，我们觉得在很多你想使用 `PHP`来输出 `HTML`页面的情况下，`Next.js`都是一个很好的替代品，不过不像 `PHP`，我们从 `ES6`的模块化系统中获得好处，每个文件都能很轻松地导入一个能够用于延迟求值或测试的组件或函数。

当我们研究 `React`的服务器端渲染时，我们并没有做出太大的改变，因为我们偶然发现了 `React`作者 `Jordan Walke`写的 [react-page](https://github.com/facebookarchive/react-page) (now deprecated)。
</details>

## Contributing

Please see our [contributing.md](./contributing.md)

## Authors

- Arunoda Susiripala ([@arunoda](https://twitter.com/arunoda)) – ▲ZEIT
- Tim Neutkens ([@timneutkens](https://github.com/timneutkens))
- Naoyuki Kanezawa ([@nkzawa](https://twitter.com/nkzawa)) – ▲ZEIT
- Tony Kovanen ([@tonykovanen](https://twitter.com/tonykovanen)) – ▲ZEIT
- Guillermo Rauch ([@rauchg](https://twitter.com/rauchg)) – ▲ZEIT
- Dan Zajdband ([@impronunciable](https://twitter.com/impronunciable)) – Knight-Mozilla / Coral Project
