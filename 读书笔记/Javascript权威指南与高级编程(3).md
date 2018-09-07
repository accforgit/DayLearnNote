## `<script>` 元素

### 主要属性

使用 `<script>` 标签，是向HTML元素中插入Javascript的主要方法，其存在6种属性：

- async

可选，表示应该立即下载脚本，但不应妨碍页面中的其他操作，比如下载其他资源或等待加载其他脚本，只对外部脚本文件有效，使用了此属性的脚本，并不能保证能按照浏览器指定的先后顺序执行，

- charset

可选，表示通过src属性指定的代码的字符集，例如charset='utf8', 由于大多数浏览器会忽略这个属性的值，所以很少使用。

- defer

可选，表示脚本可以延迟到文档完全被解析和显示之后再执行，也就是下载是即时的，但脚本的执行则必须等到整个页面都解析之后才可似乎。
需要注意的是，因为无论是否包含此属性，浏览器对于脚本的解析都是按照出现顺序执行，
所以每页文档页面中最好只包含一个包含defer属性的脚本。
此属性只对外部脚本有效，所以如果是想要延迟加载嵌入脚本，将其放在文档最后才是最佳选择(IE7以及之前版本也支持嵌入脚本)。

- language

已经废弃，没必要继续使用。

- src

可选，表示包含要执行代码的外部文件。

- type

可选，可以看成是language的替代属性，其中 text/javascript 以及 text/ecmascript 都已经不被推荐使用，不过考虑到兼容性，text/javascript 依旧可以使用，并且是作为默认值，也就是说并不需要显式指定。

### 转译

要想在`<script>`标签中，再添加`</script>`字符串的时候，此字符串会被当做是标签的结束，所以必须转义，也就是说写成`<\/script>`

### 解析

如果`<script>`标签属性中不包含`defer`和`async`属性，则浏览器将按照`<script>`标签在页面中出现的先后顺序对它们依次解析。

### `<noscript>`标签

对于那些不支持或者禁用了`<script>`标签的浏览器，将会显示出`<noscript>`中的内容，
此标签不会对那些执行`<script>`的浏览器产生任何影响。

## 基本语法

- 区分大小写
    这也就意味着，虽然不能使用类似 `typeof` 的关键字作为标识符或者函数名，但 `typeOf` 却是完全有效的，
    同样的， `True` 和` False` 也只能代表标识符或者函数名等，而不是 `Boolean`类型的值。
- 标识符推荐使用驼峰写法。
- 每条语句推荐使用分号结尾，虽然不是强制的，但多加一个分号可以避免许多潜在的错误，
    同时省去了解释器推测应该在哪里插入分号的过程，提高性能。
- 在函数中定义的变量，在函数退出后即被销毁，所以在函数外部是无法访问内部定义的变量的，也称为局部作用域。


## 数值类型

### Null 类型

- 从逻辑角度看，Null值表示一个 空指针对象，所以使用 typeof 检测类型的时候，会返回'object'
- 如果定义的变量准备在将来用于保存对象，那么最好将该变量初始化为null,
    这样做不能刻意体现null作为空指针对象的惯例，同时也有助于进一步区分null和undefined。

### Number 类型

- 最基本的数值字面量是十进制，但整数同样可以通过八进制(以数字0开头)和十六进制(以0x开头)

其中，八进制字面量在严格模式下无效，将会抛出异常。
无论是八进制还是十六进制，在进行算法运算时，最后都将转换成十进制：
```js
var num1=070,num2=0x1f
console.log(num1,num2)
//==>56,31
```
   - 由于保存浮点数的内存空间是保存整数的两倍，所以ECMA会不失时机的将浮点值转换为整数值
```js
var floatnum1=1.
var floatnum2=10.0
console.log(floatnum1,floatnum2)
//==>1,10
```
- 浮点数值小数点的前面可以没有整数，但并不推荐这种写法
```js
var floatnum1=.1
console.log(floatnum1)  //==>输出0.1,结果有效但不推荐。
```

- ECMAScript 能够表示的最小数值保存在 `Number.MIN_VALUE` 中，最大数值保存在 `Number.MAX_VALUE` 中，

如果小于最小值或者超出最大值，将会被转换成 `-Infinity`或者 `Infinity`，而这两个值是无法参与计算的。
使用 `isFinite()` 方法判断值是否存在于二者之间。

