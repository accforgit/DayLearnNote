

>摘自 《深入浅出Node.js》

---

## 1. 空格与格式
```
(1) 缩进
    采用2个空格缩进，而不是tab缩进，空格在编辑器中与字符是等宽的，
    而tab可能因编辑器的设置不同，并且2个空格会让代码看起来更紧凑、明快。

(2) 变量声明
    永远在声明 var (或let const)之后再使用变量，避免污染全局上下文，
    每行声明都应该带上var (或let const)，而不是只有一个var (或let const)：
    推荐的代码：
        var assert=require('assert');
        var fork=require('child_process');

    不推荐的代码：
        var assert=require('assert')
            ,fork=require('child_process');

(3) 空格
    在操作符前后加上空格，比如 `+ - * / % =` 等。
    推荐的代码：
        var foo='bar' + baz;

    不推荐的代码：
        var foo='bar'+baz;

(4) 单双引号的使用
    在Node中使用字符串尽量使用单引号。

(5) 大括号的位置：
    一般情况下，大括号无需另起一行：
    推荐的代码：
        if (true) {
            // some code
        }

    不推荐的代码：
        if (true)
        {
            // some code
        }

(6) 逗号
    逗号用于变量声明的分割或是元素的分割，
    如果逗号不在行结尾，后面需要一个空格：var foo='hello', bar='world';
    逗号不要出现在行首。
    不推荐的代码：
        var hello={foo:'hello'
            ,bar:world'
        };
(7) 分号
    尽管JavaScript编译器会自动给行尾添加分号，但还是要尽量给表达式的结尾添加分号。
```

## 2. 命名规范
```
(1) 变量命名
    变量名采用小驼峰式命名(即除了第一个单词的首字母不大写外，其余单词的首字母都大写，词与词之间没有任何符号)：
        var adminUser = {};

(2) 方法命名
    与变量一样，采用小驼峰式命名，不过，方法名尽量采用动词或判断行词汇：
        var getUser=function() {};
        var isAdmin = function() {};

(3) 类命名
    采用大驼峰式命名，即所有单词的首字母都大写：
        function User() {

        }

(4) 常量命名
    单词的所有字母都大写，单词之间用下划线分割：
        var PINK_COLOR = 'pink';

(5) 文件命名
    尽量采用下划线分割单词：
        child_process.js
    如果不想将文件暴露给其他用户，约定以下划线开头：
        _private.js

```

## 3. 比较操作
```
 如果是“无容忍”的操作，尽量使用'==='代替'=='
```

# 4. 字面量
```
尽量使用 `{} []`代替`new Object()  new Array()`，不要使用`string bool number`对象类型，
即不要调用`new String new Boollean new Number`。
```

# 5. 作用域
```
(1) 慎用 with
    这可能导致作用域混乱

(2) 慎用 eval()
```

# 6. 类与模块
```
(1) 类继承
    1) 一般写法
        function Socket(options) {
            stream.Stearm.call(this);
        }
    2) 推荐使用Nodejs的类继承方式
        util.inherits(Socket,stream.Stearm);

(2) 导出
    所有供外部调用的方法或变量均需挂载在 exports 变量上:
        exports.addUser() {
            //some code
        }

    当需要将文件当做一个类导出时，需要通过module.exports:
    module.exports=Class;
```