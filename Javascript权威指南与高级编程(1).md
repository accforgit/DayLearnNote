## 1 属性的特性(6.7)
```
1. 一个属性包含一个名字和4个特性（也称为是 ECMA中的数据属性），这些特性都有各自的默认值
（configurable、enumerable、writable默认值为true,value的默认值为undefined）想要修改它们，
必须使用Object.defineProperty或者Object.defineProperties()，而一旦调用了Object.defineProperty或者Object.defineProperties()，
如果不进行显式指定，则configurable  enumerable  writable的默认值都将变为false

    var o={}
    Object.defineProperty(o,'x',{
        value:1,
        writable:true,
        enumerable:false,
        configurable:true
    })

    若对对象的多个属性进行配置，则需要使用defineProperties()
    var p=Object.defineProperties({},{
        x:{value:2,writable:true,enumerable:true,configurable:true},
        y:{value:3,writable:true,enumerable:true,configurable:true},
        r:{
            get:function(){return Math.sqrt(this.x*this.y)},
            enumerable:true,
            configurable:true
        }
    })

2. 通过Object.getOwnPropertyDescriptor()获得某个对象特定属性的描述符：
    Object.getOwnPropertyDescriptor({x:1},'x')
    ==>{value: 1, writable: true, enumerable: true, configurable: true}
```

## 2 对象的三个属性(6.8)
```
每一个对象都有与之相关的原型(prototype)、类(class)、可扩展性(extensible attribute)

1. 使用原型创建对象：Object.create()
    var p={x:1}
    var o=Object.create(p)
    p.isPrototypeOf(o)  //==>true
    Object.prototype.isPrototypeOf(o)  //==>true

2. 使用默认的toString()方法可以查询类属性：
    var s={}
    s.toString()
    ==>[object Object]

    因为很多对象继承的toString方法重写，所以必须间接的调用Function.call()方法,
    下面的 classof() 可以返回传递给它的任意对象的类：
    function classof(o){
        if(o===null) return 'Null'
        if(o===undefined) return 'Undefined'
        return Object.prototype.toString.call(o).slice(8,-1)
    }

    classof(function(){})
    ==> Function

3. 通过将对象传入Object.esExtensible(),来判断该对象是否是可扩展的。
   调用Object.preventExtensions()，将对象转换为不可扩展的，此过程不可逆
   
   Object.seal()与Object.preventExtensions()类似，不过前者还可以将对象的所有
   自有属性都设置为不可配置的。
   使用Object.isSealed()检测对象是否封闭。

   Object.freeze()除了将对象设置为不可扩展和将其属性设置为不可配置之外，还可以将它只有的所有
   数据属性设置为只读。
   使用Object.isFrozen()检测对象是否冻结。

   创建一个封闭的对象，包括一个冻结的原型和一个不可枚举的属性：
   var o=Object.seal(Object.create(Object.freeze({x:1}),{y:{value:2,writable:false}}))

```

## 3 数组(7.1)
```
1. 创建数组时，如果省略直接量中的某个值，省略的元素将被赋予undefined值：
    var count=[1,,3]
    console.log(count.length)  //==>3
    console.log(count[1])  //==>undefined

    数组直接量的语法允许有可选的结尾逗号，所以[,,].length===2
    (在IE及更早版本中，可能存在问题)

2. sort()函数是原地排序，默认按照升序排序，调用该方法时，sort()首先调用每个数组项的toString()方法，
    然后比较得到的字符串，排序之后，原数组将发生变化，同时需要注意，sort()的排序是按照字母表中的顺序进行排序，
    如果进行排序的对象是数字，则产生的结果可能与预料的不一致：

    var arr=[33,444,11,222]
    arr.sort()  //==>[11, 222, 33, 444]

如果需要用数值大小进行排序，则修改代码如下：
    var arr=[33,444,11,222]
    arr.sort((a,b)=>{
        return a-b
    })
    ==>[11, 33, 222, 444]

如果需要忽略字母大小写，则修改代码如下：
    a=['ant','Bug','cat','Dog']

    a.sort((s,t)=>{
        var a=s.toLowerCase()
        var b=t.toLowerCase()
        if(a<b) return -1
        if(a>b) return 1
        return 0
    })
```



