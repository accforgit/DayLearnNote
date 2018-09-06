---

>记录《JavaScript高级程序设计（第3版）》这本书中，在本人看来比较 **重要** 或者 **有意思** 的知识点

---

# ECMA

## 延迟脚本

### defer

- 只适用于外部脚本，内联脚本不起作用
- 添加了 `defer`属性的脚本会立即下载，但将在整个页面都解析完毕后再执行
- 按照标准，延迟脚本的执行将按照先后顺序，并会先于 `DOMContentLoaded`事件执行，但实际的浏览器环境中，并不一定按照这个标准

### async

- 只适用于外部脚本，内联脚本不起作用
- 指定 `async`的目的是不让页面等待两个脚本下载和执行，充分利用浏览器的并行下载机制
- 添加了 `async`属性的脚本会异步并行立即下载，每个脚本在下载完毕后立即执行，无法保证脚本的执行顺序

## typeof

- 操作符
`typeof`是个操作符，和 `+ - * /`属于同一类，所以正常的写法是：
```js
typeof msg
```
也可以使用圆括号，但这并不意味着 `typeof`也是一个函数，圆括号只是用于区分 `typeof`操作符和操作对象的边界罢了。
```js
// typeof并不是一个函数
typeof(msg)
```

- 可以用于测定未定义变量

在某些情况下，如果想要测定某个变量是否定义，例如 `vue`的 `SSR`项目，在服务端不存在 `window`的概念，所以想要使用 `window`下的某些属性或方法，必须先判定当前的运行环境，如果直接判断 `if (window) {//...}`，这段代码在服务端会直接报错，因为并不存在 `window`这个变量，这个时候就可以使用 `typeof`:
```js
// 即使 window这个变量不存在，下面这句代码也能正常运行不会报错
typeof window === 'undefined' ? console.log('当前处于服务端') : console.log('当前处于浏览器端')
```

## Null类型

- `null`值标识一个 **空对象指针**，所以其 `typeof`是 `object`
- `undefined` 派生自 `null`，所以二者宽松相等
	```js
	undefined == null  // ==> true
	```

## Boolean类型

`Boolean`类型的字面值只有两个: `true`、`false`，但 `ECMS`中所有类型的值都与这两个值等价的值，以下是一种将任意值转换为 `Boolean`的方法：
```js
Boolean(msg)
```

## Number类型

- 虽然小数点前面可以没有数字，但不推荐：
```js
// 有效的写法，但不推荐(个人推测，JS引擎需要额外的分析，影响性能)
var num = .6
```

- 转换无意义的小数

由于保存浮点数值需要的内存空间是保存整数值的两倍，所以 `ECMS`会不失时机地将浮点值转换为整数值
```js
var num = 10.0
// 保存值的时候，将 10.0转换为 10,然后再赋值给 num
console.log(num)   // ==> 10
```

- 科学计数法的 `e`不区分大小写

下面两种写法效果是一样的：
```js
var num1 = 3e7
var num2 = 3E7
console.log(num1 === num2)  // ==> true
```

## toString()

`Number Boolean Object String`类型的值都有 `toString`方法(其中，`String`类型的 `toString`方法返回当前字符串的副本)，`null undefined`没有这个方法

如果不知道某个值是否是 `null`或者 `undefined`而又想对其进行 `toString`转换，则可以使用转换函数 `String`，此函数表现效果如下:
- 如果值有 `toString`方法，则调用并返回相应结果
- 如果值为 `null`，则返回 `null`
- 如果值为 `undefined`，则返回 `undefined`

## Object类型

- `constructor`

每个 `Object`实例的原型链上都具有此属性，此属性保存着用于创建当前对象的函数(某种程度上就是构造函数)
```js
function A(name) {
	this.name = name
}
const a = new A('xiaoming')

a.__proto__.constructor === A  // => true
Object.getPrototypeOf(a).constructor === A  // => true
```

- `toString`

每个 `Object`实例的原型链上都具有此属性，返回对象的字符串表示

- `valueOf`