- parseInt() 转换数值，将会忽略字符串前面的空格，找到第一个非空格字符，如果第一个字符不是数字字符或者负号，则返回NAN，

如果第一个字符是数字字符或者负号，则继续往下解析，直到解析完后续所有数字字符或者遇到了一个非数字字符
```js
parseInt(1234blue)  //==>1234,因为 b 不是数字字符，所以解析到这里就停止解析
parseInt(22.7)      //==>22，因为小数点不是数字字符，所以解析到这里就停止解析
```
同时 parseInt()也能解析八进制和十六进制，解析的结果都将是以十进制呈现
不过在ES5中，此函数已经不具有自动解析八进制和十六进制的能力，但可以显式指定基数: parseInt(0xA,8)

- `parseFloat()` 与 `parseInt()` 类似，不过前者只解析10进制，没有第二个参数。

- `valueOf` `toString`

当对非数值类型进行操作时，先将非数值类型进行转换，首先调用valueOf()方法，如果存在valueOf()方法，再检查valueOf()方法中是否返回值，如果存在对应值，则直接返回，否则不存在则直接返回NAN；如果不存在valueOf()方法，继续调用toString()方法，如果toString()方法存在对应值，则直接返回，否则则直接返回NAN；如果这两个方法都不存在，则最终返回NAN，这种转换规则同样适应于一元运算符`（+  - *  / ）`

```js
var s
Number(s)
var o={
    valueOf: function(){
        return 5
    }
}
Number(o)   //=>5

var o={
    toString: function(){
        return 9
    }
}
Number(o)   //=>9
```

### String 类型

- `toString` 参数

数值、布尔值、对象和字符串都有toString()方法，此方法有一个可选参数，用以指定输出数值的参数：

```js
var num1=10
console.log(num1.toString(2))
//==>1010
```

- `Object` 类型

1) 不给构造函数传递参数是，可以省略后面的圆括号，但并不推荐：
`var o=new Object` 等同于 `var o=new Object()`

2) 在使用对象字面量创建对象时，属性名可以使用字符串和数字：
```js
var person={
    name:'Nikey',
    'age':18,
    5:'this is number 5'
}
```

需要注意的是，使用数字作为属性名，会被自动转换为字符串，只能使用方括号访问值：
```js
person.5     //==>报错，Uncaught SyntaxError: Unexpected number
person.'5'   //==>报错，Uncaught SyntaxError: Unexpected string
person[5]    //==>'this is number 5'
```

## 位操作符

>在大多数语言中（比如Java、C#），位运算的速度接近于硬件处理速度非常快。
>但是JavaScript没有整数类型，只有双精度的浮点数，所以在JavaScript中，位操作符将它们的数字先转换成整数，接着执行运算，然后再转换回去，导致速度没有变快反而变得更慢，JavaScript很少用来执行位操作。
>---《JavaScript语言精粹》

- 按位非 `~`
    将数值转换为二进制，对应位上的 1 变为 0 , 0 变为 1，然后结果再转为十进制
- 按位与 `&`
    将数值转换为二进制，只有当两个数值对应二进制位上的值都为 1 时才返回 1，否则返回 0，然后结果再转为十进制
- 按位或 `|`
    将数值转换为二进制，只要当两个数值对应二进制位上的值都为 0 时才返回 0，其他情况都返回 1 ，然后结果再转为十进制
- 按位或 `^`
    将数值转换为二进制，只要当两个数值对应二进制位上的值有且只有一个为 1 时才返回 1，其他情况都返回 0 ，然后结果再转为十进制

- 左移 `<<`
    `num1 << bit`
    相当于是把num1乘以2的bit次幂
    例如： `6 << 3`  相当于 `6*(2*2*2)  ==>48`
- 有符号右移`<<` 和 无符号右移`<<<`
    分为 有符号右移 和 无符号右移
    `num1 >> bit`
    其中对于正数来说，有符号右移 和 无符号右移结果相同，都是相当于是把num1除以2的bit次幂
    例如： `48 >> 3 ` 相当于 `48/(2*2*2)  ==>6`

    如果是负数右移，则规则与此不同，一般来说，负数右移后的值将会变得比较大
     

## 语句

- for

ECMAScript中不存在块级作用域，所以在循环内部定义的变量，可以在外部访问：
```js
for(var i=0;i<10;i++){
    console.log(i)
}
console.log(i)      //==>10
```