## 4 数组every()  some() (7.9)
```
every():当针对数组中所有元素的调用都为true，才返回true：
    var a=[1,2,3,4,5]
    a.every((x)=>{return x>10})  //==>true
    a.every((x)=>{return x%2===0})  //==>false

some():当针对数组中至少存在一个元素的调用为true，就返回true：
    var a=[1,2,3,4,5]
    a.some((x)=>{return x%2===0})  //==>true
    a.some(isNaN)  //==>false
```

## 5 reduce()  reduceRight() (7.5.9)

```
reduce()和reduceRight()工作原理一样，都需要两个参数，第一个是操作的函数，
第二个可选，为函数操作初始值，reduceRight()是从右向左进行操作。
```

## 6 作为数组的字符串 (7.12)
```
  字符串的行为类似于只读的数组，除了charAt()的方法访问单个字符意外，还可以使用方括号：
var a='test'
a.charAt(0)  //==>'t'
a[0]  //==>'t'

  一些通用的数组方法也可以应用到字符串上,只不过需要间接地调用Function.call()方法来模拟实现：

    var s='Javascript'
    Array.prototype.join.call(s,'-')  //==>"J-a-v-a-s-c-r-i-p-t"
    Array.prototype.filter.call(s,(x)=>{
    return x.match(/[^aeiou]/)
    }).join('')                         //==>"Jvscrpt"


  需要注意的是，数组是可以被修改的，而字符串是不可变的值，所以字符串只能是只读的数组，类似于
push() sort()  reserve()  splice()等原地修改数组的方法用在字符串上是无效的，并且还不会出现错误提示。
```
## 7 实参对象arguments (8.3.2)
```
实参对象的callee和caller属性
在严格模式下对这两个属性进行读写都会产生类型错误，
在非严格模式下，callee表示当前正在执行的函数，caller表示当前正在执行的函数的函数
    (1) callee:
        function fac(num){
            if(num<=1){
                return 1
            }else{
                return num*arguments.callee(num-1)
            }
        }
        fac(10)

        等同于：

        function fac(num){
            if(num<=1){
                return 1
            }else{
                return num*fac(num-1)
            }
        }
        fac(10)

        但是前者解决了函数的执行与函数名fac紧紧耦合在一起的问题。

    (2) caller:
        function outer(){
            inner()
        }
        function inner(){
            console.log(inner.caller)
        }

        outer()

        //==>   function outer(){
                    inner()
                }

```

## 8 声明提升 (8.4)

```
1. 变量声明提升：
    a=1
    var a
    console.log(a)      //==>1
2. 函数声明提升
    b.count=9
    function b(){
        return b.count++
    }
     b()
     //==>9

  这里需要注意的是，函数声明提升只对函数声明有效，如果写成函数表达式就会出错：
    b.count=9
    var b=function{
        return b.count++
    }
    b()
    //==> Uncaught SyntaxError: Unexpected token
```

## 9 call()  apply() (8.7.3)
```
  ES5严格模式下，call() & apply()的第一个参数都会变为this的值，非严格模式下，如果第一个参数为null或者undefined，
则将被全局对象代替
```


