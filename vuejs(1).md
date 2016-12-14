针对1.x 版本

---

## 1. 初识vue
>(1) vue到底是什么?
```
    一个mvvm框架(库)、和angular类似
    比较容易上手、小巧
    mvc:
        mvp
        mvvm
        mv*
        mvx
    官网:http://cn.vuejs.org/	
    手册： http://cn.vuejs.org/api/
```
>(2) vue和angular区别?
```
        vue——简单、易学
            指令以 v-xxx
            一片html代码配合上json，在new出来vue实例
            个人维护项目

            适合: 移动端项目,小巧

            vue的发展势头很猛，github上start数量已经超越angular
        angular——上手难
            指令以 ng-xxx
            所有属性和方法都挂到$scope身上
            angular由google维护
            
            合适: pc端项目

        共同点: 不兼容低版本IE
```
>(3) vue基本雏形:
```
    angular展示一条基本数据:
        var app=angular.module('app',[]);

        app.controller('xxx',function($scope){	//C
            $scope.msg='welcome'
        })

        html:
        div ng-controller="xxx"
            {{msg}}

    vue展示一条基本数据:
        html:
            <div id="box">
                {{msg}}
            </div>

            var c=new Vue({
                el:'#box',	//选择器  class tagName
                data:{
                    msg:'welcome vue'
                }
            });
```
>(4) 常用指令:
```
    1) 双向数据绑定
        v-model	一般表单元素(input)	

    2) 循环:
        v-for="name in array"
            {{$index}}

        v-for="name in json"
            {{$index}}	{{$key}}
    
        v-for="(key,value) in json"
    3) 事件:
        v-on:click="函数名"    //==>函数名后面不用加圆括号
        v-on:click/mouseout/mouseover/dblclick/mousedown.....

        new Vue({
            el:'#box',
            data:{ //数据
                arr:['apple','banana','orange','pear'],
                json:{a:'apple',b:'banana',c:'orange'}
            },
            methods:{
                show:function(){	//方法
                    alert(1);
                }
            }
        });
    4) 显示隐藏:
            v-show=“true/false”

    5) 事件:
            v-on:click/mouseover......
            
            简写形式:
            @click=""		// 推荐

            事件对象:
                @click="show($event)"
            事件冒泡:
                阻止冒泡:  
                    a). ev.cancelBubble=true;ev.
                    b). @click.stop	推荐
            默认行为(默认事件):
                阻止默认行为:
                    a). ev.preventDefault();
                    b). @contextmenu.prevent	推荐
            键盘:
                @keydown	$event	ev.keyCode
                @keyup

                常用键:
                    回车
                        a). @keyup.13
                        b). @keyup.enter
                    上、下、左、右
                        @keyup/keydown.left
                        @keyup/keydown.right
                        @keyup/keydown.up
                        @keyup/keydown.down
                    .....

    6) 属性:
        v-bind:src=""
                width/height/title....
        
        简写:
        :src=""	推荐

        <img src="{{url}}" alt="">	效果能出来，但是会报一个404错误
        <img v-bind:src="url" alt="">	效果可以出来，不会发404请求

    7) class和style:
        :class=""	v-bind:class=""
        :style=""	v-bind:style=""

        :class="[red]"	red是数据
        :class="[red,b,c,d]"
        
        :class="{red:a, blue:false}"

        data:{
            json:{red:a, blue:false}
        }
        :class="json"

        style:
        :style="[c]"
        :style="[c,d]"
            注意:  复合样式，采用驼峰命名法
        :style="json"

    8) 模板:
        I. 双大括号
            {{msg}}

            此种将对输入的内容转义，并且与对应的v-model即时绑定
        II. 双大括号中加星号 `*`
            {{*msg}}

            只与v-mode绑定一次，后面就算v-model产生变化，也不再跟着变化
        III. 三大括号
            {{{msg}}}

            不会对输入的内容进行转义，也就是说将会识别HTML标签 

    9) 过滤器:-> 过滤模板数据
        系统提供一些过滤器:
        
        {{msg| filterA}}
        {{msg| filterA | filterB}}

        uppercase	eg:	{{'welcome'| uppercase}}
        lowercase
        capitalize

        currency	钱

        {{msg| filterA 参数}}

    10) 交互:
        $http	（ajax）

        如果vue想做交互

        引入: vue-resouce

        get:
            获取一个普通文本数据:
            this.$http.get('aa.txt').then(function(res){
                alert(res.data);
            },function(res){
                alert(res.status);
            });
            给服务发送数据:√
            this.$http.get('get.php',{
                a:1,
                b:2
            }).then(function(res){
                alert(res.data);
            },function(res){
                alert(res.status);
            });
        post:
            this.$http.post('post.php',{
                a:1,
                b:20
            },{
                emulateJSON:true
            }).then(function(res){
                alert(res.data);
            },function(res){
                alert(res.status);
            });
        jsonp:
            https://sug.so.360.cn/suggest?callback=suggest_so&word=a

            https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=a&cb=jshow

            this.$http.jsonp('https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su',{
                wd:'a'
            },{
                jsonp:'cb'	//callback名字，默认名字就是"callback"
            }).then(function(res){
                alert(res.data.s);
            },function(res){
                alert(res.status);
            });

```