- with

`with` 语句的作用是将代码的作用域设置到一个特定的对象中，语法如下：
```js
with (expression) statement
```
定义 `with`语句的目的主要是为了简化多次编写同一个对象的工作：
```js
var qs=locaition.search.substring(1)
var hostName=locaition.hostname
var url=locaition.url
```
等同于：
```js
with(locaition){
    var qs=search.substring(1)
    var hostName=hostname
    var url=url
}
```
在ES5非严格模式下，with语句需要Javascript解释器进行大量的分析预测，所以将会导致性能下降，
而在ES5严格模式下，则不允许使用with语句，否则将视为语法错误。

## 垃圾收集

- 标记清除

- 引用计数

引用计数如果出现循环引用，那么对应的变量将会永远不会被回收，
为了避免类似的循环引用，最好在不使用它们的时候手工断开连接：

```js
var element=document.getElementById('some_element')
var myObject=new Object()
myObject.element=element
element.someObject=myObject
//这里出现了循环引用，使用完毕之后，最好像下面这样手工断开连接：
myObject.element=null
element.someObject=null
```

- 管理内存

确保占用最少的内存可以让页面获得更好的性能，而优化内存占用的最佳方式，
就是为执行的代码只保存必要的数据，一旦数据不再有用，最好通过将其值设置为null来释放引用，
这种做法叫做 解除引用：

```js
function Person(name){
    var localPerson=new Object()
    localPerson.name=name
    return localPerson
}

var globalPerson=Person('Nikey')

//手工解除全局变量globalPerson的引用
globalPerson=null
```

## Date() 类型

创建日期对象：`var now=new Date()`
如果不传入参数则自动获得当前日期和时间，如果想要传入指定的日期和时间，必须传入表示该日期的毫秒数（即从`1970/1/1 00:00:00`）
为了简化这一计算过程, `ECMAScript`提供了两个方法：`Date.parse()  Date.UTC()`

```js
//Date.parse()参数的写法有数种，这里只是其中一种
var date1=new Date(Date.parse('2016/11/24 16:38:06'))  //==>Thu Nov 24 2016 16:38:06 GMT+0800 (中国标准时间)
var date2=new Date(Date.UTC(2016,10,24,15,38,06,000))  //==>Thu Nov 24 2016 23:38:06 GMT+0800 (中国标准时间)
```

实际上，如果直接将指定的日子字符串传入Date构造函数，也会自动在后台调用 `Date.parse()`或者 `Date.UTC()`,
也就是说无需显式指定，解释器会根据传入参数的格式，自动解析时间信息，以下等同于上面的两行代码：

```js
var date1=new Date('2016/11/24 16:38:66')
var date2=new Date(2016,10,24,15,42,06,500)
```

要想获取毫秒数，则使用 `Date.now()`

```js
var date3=Date.now()  //==>  1479977416328
```

或者使用+操作符将Date对象转换成字符串：

```js
var date4=+new Date()  //==>  1479977416328
```

## 3种特殊的引用类型

### `String`

`String` 对象是 `String` 原始类型的对象表示法，它是以下方式创建的：
```js
var oStringObject = new String("hello world");
```

`String` 对象的` valueOf()` 方法和 `toString()` 方法都会返回` String `类型的原始值：
```js
alert(oStringObject.valueOf() == oStringObject.toString());	//输出 "true"
```

```js
var s1='some text'
var s2=s1.substring(2)
```
上面两行代码中，变量s1是一个字符串，属于基本类型值，从逻辑上看不应该具有方法(`substring`)
而以上代码完美运行，是因为其实后台已经执行了以下操作：

- 创建String类型的一个实例
- 在实例上调用指定的方法
- 销毁这个实例

可以将这三个步骤看成是在后台执行了下列代码：

```js
var s1=new String('some text')
var s2=s1.substring(2)
s1=null
```

以下代码：
```js
var s1='some text'
s1.color='red'
console.log(s1.color)  //==>undefined
```

以上报错原因，同样是因为后台进行的那三个步骤，在执行第二行代码之前，就已经销毁了实例，
第二行相当于是自己又在后台重新创建了一个String对象，而该对象是没有color属性的。

主要方法（包括但不限于以下几种）：
- charAt()方法
    以单字符字符串的形式返回指定位置的那个字符