## 10 Function()构造函数 (8.7.6)
```
需要注意几点：

(1) 每次调用Function()构造函数都会解析函数体，并创建新的函数对象，影响效率
(2) Function()创建的函数不是使用词法作用域，函数体代码的编译总是会在顶层函数执行(全局作用域)：
        var scope='global'
        function constructorFunction(){
            var scope='local'
            return new Function('return scope')
        }

        constructorFunction()()  //==>'global'

(3) 没有重载
        var num=100
        function add(num){
            return num+100
        }
        function add(num){
            return num+200
        }

    以上两个函数实际上与下面这两行没什么区别：

        var num=100
        var add=function(num){
            return num+100
        }
        add=function(num){
            return num+200
        }

    从第二个例子中可以看出，在创建第二个函数的时候，实际上覆盖了引用第一个函数的变量add，
    看起来也就是函数覆盖，导致后一个覆盖前一个，结果以第二个函数为准，输出 `300`

(4) ECMAScript中的函数是对象，所以函数也有属性和方法，每个函数都包含两个属性：length和prototype
    属性：
        1) length ：表示函数定义的参数
            function person(name,age,gender){
                console.log('person info')
            }

            console.log(person.length)  //==> 3
        2) prototype
            prototype不可枚举，所以使用 for...in 无法发现。
    方法：
        1)apply()
        2)call()

        二者的区别仅在于接受参数的方式不同
    
```

## 11 constructor属性 (9.2.2)
```
1. 每个JS函数（除了ES5中Function.bind()方法返回的函数）都自动拥有一个prototype属性，这个属性的值是一个对象，
这个对象包含唯一一个不可枚举属性constructor，constructor属性的值是一个函数对象：

    var F=function(){}
    var p=F.prototype
    var c=p.constructor
    c===F       //==>true，即F.prototype.constructor===F


    var o=new F()
    o.constructor===F       //==>true，constructor属性指代这个类

2. 识别对象是否属于某各类的方法

  (1) instanceof
        var arr1=[1,2,3]
        arr1 instanceof Array        //==>true
  (2) constructor
        var arr2
        arr2.constructor===Array       //==>true

  这两种方法一般情况下都行得通，不过在多个执行上下文的场景中无法正常工作，
比如在浏览器窗口的多个框架子页面中。
```

## 12 正则表达式 (10.1.5)
```
(1)  (?=p) 零宽正向先行断言，要求接下来的字符都与p匹配，但不能包括匹配p的那些字符
(2)  (?!p) 零宽负向先行断言，要求接下来的字符不与p匹配


(3) 用于模式匹配的方法：
     search():第一个参数是一个正则表达式，返回第一个与之匹配的子串的起始位置，如果找不到子串，则返回-1
              如果第一个参数不是一个正则表达式，则首先会通过RegExp构造函数将之转换为正则表达式。
              不支持全局匹配，所以会忽略掉修饰符g
     replace():第一个参数是一个正则表达式或者字符串，
               第二个参数是要进行替换的字符串，或者也可以是一个函数，方便动态匹配。
     match():唯一参数就是一个正则表达式，如果不是一个正则表达式，则首先会通过RegExp构造函数将之转换为正则表达式。
             返回一个由匹配结果组成的数组（即使只检测到一个结果，也返回数组），支持修饰符g。
             数组的前面一个或多个元素就是匹配的字符串，余下的元素则是正则表达式中用圆括号括起来的子表达式


(4) RegExp() 对象
      RegExp()对象带有两个字符串参数，第一个参数包含正则表达式的主体部分，第二个参数可选，提供修饰符(g i m)，
    同时支持三个方法和一些属性。
    
    1) exec()
        与String的match()方法相似，不过exec()是对一个指定的字符串执行一个正则表达式，也就是在一个字符串中执行匹配检索，
        如果没有找到匹配值则返回null，如果找到则返回一个数组，这个数组的第一个元素时与正则表达式相匹配的原始字符串，
        余下的元素时与圆括号内的子表达式相匹配的子串。

            var pattern=/Java/g;
            var text='Javascript is more fun than Java!';
            while((result=pattern.exec(text))!=null){
            console.log("Matched'"+result[0]+"'"+" at position "+result.index+"; next search begins at "+pattern.lastIndex)
            }

            //==> Matched'Java' at position 0; next search begins at 4
                Matched'Java' at position 28; next search begins at 32

    2) text()
        接受一个字符串参数，如果匹配返回true，否则返回false：
            var text='000-00-0000'
            var pattern=/\d{3}-\d{2}-\d{4}/
            if(pattern.test(text)){
                console.log('the pattern was matched)
            }

    3) 在需要动态创建正则表达式（无法将正则表达式写死）的时候很有用，例如，如果待检索的字符串是由用户输入的。

```

