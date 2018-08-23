>要调用 `Date`上方法的实例对象必须通过 `Date`构造出来，否则不允许调用 `Date`的方法

由于上述限制，所以想要继承 `Date`类，就无法使用经典的**寄生组合式继承法**进行继承。

- ES5实现

```js
// 需要考虑polyfill情况
Object.setPrototypeOf = Object.setPrototypeOf ||
function(obj, proto) {
  obj.__proto__ = proto;
  return obj;
};

/**
 * 用了点技巧的继承，实际上返回的是Date对象
 */
function MyDate() {
  // 下面这句话主要是为了能够拿到传入参数，换成下面两种写法也是可以的
  // new(Date.bind(([Date].concat(Array.prototype.slice.call(arguments))).join(',')))
  // new(Date.bind(Date, ...arguments))
  var dateInst = new(Function.prototype.bind.apply(Date, [Date].concat(Array.prototype.slice.call(arguments))))();

  // 更改原型指向，否则无法调用MyDate原型上的方法
  // ES6方案中，这里就是[[prototype]]这个隐式原型对象，在没有标准以前就是__proto__
  Object.setPrototypeOf(dateInst, MyDate.prototype);

  dateInst.abc = 1;

  return dateInst;
}

// 原型重新指回Date，否则根本无法算是继承
Object.setPrototypeOf(MyDate.prototype, Date.prototype);

MyDate.prototype.getTest = function getTest() {
  return this.getTime();
};

var date = new MyDate();
var date2 = new Date();

console.log(date instanceof Date);  // => true
console.log(date2 instanceof Date);  // => true
console.log(date.abc)  // => 1
console.log(date2.abc)  // => undefined
console.log(date.getTest());  // => 正常输出调用 getTime()
console.log(date2.getTest());  // => Uncaught TypeError: date2.getTest is not a function
```

- ES6实现

```js
class MyDate extends Date {
  constructor() {
    super();
    this.abc = 1;
  }
  getTest() {
    return this.getTime();
  }
}

let date = new MyDate();

// 正常输出，譬如1515638988725
console.log(date.getTest());
```

可以看到，使用 `ES6`的 `class`关键字，配合 `super`方法可以很容易实现继承，不过上述写法只限于 `ES6`，如果使用 `Babel`等工具对上述代码进行转换，同样不可行