- charCodeAt()方法
    以单字符字符串的形式返回指定位置的那个字符的编码
- split()
    存在两个参数，第一个参数代表分隔符，可以是字符串，也可以是正则表达式，
    第二个参数可选，指定了最终得到的数组大小
    ```js
    var colorText='red,blue,green,yellow'
    var color1=colorText.split(',')     // ==> ['red','blue','green','yellow']
    var color2=colorText.split(',',2)     // ==> ['red','blue']
    var color3=colorText.split(/[^\,]+/)     // ==> ['',',',',',',','']
    ```
- localeCompare()
    用于比较两个字符串，如果字符串在字母表中的排序在字符串参数之前，则返回负数(大多数情况下是-1,但也不一定)，
    如果相等，则返回0，如果在之后，则返回正数(大多数情况下是1,但也不一定)
    ```js
    var str='yellow'
    console.log(str.localeCompare('brick'))  //==>1
    console.log(str.localeCompare('yellow'))  //==>0
    console.log(str.localeCompare('zoo'))  //==>-1
    ```
- fromCharCode()

    接收一或多个字符串编码，然后将其转换成一个字符串，从本质上来，与charCodeAt()执行的是相反的操作。
    `String.fromCharCode(104,101,108,111)  //==>'hello'`

- Boolean 对象
    Boolean 对象是 Boolean 原始类型的引用类型。
    Boolean 对象在 ECMAScript中的用处不太大，并且容易造成误解，所以不推荐使用。

    以下两段代码：
    ```js
    var ob=new Boolean(false)
    var result=ob && true
    console.log(result)    //==>true

    var ob=false
    var result=ob && true
    console.log(result)    //==>false
    ```
    两段看似相同的代码，却产生了不同的结果，
    原因在于第一段代码实际上是对ob 本身而不是其值false进行求值，而 ob本身是Object类型，
    所以代表true。

- Number 对象
    Number 对象是 Number 原始类型的引用类型

    1) toFixed() 方法
        返回的是具有指定位数小数的数字的字符串表示，参数表示应该显示的小数位数，支持四舍五入。
            var oNumberObject = new Number(68);
            alert(oNumberObject.toFixed(2));  //输出 "68.00"
    2) toExponential() 方法
        返回的是用科学计数法表示的数字的字符串形式，参数表示应该显示的小数位数，支持四舍五入。
            var oNumberObject = new Number(68);
            alert(oNumberObject.toExponential(1));  //输出 "6.8e+1"，即 6.8*(10^1)
    3) toPrecision() 方法
        toPrecision() 方法根据最有意义的形式来返回数字的预定形式或指数形式，
        它有一个参数，即用于表示数的数字总数（不包括指数），支持四舍五入，
        在不清楚要用上面两种形式中（预定形式或指数形式）的哪一种的时候，可以用 toPrecision() 方法。


## URI编码

- encodeURI()
    作用于整个URI
- encodeURIComponent()
    作用于URI中的某一段
二者区别在于，encodeURI() 不会对本身属性URI的特殊字符进行编码，例如冒号、正斜杠、问号和井号
而encodeURIComponent()则会对它发现的任何非标准字符进行编码。

```js
var uri='https://www.google.com.hk/?  gws_rd=ssl'
console.log(encodeURI(uri))           //==>https://www.google.com.hk/?%20%20gws_rd=ssl
console.log(encodeURIComponent(uri))  //==>https%3A%2F%2Fwww.google.com.hk%2F%3F%20%20gws_rd%3Dssl
```
- decodeURI()
    对应 encodeURI(),同时也只能对encodeURI()替换的字符进行解码
- decodeURIComponent()
    对应 encodeURIComponent()


## 模仿块级作用域

用作块级作用域（或称为私有作用域）的匿名函数语法如下：
```js
(function(){
    //这里是块级作用域
})()
```
必须使用括号将匿名函数包裹，否则 Javascript解释器将会把function关键字当做一个函数声明的开始，
而函数声明后面是不能跟上一个圆括号的，只有函数表达式才能跟圆括号，要将函数声明转成函数表达式，就是使用圆括号将函数声明括起来：
```js
function(){
    // ...
}()
//==>没有使用圆括号，将会报错！
```

# BOM

## 全局作用域

