## new 操作符

```js
function create (func) {
  // 1. 创建一个空对象
  const obj = {}
  // 2. 将构造函数的作用域给新对象（因此 `this`就指向了这个新对象）
  obj.__proto__ = func.prototype
  // 3. 执行构造函数中的代码
  const rst = func.call(obj)
  // 4. 判断`Func`的返回值类型，如果是值类型，返回 `obj`。如果是引用类型，就返回这个引用类型的对象
  return typeof rst === 'object' ? rst : obj
}
```

## instanceof

主要是原型链的向上层层追溯
```js
function myInstanceof (obj, ctx) {
  let proto = obj.__proto__
  const prototype = ctx.prototype
  while (true) {
    if (proto === null) return false
    if (proto === prototype) return true
    proto = proto.__proto__
  }
}
```

## call

```js
Function.prototype.myCall = function(context) {
  // this 参数可以传基本类型数据，原生的 call 会自动用 Object() 转换
  const ctx = context ? Object(context) : window
  ctx.fn = this
  const args = [...arguments].slice(1)
  const result = ctx.fn(...args)
  delete ctx.fn
  return result
}
```

## apply

```js
Function.prototype.myApply = function(context, arr) {
  // this 参数可以传基本类型数据，原生的 call 会自动用 Object() 转换
  const ctx = context ? Object(context) : window
  ctx.fn = this
  let result = arr ? ctx.fn(...arr) : ctx.fn()
  delete ctx.fn
  return result
}
```

## bind

版本 1：
```js
Function.prototype.myBind = function(context) {
  const ctx = context || window
  const args = [...arguments].slice(1)
  const self = this
  return function Fn(){
    // bind有个特点 一个绑定函数也能使用new操作符创建对象
    if (this instanceof Fn) {
      return new self(args, ...arguments)
    }
    return self.apply(ctx, args.concat(arguments))
  }
}
```

版本 2，较为成熟：
```js
if(!Function.prototype.bind) {
  Function.prototype.bind = function(obj) {
    var slice = [].slice
    var args = slice.call(arguments,1)
    var self = this
    var nop = function () {}
    nop.prototype = self.prototype
    var bound = function () {
      return self.apply(this instanceof nop ? this : (obj || {}), args.concat(slice.call(arguments)));
    }
    // 原型式继承
    bound.prototype=new nop()
    return bound
  };
}
```

## 函数防抖 debounce

```js
// func是用户传入需要防抖的函数
// wait是等待时间
function debounce (fn, wait = 50) {
  let timer = null
  return function () {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, wait)
  }
}

var validate = debounce(function(e) {
  console.log("change", e.target.value, new Date-0)
}, 380);

// 绑定监听
document.querySelector("input").addEventListener('input', validate);
```

## Throttle 节流

只有当两次触发之间的时间间隔大于事先设定的值，这个新函数才会运行实际的任务。

```js
function throttle (func, delay) {
    let timer = null
    let startTime = +new Date()
    return function() {
      let curTime = +new Date()
      let remaining = delay - (curTime - startTime)
      let context = this
      let args = arguments
      clearTimeout(timer)
      if (remaining <= 0) {
        func.apply(context, args)
        startTime = +new Date()
      } else {
        timer = setTimeout(() => {
          func.apply(context, args)
        }, remaining)
      }
    }
}
// 实际想绑定在事件上的 handler
function realFunc(){
    console.log("Success");
}
// 如果两次输入之间间隔大于 1000ms ，则立即执行操作，否则就等待 500ms 之后再执行
$('input').on('keydown', debounce(realFunc, 500,1000));
```

## js对象浅copy
```js
function shallowCopy (src) {
  const dist ={ }
  for(let prop in src) {
    if(src.hasOwnProperty(prop)) {
      dist[prop] = src[prop]
    }
  }
  return dist
}
```

## js对象深拷贝/深复制/深copy

- 最简单的写法，大部分情况下已经满足需求

```js
var newObj = JSON.parse(JSON.stringify(obj))
```
缺点：
  - 无法复制函数(function)
  - 丢失原本的原型链
优点：
  - 利用系统方法，简单方便
  - 自带循环引用的检测

- 稍好些的写法