每个 `Object`实例的原型链上都具有此属性，返回对象的字符串、数值或者布尔值表示，通常情况下与 `toString`的返回值相同

## 函数参数 arguments

非严格模式下，`arguments`的值永远与对应命名参数的值保持同步
```js
function add1(num1, num2){
	// 这个时候，无论 num2传入的值是多少，下面它的值都为 10
	arguments[1] = 10
	console.log(arguments[0] + num2)
}
add(7, 9)  // ==> 17
```

如果是严格模式(`use strict`)，则不允许重写 `arguments`，上述代码中 `arguments[1] = 10`将被忽略不起作用。

## try...catch

`catch`的代码块将创建一个作用域，而 `try`并不会
```js
try {
	var t1 = 90
} catch(e){
	var t2 = 78
}
console.log(t1)  // ==> 90
console.log(t2)  // ==> undefined
```

## sort()

`sort()`会调用每个数组项的 `toString()`方法，然后比较得到的字符串
`undefined` 和 `null`没有 `toString()`方法，会使用 `String(undefined)` 和 `String(null)`
```js
var values = [0, 1, 5, 10, 15]
values.sort()
// 会在比较之前转换成 ['0', '1', '5', '10', '15']
console.log(values)  // ==> [0, 1, 10, 15, 5]

var arr = [4, {}, [], true, null]
arr.sort()
// 会在比较之前转换成 ["4", "[object Object]", "", "true", "null"]
console.log(arr)  // ==> [[], 4, {}, null, true]
```

## Date

- `Date.parse`

转化传入的日期字符串为时间戳，如果传入的字符串不是正确的日期格式，则返回 `NaN`
```js
Date.parse('2008/08/08 12:00:00')  // ==> 1218168000000
Date.parse('Aug 8, 2008, 12:00:00')  // ==> 1218168000000
Date.parse('Aug 8 2008 12:00:00')  // ==> 1218168000000
```

- `Date.UTC`
 ```js
Date.UTC(2008, 8, 8, 12, 0, 0)  // ==> 1218168000000
```

如果不使用上述两个方法，直接给 `Date`构造函数传字符串也可以
例如，`new Date('2008/08/08 12:00:00')`，会在后台调用 `Date.parse`，然后再根据得到的值经过进一步计算返回值

- 获取当前时间的时间戳

下面三种写法都可以达到目标
```js
// 将Date实例转为数字
+new Date()
// ES5新增的方法
Date.now()
// 一般常用的方法
new Date().getTime()
```


`Date`实例还有很多平时不常用的方法，有一些是在某些时候比较有用的，知道这些方法的存在能够减少编码量

- `toDateString()` 能够显示星期几
```js
new Date().toDateString()  // ==> "Wed Aug 08 2018"
```

- `toTimeString()` 显示本地时分秒
```js
new Date().toTimeString()  // ==> "20:07:44 GMT+0800 (中国标准时间)"
```

- `getTimezoneOffset()` 返回本地时间与 `UTC`时间相差的分钟数
```js
// 表示本地时间比 UTC时间早 8个小时
new Date().getTimezoneOffset()  // ==> -480
```

## 字符串

### `concat()`

字符串也有 `concat`方法，效果与数组的 `concat()`差不多，都用于拼接
字符串的 `concat`方法，也与 `+`操作符的效果类似，一般情况下，都是使用 `+`，更加方便
```js
var s1 = 'hello '.concat('w', 'o', 'rld')
var s2 = 'hello ' + 'w' + 'o' + 'rld'
s1 === s2  // ==> true
```

### `trim()`方法

`trim()` 是 `ES5`的新增方法(`IE9+`)，用于创建并返回一个删除了前置和后缀所有空格的字符串副本（不会改变原字符串）

### 模式匹配方法 `match()`

在字符串上调用 `match`方法本质上与调用 `RegExp`的 `exec()`方法相同

### `replace()`方法

`replace()` 的第二个参数也可以是一个 **函数**，在只有一个匹配项（即与模式匹配的字符串）的情况下，会向这个函数传递 `3`个参数：模式的匹配项、模式的匹配项在字符串中的位置、原始字符串。

