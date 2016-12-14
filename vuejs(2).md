##  从 1.x 到 2.x 重要变化

>(1) 在每个组件模板，不在支持片段代码
```
    组件中模板:
        之前:
            <template>
                <h3>我是组件</h3><strong>我是加粗标签</strong>
            </template>
        现在:  必须有根元素，包裹住所有的代码
            <template id="aaa">
                    <div>
                        <h3>我是组件</h3>
                        <strong>我是加粗标签</strong>
                    </div>
            </template>
```
>(2) 关于组件定义
```
    Vue.extend	这种方式，在2.0里面可以使用，但有些改动
    
    Vue.component(组件名称,{	在2.0继续能用，但不推荐，推荐使用简洁写法
        data(){}
        methods:{}
        template:
    });

    2.0 推出一个组件，简洁定义方式：
    var Home={
        template:''		->   Vue.extend()
    };
```
>(3) 生命周期
```
    1.x 版本:
        init	
        created
        beforeCompile
        compiled
        ready		√	->     mounted
        beforeDestroy	
        destroyed
    2.x 版本:
        beforeCreate	组件实例刚刚被创建,属性都没有
        created	实例已经创建完成，属性已经绑定
        beforeMount	模板编译之前
        mounted	模板编译之后，代替之前ready  *
        beforeUpdate	组件更新之前
        updated	组件更新完毕	*
        beforeDestroy	组件销毁前
        destroyed	组件销毁后
```
>(4) 循环
```
    2.0 里面默认就可以添加重复数据，无需 track by

    去掉了隐式一些变量
        $index	$key

    1.x 版本:
        v-for="(index,val) in array"
    2.x 版本:
        v-for="(val,index) in array"    //==>类似原生JS的forEach()函数
```

>(5) track-by="id"
```
    2.0 可以直接添加重复数据，所以直接删掉，但是如果还想要提高性能，
    变成
        <li v-for="(val,index) in list" :key="index">
```
>(6) 自定义键盘指令
```
    1.x 版本：Vue.directive('on').keyCodes.f1=17;	
    
    2.x 版本:  Vue.config.keyCodes.ctrl=17
```
>(7) 过滤器
```
    1.x 版本:
        系统就自带很多过滤
        {{msg | currency}}
        {{msg | json}}
        ....
        limitBy
        filterBy
        .....
    一些简单功能，自己通过js实现

    2.x 版本， 内置过滤器全部删除

        可以自己使用原生JS实现，或者使用 `lodash` 等工具库，例如自定义延迟过滤器：`_.debounce(fn,200)`

        自定义过滤器——还有
            但是,自定义过滤器传参

            1.x 版本:	    {{msg | toDou '12' '5'}}
            2.x 版本: 	{{msg | toDou('12','5')}}
```
>(8) 组件通信:
```
    vm.$emit()
    vm.$on();

    父组件和子组件:

    子组件想要拿到父组件数据:
        通过  props

    1.x 版本，子组件可以更改父组件信息，并且可以是父子组件同步更改(使用sync)：<child :msg.sync='aa'></child>
    2.x 版本，不允许直接给父级的数据，也就是不允许直接给父级的数据进行赋值操作(this.msg='newMsg')

    如果希望进行更改：
        a). 父组件每次传一个 `对象` (而不是单个的String或者Number类型的数据)给子组件, 对象之间互相引用，
            并没有直接对整个对象赋值，而是对 对象 的属性值进行复制, 并且对象是引用类型。
        b). 只是不报错, 使用mounted()钩子函数进行中转,不过只能更改子组件本身数据。
                mounted(){
                    this.b=this.parentData
                }
```

>(9) 单一事件管理组件通信:
        var Event=new Vue();

        Event.$emit(事件名称, data)

        Event.$on(事件名称,function(data){
            //data
        }.bind(this));


