# 你不知道的JavaScript(上卷)
---

## 遮蔽效应

### 遮蔽效应的原理

```js
function foo(a) {
  var b = a * 2;
  function bar(c) {
    console.log(a, b, c);
  }
  bar(b * 3);
}
foo(2);
```

上述代码存在三个逐级嵌套的作用域，分别为全局作用域、foo所创建的作用域和bar所创建的作用域。
引擎执行`console.log(a, b, c);`声明，并查找`a,b,c`三个变量的引用，首先从最内部的作用域开始查找，
如果没有找到对应的变量，例如在`bar`所创建的作用域中，并没有找到`a和b`，则往外部作用域查找，
如果找到了对应的变量，例如在`bar`所创建的作用域中，可以直接找到`b`变量，

**作用域查找会在找到第一个匹配的标识符时停止**，因为即使在外部作用域再次声明了变量`b`，
JS引擎也都会选择忽略掉，这叫做 **遮蔽效应** 。

### 全局属性绕开遮蔽效应

全局变量会自动成为全局对象(比如浏览器中的 `window`对象)的属性，因此可以不直接通过全局对象的词法名称，
而是间接地通过对全局对象属性的引用来对其进行访问。

```js
window.a
```

通过这种技术可以访问那些被同名变量所遮蔽的全局变量。但非全局的变量，如果被遮蔽了，无论如何都无法被访问到。

**无论函数在哪里被调用，也无论它如何被调用，它的词法作用域都只由函数被声明时所处的位置决定。**

## 欺骗词法

指得是在程序运行时来“修改”（也可以说欺骗）词法作用域。
使用欺骗词法并不是什么好主意，并且最重要的是：**欺骗词法作用域会导致性能下降** 。
所以在程序中动态生成代码的使用场景非常罕见，因为它所带来的好处无法抵消性能上的损失。

### `eval`

`eval()`函数接收一个字符串作为参数，并将其中的内容视为好像在书写时就存在于
程序中这个位置的代码，换句话说，可以在你写的代码中用程序生成代码并运行，就好像代码是写在那个位置的一样。
在执行 `eval(..)` 之后的代码时，引擎并不“知道”或“在意”前面的代码是以动态形式插
入进来，并对词法作用域的环境进行修改的。引擎只会如往常地进行词法作用域查找。

```js
function foo(str, a) {
  eval(str);  // 欺骗
  console.log(a,b);
}
var b=2;
foo('var b=3;',1);
```

以上代码将会输出`1,3`，这是因为代码句 ` eval(str) ` 实质上就相当于是`var b = 3`，
JS引擎在寻找`a,b`变量的时候，能够在`foo`的作用域内同时找到，所以就不会再访问全局作用域中的`b`了。

在严格模式下(`use strict`)，`eval()`在运行时有其自己的作用域，意味着其中的声明无法修改所在的作用域。

```js
function foo(str) {
  'use strct';
  eval(str);
  console.log(a);   // ReferenceError: a is not defined
}
foo('var a=2;');
```

### `with`

`with` 通常被当作重复引用同一个对象的多个属性的快捷方式，可以*不需要重复引用对象本身*。
在严格模式下，`with` 被完全禁止使用。

```js
var obj={
  a:1,
  b:2,
  c:3
};
```

以上代码使用字面量方式定义了一个存在三个属性的对象，下面给这三个属性重新赋值，有两种方法：
```js
obj.a = 2;
obj.b = 3;
obj.c = 4;
```
和下面代码起到的作用其实是一样的，因为`with`改变下面代码大括号中变量的作用域：
```js
with(obj) {
  a=2;
  b=3;
  c=4;
}
```

但 `with` 的作用并不仅仅是改变作用域那么简单，有的时候，可能会导致意料之外的结果：

```js
function foo(obj) {
  with (obj) {
    a = 2;
  }
}
var o1 = {
  a: 3
};
var o2 = {
  b: 3
};

foo(o1);
console.log(o1.a); // 2
foo(o2);
console.log(o2.a); // undefined
console.log(a); // 2——不好，a 被泄漏到全局作用域上了！
```

尽管 `with` 块可以将一个对象处理为词法作用域，但是这个块内部正常的 `var`声明并不会被限制在这个块的作用域中，而是被添加到 `with` 所处的函数作用域中。