在正则表达式中定义了多个捕获组的情况下，传递给函数的参数分别是模式的匹配项、第一个捕获组的匹配项、第二个捕获组的匹配项...，最后两个参数仍然分别是 模式的匹配项在字符串中的位置、原始字符串。

这个函数应该返回一个字符串，表示应该被替换的匹配项。

一个匹配项：
```js
function htmlEscape(text) {
	return text.replace(/<>/g, function(match, pos, originStr) {
		switch(match) {
			case '<':
				return '&lt'
			case '>':
				return '&gt'
		}
	})
}

htmlEscape('<div></div>')  // ==> "&ltdiv&gt&lt/div&gt"
```

### `split()`

`split()`方法接受可选的第二个参数，用于指定数组的大小：
```js
var str = 'red,blue,yellow,green'
console.log(str.split(',', 2))  // ==> ["red", "blue"] 
```
上述代码中，如果你只需要保证数组的长度为 `2`，那么指定第二个参数为 `2`就可达到目标，比不指定减少了一步截取的操作，同时当数据量比较大的时候，性能也能有所提升。

### html方法

可以通过调用字符串上的一些方法直接生成 `html`字符串：
```js
var htmlStr = 'hello World'.big()
console.log(htmlStr)  // ==> "<big>hello World</big>"
```

除了 `big()`，还有 `bold  fixed fontsize`等方法，不过不建议使用这些方法，因为能够使用这种方法创建的标签字符串都是无法表达语义的那一类，例如`<big>  <small>`等，大部分都被 `html5`废弃。

## 属性的特性

一个属性包含一个名字和 `4`个特性（也称为是 `ECMA`中的数据属性），这些特性都有各自的默认值
（`configurable、enumerable、writable`默认值为 `true`, `value`的默认值为 `undefined`）想要修改它们，
必须使用 `Object.defineProperty`或者 `Object.defineProperties()`，而一旦调用了 `Object.defineProperty`或者 `Object.defineProperties()`，
如果不进行显式指定，则 `configurable  enumerable  writable`的默认值都将变为 `false`

```js
var o={}
Object.defineProperty(o,'x',{
	value:1,
	writable:true,
	enumerable:false,
	configurable:true
})

// 若对对象的多个属性进行配置，则需要使用defineProperties()
var p=Object.defineProperties({},{
	x:{value:2,writable:true,enumerable:true,configurable:true},
	y:{value:3,writable:true,enumerable:true,configurable:true},
	r:{
		get:function(){return Math.sqrt(this.x*this.y)},
		enumerable:true,
		configurable:true
	}
})
```

通过 `Object.getOwnPropertyDescriptor()`获得某个对象特定属性的描述符：
```js
Object.getOwnPropertyDescriptor({x:1},'x') // ==>{value: 1, writable: true, enumerable: true, configurable: true}
```

>__Note__: 如果显式定义了 `set`或者 `get`，则将不可再显式定义 `writable` 或者 `value`，这两对属性互斥，显式定义了其中一对的任意一个或者全部，则另外一对属性将全部不可定义，否则将报错(有的浏览器是静默忽略)。



## 对象的三个属性

每一个对象都有与之相关的原型(prototype)、类(class)、可扩展性(extensible attribute)

- 使用原型创建对象：Object.create()

```js
    var p={x:1}
    var o=Object.create(p)
    p.isPrototypeOf(o)  //==>true
    Object.prototype.isPrototypeOf(o)  //==>true
```
- 使用默认的 `toString()`方法可以查询类属性：
```js
    var s={}
    console.log(s.toString()) // ==> [object Object]
```
- `Function.call()`

因为很多对象继承的 `toString`方法重写，所以必须间接的调用 `Function.call()`方法,
下面的 `classof()` 可以返回传递给它的任意对象的类：

```js
	function classof(o){
		if(o===null) return 'Null'
		if(o===undefined) return 'Undefined'
		return Object.prototype.toString.call(o).slice(8,-1)
	}

	classof(function(){})  // ==> Function
```
- 可扩展

