# 你不知道的JavaScript(中卷)
---

## 类型和语法

### 函数不仅是对象,还可以拥有属性。

```js
function a(b, c){}
a.length    // 2
```
以上代码中，因为函数`a()`具有两个参数，所以其属性`length` 的值为`2`。

### 使用 `arguments` 对象(类数组)将函数的参数当做列表访问，即转换为数组(注意，这种方法从ES6开始已废止)。

```js
function foo() {
  var arr=Array.prototype.slice.call(arguments);
  arr.push('bam');
  console.log(arr);
}

foo('bar', 'baz');      // ["bar","baz","bam"]
```

在 `ES6` 中，可以使用 `ES6` 的内置工具函数 `Array.from()`来实现同样的功能：
```js
let arrLike={
  '0':'a',
  '1':'b',
  '2':'c',
  length:3
}
var arr = Array.from(arrLike);
arr     // ["a", "b", "c"]
arr.length    // 3
```

不过，`Array.from()` 只能将部署了 `Iterator` 接口的数据结构转为数组，
例如字符串(`string` )类型、带有 `length` 属性的类数组等，对于其他的数据结构则不起作用。

另外，`ES6` 的扩展运算符 `...` 同样具备将某些数据结构转为数组的功能：
```js
function foo() {
  var arr = [...arguments];
}
foo('a','b','c');     // ["a", "b", "c"];

// 或者用来转换 NodeList对象:
[...documents.querySelectorAll('div')]
```

这种用法同样具有局限性 ，扩展运算符背后调用的是遍历器接口(`Symbol.iterator`)，
例如函数的参数(`arguments`)对象，如果一个对象没有部署这个接口，就无法转换。

还有一种在 `ES6` 中将数值转换为数组的方法，就是 `Array.of()`:
```js
Array.of()    // []
Array.of(undefined)     // [undefined]
Array.of(1,2)     // [1,2]
```

### `ES6` 中的八进制与二进制新写法

`JavaScript` 支持二进制、八进制和十六进制的写法：
以 `0x` 或 `0X` 开头的十六进制：
```js
0xf3    // 243的十六进制
0Xf3    // 243的十六进制
```

以 数字`0`开头八进制：
```js
0363    // 243的八进制
```

在 `ES6` 中，严格模式下不在支持类似 `0363` 的八进制格式，非严格可以继续使用，
不过为了兼容性，最好避免使用。

`ES6` 支持以下新格式：
以 `0o` 或者 `0O` 开头的八进制：
```js
0o363     // 243的八进制
0O363     // 243的八进制
```

以 `0b` 或者 `0B` 开头的二进制：
```js
0b11110011     // 243的二进制
0B11110011     // 243的二进制
```

### `0.1 + 0.2` 的精度问题。

由于 `JavaScript` 遵循 `IEEE 754` 规范，所以一些数字运算，会出现无法做到完全精确的情况：
```js
0.1 + 0.2 === 0.3     // false
```
这是因为在JS中二者相加的结果其实等于 `0.30000000000000004`。

解决方案：
- 先将浮点数放大为整数，计算完成后再缩小为浮点数：
```js
0.1 * 10 + 0.2 * 10 === 0.3 * 10    // true
```
- 机器精度

设置一个误差范围值，称为及其精度
在`JavaScript`中，此时通常是`2^-52`，
在`ES6`中，该值定义在`Number.EPSTLON`, 也可以为`ES6`之前的版本写`polifill`。
```js
if(!Number.EPSTLON) {
  Number.EPSTLON = Math.pow(2, -52);
}
```

然后就可以使用`Number.EPSTLON` 来比较两个数字是否相等(在指定的误差范围内)：
```js
function numbersCloseEnoughToEqual(n1,n2) {
  return Math.abs( n1 - n2 ) < Number.EPSILON;
}

var a = 0.1 + 0.2;
var b = 0.3;

numbersCloseEnoughToEqual( a, b ); // true
numbersCloseEnoughToEqual( 0.0000001, 0.0000002 ); // false
```

### 值和引用

```js
function foo(x) {
  x.push(4);
  console.log(x);     //[1,2,3,4]

  x=[4,5,6];
  x.push(7);
  console.log(x);     //[4,5,6,7]
}

var a=[1,2,3];
foo(a);
console.log(a);     // 是[1,2,3,4]， 不是[4,5,6,7]
```

