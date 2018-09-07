# 锋利的JQuery(第2版)
---

## JQuery对象和DOM对象的相互转换

首先约定编码规范，如果获取的是`jQuery`对象，则在变量前面加上 `$` :
```js
var $variable = $('#cr')
```

## jQuery对象转为DOM对象

- jQuery对象是一个类似数组的对象，可以通过`[index]`的方法得到相应的DOM对象。

```js
var $cr = $('#cr');   // jQuery对象
var cr = $cr[0]   // DOM对象
```

- 使用jQuery本身提供的 `get(index)` 方法。

```js
var $cr = $('#cr');   // jQuery对象
var cr = $cr.get(0)   // DOM对象
```

## DOM对象转为jQuery对象

只需要使用 `$()`将DOM对象包装起来即可。
```js
var cr = document.getElementById('cr);      // DOM对象
var $cr = $(cr);    // jQuery对象
```

## `$()`包装选择器

>使用 `jQuery` 自带的选择器，由于其内部的预防措施，所以即使是选取了网页中并不存在的元素，
也不会报错。同时，因为 `$()` 选择器选取的一个对象类型，所以想要判断选取的 `jQuery` 对象
是否存在，不能直接判断，需要将其转换为`DOM`对象 ，或者判断其长度。

```js
// 这样判断永远都返回 true，是行不通的
if ($('#tt')) {
    // do something
}
```

需要使用以下两种方法：
```js
if ($('#tt').length > 0) {
    // do something
}

// 或者
if($('#tt)[0]) {
    // do something
}
```

## 选择器中含有空格的注意事项

```js
// .text 和 :hidden 之间存在空格，空格在 jQuery 选择器中就代表后代选择器，
// 所以最后选取到的结果其实是 class 为 text 元素下的隐藏子元素
var $a = $('.test :hidden');

// .text 和 :hidden 之间不存在空格，选取到的结果就是 class 为 test 的隐藏元素
var $b = $('.test:hidden');
```

##  判断是否含有某个样式

```js
$('p').hasClass('tt');
```

`hasClass()` 这个方法实质上是在 `jQuery` 的内部调用了 `is()` 方法，
也就是说上面一点代码等于下面这段：
```js
// 注意方法参数中类名前需要加点号 `.`
$('p').is('.tt')
```

## `val()` 方法

`val()` 方法可以返回任何能够带有 `value` 属性的`HTML`标签，如果带有参数，则具备设置值的功能，
除此之外， `val()` 还有一个功能，就是**它能使 `select checkbox radio` 标签相应的项被选中。**

```html
<!-- 单选下拉框： -->
<select id='single'>
    <option>first</option>
    <option>second</option>
</select>
```
```js
// 选中第二个选项
$('#single').val('second');
```
```html
<!-- 多选下拉框： -->
<select id='multiple' multiple='multiple' style='height:120px;'>
	<option>first</option>
	<option>second</option>
	<option>third</option>
</select>
```
```js
// 选中第一、二个选项
$('#multiple').val(['first','second']);
```

```html
<!-- 多选框： -->
<input type="checkbox" value='check1'> 多选框1
<input type="checkbox" value='check2'> 多选框2
<input type="checkbox" value='check3'> 多选框3
```
```js
// 选择第二、三个多选框
$(':check').val(['check1','check2']);
```
```html
<!-- 单选框： -->
<input type="radio" value="radio1">单选1
<input type="radio" value="radio2">单选2
```
```js
// 选择第一个单选按钮
$(':radio').val(['radio1'])
```

## 取得最近的匹配父元素(包括自身也会检查一遍)，逐级向上查找。

```js
$(document).bind('click', function(e) {
	$(e.target).closest('li').css('color','red');
})
```

## `CSS-DOM` 操作

```js
// 单个元素
$('p').css('color', 'red');

// 多个元素，注意，属性名如果不加引号可能需要使用驼峰写法，
// 如果加了引号，则是否使用驼峰写法可以任选，规范期间，建议加上引号
$('p').css({'font-size':'30px', 'fontWeight':'bold', backgroundColor:'red', 'color':'red'})
```