通过将对象传入 `Object.isExtensible()`,来判断该对象是否是可扩展的。
调用 `Object.preventExtensions()`，将对象转换为不可扩展的，此过程不可逆

`Object.seal()`与 `Object.preventExtensions()`类似，不过前者还可以将对象的所有
自有属性都设置为不可配置的。
使用 `Object.isSealed()`检测对象是否封闭。

`Object.freeze()`除了将对象设置为不可扩展和将其属性设置为不可配置之外，还可以将它只有的所有
数据属性设置为只读。
使用 `Object.isFrozen()`检测对象是否冻结。

创建一个封闭的对象，包括一个冻结的原型和一个不可枚举的属性：

```js
var o=Object.seal(Object.create(Object.freeze({x:1}),{y:{value:2,writable:false}}))
```

## 数组

创建数组时，如果省略直接量中的某个值，省略的元素将被赋予undefined值：
```js
	var count=[1,,3]
	console.log(count.length)  //==> 3
	console.log(count[1])  //==> undefined
```
数组直接量的语法允许有可选的结尾逗号，所以 `[,,].length===2`，在IE及更早版本中，或者其他浏览器中可能存在问题，所以最好不要这样写

## 数组every()  some() 

`every()`:当针对数组中所有元素的调用都为 `true`，才返回 `true`：

```js
	var a=[1,2,3,4,5]
	a.every((x)=>{return x>10})  //==>true
	a.every((x)=>{return x%2===0})  //==>false
```
`some()`:当针对数组中至少存在一个元素的调用为 `true`，就返回 `true`：
```js
	var a=[1,2,3,4,5]
	a.some((x)=>{return x%2===0})  //==>true
	a.some(isNaN)  //==>false
```

## reduce()  reduceRight() 

`reduce()`和 `reduceRight()`工作原理一样，都需要两个参数，第一个是操作的函数，
第二个可选，为函数操作初始值，`reduceRight()`是从右向左进行操作。

## 作为数组的字符串 
  字符串的行为类似于只读的数组，除了charAt()的方法访问单个字符意外，还可以使用方括号：
```js
var a='test'
a.charAt(0)  //==>'t'
a[0]  //==>'t'
```
  一些通用的数组方法也可以应用到字符串上,只不过需要间接地调用 `Function.call()`方法来模拟实现：
```js
	var s='Javascript'
	Array.prototype.join.call(s,'-')  //==>"J-a-v-a-s-c-r-i-p-t"
	Array.prototype.filter.call(s,(x)=>{
	return x.match(/[^aeiou]/)
	}).join('')                         //==>"Jvscrpt"
```

>需要注意的是，数组是可以被修改的，而字符串是不可变的值，所以字符串只能是只读的数组，类似于 `push() sort()  reserve()  splice()`等原地修改数组的方法用在字符串上是无效的，并且还不会出现错误提示。

## 实参对象arguments 

实参对象的 `callee`和 `caller`属性 在严格模式下对这两个属性进行读写都会产生类型错误， 在非严格模式下，`callee`表示当前正在执行的函数，`caller`表示当前正在执行的函数的函数

- `callee`

解决了函数的执行与函数名紧紧耦合在一起的问题。

```js
function fac(num){
	if(num<=1) {
		return 1
	} else {
		return num*arguments.callee(num-1)
	}
}
// 等同于：
function fac(num){
	if(num<=1){
		return 1
	}else{
		return num*fac(num-1)
	}
}
```

- `caller`

```js
function outer(){
		inner()
}
function inner(){
		console.log(inner.caller)
}

outer()

/*
function outer(){
	inner()
}
*/
```

## 声明提升 

- 变量声明提升：

```js
	a=1
	var a
	console.log(a)      //==>1
```
- 函数声明提升
```js
	b.count=9
	function b(){
		return b.count++
	}
		b()
```

这里需要注意的是，函数声明提升只对函数声明有效，如果写成函数表达式就会出错：