## 13 解构运算 (11.3)
```
  (1) 整个解构复制运算的返回值是右侧的整个数据解构，而不是从中提取出来的某个值：

        let first,second,all
        all=[first,second]=[1,2,3,4]
        // first==[1],second==[2],all=[1,2,3,4]

  (2) 解构对象
    需要注意表达式左侧部分的键值对顺序：

        let transparent={r:224,g:123,b:223,a:0.8}
        let {r:red,g:green,b:blue}=transparent
        console.log(red,green,blue)
        //224，123,223
```


## 14 IE与标准浏览器

(1) 事件转换

|标准浏览器|IE|兼容写法|
|---|---|---|
|`addEventListener`|`attachEvent`(IE8)|`window.addEventListener ? window.addEventListener : window.attachEvent`|
|`canvas`|IE所有都不支持|通过加载 `excanvas.js` 使得IE看起来可以使用 `canvas`<br>`<!--if IE><script src='excanvas.js'></script><![endif]-->`|
|`window.getSelection().toString()`|`document.selection.createRange().text`|`document.selection.createRange().text`|

(2) 模式检查
```
检查 document.compatMode 的值，
如果输出 CSS1Compat，表明是标准模式，
否则为 BackCompat 或者undefined ，则为怪异模式

```

(3) 条件注释
```
<!--if IE 6>
    It will only be display in IE6
<![endif]-->
```

(4) IE的JS解释器的条件注释

代码示例格式如下：
```
/*@cc_on
    @if(@_jscript)
        alert('You are using IE');
    @else*/
    alert('You are not using IE');
/*@end
  @*/

以上代码中， JScript是微软自己的Javascript解释器的名字，所以变量 @_jscript 在IE中总是为true，否则为false
```

## 15 delete
```
    (1) 使用delete删除一个属性就像（但不完全一样）给这个属性复制undefined，或者说在那里挖了个洞，原来的东西没了，但是位置依旧存在。
    例如删除一个对象的属性，或者数组的某个值，表面上看似乎实际上看被删除的属性或者值已经不存在了，
但是实际上这个数组的长度或者对象的被删除的那个属性依旧存在，只不过它们的值都变成了undefined。

        var s=['aa','bb','cc']
        delete s[1]
        console.log(s)      // => ['aa','cc']，看起来确实不存在'bb'这个值了
        console.log(s.length)      // => 3 ，但是s的长度却没变


    (2) delete不可删除使用var定义的全局变量，否则将会返回false，可以删除直接创建的全局变量（不使用var），或者是使用this显式声明的全局变量
        var t=1     //声明一个不可删除的全局变量
        f=2         //创建全局对象的一个可删除的属性（注意，这种创建全局变量的方式不建议使用）
        this.s=2    //创建全局对象的一个可删除的属性

        delete t    // =>false ：变量并没有被删除
        delete f   // =>true ：变量被删除
        delete t    // =>true ：变量被删除

    (3) delete只能删除自有属性，不能删除继承属性（要删除继承属性，必须从定义这个属性的原型对象上删除）
        var 0={x:1}
        delete o.x  //=》删除x,返回true 
        delete o.x  //=》尽管也返回了true，但是实际上什么也没做 
        delete o.toString  //=》toString是Object.prototype上的属性，来自于原型链，尽管也返回了true，但是实际上什么也没做 ，无意义
```

## 16 逗号（，）运算符