>(10) vue动画
```
    1) transition 
        1.x 版本 transition 是属性：
            <p transition="fade">transition</p>

            .fade-transition{}
            .fade-enter{}
            .fade-leave{}

        2.x 版本 transition 是组件：
            <transition name="fade">
                <p>transition</p>
            </transition>

            class定义:
            .fade-enter{}	//初始状态
            .fade-enter-active{}  //变化成什么样  ->  当元素出来(显示)

            .fade-leave{}
            .fade-leave-active{} //变成成什么样   -> 当元素离开(消失)

    2) 使用
        <transition enter-active-class="animated zoomInLeft" leave-active-class="animated zoomOutRight">
            <p v-show="show"></p>
        </transition>

        多个元素运动,需要放在一个 <transition-group>标签中:
            <transition-group enter-active-class="" leave-active-class="">
                <p :key=""></p>
                <p :key=""></p>
            </transition-group>

            //这一行是必须有的，定义了进入动画和离开动画的持续时间
            .fade-enter-active,.fade-leave-active {
                transition:1s all ease;
            }
            //这一行表示进入动作被激活，将要朝着这个样式进行变化
            .fade-enter-active{
                opacity: 1;
                width:300px;
                height: 300px;
            }
            //.fade-enter表示刚刚进入时的初始状态，动画将以这个样式状态作为起点进行进入的变化，
            //需要注意与.fade-enter-active的先后次序，如果放在.fade-enter-active上面，可能导致动画不起作用
            //.fade-leave没实质性的意义，不过官方建议加上，作为动画刚开始离开时刻的状态，动画将以这个样式状态作为起点进行离开的变化，一般与.fade-enter相同
            .fade-enter,.fade-leave {
                opacity: 0;
                width:100px;
                height: 100px;
            }
            //这一行表示离开动作被激活的状态，将要朝着这个样式进行变化
            .fade-leave-active{
                opacity: 0;
                width:100px;
                height: 100px;
            }
    3) 运动事件
        <transition name="fade"
            @before-enter="beforeEnter"
            @enter="enter"
            @after-enter="afterEnter"

            @before-leave='beforeLeave'
            @leave='leave'
            @after-leave='afetrLeave'>
            <p v-if="show">hello</p>
        </transition>

    4) 配合animate.css
        注意：使用animate.css 需要使用 class="animated" 指定需要运动的元素，有以下两种指定的形式：
            <transition enter-active-class="bounceInLeft" leave-active-class="bounceOutRight">
                <p v-if="show" class="animated">hello</p>
            </transition>
            或者
            <transition enter-active-class="bounceInLeft animated" leave-active-class="bounceOutRight animated">
                <p v-if="show">hello</p>
            </transition>
```
>(11) vue2.0 路由:
```
    http://router.vuejs.org/zh-cn/index.html
    
    1) 布局
	    <router-link to="/home">主页</router-link>
	    <router-view></router-view>

    2) 路由具体写法
        //组件
        var Home={
            template:'<h3>我是主页</h3>'
        };
        var News={
            template:'<h3>我是新闻</h3>'
        };

        //配置路由
        const routes=[
            {path:'/home', componet:Home},
            {path:'/news', componet:News},
        ];

        //生成路由实例
        const router=new VueRouter({
            routes
        });

        //最后挂到vue上
        new Vue({
            router,
            el:'#box'
        });
    3) 重定向
        之前  router.rediect  废弃了
        {path:'*', redirect:'/home'}

    4) 路由嵌套:
        /user/username

        const routes=[
            {path:'/home', component:Home},
            {
                path:'/user',
                component:User,
                children:[  //核心
                    {path:'username', component:UserDetail}
                ]
            },
            {path:'*', redirect:'/home'}  //404
        ];

    5) 传值
        /user/strive/age/10

        :id
        :username
        :age
    6) 路由实例方法:
        router.push({path:'home'});  //直接添加一个路由,表现切换路由，本质往历史记录里面添加一个
        router.replace({path:'news'}) //替换路由，不会往历史记录里面添加
    
    7) 路由切换可以与animate.css配合，产生页面切换动画的效果，类似swiper

    8) 脚手架:  vue-loader
        1.0  -> 
            new Vue({
                el: '#app',
                components:{App}
            })	

        2.0->
            new Vue({
                el: '#app',
                render: h => h(App)
            })

```
---

## 5. 组件样式
```
(1) MintUI:适应于移动端
(2) elementUI:适应于PC端
```