```js
	b.count=9
	var b=function{
		return b.count++
	}
    b() //==> Uncaught SyntaxError: Unexpected token
```

## call()  apply()

`ES5`严格模式下，`call()` 和 `apply()`的第一个参数都会变为 `this`的值
非严格模式下，**如果第一个参数为`null`或者`undefined`，则将被全局对象代替**

## Function()构造函数 

需要注意几点：

- 每次调用 `Function()`构造函数都会解析函数体，并创建新的函数对象，影响效率
- `Function()`创建的函数不是使用词法作用域，函数体代码的编译总是会在顶层函数执行(全局作用域)

```js
var scope='global'
function constructorFunction(){
	var scope='local'
	return new Function('return scope')
}

constructorFunction()()  //==>'global'
```
- 没有重载

```js
var num=100
function add(num){
	return num+100
}
function add(num){
	return num+200
}
```
以上两个函数实际上与下面这两行没什么区别：
```js
var num=100
var add=function(num){
	return num+100
}
add=function(num){
	return num+200
}
```

从第二个例子中可以看出，在创建第二个函数的时候，实际上覆盖了引用第一个函数的变量 `add`，
看起来也就是函数覆盖，导致后一个覆盖前一个，结果以第二个函数为准，输出 `300`

>**函数名只是指针**

- `ECMAScript`中的函数是对象，所以函数也有属性和方法

属性：
 - `length`: 表示函数定义的参数
 - `prototype`: `prototype`不可枚举，所以使用 `for...in` 无法发现。

方法：
- `apply()`
- `call()`

二者的区别仅在于接受参数的方式不同
    
## 构造函数

```js
function Person(name) {
	this.name = name
	this.getName = function() {
		return this.name
	}
}

const p = new Person('xiaoming')
p.getName()  // ==> xiaoming
// 实例对象的 constructor永远指向创建它的函数
p.constructor === Person  // ==> true
```

类似于上述构造函数的调用，一般经过一下步骤：
- 创建一个对象
- 将构造函数的作用域赋给新对象（因此 `this`就指向了这个新对象）
- 执行构造函数中的代码（为这个新对象添加属性和方法）
- 返回新对象

>任何函数，只要通过 `new`操作符来调用，那它就可以作为构造函数；任何函数，如果不通过 `new`操作符调用，那它跟普通函数就没什么区别

## constructor属性 

每个JS函数（除了`ES5`中 `Function.bind()`方法返回的函数）都自动拥有一个 `prototype`属性，这个属性的值是一个对象，
这个对象包含唯一一个不可枚举属性`constructor`，`constructor`属性的值是一个函数对象：

```js
var F=function(){}
var p=F.prototype
var c=p.constructor
c===F       //==>true，即F.prototype.constructor===F

var o=new F()
o.constructor===F       //==>true，constructor属性指代这个类
```

识别对象是否属于某个类的方法

- instanceof
	```js
	var arr1=[1,2,3]
	arr1 instanceof Array        //==>true
	```
- constructor
	```js
	var arr2=[]
	arr2.constructor===Array       //==>true
	```

这两种方法一般情况下都行得通，不过在多个执行上下文的场景中无法正常工作，比如在浏览器窗口的多个框架子页面中，因为 `Array`可能是属于不同上下文的 `Array`

## 正则表达式 

### (?=p)

零宽正向先行断言，要求接下来的字符都与 `p`匹配，但不能包括匹配 `p`的那些字符

### (?!p)

零宽负向先行断言，要求接下来的字符不与 `p`匹配


### 用于模式匹配的方法

- search()
	第一个参数是一个正则表达式，返回第一个与之匹配的子串的起始位置，如果找不到子串，则返回 `-1`
	如果第一个参数不是一个正则表达式，则首先会通过 `RegExp`构造函数将之转换为正则表达式。
	不支持全局匹配，所以会忽略掉修饰符g

- replace()
	第一个参数是一个正则表达式或者字符串，
  第二个参数是要进行替换的字符串，或者也可以是一个函数，方便动态匹配。

