>更详细的 `React 16.x`的进化步骤参见 [精读《React16 新特性》](https://zhuanlan.zhihu.com/p/52016989?utm_source=75weekly&utm_medium=75weekly)

## React 16.x新的生命周期函数和 `deprecate`掉的生命周期函数

`deprecate`掉了三个生命周期函数，都是 `render`之前的：
- `componentWillReceiveProps`
- `componentWillMount`
- `componentWillUpdate`

对应地为这三个函数增加了带有 `UNSAFE` 的替代方法， `UNSAFE_componentWillReceiveProps()`、`UNSAFE_componentWillMount()`、`UNSAFE_componentWillUpdate()`

在 `16.4`及之前的版本中可以继续使用 不带 `UNSAFE`标识的上述三个生命周期函数，但会给出警告，但是  `17`版本之后将删除，只能使用 `UNSAFE`前缀的了

### getDerivedStateFromProps

上述被 `deprecate`的函数都可以用新增的生命周期函数 `getDerivedStateFromProps`来代替实现
无论是 `Mounting`还是`Updating`，也无论是因为什么引起的 `Updating`，此函数都会被调用

`getDerivedStateFromProps`: 静态纯函数，函数体内无法访问 `this`，主要作用是用于运算而非其他类似于请求数据之类的动作
```js
static getDerivedStateFromProps(nextProps, prevState) {
  //根据nextProps和prevState计算出预期的状态改变，返回结果会被送给setState
}
```

>Note: 废弃三个生命周期函数并增加此函数的目的在于，强制开发者在 `render`之前只做无副作用的操作，而且能做的操作局限在根据 `props`和`state`决定新的 `state`

### getSnapshotBeforeUpdate

此函数会在 `render`之后执行，而执行之时 `DOM`元素还没有被更新，给了一个机会去获取 `DOM`信息，此函数的返回值 `snapshot`会作为 `componentDidUpdate`的第三个参数传入：
```js
getSnapshotBeforeUpdate(prevProps, prevState) {
  return 'foo'
}

componentDidUpdate(prevProps, prevState, snapshot) {
  console.log('#enter componentDidUpdate snapshot = ', snapshot)
}
```

>Note: 在不知道是否需要使用此生命周期 `API`的情况下，那就不要用

## Portal

>`render`到一个组件里面去，实际改变的是网页上另一处的 `DOM`结构，减少组件杂糅，避免不可预知的组件样式等之间的影响

`Dialog.jsx`组件：
```jsx
import React from 'react'
import { createPortal } from 'react-dom'

export default class Dialog extends React.Component {
  constructor(props) {
    super(props)
    const doc = window.document
    this.node = doc.createElement('div')
    doc.body.appendChild(this.node)
  }
  render() {
    return createPortal(
      <div className="dialog">
        {this.props.children}
      </div>,
      this.node
    )
  }
  componentWillUnmount() {
    document.body.removeChild(this.node)
  }
}
```

`App.jsx`引用:
```jsx
class App extends Component {
  render() {
    return (
      <div className="App">
        <Dialog>
          <p className="lp">121dwed</p>
        </Dialog>
      </div>
    )
  }
}
```
上述，尽管 `App.jsx`是在 `.App`这个元素内引用的 `Dialog`组件，但是实际上最后渲染出来的 `<Dialog />`组件的位置是在 `<body>`的下面

## `Error Boundary`

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true })
    
    // 将异常信息上报给服务器
    logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      return '出错了'
    }
    return this.props.children
  }
}
```

将此组件作为最顶级的组件，所有页面组件都作为其子组件，当任何层级的子组件发生错误时，都会被此组件接到

## Context API

>解决 `props`多级嵌套传递的问题，只要父组件 `Provider`对应的 `props`，则其下任何层级的子组件都可通过 `Consumer`获得此 `props`

```jsx
import React, { Component } from 'react'

const defaultTheme = { background: 'pink' }
const fooTheme = { background: '#58a' }

const { Provider, Consumer } = React.createContext(defaultTheme)

const Banner = () => (
  <Consumer>
    { context => <div className="banner" style={context}> world</div> }
  </Consumer>
)

const Content = () => <div className="content">hello<Banner /></div>