将 `a`作为参数传给 `foo`，实际上是将 `a`的一个引用传了进去，所以对这个引用的操作，同时也会作用给 `a`，
当修改参数的引用时，这个参数与 `a`不再指向同一个引用，所以不再有关联

### `JSON.stringify()` 不太为人所知但却非常有用的功能/参数。

可选参数`replacer`：可以是数组或者函数，用来指定对象序列化过程中哪些属性应该被处理，哪些应该被派出，和`toJSON()` 类似。

```js
var a = {
  b: 42,
  c: "42",
  d: [1,2,3]
};

JSON.stringify(a, ['b', 'c']);    // "{"b":42,"c":"42"}"
JSON.stringify(a, function(k, v){
  if(k !== 'c') {
    return v;
  }
});
// "{"b":42,"d":[1,2,3]}"
```

## 判断`IE`浏览器

### 判断 `document.all` 的真假

在现在标准浏览器上， `document.all` 的值为`false`，而在包括`IE10`及以下版本则为`true`。
```js
if(document.all) {
  console.log('IE10及以下的IE浏览器');
}
```

### 是否存在 `window.addEventListener` 属性

```js
if(window.addEventListener){ 
  console.log("IE9及以上或标准浏览器"); 
} else if (window.attachEvent){ 
  console.log("IE10及以上的IE浏览器"); 
} else { 
  console.log("这种情况发生在不支持DHTML的老版本浏览器（现在一般都支持）") 
}
```

## 隐式强制类型转换

### 字符串和数字之间的隐式强制类型转换

如果操作符为 `+` ，其中一个操作数是字符串(或者能够转换为字符串，例如数组和对象)的，
则进行字符串拼接；如果操作符为 `-` ，表明是减法运算，首先将两边操作数全都转换为字符串，
然后再转换为数字进行减法操作。
  
```js
var a = '42';
var b = 1;
a + b     // 421

var c = [1,2];
var d = [3,4];
c + d     // '1,23,4'

var e = [5];
var f = [3];
e - f     // 2
```

>注意类似于 `a+` 隐式转换与 `String(a)` 显式转换间的差别

```js
var a = {
  valueOf: function() { return 42; },
  toString: function() { return 4; }
};

a + ''    // 42
String(a)     // 4
```

以上两种转换的结果不同，这是因为 `a + ''`会对 `a` 调用 `valueOf` 方法，
然后通过 `ToString` 抽象操作将返回值转换为字符串。
而 `String(a)` 则是直接调用 `ToString()`。

### 宽松相等 `==` 于完全相等 `===`

- 转换效率

宽松相等 `==` 具有强制类型转换的功能，而完全相等 `===`则不具备，
所以对相同的一组数进行比较，使用这两个操作符可能会产生不同的结果。
但是，并不像想象中的那样，二者的效率几乎相同，宽松相等 `==` 因为需要强制转换类型，
所以可能要多花点时间，但这 **仅仅是在微妙级别(百万分之一秒)的差别而已**。

- 强制转换的方法

如果两个操作数中，存在一个为数字类型的，那么就把另外一个(包括字符串、布尔值)转换为数字类型(如果可以的话)，
然后返回它们的操作结果。

根据以上规则：
```js
var x=true;
var y=42;
x == y;     // false
```
因为 `y` 是数字类型，所以将 `x` 转为数字类型，也就是 `1`，所以返回 `false`。

### 安全运用隐式强制类型转换

- 如果两边的值中有 `true` 或者 `false` ，千万不要使用宽松相等 `==`
- 如果两边的值中有 `[]` 、`""` 或者 `0` ，尽量不要使用宽松相等 `==`

以上两种情况下，最好使用 `===` 来避免不经意的强制类型转换，这些原则可以避开几乎所有强制类型转换的坑。

## 函数参数

### 默认值

对 `ES6` 中的参数默认值而言，除了在极少数情况下意外，参数被省略或被赋值为 `undefined` 效果都一样，都是取该参数的默认值。

```js
function foo(a=42, b=a+1) {
  console.log(a, b);
}

foo(10)     // 10, 11
foo(10, undefined)    // 10, 11
```

### 命名参数关联