- match()
	唯一参数就是一个正则表达式，如果不是一个正则表达式，则首先会通过 `RegExp`构造函数将之转换为正则表达式。
	返回一个由匹配结果组成的数组（即使只检测到一个结果，也返回数组），支持修饰符 `g`。
	数组的前面一个或多个元素就是匹配的字符串，余下的元素则是正则表达式中用圆括号括起来的子表达式

- RegExp() 对象
  RegExp()对象带有两个字符串参数，第一个参数包含正则表达式的主体部分，第二个参数可选，提供修饰符(`g i m`)，同时支持三个方法和一些属性。
  一般不会直接使用此 对象创建正则，而在需要动态创建正则表达式（无法将正则表达式写死）的时候很有用，例如，如果待检索的字符串是由用户输入的。
	```js
	var pattern='k'
	var r = new RegExp(pattern)
	console.log(r.test('d312wk'))  // => true
	```

## 解构运算 

- 整个解构复制运算的返回值是右侧的 **整个数据解构**，而不是从中提取出来的某个值：
	```js
	let first, second, all
	all = [first,second] = [1, 2, 3, 4]
	// first===[1], second===[2], all===[1,2,3,4]
	```

- 解构对象
  需要注意表达式左侧部分的键值对顺序：
	```js
	let transparent={r:224,g:123,b:223,a:0.8}
	let {r:red,g:green,b:blue}=transparent
	console.log(red,green,blue)
	//224，123,223
	```

## IE与标准浏览器

### 事件转换

|标准浏览器|IE|兼容写法|
|---|---|---|
|`addEventListener`|`attachEvent`(IE8)|`window.addEventListener ? window.addEventListener : window.attachEvent`|
|`canvas`|IE所有都不支持|通过加载 `excanvas.js` 使得IE看起来可以使用 `canvas`<br>`<!--if IE><script src='excanvas.js'></script><![endif]-->`|
|`window.getSelection().toString()`|`document.selection.createRange().text`|`document.selection.createRange().text`|

### 模式检查

检查 `document.compatMode` 的值，
如果输出 `CSS1Compat`，表明是标准模式，
否则为 `BackCompa`t 或者`undefined`，则为怪异模式


### 条件注释

```html
<!--if IE 6>
    It will only be display in IE6
<![endif]-->
```

### IE的 JS解释器的条件注释

代码示例格式如下：
```js
/*@cc_on
	@if(@_jscript)
			alert('You are using IE');
	@else*/
	alert('You are not using IE');
/*@end
@*/
```

以上代码中， `JScript`是微软自己的 `Javascript`解释器的名字，所以变量 `@_jscript` 在 `IE`中总是为`true`，否则为 `false`

## delete

使用 `delete`删除一个属性就像（但不完全一样）给这个属性赋值 `undefined`，或者说在那里挖了个洞，原来的东西没了，但是位置依旧存在。
例如删除一个对象的属性，或者数组的某个值，表面上看似乎实际上看被删除的属性或者值已经不存在了，
但是实际上这个数组的长度或者对象的被删除的那个属性依旧存在，只不过它们的值都变成了`undefined`。

```js
var s=['aa','bb','cc']
delete s[1]
console.log(s)      // => ["aa", 2: "cc"]，看起来确实不存在'bb'这个值了
console.log(s.length)      // => 3 ，但是s的长度却没变
```

`delete`不可删除使用 `var`定义的全局变量，否则将会返回 `false`，可以删除直接创建的全局变量（不使用`var`），或者是使用 `this`显式声明的全局变量
```js
var t=1     //声明一个不可删除的全局变量
f=2         //创建全局对象的一个可删除的属性（注意，这种创建全局变量的方式不建议使用）
this.s=2    //创建全局对象的一个可删除的属性

delete t    // =>false ：变量并没有被删除
delete f   // =>true ：变量被删除
delete t    // =>true ：变量被删除
```