- 全局变量不能通过delete操作符删除，而直接在window对象上定义的属性则可以：
    ```js
    var age=29
    window.color='red'

    delete window.age  //==>在IE<9 时抛出错误，其他浏览器返回false
    delete window.color  //==>在IE<9 时抛出错误，其他浏览器返回true

    console.log(window.age)  //==>29
    console.log(window.color)  //==>undefined
    ```
- 尝试访问未声明的变量会抛出错误，但是通过查询window对象，可以知道某个可能未声明的变量是否存在：
    ```js
    var newValue1=oldValue   //==>抛出错误，因为oldValue未定义
    var newValue2=oldValue   //==>不会抛出错误，因为这是一次属性查询，newValue2的值为 undefined
    ```

## locaition 对象

- 打开新窗口（新链接）

```js
location.assign('https://www.google.com.hk/')
window.location('https://www.google.com.hk/')
location.href('https://www.google.com.hk/')
```
以上三种方法产生的效果完全一样，其中后两种方法，实质上就是调用了第一种的   `assign()`方法

除此之外，修改 `location`对象的其他属性也可以改变当前加载的页面

假设初始值为 `http://www.wrox.com/WileyCDA/` ，以下几项都是单独对此进行操作：
```js
locaition.hash='#section1' //==>地址变为 http://www.wrox.com/WileyCDA/#selection1
locaition.search='?q=javascript' //==>地址变为 http://www.wrox.com/WileyCDA/?q=javascript
locaition.hostname='https://www.google.com.hk' //==>地址变为 https://www.google.com.hk
locaition.pathname='mydir' //==>地址变为 http://www.wrox.com/mydir
locaition.port='8080' //==>地址变为 http://www.wrox.com:8080/WileyCDA/
```
以上几种方式修改URL之后，浏览器的历史记录中都会生成一条新记录，用户可以点击‘后退’按钮返回，
想要禁用这种行为，使用 `replace()` 方法：
```js
locaition.replace('https://www.google.com')  //==>地址变为 https://www.google.com/ 但浏览器历史记录中不会上一个地址
```

- 重新加载 `reload()`

得到的结果可能来自服务器，也可能来自浏览器缓存。
想要禁用缓存，强制数据来自服务器，需要传递参数 : `local.reload(true)`

# DOM

## 特殊集合

访问文档常用的部分提供的快捷方式：

- document.anchors : 包含文档中所有带name属性的 `<a>` 元素
- document.applets : 包含文档中所有的 `<applet>` 元素，已经过时了，不建议使用
- document.forms : 包含文档中所有的 `<from>` 元素，相当于 document.getElementsByTagName('form')
- document.images : 包含文档中所有的 `<img>` 元素，相当于 document.getElementsByTagName('img')
- document.links : 包含文档中所有带href属性的 `<a>` 元素

## DocumentFragment 类型

文档片段(document fragment) 是一种轻量级文档，可以包含以及控制节点，但不会像完整的文档那样占用额外的资源。
虽然不能把文档片段直接添加到文档中，但可以将它作为一个“仓库”来使用，在里面暂时保存将来可能会添加 到文档中的节点。
```js
var fragment=document.createDocumentFragment()
var ul=document.getElementById('myList')
var li=null

for(var i=0;i<10;i++){
li=document.createElement('li')
li.appendChild(document.createTextNode('Item '+(i+1)))
fragment.appendChild(li)
}

ul.appendChild(fragment)
```
通过 fragment 插入多个 `li` 标签，避免了浏览器的反复渲染与呈现，提高性能与表现力。

## 选择符 API

- querySelector()
    返回第一个匹配元素，如果没有找到则返回null
- querySelectorAll()
    返回所有匹配元素的一个NodeList集合，如果没有找到则返回空
- matchesSelector()
    接受一个参数，即CSS选择符，如果调用元素与该选择符匹配，返回true，否则返回false
    ```js
    if(document.body.matchesSelector('body.page1')){
        //true
    }
    ```
    解决兼容性：
    ```js
    function matchesSelector(element,selector){
        if(element.matches){
            return element.matches(selector);
        } else if(element.matchesSelector){
            return element.matchesSelector(selector);
        } else if(element.webkitMatchesSelector){
            return element.webkitMatchesSelector(selector);
        } else if(element.msMatchesSelector){
            return element.msMatchesSelector(selector);
        } else if(element.mozMatchesSelector){
            return element.mozMatchesSelector(selector);
        } else if(element.oMatchesSelector){
            return element.oMatchesSelector(selector);
        } else if(element.querySelectorAll){
            var matches = (element.document || element.ownerDocument).querySelectorAll(selector),
                i = 0;
    
            while(matches[i] && matches[i] !== element) i++;
            return matches[i] ? true: false;
        }
        throw new Error('Your browser version is too old,please upgrade your browser');
    }
    ```