---

## 2. 进阶

>(1) v-cloak		防止闪烁, 比较大段落

```
    <span>{{msg}}</span>		->   v-text
    {{{msg}}}			->   v-html
```
>(2) 计算属性的使用:
```
    1) computed:{
            b:function(){	//默认调用get
                return value
            }
        }
    
    2) computed:{
            b:{
                get:function(){return value}
                set:function(value){this.v=value}
            }
        }

    * computed里面可以放置一些业务逻辑代码，一定记得return
```
>(3) vue实例简单方法:
```
    vm.$el	->  就是元素
    vm.$data  ->  就是data
    vm.$mount ->  手动挂在vue程序
    
    vm.$options	->   获取自定义属性
    vm.$destroy	->   销毁对象
```
>(4) 循环：
```
    v-for="value in data"

    会有重复数据？
    track-by='索引'	提高循环性能

    track-by='$index/uid'
```
>(5) 过滤器:
```
    vue提供过滤器:
        capitalize	uppercase	currency....

        debounce	配合事件，延迟执行

    数据配合使用过滤器:
        limitBy	限制几个
        limitBy 参数(取几个)
        limitBy 取几个  从哪开始

        filterBy	过滤数据
        filterBy ‘谁’

        orderBy	排序
        orderBy 谁 1/-1
            1  -> 正序
            2  -> 倒序

    自定义过滤器:  model ->过滤 -> view
        Vue.filter(name,function(input){
            
        });

    时间转化器
    过滤html标记

    双向过滤器:*
    Vue.filter('filterHtml',{
                read:function(input){ //model-view
                    return input.replace(/<[^<+]>/g,'');
                },
                write:function(val){ //view -> model
                    return val;
                }
    });

    数据 -> 视图
    model -> view

    view -> model
```
>(6) 指令: 扩展html语法
```
    v-text
    v-for
    v-html
        

    自定义指令:
        属性:

        Vue.directive(指令名称,function(参数){
            this.el	-> 原生DOM元素
        });

        <div v-red="参数"></div>

        指令名称: 	v-red  ->  red

        * 注意: 必须以 v-开头

    自定义元素指令:（用处不大）
        Vue.elementDirective('my-red',{
            bind:function(){
                this.el.style.background='red';
            }
        });
```
>(7) 键盘事件
```
    @keydown.up
    @keydown.enter

    @keydown.a/b/c....

    自定义键盘信息:
        Vue.directive('on').keyCodes.ctrl=17;
        Vue.directive('on').keyCodes.myenter=13;
```
>(8) 监听数据变化:
```
    vm.$el/$mount/$options/....

    vm.$watch(name,fnCb);  //浅度监视，无法监视到对象内部属性的变化
    vm.$watch(name,fnCb,{deep:true});  //深度监视
```