```js
var obj={
  a:1,
  b:2
}
with(obj){
  var c=3;
  var b=5;
  a:2
}
console.log( obj.a ); // 2
console.log( obj.b ); // 5
console.log( b ); // undefined
console.log( c ); // 3
```

## 立即执行函数表达式(IIFE)

```js
(function{
console.log('ok')
})();

// 上面代码其实和下面这一段，写法上第二个圆括号的位置发生了变化，
// 但在功能上是一致的，没什么区别，**选择哪个全凭个人喜好**。

(function{
console.log('ok')
}());

```

## 变量提升，函数声明优先于变量声明

```js
foo();  // 1
var foo;
function foo() {
  console.log(1);
}

foo=function() {
  console.log(2);
}
```

以上代码最终将会输出 `1` ，因为在上述的提升过程中，函数首先被提升，然后才是变量，
第二句的 `var foo` 其实已经因为重复声明，被JS引擎忽略掉了。

## `this` 隐式绑定

对象属性引用链中只有最顶层或者说最后一层会影响调用位置。

```js
function foo() {
  console.log(this.a);
}

var obj2={
  a:42,
  foo:foo
}

var obj1={
  a:2,
  obj2:obj2
}

obj1.obj2.foo();    // 42
``` 
上述代码将会输出 `42` 而不是 `2` ，这是因为在引用链上，最后一层是 `obj2` ，而 `obj2` 的 `a` 属性值就是 `42`。

## `this` 隐式绑定丢失

一个最常见的 `this` 绑定问题就是被隐式绑定的函数会丢失绑定对象，也就是说它会应用默认绑定，
从而把 `this` 绑定到全局对象或者 `undefined` 上，取决于是否是严格模式。

```js
function foo() {
  console.log(this.a);
}

var obj={
  a:2,
  foo:foo
}

var bar=obj.foo;    // 函数别名
var a='oops,global';

bar();  // 'oops,global'
```
上述代码中，虽然 `bar` 是 `obj.foo` 的一个引用，但是实际上，它引用的是 `foo` 函数本身，因此此时的
`bar()` 其实是一个不带任何修饰的函数调用，因此应用了默认绑定。

一种更微妙、更常见并且更出乎意料的情况发生在传入回调函数时：

```js
function foo() {
  console.log(this.a);
}
function doFoo(fn) {
  // fn 其实引用的是 foo
  fn(); // <-- 调用位置！
}
var obj = {
  a: 2,
  foo: foo
};
var a = "oops, global"; // a 是全局对象的属性
doFoo(obj.foo); // "oops, global"
```

`this`绑定地隐式丢失是非常常见的，一般发生在为函数引用声明一个变量作为别名，
或者将函数引用作为函数的参数传递，而且调用回调函数的函数可能会修改`this`。

## 判断 `this`

- new

函数是否在 `new` 中调用（ `new` 绑定）？如果是的话 `this` 绑定的是新创建的对象。

```js
var bar = new foo();
```

- `call` `apply`

函数是否通过 `call 、 apply` （显式绑定）或者硬绑定调用？如果是的话， `this` 绑定的是指定的对象。

```js
var bar = foo.call(obj2)
```

- 隐式绑定

函数是否在某个上下文对象中调用（隐式绑定）？如果是的话， this 绑定的是那个上下文对象。

```js
var bar = obj1.foo();
// 上述代码，foo()在全局的上下文对象中被调用，使用 bar 作为 函数别名，
// 所以this 其实就是被隐式绑定到了全局作用域上。
```

- 默认绑定

如果都不是的话，使用默认绑定。如果在严格模式下，就绑定到 `undefined`，否则绑定到全局对象。

- 箭头函数

箭头函数(`=>`)不使用以上 `this` 的四种标准规则，而是根据外层（函数或者全局）作用域来决定 `this`，（无论 `this` 绑定到什么），这其实和 `ES6` 之前代码中的 `self = this `机制一样。并且 箭头函数的绑定无法被修改。

- `this`绑定判断的例外情况

如果把 `null` 或者 `undefined` 作为 `this` 的绑定对象传入 `call apply` 或者 `bind`，这些值在调用时会被忽略，实际应用的是默认绑定规则
```js
function foo() {
  console.log(this.a);
}
var a=2;
foo.call(null);  // 2
```