## 属性扩充

- classList 属性
    方便增删改查某个元素的class属性

存在如下方法：

1) add(className) :将给定的字符串值添加到列表中，如果已经存在，则不添加。
    div.classList.add('fade')
2) contains(className) :表示列表中是否存在给定的值，如果存在返回true，否则返回false。
    div.classList.contains('current')
3) remove(className) :从列表中移除给定的字符串。
    div.classList.remove('user')
4) toggle(className) :如果列表中已经存在给定的值，则删除它，否则添加它。
    div.classList.remove('bd')

- focus焦点管理

1) 通过 activeElement 属性查询获得焦点的元素
```js
var button=document.getElementById('myButton')
button.focus();
console.log(document.activeElement===button)    //==> true
```
2) hasFocus 确定元素是否获得焦点
```js
var button=document.getElementById('myButton')
button.focus();
console.log(button.hasFocus())    //==> true
```
此属性支持度较低，建议不用

## 字符集属性

- charset:获得文档中实际使用的字符集,具备读取与重置功能：
```js
document.charset    //==>utf-8
document.charset='utf-16'
document.charset    //==>utf-16
```
- 自定义属性：dataset


## 插入标记

```
    (1) innerHTML
        具备读取与重置功能，相对于一步步创建DOM节点来说，速度更快、更简单。
        但是如果是想要使用此属性插入JS脚本，需要注意一下两点：
            I. 必须为`<script>`标签指定 defer 属性
            II. `<script>`标签必须位于有作用域的元素之后
        所以想要插入脚本，一共有三种方法，下面是大多数情况下首选方式，
        使用了一个带有隐藏属性、未闭合的`<input>`：
            div.innerHTML="<input type='hidden'><script defer>alert('ok')<\/script>"
        
        大多数浏览器支持以直观的方式插入<style>不过对于IE8及更早的浏览器，需要这么做：
        div.innerHTML="_<style type='text/css'><\/script>"

        支持度：<html> <head> <table>等元素不支持此属性

    (2) outHTML
        作用是整个替换调用的元素
    (3) insertAdjaceHTML
        接收两个属性：插入的位置、要插入的HTML文本
```

## 7. scrollIntoView()
```
页面滚动，接收一个布尔参数，如果为true或者不传，则让调用元素的顶部尽可能与视口顶部对齐，
如果传入false，则让调用元素的顶部尽可能全部出现在视口中：
    document.getElementById('s').scrollIntoView(true)
对于scrollIntoView()的扩展，所有元素皆可用：
    (1) scrollIntoViewIfNeeded(boolean):safari&chrome
    (1) scrollByLines(lineCount):safari&chrome
    (1) scrollByPages(pageCount):safari&chrome
```

## 8. 专有扩展
```
(1) children 属性
    获取元素中所包含的子元素的结果集
(2) contains 方法(IE9+)
    检测节点间的包含关系（某个节点是不是另一个节点的后代节点）
    document.body.contains(document.getElementById('sss'))
(3) compareDocumentPosition() 方法 (IE9+)
    相比于contains,能够获得节点更多的位置关系：无关、居前、居后、包含、被包含
(4) 插入文本
    1)innerText
        具备读取与重置功能，相对于一步步创建DOM节点来说，速度更快、更简单。
        但是如果是想要使用此属性插入JS脚本，需要注意一下两点：
           
        支持度：<html> <head> <table>等元素不支持此属性

    2) outText
        用来读取，则功能与innerText结果完全一样，
        用来写入，则替换整个元素，包括子节点
```

---

## 1. DOM2 & DOM3
```
(1) DOM样式属性和方法(以下支持度都是IE9+)
    1) cssText : style中的css代码
    2) length ：元素css属性数量
    3) parentRule 
    4) getPropertyCSSValue(propertyName)
    5) getPropertyPriority(propertyName)
    6) item(index):指定位置的css属性名称 
    7) removeProperty(propertyName):删除样式中的某个属性
        document.getElementById('s').style.removeProperty('border') 
    8) setProperty(propertyName,value,priority)
```