函数参数默认值会导致 `arguments` 数组和相对应的命名参数之间出现偏差：
```js
function foo(a) {
  a = 42;
  console.log(arguments[0]);
}

foo(2);     // 42(linked)
foo();    // undefined(not linked)
```

严格模式下则不会存在参数关联的说法，但无论如何，**尽量不要依赖这种关联机制**

```js
function foo(a) {
  'use 'strict';
  a = 42;
  console.log(arguments[0]);
}

foo(2);     // 2(not linked)
foo();    // undefined(not linked)
```

## `try...cantch...finally`

### 执行顺序

```js
function foo() {
  try {
    return 42;
  }
  finally {
    console.log('Hello');
  }
  
  console.log('never runs');
}

console.log(foo());
// Hello
// 42
```
上述代码中，`return 42` 先执行，并将 `foo()` 函数的返回值设置为 `42` ，
然后 `try` 执行完毕，接着执行`finally`，最后`foo()` 函数执行完毕，
`foo()` 函数中最后一句`console.log('never runs');`因为前面已经存在`return 42`返回值，所以没有机会执行。
同理，如果将`return 42;` 换成 `throw 42;`，将在输出`Hello`之后，再输出`Uncaught 42`

### `finally` 抛出异常终止

如果在 `finally` 中抛出异常，则函数就会在此终止，并且如果此前`try`中已经有`return`，设置了返回值，则该值也会被丢弃。
```js
function foo() {
  try {
    return 42;
  }
  finally {
    throw 'Oops!';
  }
  console.log('never runs');
}

console.log(foo());
// Uncaught Oops!
```

### `finally` 返回值覆盖

由于 `finally` 无论如何都会被执行，所以如果在 `finally` 中存在 `return` 返回值，
那么 `finally` 中的 `return` 会覆盖 `try` 或者 `catch` 中的 `return` 返回值。

```js
function foo() {
  try {
    return 42;
  }
  finally {
    // 没有返回语句，所以不存在覆盖问题
  }
}

function bar() {
  try {
    return 42;
  }
  finally {
    // 覆盖前面的 return 42，并且因为没有确切的返回值，
    // 所以将返回 undefined，效果和 return undefined; 是相同的。
    return;
  }
}

function baz() {
  try {
    return 42;
  }
  finally {
    // 覆盖前面的 return 42
    return 'Hello';
  }
}

foo();    // 42
bar();    // undefined
baz();    // Hello
```

## `switch` 语句

### 严格 `true`
`switch` 语句块(即双大括号)中，`case` 表达式的结果必须为严格意义上的`true`，条件才能成立， 
即，类似于 `case 'abc'  ， case {}` 都是不成立的条件。

```js
var a = 'Hello world';
var b = 10;

switch (true) {
  case (a || b===10):
    // 永远执行不到这里
    break;
  default:
    console.log('Oops');
}
```
因为 `(a || b===10)` 的结果是 `Hello world` ，尽管隐式强制类型转换为布尔值后也是 `true`，
但并非严格意义上的 `true`，所以条件不成立。
如果想让条件成立，则可以使用显式强制表达式的方法，即 `case !!((a || b===10)`。

### 执行顺序

```js
var a = 10;
switch (a) {
  case 1:
  case 2:
    // 永远执行不到这里
  default:
    console.log('default');
  case 3:
    console.log('3');
    break;
  case 4:
    console.log('4');
}
// default
// 3
```

上例中的代码是这样执行的，首先遍历并找到所有匹配的 `case`，如果没有匹配则执行 `default` 中的代码，
因为 `default` 没有 `break` 语句 ，所以继续执行已经遍历过的 `case 3` 代码块，直到 `break` 为止。
一般来说，不建议混合 `default` 与 `case` ，如果有必须使用的必要，那么请**进行详细的注释**。

## 全局`DOM`变量

由于浏览器演进的历史遗留问题，在创建带有`id` 属性的`DOM` 元素时，也会创建同名的全局变量。
```html
<div id="foo"></div>
```

```js
if(typeof foo=='undefined'){
  // 不会执行这到这里
  foo=42;
}
console.log(foo);     // HTML对象
```

上述代码中，因为在页面文档上存在一个`id='foo'`的元素，相当于是在`window`的全局环境中
添加了一个名为`foo`的全局`DOM`对象，所以`foo`的值就是对应的`HTML`元素对象。

## `<script>`

- 内联代码的 `script` 标签没有 `charset` 属性。