需要注意的是，总是使用 `null` 或者 `undefined` 来忽略`this`的绑定可能产生一些副作用。
一种 **更安全** 的做法是传入一个特殊的对象，把 `this` 绑定到这个对象不会对你的程序产生任何副作用。
它就是一个空的非委托的对象，而在JS中，创建一个空对象的最简单方法就是`Object.create(null)`
`Object.create(null)` 和 `{}` 很像，但是并不会创建 `Object.prototype` 这个委托，所以它比 `{}` **更空**

```js
function foo(a,b) {
  console.log( "a:" + a + ", b:" + b );
}
// 我们的 DMZ 空对象
var ø = Object.create( null );
// 这里之所以使用一个空对象，其实就是为了能把数组展开成参数传入函数
foo.apply( ø, [2, 3] ); // a:2, b:3
// 使用 bind(..) 进行柯里化
var bar = foo.bind( ø, 2 );
bar( 3 ); // a:2, b:3
```

## 复制对象

考虑下面代码：
```js
var obj1={a:'aa',b:'bb'}
var obj2=obj1
obj2===obj1  // true
```

因为实质上这里`obj2`和`obj1`实质上都是引用内存中同样的一个地址，所以它们是完全相同的，`obj2`的改变，能够同时让`obj1`同时发生相同的变化，这并不是复制，因为没有产生任何副本。

- `JSON.parse`

对于一个能够被`JSON序列化`并且解析的对象来说，有一种巧妙的复制方法：
```js
var obj1={a:'aa',b:'bb'}
var obj2=JSON.parse(JSON.stringify(obj1));
obj2==obj1  // false
```
这个时候，`obj2`所指向的内存中的地址，实质上已经与`obj1`不再相同了。

- `slice`

如果是复制数组，那么可以借助`slice()`方法：
```js
var a=[1,2,3];
var b=a;
var c=a.slice();
b === a;    // true
c === a;    // false
```

- `Object.assign`

如果需要深度复制，那么可借助`ES6`中定义的`Object.assign()`方法。

## 属性描述符

### `getOwnPropertyDesciptor`

从`ES5`开始，可使用 `Object.getOwnPropertyDescriptor(obj, attr)` 来检测属性特性。
```js
var obj1={
  a:2
};

Object.getOwnPropertyDescriptor(obj1, 'a');

// 输出:
{
  value: 2,
  writable: true,
  enumerable: true,
  configurable: true
}
```
将一个对象属性的 `writable` 和 `configurable` 全部设置为 `false`，就可以创建一个真正的常量属性(不可修改、定义或删除)。

### 禁止扩展

如果你想禁止一个对象添加新属性并且保留已有属性，可以使用`Object.preventExtensions()`。

```js
var obj1={
  a:2
}

Object.preventExtensions(obj1);

obj1.b=3;
obj1.b    // undefined
```

### 密封

`Object.seal()` 方法会创建一个 **密封**对象，这个方法实际上会在一个现有对象上调用
**`Object.preventExtensions()`**，并把所有现存属性标记为 **`configurable:false`**


### 冻结

`Object.freeze()` 方法会创建一个 **冻结**对象，这个方法实际上会在一个现有对象上调用
**`Object.seal()`**，并把所有数据访问属性标记为 **`writable:false`**
**此方法是可以应用在对象上的级别最高的不可变性**


## 检测对象及其属性的存在性

- 在不访问属性值的情况下判断对象中是否存在这个属性
```js
var obj={
  a:2
}

'a' in obj    // true
'b' in obj    // false

obj.hasOwnProperty('a')  // true
obj.hasOwnProperty('b')  // false
```

- 检测对象的枚举属性

```js
var myObject = { };
Object.defineProperty(
  myObject,
  "a",
  // 让 a 像普通属性一样可以枚举
  { enumerable: true, value: 2 }
);
Object.defineProperty(
  myObject,
  "b",
  // 让 b 不可枚举
  { enumerable: false, value: 3 }
);

myObject.b; // 3
("b" in myObject); // true
myObject.hasOwnProperty("b"); // true
Object.getOwnPropertyNames(myObject); // ["a", "b"]

// 第一种检测枚举的方法
for (var k in myObject) {
  console.log(k, myObject[k]);
}
// "a" 2

// 第二种检测枚举的方法
myObject.propertyIsEnumerable("a"); // true
myObject.propertyIsEnumerable("b"); // false

// 第三种检测枚举的方法
Object.keys(myObject); // ["a"]
```
