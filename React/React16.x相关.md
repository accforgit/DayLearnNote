## React 16.x新的生命周期函数和 `deprecate`掉的生命周期函数

`deprecate`掉了三个生命周期函数，都是 `render`之前的：
- `componentWillReceiveProps`
- `componentWillMount`
- `componentWillUpdate`

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
此方法创建的 `ref`，不会有使用 `string ref`方法创建的副作用

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

此组件不会渲染任何的 `bisible UI`，用于对其所有子元素进行检测，只在开发环境起作用，不会对生产版本产生任何影响
检测内容如下：

- 不安全的生命周期函数
- 使用`string ref API`创建 `ref`
- 不期望的副作用
- 老式(v16.x之前)的 `Context API`