>(9) 组件
```
    vue组件:
        组件: 可以看成是一个大对象

    定义一个组件:
    1) 全局组件
    var Aaa=Vue.extend({
        template:'<h3>我是标题3</h3>'
    });

    Vue.component('aaa',Aaa);

        *组件里面放数据:
            data必须是函数的形式，函数必须返回一个对象(json)
    2) 局部组件
        放到某个组件内部
        var vm=new Vue({
            el:'#box',
            data:{
                bSign:true
            },
            components:{ //局部组件
                aaa:Aaa
            }
        });
    
        另一种编写方式:
            Vue.component('my-aaa',{
                template:'<strong>推荐</strong>'
            });

            var vm=new Vue({
                el:'#box',
                components:{
                    'my-aaa':{
                        template:'<h2>标题2</h2>'
                    }
                }
            });
    
    3) 配合模板:
        I. template:'<h2 @click="change">标题2->{{msg}}</h2>'

        II. 单独放到某个地方
            a). <script type="x-template" id="aaa">
                <h2 @click="change">标题2->{{msg}}</h2>
            </script>
            b). <template id="aaa">
                <h1>标题1</h1>
                <ul>
                    <li v-for="val in arr">
                        {{val}}
                    </li>
                </ul>
            </template>
    
    4) 动态组件:
        <component :is="组件名称"></component>

    5) 父子组件数据传递
        vue默认情况下，子组件也没法访问父组件数据

            II. 子组件就想获取父组件data
                在调用子组件：
                    <bbb :m="数据"></bbb>

                子组件之内:
                    props:['m','myMsg']

                    props:{
                        'm':String,
                        'myMsg':Number
                    }
            II. 父级获取子级数据
                *子组件把自己的数据，发送到父级，父级使用 $on事件接收
                vm.$emit(事件名,数据);
                v-on:	@

            III.  vm.$dispatch(事件名,数据)	子级向父级发送数据
                vm.$broadcast(事件名,数据)	父级向子级广播数据
                配合: event:{}

                注意：在vue2.0里面已经，报废了

    6) slot:
        位置、槽口
        作用: 占个位置

        类似ng里面 transclude  （指令）

```


---

## 3. 模块化开发

>vue-> SPA应用，单页面应用<br>
>vue-resouce	交互<br>
>vue-router	路由
>vue-loader	使用webpack将vue文件打包成浏览器端可运行的js文件


>(1) vue-router
```
1) 基本使用
    html:
        <a v-link="{path:'/home'}">主页</a>	跳转链接
        
        展示内容:
        <router-view></router-view>
    js:
        //1. 准备一个根组件
        var App=Vue.extend();

        //2. Home News组件都准备
        var Home=Vue.extend({
            template:'<h3>我是主页</h3>'
        });

        var News=Vue.extend({
            template:'<h3>我是新闻</h3>'
        });

        //3. 准备路由
        var router=new VueRouter();

        //4. 关联
        router.map({
            'home':{
                component:Home
            },
            'news':{
                component:News
            }
        });

        //5. 启动路由
        router.start(App,'#box');

    跳转:
        router.redirect({
            '/':'/home'
        });

2) 路由嵌套(多层路由):

    主页	home
        登录	home/login
        注册	home/reg
    新闻页	news

    subRoutes:{
        'login':{
            component:{
                template:'<strong>我是登录信息</strong>'
            }
        },
        'reg':{
            component:{
                template:'<strong>我是注册信息</strong>'
            }
        }
    }

路由其他信息:
    /detail/:id/age/:age

    {{$route.params | json}}	->  当前参数

    {{$route.path}}	->  当前路径
    
    {{$route.query | json}}	->  数据
```
>(2) vue-loader:
```
    其他loader ->  css-loader、url-loader、html-loader.....

    后台: nodeJs	->  require  exports
        broserify  模块加载，只能加载js
        webpack   模块加载器， 一切东西都是模块, 最后打包到一块了

    require('style.css');	->   css-loader、style-loader


    vue-loader基于webpack


    .vue文件:
        放置的是vue组件代码，基本模式如下：

            <template>
                html
            </template>
        
            <style>
                css
            </style>
        
            <script>
                js	（平时代码、ES6）
            </script>
```