## `css()` 方法和 `height()` 方法获取元素高度的区别

```js
$('div').css('height');
$('div').height();
```

`css()` 方法获取的高度值与样式的设置有关，也就是说可能会得到 `auto` 或者 `10px` 之类的字符串，
而 `height()` 获得的高度则是元素在页面中的实际高度，与样式的设置不存在必然联系，并且不带单位。
与此类似的还有元素宽度(`width()`)的获取等。

## 文档加载简写代码

以下三种写法完全相同：
```js
// 完整写法
$(document).ready(function(){});

// 简写1
$().ready(function(){});

// 简写2
$(function(){})
```

## 事件绑定

### 绑定的事件类型

```
blur focus load resize scroll unload click dblclick mousedown mouseup
mousemove mouseover mouseout mouseenter mouseleave change select submit
keydown keypress keyup error
```

相比于原生 `JavaScript` 事件来说，`jQuery` 的事件绑定类型少了 `on`

### 事件绑定简写

`jQuery` 提供了一套事件绑定的简写方法，简写的唯一作用就是缩减了代码量
```js
$('.tt').click(function(){

})

// 等同于：

$('.tt').bind('click', function(){

})
```

### 合成事件

`jQuery`有两个合成事件: `hover()` & `toggle()`

```js
hover(enter, leave)

$('.tt').hover(function(){
	// 光标移入触发的事件
}, function(){
	// 光标移出触发的事件
})
```
```js
// 用于模拟鼠标连续单击事件，第1次鼠标单击触发指定的第1个函数(fn1)，第2次单击触发指定
// 的第2个函数(fn2)，依次触发下去，直到最后一个，然后如果继续触发，则从头开始重复触发。
toggle(fn1, fn2,...fnN):

$('.tt').toggle(function(){
	// 第1次事件触发时执行的函数
}, function(){
	// 第2次事件触发时执行的函数
})
```

### 触发自定义事件

```js
// 首先定义自定义事件
$('#btn').bind('myClick', function(){
	console.log('ok');
})

// 使用 trigger 触发自定义事件
$('#btn').trigger('myClick');
```

### 为事件添加命名空间，便于管理

批量卸载事件
```js
$(function(){
		// 命名空间为 plugin
		$('div').bind('click.plugin', function(){
				$('body').append('<p>click事件</p>')
		});
		// 命名空间为 plugin
		$('div').bind('mouseover.plugin', function(){
				$('body').append('<p>mouseover事件</p>');
		});
		// 没有设置命名空间
		$('div').bind('dblclick', function(){
				$('body'.append('<p>dblclick事件</p>'))
		});

		// 点击 button1 时，将卸载掉 click 和 mouseover 事件，因为它们属于 plugin 命名空间
		// dblclick事件则不受影响
		$('.button1').click(function(){
				$('div').unbind('.plugin');
		});
})
```

### 触发指定命名空间下的事件

```js
// 命名空间为 plugin
$('div').bind('click.plugin', function(){
		$('body').append('<p>click事件</p>')
});
// 没有设置命名空间
$('div').bind('click', function(){
		$('body').append('<p>click2事件</p>');
});

// 点击 button1 时，以上两个绑定事件都将被触发
$('.button1').click(function(){
		$('div').trigger("click");
});
// 点击 button12时，只触发 plugin 命名空间内的 click 事件
$('.button2').click(function(){
		$('div').trigger("click.plugin");
});
```

### 属性值获取：`attr()` 与 `prop()`

`attr()` 能够获取及设置元素的属性值，但是某些时候，比如获取`input`的`disable`属性时，
可能会出现问题。  在有些浏览器中，只要写了`disable` 属性就可以，而有些则需要写`disable='disable'`。
所以，从1.6版本开始，`jQuery` 提供新的方法来获取这些属性。
使用 `prop()` 时，返回值是标准属性：`true/false`，比如`$('#checkbox').prop('disable')`，
不会像`attr()`那样返回`disable`或者空字符串`""`，而是返回`true`或者`false`，进行属性赋值的时候同样如此。

