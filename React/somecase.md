## 一些有关 React 的关键知识

### `setSate`具有确定的顺序

>来源 [React 是否保持 state 更新的顺序？](https://mp.weixin.qq.com/s?__biz=MzI0NTAyNjE0NQ==&mid=2675577690&idx=1&sn=15fab0f2843a3c01866545a20efa0962&chksm=f3da6f54c4ade64220e8f5d7a2b05f980a43e47cba48c5f44d533b48f147832f8392b415b5c0&mpshare=1&scene=23&srcid=0206ZZS6lkbMjlxelHxLeHTe#rd)

>**无论是同一个组件，还是不同的组件，`setSatte`都具有确定的顺序。**
>状态始终是按照特定的顺序更新的。无论你是否看到介于两个状态之间的一个中间状态，无论你是否在批处理内。

在 `React` 事件处理程序中，不论 `setState()` 调用了多少次，也不论 `setState()` 被多少个组件调用，它们在事件结束时只会生成一次重新渲染，也就是在事件结束时，所有的 `setState`调用都会被合并到一起。

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