export default class App extends Component {
  state = { theme: defaultTheme }
  render() {
    return (
      <Provider value={this.state.theme}>
        <Content />
        <button onClick={() => {
          this.setState(state => ({
            theme: state.theme === defaultTheme ? fooTheme : defaultTheme
          }))
        }}>Click</button>
      </Provider>
    )
  }
}
```

## createRef API

除了沿用之前创建 `ref`的两种方法： `string ref` 和 `callback ref`之外，另增 `createRef`的方法
此方法创建的 `ref`，不会有使用 `string ref`方法创建的副作用，更多关于 `string ref`的副作用详见 [React ref 的前世今生](https://zhuanlan.zhihu.com/p/40462264)

```jsx
export default class CreateRefApi extends Component {
  inputRef = React.createRef()
  btnClick = () => this.inputRef.current.focus()
  render() {
    return (
      <div className="box">
        <input type="text" ref={this.inputRef} />
        <button onClick={this.btnClick}>click</button>
      </div>
    )
  }
}
```

## forwardRef API

通过 `ref`穿透组件，直接控制组件内的指定元素

```jsx
const ChildInput = React.forwardRef((props, ref) => (
  <div className="child-box">
    <input type="text" ref={ref}/>
    <p>other content</p>
  </div>
))

export default class ForwardRefApi extends React.Component {
  inputRef = React.createRef()
  btnClick = () => {
    this.inputRef.current.value = 'hello world'
  }
  render() {
    return (
      <div className="box">
        <button onClick={this.btnClick}>Click</button>
        <ChildInput ref={this.inputRef} />
      </div>
    )
  }
}
```

## Strict Mode

此组件不会渲染任何的 `visible UI`，用于对其所有子元素进行检测，只在开发环境起作用，不会对生产版本产生任何影响
检测内容如下：

- 不安全的生命周期函数
- 使用`string ref API`创建 `ref`
- 不期望的副作用
- 老式(v16.x之前)的 `Context API`

## lazy

异步操作，例如异步加载组件，异步获取数据
```js
import React, {lazy, Suspense} from 'react';
const OtherComponent = lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtherComponent />
    </Suspense>
  );
}
```

## React.memo

用于给无状态组件实现类似 `PureComponent`的浅比较功能，即浅比较 `props`是否有变化，如果没有变化，就不重新渲染当前组件

```js
const MyComponent = React.memo(function MyComponent(props) {
  /* only rerenders if props change */
})
```

## static contextType

`Context API`的一种渐进方式，功能相同，可以不用关心，一般直接使用 `Context API`即可

## static getDerivedStateFromError()

在发布 `Error Boundaries`的时候，`React`提供了一个新的生命周期方法 `componentDidCatch`，在捕获到错误的时候会触发，你可以在里面修改 `state`以显示错误提醒的 `UI`，或者将错误信息发送给服务端进行 `log`用于后期分析。但是这里有个问题，就是在捕获到错误的瞬间，`React`会在这次渲染周期中将这个组件渲染为 `null`，这就有可能导致他的父组件设置他上面的`ref`获得 `null`而导致一些问题，所以现在提供了这个方法。
这个方法跟 `getDerivedStateFromProps`类似，唯一的区别是他只有在出现错误的时候才触发，他相对于 `componentDidCatch`的优势是在当前的渲染周期中就可以修改 `state`，以在当前渲染就可以出现错误的 `UI`，而不需要一个 `null`的中间态。
而这个方法的出现，也意味着以后出现错误的时候，修改 `state`应该放在这里去做，而后续收集错误信息之类的放到 `componentDidCatch`里面


## Hooks

### useState

作用：

- 方便组件的复用
- 摒弃 `class`，摒弃 `this`， 让组件易于写成 `function`的形式，

```js
import { useState } from 'react'

function Example() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  )
}
```

`Tips`：

- 数组的结构赋值开销较大，可以考虑写成对象结构或直接赋值

```js
const [count, setCount] = useState(0)
// 改成
const _useState = useState(0)
let count = _useState[0]
let setCount = _useState[1]
```
- `useState`可以多次调用，用于构造多个 `state`，接收的值不仅限于原始类型(`string/number/boolean`)，同样包括对象和数组，需要注意的是，之前我们的 `this.setState`做的是合并状态后返回一个新状态，而 `useState`是直接替换老状态后返回新状态，最后，`react`也给我们提供了一个 [useReducer](https://react.docschina.org/docs/hooks-reference.html#usereducer) 的 `hook`，如果你更喜欢 `redux`式的状态管理方案的话

- `react`是怎么保证这组件内多个 `useState`找到它对应的 `state`呢

`react`是根据 `useState`出现的顺序来定的，所以 `react`规定我们必须把 `hooks`写在函数的最外层，不能写在 `if...else`等条件语句当中，来确保 `hooks`的执行顺序一致