## 2. 事件类型
```
(1) UI(用户界面)事件：当用户与页面上的元素交互时发生
    1) load
        当页面完全加载后(包括所有的图像、JS文件、CSS文件等)
    2) unload
        当页面完全卸载后触发，只要用户从一个页面切换到另外一个页面，就会发生，
        此事件大多用于清除引用，以避免内存泄露
    3) resize
    4) scroll
(3) 焦点事件
    1) blur:不会冒泡，所有浏览器支持
    2) focus:不会冒泡，所有浏览器支持
    3) focusin:与focus等价，但是会冒泡，IE5+
    4) focusout:与blur等价，IE5+
(4) 鼠标事件
    1) click
    2) dblclick
    3) mousedown
    4) mouseenter:不冒泡
    5) mouseleave:不冒泡
    6) mousemove：当鼠标在元素内部移动时重复触发
    7) mouseout
    8) mouseover
    9) mouseup
    以上事件，除了mouseenter与mouseleave之外，其余都会冒泡
(5) 滚轮事件
(6) 文本事件：用户输入文本
(7) 键盘事件
(8) 合成事件：当输入法编辑器输入字符时触发
(9) 变动事件：当底层DOM结构变化时触发
(10) 变动名称事件：已废弃
```

## 3. 表单
```
(1) elements 属性：表单中所有元素的有序列表集合
    var field1=form.elements[0]
    var field2=form.elements['name2']
    var fieldCount=form.elements.length
(2) 表单字段属性
    1) disabled: 布尔值，表示当前字段是否被禁用
    2) form: 指向当前字段所属表单的指针，只读
    3) name: 当前字段的名称
    4) readOnly: 布尔值，表示当前字段是否只读
    5) tabIndex: 表示当前字段的切换序号
    6) type: 表示当前字段的类型，如 checkbox radio 等
    7) value: 当前字段将被提交给服务器的值，对于文件字段来说，此值只读，包含着文件在计算机中的路径

    除了form属性之外，其余属性皆可通过JS动态修改：
        field1.value='newValue'
(3) 文本框脚本
    1) 选择文本
        全选文本框中的文本，用在方便用户全删文本框内容的时候：
            document.forms[0].elements['textbox1'].select()
    2) 选择文本触发的select事件：
        textbox.addEventListener('select',function(e){
            alert(e.target.value)
        })
    3) 取得选择的文本
        textbox.addEventListener('select',function(e){
            alert(e.target.value.substring(textbox.selectionStart,textbox.selectionEnd))
        })
        对于IE8及更早版本不支持selectionStart、selectionEnd属性，换成以下兼容写法：
            function getSelectedText(textbox){
                if(typeof textbox.selectionStart=='number'){
                    return textbox.value.substring(textbox.selectionStart,textbox.selectionEnd)
                }else if(document.selection){
                    return document.selection.createRange().text
                }
            }
        4) 选择部分文本
            textbox.value='Hello,world!'
            //选择所有文本
            textbox.setSelectionRange(0,textbox.value.length)
            //选择前3个字符
            textbox.setSelectionRange(0,3)

        5) 操作剪贴板方法
            1) beforecopy: 在发生复制之前触发
            2) copy: 在发生复制时触发
            3) beforecut: 在发生剪切操作前触发
            4) cut: 在发生剪切操作之时触发
            5) beforepaste: 在发生粘贴之前触发
            6) paste:在发生粘贴之时触发
        6) 访问剪贴板数据
            通过clipboardData对象，存在三个方法：
                I. getData()：接收一个参数，即要取得的数据的类型，text、URL
                II. setData()：第一个参数表示数据类型，第二个参数表示要放在剪贴板中的文本
                III. clearData()
        7) 富文本编辑
            I. 设置iframe的designMode属性
            II. 使用contenteditable属性，可以在任何元素上设置

```


## 4. HTML5约束验证API
```
(1) 输入验证
    除了内置的 number、email、url之外，还支持自定义的正则匹配：
    <input type='text' pattern='\d+' name='count'/>

    使用以下JS代码可通过pattern访问:
    var pattern=document.forms[0].elements['count'].pattern
(2) checkValidity() 检测表单字段是否有效，validity属性则说明为什么字段有效或无效。
(3) 禁用验证：
    <form method='post' action='signup.php' novalidate>
    </form>
```

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
