# 一些有关 React 的知识点

## `setSate`具有确定的顺序

>来源 [React 是否保持 state 更新的顺序？](https://mp.weixin.qq.com/s?__biz=MzI0NTAyNjE0NQ==&mid=2675577690&idx=1&sn=15fab0f2843a3c01866545a20efa0962&chksm=f3da6f54c4ade64220e8f5d7a2b05f980a43e47cba48c5f44d533b48f147832f8392b415b5c0&mpshare=1&scene=23&srcid=0206ZZS6lkbMjlxelHxLeHTe#rd)

>**无论是同一个组件，还是不同的组件，`setSatte`都具有确定的顺序。**
>状态始终是按照特定的顺序更新的。无论你是否看到介于两个状态之间的一个中间状态，无论你是否在批处理内。

在 `React` 事件处理程序中(可以理解为由 `React`引发的事件处理，例如 `onClick` `onChange`)，不论 `setState()` 调用了多少次，也不论 `setState()` 被多少个组件调用，它们在事件结束时只会生成一次重新渲染，也就是在事件结束时，所有的 `setState`调用都会被合并到一起。

更新总是按照它们发生的顺序进行浅合并(`shallowly merge`)。


*但是*，截至目前，也就是 `React 16` 和更早版本中，**React 事件处理程序** 之外还没有默认的批处理

例如，下述的 `handleClick`函数中的代码，就是在 **React 事件处理程序**之内：
```jsx
<button onClick={this.handleClick}>click</button>

handleClick = () => {
  this.setState({ a: 1 }); // 不立即重新渲染
  this.setState({ b: 2 }); // 不立即重新渲染
  console.log('be clicked');
}
// 当所有的 React 事件处理程序 全部结束后，会一次性改变状态，组件重新渲染一次
```

下述的 `getData`函数中的代码，则是在 **React 事件处理程序**之外：
```js
getData() {
  promise.then(data => {
    this.setState({ a: data }); // 使用 { a: data }重新渲染一次
    this.setState({ b: 2 }); // 使用 { b: 2 }重新渲染一次
  });
}
```

`React`未来的版本(或许是从 `React 17`开始)，可能会默认支持批量更新所有的更新，在此之前，`React`也提供了一个 `API`用于强制批量处理：
```js
promise.then(() => {
  // 强制批量处理
  ReactDOM.unstable_batchedUpdates(() => {
    this.setState({ a: true }); // 不立即重新渲染
    this.setState({ b: false }); // 不立即重新渲染
  });
  // 当我们退出 unstable_batchedUpdates函数后，重新渲染一次
});
```

## 不要在 `componentWillMount`中获取数据

在 `componentWillMount`里发起`AJAX`，不管多快得到结果也赶不上首次`render`，而且 `componentWillMount`可能会被调用多次，所以类似的 `IO`操作最好放到 `componentDidMount`

## `react-router 4.x`：切换路由后，页面仍然停留在上一个页面的位置

>更多 `react-router`使用技巧可见 [React Router 4.x 开发，这些雷区我们都帮你踩过了](https://jdc.jd.com/archives/212552)

由 A 页面跳转到 B 页面，B 页面停留在 A 页面的位置，没有返回到顶部。

3.x以及早期版本中，可以使用滚动恢复的开箱即用功能，但是在 4.x中路由切换并不会回复滚动位置。

解决方法：**使用 withRouter**：
>`withRouter(MyComponent)`
>`withRouter` 可以访问历史对象的属性和最近的 `<Route`> 匹配项，当路由的属性值 `{ match, location, history }` 改变时，
>`withRouter` 都会重新渲染。该组件可以携带组件的路由信息，避免组件之间一层层传递。

所以可以利用上述特点，使用 `withRouter` 封装出一个 `ScrollToTop` 组件。
这里就用到了 `withRouter` 携带路由信息的特性，通过对比`props` 中 `location` 的变化，实现页面的滚动。

```jsx
import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
class ScrollToTop extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }
  render() {
    return this.props.children;
  }
}

export default withRouter(ScrollToTop);
```

在定义路由出引用该组件，例如：
```jsx
ReactDOM.render((
  <BrowserRouter>
    <ScrollToTop>
      <div className="container">
        <Route path={routePaths.INDEX} exact component={Index} />
        <Route path={routePaths.CARD} component={Card} />
      </div>
    </ScrollToTop>
  </BrowserRouter>
  ),
  document.getElementById('app')
);
```