>(3) 使用webpack构建单页应用程序
```
    1)  简单的目录结构:
            ```
            |-index.html
            |-main.js	入口文件
            |-App.vue	vue文件，官方推荐命名法
            |-package.json	工程文件(项目依赖、名称、配置)
                npm init --yes 生成
            |-webpack.config.js	webpack配置文件
            ```

    2) webpak开发vue单页应用程序准备工作:
        //vue模块
        vue

        //webpack 相关模块
        webpack --save-dev
        webpack-dev-server --save-dev

        //vue相关模块
        vue-loader@8.5.4  // 将App.vue文件-> 变成正常js代码
        vue-loader@8.5.4
        vue-html-loader
        css-loader
        vue-style-loader
        vue-hot-reload-api@1.3.2

        //想要使用babel编译ES6代码，以下5个模块是必备组合
        babel-loader
        babel-core
        babel-plugin-transform-runtime
        babel-preset-es2015
```

>(4) vue-router vue-loader webpack 配合使用
```
    1) npm run dev
        ->  package.json
            "scripts":{
                "dev":"webpack-dev-server --inline --hot --port 8082"
            }

    2) bower查看版本：bower info vue-router

    3) 路由使用版本(对于vue1.x): 0.7.13，基本步骤

        配合vue-loader使用:
        I. 下载vue-router模块
            cnpm install vue-router@0.7.13
        II. 入口文件中(main.js)引入:
            import VueRouter from 'vue-router'

        III. 让vue使用vue-router
            Vue.use(VueRouter);

        IV. 配置路由
            var router=new VueRouter();
            router.map({
                路由规则
            })
        VI. 最后一步，开启路由
            router.start(App,'#app');

    4) 注意:

        之前: index.html	->   <app></app>
        现在: index.html	->   <div id="app"></div>

        App.vue	->   模板中需要一个 <div id="app"></div>  根元素进行包裹：
            
                <div id="app">
                    <h1>vue-loader vue--router</h1>
                    <div>
                        <a v-link="{path:'/home'}">Home Page</a>
                        <a v-link="{path:'/news'}">News Page</a>
                    </div>
                    <router-view></router-view>
                </div>

    5) 路由嵌套:
        和之前一模一样

    6) 上线:

        将整个项目打包，在package.json 中的 "scripts" 属性中添加：
            "build":"webpack -p"
            然后控制台执行：npm run build
            即可将整个项目打包到指定目录中（例如bundle.js），然后就可以直接以文件形式访问index.html，
            无需再借助webpack了。
```

>(5) 脚手架:
```
    1) vue-cli——vue脚手架
		帮你提供好基本项目结构
    2) 基本使用流程:
        I npm install vue-cli -g	安装 vue命令环境
            验证安装ok?
                vue --version
        II. 生成项目模板
            vue init <模板名> 本地文件夹名称
            例如：
                 vue init simple vue-cli-test
                 vue init webpack vue-cli-test
            现在默认安装vue@2.0版本，想要安装1.0需要显式指定：
                vue init simple@1.0 vue-cli-test
                 vue init webpack@1.0 vue-cli-test

            本身集成很多项目模板:
                simple		    个人觉得一点用都没有
                webpack	        大型项目使用
                                Eslint 检查代码规范，
                                单元测试等
                                安装此模块后，想要运行必须安装必要的依赖包，
                                首先就要控制台运行 `npm install`，
                                然后控制台运行 `npm run dev`
                webpack-simple	推荐个人使用

                browserify
                browserify-simple
```