`delete`只能删除自有属性，不能删除继承属性（要删除继承属性，必须从定义这个属性的原型对象上删除）
```js
var o={x:1}
delete o.x  //=》删除x,返回true 
delete o.x  //=》尽管也返回了true，但是实际上什么也没做 
delete o.toString  //=》toString是Object.prototype上的属性，来自于原型链，尽管也返回了true，但是实际上什么也没做 ，无意义
```

## 逗号（，）运算符

逗号运算符是二元运算符，它的操作数可以是任意类型，它 **从左往右计算**,首先计算左操作数，然后计算右操作数，最后返回右操作数的值。
也就是说逗号运算符（，）总是计算两侧的表达式，但是只返回右侧的值，左侧的值将会被忽略

```js
var a = 3
// 从左到右计算，最后返回最右侧操作的结果
var s = (a+=3, a-=1, a)
console.log(s)  // => 5
```

## for...in &  for...of

`for...in` 遍历的是 `key`(键),适用于数组和对象
`for...of`遍历的是值，只适用于数组或者类数组(伪数组)
因为对象的属性是没有顺序的，所以循环输出的先后次序可能会因浏览器而异。

- 将所有的对象属性复制到一个数组中：

```js
var o={x:1,y:2,z:3}
var a=[],i=0
for(a[i++] in o);   //分号别忘了
console.log(a)      //["x", "y", "z"]
```

- 将所有的数组的值复制到另外一个数组中：
```js
var o=['a','b','c']
var a=[],i=0
for(a[i++] of o);   //分号别忘了
console.log(a)      //["a", "b", "c"]
```

## js不使用临时变量来进行两个变量值的交换

- 使用数组
```js
var x=2,y=3
x=[y,y=x][0]
console.log(x)    //3
console.log(y)    //2
```

- 按位异或(^)
```js
var x=2,y=3
x^=y
y^=x
x^=y
console.log(x)    //3
console.log(y)    //2
```

- ES6中的解构运算
```js
var x=2,y=3
[x,y]=[y,x]
console.log(x)    //3
console.log(y)    //2
```


## 标签语句

语句是可以添加标签的，标签是由语句前的标识符和冒号组成：`indenfifier:statement`

```js
here: for(var i=0;i<10;i++){
  for(var j=0;j<10;j++){
    if(j>5) break here;
  }
}
```

`break`和 `continue`是 `JS`中仅有的可以使用语句标签的语句

一般来说，在循环语句中使用 `break`和 `continue`将会终止整个循环(break)或者终止当前循环从头开始，但是这二者跳出的都是最近的循环体，
要想跳出到更远的循环体之外，标签语句将会派上用场
但是值得注意的是，尽管标签语句能够让 `break`或者 `continue`跳出比最近的循环语句更远的语句上，但标签语句是不能够让二者的控制权越过函数的边界的


## 检测属性

- 判断某个属性是否存在于某个对象中，可以使用 `in`运算符

```js
var o={x:1}
'x' in o  //=>true：x是o 的属性, 注意这里别忘了引号
'y' in o  //=>false：y不是o 的属性
'toString' in o  //=>true：o继承了Object的toString属性
```
- `in`运算符只能简单的判断属性对于对象来说是否是存在，但是无法判断属性是属于对象本身还是来自于原型链，想要做到这一点，需要用到`hasOwnProperty`这个方法
```js
var o={x:1}
o.hasOwnProperty('x')   //=>true：x是o 本身就有的属性
o.hasOwnProperty('y')   //=>false：y不是o 的属性
o.hasOwnProperty('toString')  //=>false：o继承了Object的toString属性，并不是o本身的属性
```

- `propertyIsEnumerable`是 `hasOwnProperty`的增强版，只有检测到时自有属性，并且这个属性可枚举才为`true`
```js
var o={x:1}
o.propertyIsEnumerable('x')   //=>true：x是o 本身就有的属性
o.propertyIsEnumerable('y')   //=>false：y不是o 的属性
o.propertyIsEnumerable('toString')  //=>false：o继承了Object的toString属性，并不是o本身的属性，并且不可枚举
```