```
    逗号运算符是二元运算符，它的操作数可以是任意类型，它首先计算做操作数，然后计算右操作数，最后返回右操作数的值。
也就是说逗号运算符（，）总是计算两侧的表达式，但是只返回右侧的值，左侧的值将会被忽略

```

## 17 for...in &  for...of

```
for...in 遍历的是key(键),for...of遍历的是值
因为对象的属性是没有顺序的，所以循环输出的先后次序可能会因浏览器而异。

(1) 将所有的对象属性复制到一个数组中：
    var o={x:1,y:2,z:3}
    var a=[],i=0
    for(a[i++] in o);   //分号别忘了
    console.log(a)      //["x", "y", "z"]

(2) 将所有的对象属性的值复制到一个数组中：
    var o={x:1,y:2,z:3}
    var a=[],i=0
    for(a[i++] of o);   //分号别忘了
    console.log(a)      //["x", "y", "z"]
```

## 18 js不使用临时变量来进行两个变量值的交换

```
(1) 使用数组
    var x=2,y=3
    x=[y,y=x][1]
    console.log(x)    //3
    console.log(y)    //2

(2) 按位异或(^)
    var x=2,y=3
    x^=y
    y^=x
    x^=y
    console.log(x)    //3
    console.log(y)    //2

(3)ES6中的解构运算
    var x=2,y=3
    [x,y]=[y,x]
    console.log(x)    //3
    console.log(y)    //2

```

## 19 标签语句
```
（C语言中也有这个东西）
语句是可以添加标签的，标签是由语句前的标识符和冒号组成：indenfifier:statement

here: for(var i=0;i<10;i++){
  for(var j=0;j<10;j++){
    if(j>5) break here;
  }
}

break和continue是JS中唯一可以使用语句标签的语句

一般来说，在循环语句中使用break和continue将会终止整个循环(break)或者终止当前循环从头开始，但是这二者跳出的都是最近的循环体，
要想跳出到更远的循环体之外，标签语句将会派上用场
但是值得注意的是，尽管标签语句能够让break或者continue跳出比最近的循环语句更远的语句上，但标签语句是不能够让二者的控制权越过函数的边界的，
例如，对于一条带比起爱你的函数定义语句来说，不能从函数内部通过这个边卡跳转到函数外部

```

## 20 检测属性 
```
(1) 判断某个属性是否存在于某个对象中，可以使用in运算符
    var o={x:1}
    'x' in o  //=>true：x是o 的属性, 注意这里别忘了引号
    'y' in o  //=>false：y不是o 的属性
    'toString' in o  //=>true：o继承了Object的toString属性

(2) in运算符只能简单的判断属性对于对象来说是否是存在，但是无法判断属性是属于对象本身还是来自于原型链，
想要做到这一点，需要用到hasOwnProperty这个方法
    var o={x:1}
    o.hasOwnProperty('x')   //=>true：x是o 本身就有的属性
    o.hasOwnProperty('y')   //=>false：y不是o 的属性
    o.hasOwnProperty('toString')  //=>false：o继承了Object的toString属性，并不是o本身的属性

(3) propertyIsEnumerable是 hasOwnProperty的增强版，只有检测到时自有属性，并且这个属性可枚举才为true

    var o={x:1}
    o.propertyIsEnumerable('x')   //=>true：x是o 本身就有的属性
    o.propertyIsEnumerable('y')   //=>false：y不是o 的属性
    o.propertyIsEnumerable('toString')  //=>false：o继承了Object的toString属性，并不是o本身的属性，并且不可枚举

```

## 21 自定义事件
有两种方法，一种是使用 `new Event()` ，另一种是 `new CustomEvent()`
>`new Event()` 
```
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
>`new CustomEvent()` 
```
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
>`new customEvent()` 与 `new Event()`之间的差别在于，<br>
`new customEvent()`可以在`event.detail`属性里携带自定义数据的功能(`event.detail`的值为`good`)