```js
function copyObject(orig) {
  var copy = Object.create(Object.getPrototypeOf(orig));
  copyOwnPropertiesFrom(copy, orig);
  return copy;
}

function copyOwnPropertiesFrom(target, source) {
  Object
  .getOwnPropertyNames(source)
  .forEach(function(propKey) {
    var desc = Object.getOwnPropertyDescriptor(source, propKey);
    Object.defineProperty(target, propKey, desc);
    if (typeof source[propKey] === 'object') {
      target[propKey] = copyObject(source[propKey]);
    }
  });
  return target;
}
```
缺点：
  - 无法复制函数(function)
  - 无法复制 RegExp 和 Date

 优点：
  - 包括原型链和自有属性的深度拷贝

- 递归实现
```js
function deepCopy (origin, dest) {
  const c = dest || {}
  for (let i in origin) {
    if (origin.hasOwnProperty(i)) {
      if (typeof origin[i] === 'object') {
        if (origin[i].constructor === Array) {
          c[i] = []
        } else {
          c[i] = {}
        }
        deepCopy(origin[i], c[i])
      } else {
        c[i] = origin[i]
      }
    }
  }
  return c
}
```

或者这一种也可以：
```js
function deepClone (source) {
  if (typeof source !== 'object') { return source }

  var clone = Array.isArray(source) ? [] : {}
  for (var p in source) { clone[p] = deepClone(source[p]) }

  return clone
}
```

- MessageChannel

此 `API`属于 `macro task`，`vue`中实现的 `macro task`降级策略就是此：

```js
setImmediate->MessageChannel->setTimeout(fn,0)
```

此`API`也可以用于实现深拷贝，不过深拷贝的对象中包含的属性不能存在函数，否则会报错：
```js
function structuralClone(obj) {
  return new Promise(resolve => {
    const {port1, port2} = new MessageChannel();
    port2.onmessage = ev => resolve(ev.data);
    port1.postMessage(obj);
  });
}

var obj = {a: 1, b: {
    c: b
}}
// 注意该方法是异步的
// 可以处理 undefined 和循环引用对象
(async () => {
  const clone = await structuralClone(obj)
})()
```

- 利用堆栈和循环实现

用循环遍历一棵树，需要借助一个栈，当栈为空时就遍历完了，栈里面存储下一个需要拷贝的节点

```js
function cloneForce(x) {
  // =============
  const uniqueList = []; // 用来去重
  // =============
  let root = {};
  // 循环数组，初始堆栈，对这个堆栈数组进行pop和 push，当数组空了，则说明遍历完成
  const loopList = [
    {
      parent: root,
      key: undefined,
      data: x,
    }
  ];

  while(loopList.length) {
    // 深度优先
    const node = loopList.pop();
    const parent = node.parent;
    const key = node.key;
    const data = node.data;

    // 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素
    let res = parent;
    if (typeof key !== 'undefined') {
      res = parent[key] = {};
    }
    // =============
    // 数据已经存在
    let uniqueData = find(uniqueList, data);
    if (uniqueData) {
      parent[key] = uniqueData.target;
      break; // 中断本次循环
    }
    // 数据不存在
    // 保存源数据，在拷贝数据中对应的引用
    uniqueList.push({
      source: data,
      target: res,
    });
    // =============
    for(let k in data) {
      if (data.hasOwnProperty(k)) {
        if (typeof data[k] === 'object') {
          // 下一次循环
          loopList.push({
            parent: res,
            key: k,
            data: data[k],
          });
        } else {
          res[k] = data[k];
        }
      }
    }
  }
  return root;
}

function find(arr, item) {
  for(let i = 0; i < arr.length; i++) {
    if (arr[i].source === item) {
      return arr[i];
    }
  }
  return null;
}
```

使用：
```js
var b = 1;
var a = {a1: b, a2: b};

a.a1 === a.a2 // true

var c = cloneForce(a);
c.a1 === c.a2 // true
```

优点：
  - 解决了循环引用的问题