## 重写原型对象

```js
function Person() {}
Person.prototype = {
  name: 'Join',
  getName: function () { return this.name }
}
```

这种重写方法等于是重写了整个 `prototype`，尽管对功能没什么改变，但是得到的实例的 `constructor`不再指向 `Person`，
而指向`Objcet`:
```js
var p1 = new Person()
console.log(p1 instanceof Object)   // => true
console.log(p1 instanceof Person)   // => true
console.log(p1.constructor === Person)   // => false
console.log(p1.constructor === Object)   // => true
```

所以需要手动引用回去：
```js
Person.prototype = {
  constructor: Person,
  name: 'Join',
  getName: function () { return this.name }
}
```

## 组合继承

也叫伪经典继承，指的是将原型链和借用构造函数的技术组合到一起
使用原型链实现对原型属性和方法的继承，通过借用构造函数来实现对实例属性的继承

```js
// 父对象
function SuperType(name) {
	this.name = name
	this.colors = ['red', 'blue']
	this.getColor = function() {
		return this.colors
	}
}
SuperType.prototype.sayName = function() {
	return this.name
}

// 子对象
function SubType(name, age) {
	// 借用构造函数方法 继承原型属性和原型方法
	SuperType.call(this, name)
	this.age = age
}
// 原型链方法 继承实例方法和属性
SubType.prototype = new SuperType()
SubType.prototype.sayAge = function() {
	return this.age
}
```

## 原型式继承

```js
function inherit(o) {
	function F(){}
	F.prototype = o
	return new F
}
```

## 寄生组合式继承

引用类型最理想的继承范式

```js
function inheritPrototype(subType, superType) {
	var p = inherit(superType.prototype)
	p.constructor = subType
	subType.prototype = p
}
// 使用
inheritPrototype(SubType, superType)
// 子对象可以有自己的实例方法
SubType.prototype.sayAge = function(){
	return this.age
}
```

## 作用域链

闭包只能取得包含函数中任何变量的最后一个值
```js
function fn1(){
	var i;
	for(i=0; i< 10;i++){
		setTimeout(function(){
			console.log(i)
		}, 1000)
	}
}

fn1()
```
上述代码将在 `2s`后输出 `10`个 `10`而不是 `从 1 到 10`
因为 `setTimeout`的第一个参数匿名函数的作用域链中都保存着 `fn1`的变量 `i`，当 `fn1`函数返回后， `i`的值为 `10`，
所以所有的 匿名函数都输出 `i`的最终值 `10`

想要达到预期输出，则可以加个闭包，本质就是多套一层作用域，延长作用域链
```js
function fn1(){
	var i;
	for(i=0; i< 10;i++){
		setTimeout(function(j){
			return function() {
				console.log(j)
			}
		}(i), 1000)
	}
}

fn1()
```

## 自定义事件

有两种方法，一种是使用 `new Event()` ，另一种是 `new CustomEvent()`

>`new Event()` 

```js
var btn = document.querySelector('.button');
var ev = new Event('test', {
    // 以下属性都是内置的
    bubbles: true,
    cancelable: true
});

btn.addEventListener('test', function(e){
    console.log(e.bubbles);         // true
    console.log(e.cancelable);      // true
    console.log(e.detail);          // undefined
}, false);  // 事件在冒泡阶段执行，默认就为false

btn.dispatchEvent(ev);
```

> `new CustomEvent()` 

```js
var btn = document.querySelector('.button');
var ev = new CustomEvent('test', {
    // 以下属性都是内置的
    bubbles: true,
    cancelable: true,
    detail:'good'
});

btn.addEventListener('test', function(e){
    console.log(e.bubbles);         // true
    console.log(e.cancelable);      // true
    console.log(e.detail);          // good
}, false);  // 事件在冒泡阶段执行，默认就为false

btn.dispatchEvent(ev);
```

> `new customEvent()` 与 `new Event()`之间的差别在于，<br>
`new customEvent()`可以在`event.detail`属性里携带自定义数据的功能(`event.detail`的值为`good`)