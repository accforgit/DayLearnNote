`JavaScript`世界中至今为止没有私有变量的概念，不过在编写程序的时候可能需要这个东西，这就需要我们自己来实现了。

_源自 [Private Variables in JavaScript](https://marcusnoble.co.uk/2018-02-04-private-variables-in-javascript/)、 [JavaScript 中的私有变量](https://github.com/xitu/gold-miner/blob/master/TODO/private-variables-in-javascript.md)_

## 命名约定

`JS`中实现私有变量惯常的方式，就是加个下划线，但这只防君子不防小人，只是从道德约束层面而非从技术上实现。

```js
// 下述变量被认为是私有变量
const _privateName = 'xiaoming'
```

## WeakMap

`WeakMap`是 `ES6`中新添加的数据结构，类似于 `Object`，能够维护一个 **键值对**，更多关于可见 [WeakMap](http://es6.ruanyifeng.com/#docs/set-map)

**这里主要是利用 `WeakMap`能够将一个 Object类型的数据作为键的特点**

>想要稍有一些限制性，您可以使用 WeakMap 来存储所有私有值。这仍然不会阻止对数据的访问，但它将私有值与用户可操作的对象分开。对于这种技术，我们将 WeakMap 的关键字设置为私有属性所属对象的实例，并且我们使用一个函数（我们称之为 internal ）来创建或返回一个对象，所有的属性将被存储在其中。这种技术的好处是在遍历属性时或者在执行 JSON.stringify 时不会展示出实例的私有属性，但它依赖于一个放在类外面的可以访问和操作的 WeakMap 变量。

```js
const map = new WeakMap()
const internal = obj => {
  if (!map.has(obj)) {
    map.set(obj, {})
  }
  return map.get(obj)
}

class Shape {
  constructor(width, height) {
    internal(this).width = width
    internal(this).height = height
  }
  get area() {
    return internal(this).width * internal(this).height
  }
}

const square = new Shape(2, 5)
console.log(square.area)  // => 10
console.log(map.get(square))  // => { height: 2, width: 5 }
```

## Symbol

主要是利用 `Symbol`不会被类似于 `for...in`、`for...of`、`Object.keys()`等方法访问到的特性

>Symbol 的实现方式与 WeakMap 十分相近。在这里，我们可以使用 Symbol 作为 key 的方式创建实例上的属性。这可以防止该属性在遍历或使用 JSON.stringify 时可见。不过这种技术需要为每个私有属性创建一个 Symbol。如果您在类外可以访问该 Symbol，那你还是可以拿到这个私有属性。

```js
const widthSymbol = Symbol('width')
const heightSymbol = Symbol('height')

class Shape {
  constructor(width, height) {
    this[widthSymbol] = width
    this[heightSymbol] = height
  }
  get area() {
    return this[widthSymbol] * this[heightSymbol]
  }
}

const square = new Shape(10, 10);
console.log(square.area);         // 100
console.log(square.widthSymbol);  // undefined
console.log(square[widthSymbol]); // 10，这种方法还是可以访问到的
```

## 闭包

>到目前为止所显示的所有技术仍然允许从类外访问私有属性，闭包为我们提供了一种解决方法。如果您愿意，可以将闭包与 WeakMap 或 Symbol 一起使用，但这种方法也可以与标准 JavaScript 对象一起使用。闭包背后的想法是将数据封装在调用时创建的函数作用域内，但是从内部返回函数的结果，从而使这一作用域无法从外部访问。

```js
function Shape() {
  // 私有变量集
  const this$ = {};

  class Shape {
    constructor(width, height) {
      this$.width = width;
      this$.height = height;
      // 手动指定 area，解决 将square.area 视为未定义的问题
      Object.defineProperty(this, 'area', {
        get: function() {
          return this$.width * this$.height;
        }
      });
    }
  }
  // 将 this 设置为 new Shape(...arguments)的原型
  // 解决 square instanceof Squrea 返回 false
  return Object.setPrototypeOf(new Shape(...arguments), this);
}
const square = new Shape(10, 10);
console.log(square.area);             // 100
console.log(square.width);            // undefined
console.log(square instanceof Shape); // true
```

## Proxy

>Proxy 是 JavaScript 中一项美妙的新功能，它将允许你有效地将对象包装在名为 Proxy 的对象中，并拦截与该对象的所有交互。我们将使用 Proxy 并遵照上面的 命名约定 来创建私有变量，但可以让这些私有变量在类外部访问受限。

>Proxy 可以拦截许多不同类型的交互，但我们要关注的是 get 和 set，Proxy 允许我们分别拦截对一个属性的读取和写入操作。创建 Proxy 时，你将提供两个参数，第一个是您打算包裹的实例，第二个是您定义的希望拦截不同方法的 “处理器” 对象。

```js
class Shape {
  constructor(width, height, otherParams) {
    this._width = width;
    this._height = height;
    this.otherParams = otherParams;
  }
  get area() {
    return this._width * this._height;
  }
}

const handler = {
  // 禁止访问带 `_`前缀的变量
  get: function(target, key) {
    if (key[0] === '_') {
      throw new Error('Attempt to access private property');
    } else if (key === 'toJSON') {
      // 禁止 JSON.stringify对私有属性的格式化
      const obj = {};
      for (const key in target) {
        if (key[0] !== '_') {
          obj[key] = target[key];
        }
      }
      return () => obj;
    }
    return target[key];
  },
  // 禁止设置带 `_`前缀的变量
  set: function(target, key, value) {
    if (key[0] === '_') {
      throw new Error('Attempt to access private property');
    }
    target[key] = value;
  },
  // 禁止 遍历私有属性，例如 for...in、Object.keys
  getOwnPropertyDescriptor(target, key) {
    const desc = Object.getOwnPropertyDescriptor(target, key);
    if (key[0] === '_') {
      desc.enumerable = false;
    }
    return desc;
  }
}

const square = new Proxy(new Shape(10, 10, 12), handler);
console.log(square.area);             // 100
console.log(square instanceof Shape); // true，没有破坏  instanceof
console.log(JSON.stringify(square));  // "{otherParams: 12}"，只能列出非私有属性
for (const key in square) {
  console.log(key);                   // otherParams, 只能列出非私有属性
}
square._width = 200;                  // 错误：试图访问私有属性
square.otherParams = 200;             // 正常设置非私有属性
```