关于解决循环引用问题，还可以使用 `WeakMap`
```js
function deepCopy(obj) {
  // hash表，记录所有的对象的引用关系
  let map = new WeakMap();
  function dp(obj) {
    let result = null;
    let keys = Object.keys(obj);
    let key = null,
      temp = null,
      existobj = null;

    existobj = map.get(obj);
    //如果这个对象已经被记录则直接返回
    if(existobj) {
      return existobj;
    }

    result = {}
    map.set(obj, result);

    for(let i =0,len=keys.length;i<len;i++) {
      key = keys[i];
      temp = obj[key];
      if(temp && typeof temp === 'object') {
        result[key] = dp(temp);
      }else {
        result[key] = temp;
      }
    }
    return result;
  }
  return dp(obj);
}
```

- 考虑较为全面的写法

```js
//定义一个辅助函数，用于在预定义对象的 Prototype 上定义方法
function defineMethods(protoArray, nameToFunc) {
  protoArray.forEach(function(proto) {
    var names = Object.keys(nameToFunc), i = 0
    for(; i < names.length; i++) {
      Object.defineProperty(proto, names[i], {
        enumerable: false,
        configurable: true,
        writable: true,
        value: nameToFunc[names[i]]
      })
    }
  })
}

// Object对象的处理
defineMethods([Object.prototype], {
  //主要解释两个参数，srcStack和dstStack。它们的主要用途是对存在环的对象进行深复制。比如源对象中的子对象srcStack[7]在深复制以后，对应于dstStack[7]
  '$clone': function(srcStack, dstStack) {
    var obj = Object.create(Object.getPrototypeOf(this)),
        keys = Object.keys(this),
        index,
        prop
    srcStack = srcStack || []
    dstStack = dstStack || []
    srcStack.push(this)
    dstStack.push(obj)

    for(var i = 0; i < keys.length; i++) {
      prop = this[keys[i]]
      if(prop === null || prop === undefined) {
        obj[keys[i]] = props
      } else if(!jQuery.isFunction(prop)) {
        if(jQuery.isPlainObject(prop)) {
          index = srcStack.lastIndexOf(prop)
          if(index > 0) {
            obj[keys[i]] = dstStack[index]
            continue
          }
        }
        obj[keys[i]] = prop.$clone(srcStack, dstStack)
      }
    }
    return obj
  }
})

// Array的处理
defineMethods([Array.prototype], {
  '$clone': function(srcStack,dstStack) {
    var thisArr = this.valueOf(),
        newArr = [],
        keys = Object.keys(thisArr),
        index,
        element
    
    srcStack = srcStack || []
    dstStack = dstStack || []
    srcStack.push(this)
    dstStack.push(newArr)

    for(var i = 0; i < keys.length; i++) {
      element = thisArr[keys[i]]
      if(element === null || element === undefined) {
        newArr[keys[i]] = element
      } else if(!jQuery.isFunction(element)) {
        if(jQuery.isPlainObject(element)) {
          index = srcStack.lastIndexOf(element)
          if(index > 0) {
            newArr[keys[i]] = dstStack[index]
            continue
          }
        }
      }
      newArr[keys[i]] = element.$clone(srcStack, dstStack)
    }
    return newArr
  }
})

// Date类型处理
defineMethods([Date.prototype], {
  '$clone': function() {
    return new Date(this.valueOf())
  }
})

// RegExp的处理
defineMethods([RegExp.prototype], {
  '$clone': function() {
    var pattern = this.valueOf()
    var flags = ''
    flags += pattern.global ? 'g' : ''
    flags += pattern.ignoreCase ? 'i' : ''
    flags += pattern.multiline ? 'm' : ''
    return new RegExp(pattern.source, flags)
  }
})

//Number, Boolean 和 String 的处理，这样能防止像单个字符串这样的对象错误地去调用Object.prototype.$clone
defineMethods([
  Number.prototype,
  Boolean.prototype,
  String.prototype
], {
  '$clone': function() {
    return this.valueOf()
  }
})
```

其中 `jQuery.isFunction` 与 `jQuery.isPlainObject` 均为 `jquery`中的方法，支持 `Object` 、 `Array` 、 `Date` 、`RegExp`的深复制，但不支持函数的复制

用法示例:
```js
var arr1=[2,3,4,5]
var arr2=arr1.$clone()

console.log(arr1)
// => [2,3,4,5]
console.log(arr1 === arr2)
// => false
```