- 内联代码的 `script` 标签中不可以出现 `</script>` 字符串，一旦出现即被视为代码块的结束。

```js
<script>
  // 这将导致错误
  var code = "<script>alert('hello world')</script>";
</script>

// 可以修改成如下代码进行变通
<script>
  // 这样就行了
  var code = "<script>alert('hello world')</sc" + "ript>";
</script>
```
---

## 异步和性能

### `Promise`

如果向 `Promise.resolve()` 传递一个非`Promise`、非`thenable`的立即值，
就会得到一个用这个值填充的`promise`，这同样适用于 `Promise.reject()`。

```js
// 下面两种情况的结果是完全相同的
var p1 = new Promise(function(resolve, reject) {
  resolve(42);
});

var p2 = Promise.resolve(42);
```

如果向 `Promise.resolve()` 传递一个真正的`Promise`，就只会返回同一个`Promise`

```js
var p1 = Promise.resolve(42);
var p2 = Promise.resolve(p1);

p1 === p2;    // true
```

### `yield`

### 迭代消息传递

```js
function *foo(x) {
  // 注意，yield 的圆括号不能省略
  var y = x * (yield);
  return y;
}

var it = foo(6);
// 启动foo()
it.next();

var res = it.next(7);
res.value     // 42
```

以上代码，首先传入`6`作为参数，然后调用`it.next()`启动 `*foo()`,
在`*foo()` 内部，语句将会暂停在 `yield` 处，并在本质上要求调用代码为 `yield`
表达式提供一个结果值。接下来，调用 `it.next( 7 )` ，这一句把值 `7` 传回作为被暂停的
yield 表达式的结果。

>**`yield` 和 `next()` 调用存在一个不匹配，一般来说，需要的 `next()` 调用要比 `yield` 语句多一个。**

### 生成器

#### `iterable`

接口中有 `next()` 方法的对象，称为迭代器对象。

从一个 `iterable` 中提取迭代器的方法：

`iterable` 必须支持一个函数，其名称是专门的 `ES6` 符号值 `Symbol.iterable` 。
调用这个函数时，它会返回一个迭代器，通常每次调用会返回一个全新的迭代器，虽然这一点并不是必须的。
`for...of` 循环能够自动调用迭代器对象的 `Symbol.iterator` 函数，从而构建一个迭代器。

#### `[Symbol.iterator]`

`[...]` 语法被称为 计算属性名： 指定一个表达式，并用这个表达式的结果作为属性的名称。
`Symbol.iterator` 是 `ES6`预定义的特殊 `Symbol` 值之一。

```js
var a = [5,6,8];
// 调用 [Symbol.iterator]()函数，返回一个迭代器
var it = a[Symbol.iterator]();

it.next().value;    // 5
it.next().value;    // 6
it.next().value;    // 8
it.next().value;    // undefined
```

#### 停止生成器

- 自动终止
 
通常由 `break 、 return` 或者未捕获的异常，会向生成器发送一个异常结束信号 使其终止，
一般情况下，`for...of` 循环能够自动发送这个信号。

- 使用 `return(...)` 手动终止
 
```js
var it = something();
for(var v of it) {
  console.log(v);
  if(v > 500) {
    // 完成生成器的迭代器
    console.log(
      it.return('Hello World').value;
    );
  }
}

// 1 9 33 105 321 969
// Hello world
```

#### 异步迭代生成器

```js
function foo(x, y) {
  ajax(
    'http://some.url.1/?x=' + x + '&y=' + y,
    function (err, data) {
      if (err) {
        // 向 *main() 抛出一个错误
        it.throw(err);
      } else {
        // 用接收到的 data 恢复 *main()
        it.next(data);
      }
    }
  );
}

function *main() {
  try {
    var text = yield foo(11,31);
    console.log(text);
  }
  // 同步捕获异步错误。
  catch(err) {
    console.error(err);
  }
}

var it = main();
// 启动生成器
it.next();
```

#### 生成器中的 `Promise` 并发。

```js
function *foo() {
  // 两个请求是相互独立、互不干扰的，所以使用并发方式同时运行
  var results = yield Promise.all([
    request('http://some.url.1'),
    request('http://some.url.2')
  ]);

  // 这里用到了 ES6 中的结构语法
  var [r1, r2] = results;
}
```
