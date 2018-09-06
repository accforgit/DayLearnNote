

>摘自 《深入浅出Node.js》

---

## 代码风格

- 缩进

采用2个空格缩进，而不是tab缩进，空格在编辑器中与字符是等宽的，
而tab可能因编辑器的设置不同，并且2个空格会让代码看起来更紧凑、明快。

- 变量声明

永远在声明 `var` (或 `let const`)之后再使用变量，避免污染全局上下文，
每行声明都应该带上 `var` (或`let const`)，而不是只有一个 `var (或let const)`
推荐的代码：
```js
var assert=require('assert');
var fork=require('child_process');
```

不推荐的代码：
```js
// 不会产生全局变量，但是不太好看
var assert=require('assert')
    ,fork=require('child_process');
```

- 空格

在操作符前后加上空格，比如 `+ - * / % =` 等。
推荐的代码：
```js
var foo='bar' + baz;
```

不推荐的代码：
```js
var foo='bar'+baz;
```

- 单双引号的使用

在 `Node`中使用字符串尽量使用单引号。

- 大括号的位置：

一般情况下，大括号无需另起一行：
推荐的代码：

```js
if (true) {
    // some code
}
```
不推荐的代码：
```js
if (true)
{
    // some code
}
```

- 逗号

逗号用于变量声明的分割或是元素的分割，
如果逗号不在行结尾，后面需要一个空格：var foo='hello', bar='world';
逗号不要出现在行首。
不推荐的代码：
```js
    var hello={foo:'hello'
        ,bar:world'
    };
```
- 分号

尽管 `JavaScript`编译器会自动给行尾添加分号，但还是要尽量给表达式的结尾添加分号，因为 `JS`引擎推测分号也是需要时间的，并且可以避免不可预测的语法错误

>_Note: 目前大多数项目都使用 压缩与混淆 ，会自动给代码加分号，所以现在不用考虑这个事情了

## 命名规范

- 变量命名

变量名采用小驼峰式命名(即除了第一个单词的首字母不大写外，其余单词的首字母都大写，词与词之间没有任何符号)：

```js
var adminUser = {};
```

- 方法命名

与变量一样，采用小驼峰式命名，不过，方法名尽量采用动词或判断行词汇：
```js
var getUser=function() {};
var isAdmin = function() {};
```

- 类命名

采用大驼峰式命名，即所有单词的首字母都大写：
```js
function User() {
}
```

- 常量命名

单词的所有字母都大写，单词之间用下划线分割：
```js
var PINK_COLOR = 'pink';
```

- 文件命名

尽量采用下划线分割单词：
```js
child_process.js
```

如果不想将文件暴露给其他用户，约定以下划线开头（只是一种约定，并不会真的在代码层面进行阻止）：

```js
_private.js
```

## 比较操作

 如果是“无容忍”的操作，尽量使用'==='代替'=='

## 字面量

尽量使用 `{} []`代替`new Object()  new Array()`，不要使用`string bool number`对象类型，
即不要调用`new String new Boollean new Number`。

## 作用域

- 慎用 `with`

这可能导致作用域混乱

- 慎用 eval()

## 类与模块

- 类继承

一般写法
```js
function Socket(options) {
    stream.Stearm.call(this);
}
```
推荐使用Nodejs的类继承方式
```js
util.inherits(Socket,stream.Stearm);
```

- 导出

所有供外部调用的方法或变量均需挂载在 `exports` 变量上:
```js
exports.addUser() {
    //some code
}
```
当需要将文件当做一个类导出时，需要通过 `module.exports`:
```js
module.exports=Class;
```
>_Note: `module.exports` 是对 `exports`的一个引用

## 更多
[腾讯Web团队编码规范 Code Guide by @AlloyTeam](http://alloyteam.github.io/CodeGuide/)
