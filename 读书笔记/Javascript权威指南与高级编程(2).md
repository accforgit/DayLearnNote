# DOM

## 访问 `NodeList` 的节点数组

方括号和 `item()`方法两种手段，一般都是使用前者

```js
someNode.childNodes[0]
someNode.childNodes.item(0)
```

## cloneNode()

此方法不会复制添加到 `DOM`节点中的 `JavaScript`属性，例如事件处理程序，只复制特性、子节点（如果明确指定了的话），其他一切都不会复制，但是某些版本的 `IE`可能也会复制事件处理程序，所以最好在复制节点之前，移除所有的事件处理程序

## classList

`HTML5`新增的 `classList`属性，具备以下方法：

- add(value)：将给定的字符串值添加到列表中，如果值已经存在，就不添加了
- contains(value)：表示列表中是否存在给定的值，返回 true/false
- remove(value)：从列表中删除给定的字符串
- toggle(value)：如果列表中存在 value，则删除；如果不存在 value，则添加

## hasFocus

文档是否获得了焦点，支持度`IE4+`
```js
var btn = document.querySelector('.btn')
btn.focus()
console.log(document.hasFocus())  // => true
```

## insertAdjacentHTML(position, htmlStr)

支持直接插入一个 `html`字符串，而不用逐步创建一个元素

第一个参数取值如下：

- beforebegin: 在当前元素之前插入一个紧邻的同辈元素
- afterbegin：在当前元素之下插入一个新的子元素或在第一个子元素之前插入新的子元素
- beforeend： 在当前元素之下插入一个新的子元素或在最后一个子元素之后再插入新的子元素
- afterend: 在当前元素之后插入一个紧邻的同辈元素

```js
element.insertAdjacentHTML('beforebegin', '<p>hello world</p>')
```

## contains & compareDocumentPosition

支持度 `IE9+`，都用于比较元素间的相互关系

`contains`用于检测某节点是否是另外一个节点的后代，返回 `true/false`
```js
parentElement.contains(childElement)
```

`compareDocumentPosition`可确定节点间如下关系：

|掩码|节点关系|
|-|-|
|1|无关（给定的节点不在当前文档中）|
|2|居前（给定的节点在DOM树中的位置位于参考节点之前）|
|4|居后（给定的节点在DOM树中的位置位于参考节点之后）|
|8|包含（给定的节点是参考节点的祖先）|
|16|包含（给定的节点是参考节点的后代）|

```js
// 结果 20 表示：居后(4) + 被包含(16)
document.documentELement.compareDocumentPosition(document.body) // => 20
```

## isSameNode && isEqualNode

都用于比较两个节点是否相同

`isEqualNode`，满足下述条件则返回 `true`:

- 相同的节点类型
- 相同的节点名、节点值、本地名、命名空间URI和前缀
- 相同的子节点
- 相同的属性和属性值（属性可以没有相同的排序方式）

`isSameNode`，必须是同一个节点才返回 `true`，`DOM 4`中被废弃，比较是否是同一个元素只需要使用等于表达式即可 `===`

## 操作内联 style

- `cssText`: 元素 style的值
  ```js
  var box1Style = document.querySelector('.box1').style
  console.log(box1.cssText) // => "font-size: 20px; padding: 0px 10px"
  ```
- `length`: 元素的 `css`属性的数量，包括内联 `style`，外联等任何形式的样式设置
  ```js
  box1Style.length
  ```
- `parentRule`: `CSS` 信息的 `CSSRule`对象
- `getPropertyCSSValue(propertyName)`: 返回包含给定属性值的 `CSSRule`对象
- `getPropertyPriority(propertyName)`: 如果给定的属性使用了 `!important`设置，则返回 `!important`，否则返回空字符串
- `getPropertyValue(propertyName)`: 返回给定属性的字符串值
  ```js
  box1Style.getPropertyValue('font-size') // => "20px"
  ```
- `item(index)`: 返回给定位置的 CSS属性的名称
- `removeProperty(propertyName)`: 从样式中删除给定的属性，只能删除内联样式，如果属性本来就是不存在则静默失败
- `setProperty(propertyName, value, prioryty)`: 将给定属性设置为相应的值，并加上优先权标志（`!important` 或者 空字符串）