>1. 只添加属性名称该属性就会生效时，应该使用`prop()`，例如`checkbox`的`disable`属性。
>2. 只存在`true/false`的属性时应该使用`prop()`

### 获取被点击的 `li` 元素在 `ul` 中的索引。

```js
var $li = $('li');
$li.click(function(){
	// 第一种获取方法
	var index1 = $(this).index();

	// 第二种获取方法
	var index2 = $li.index(this);
})
```

### `jQuery` 插件

- 表单验证插件：`jquery.validate.js`，一般可以与 `jquery.metadata.js` 配合使用，方便开发。

(1) 内置验证规则：必填、数字、E-Mail、URL、信用卡等19类
(2) 自定义验证规则
(3) 验证信息提示：内置提示 和 自定义提示
(4) 可以通过 keyup blur 等事件触发

- `form`插件: `jQuery.form.js`，支持`ajax`表单提交和`ajax`文件上传。

- 模态窗口插件: `jquery.simplemodal.js`

- 管理网站`cookie`：`jquery.cookie.min.js`

### 性能优化

- 选择器

性能从高到低：

>id > tagName > class > attribute( 例如：$("[type='button']") ) > 伪选择器(例如：$(':hidden'))

- 尽量缓存选择器对象

```js
// 最好这样：
var $li = $('ul>li');
$li.css('color','red');

// 而不是：
$('ul>li').css('color','red');
```

- 减少 `DOM` 操作

```js
// 最好这样(一次性插入拼接的元素)：
var temp_li="", $list=$('ul');
for(var i=0; i<100; i++){
		temp_li += '<li>' + i + '</li>';
}
// 注意这里使用了 html() 方法
$list.html(temp_li);

// 而不是这样(循环多次修改DOM)：
var $list=$('ul');
for(var i=0; i<100; i++){
		$list.append('<li>' + i + '</li>');
}
// 注意这里使用了 html() 方法
$list.html(temp_li);
```

- 使用简单的 `for` 或 `while` 循环，而不是 `jQuery` 的 `$.each()`

```js
// 最好这样:
var array = new Array();
for(var i=0; i<100; i++) {
		array[i] = i;
}

// 而不是：
var array = new Array(100);
$each(array, function(i){
		array[i] = i;
})
```

- 使用父级元素委托冒泡事件

```js
// 最好这样:
$('ul').click(function(e){
	var $clicked = $(e.target);
	$clicked.css('background', 'red');
});

// 或者使用 jQuery 1.7 提供的 on() 方法：
$('ul').on('click', 'td', function(){
	$(this).css('background', 'red');
});

// 而不是：
$('ul li').click(function(){
	$(this).css('background', 'red');
});
```

- 将需要重复多次使用的代码片段创建成插件

- 使用 `join()` 拼接字符串

```js
// 最好这样：
var array=[], $list=$('ul');
for(var i=0; i<20; i++){
		array[i] = '<li>'+i+'</li>';
		// 或者 array.push('<li>'+i+'</li>')
}
$list.html(array.join(''));

// 而不是：
var temp_li="", $list=$('ul');
for(var i=0; i<100; i++){
		temp_li += '<li>' + i + '</li>';
}
$list.html(temp_li);
```

- 合理利用 `HTML5` 的 `Data` 属性

```html
<div id="dl" data-role='page' data-options="{'name':'John'}"></div>
```

```js
$('#dl').data('role');      // page
$('#dl').data('options').name;      // John
```

- 尽量使用原生 `JavaScript` 方法,因为在很多时候这可以避免调用许多不需要使用的方法。

- 使用 `$.proxy()` 改变 `this` 指向

```html
<div id="panel">
		<button>1234</button>
</div>
<span>456</span>
```

```js
// 如果是下面这段代码，点击之后，消失的将是 `button` 元素
$('#panel button').click(function(){
		$(this).fadeOut();
})

// 如果使用 `$.proxy()` ，则消失的将是 `span` 元素
$('#panel button').click($.proxy(function(){
		$(this).fadeOut();
},$('span')))
```
