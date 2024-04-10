import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
import store from '@/store'
import Home from "@/views/Home";
import Search from "@/views/Search";
import Detail from "@/views/Detail";
import AddCartSuccess from "@/views/AddCartSuccess";
import ShopCart from "@/views/ShopCart";
import Register from "@/views/Register";
import Login from "@/views/Login";
import Trade from "@/views/Trade";
import Pay from "@/views/Pay";

// 重写push && replace
// 获取原型对象push||replace函数
const originalPush = VueRouter.prototype.push;
const originalReplace = VueRouter.prototype.replace;
// 修改原型对象中的push函数
// 1. location: 告诉原来的push放发，你往哪里跳转（传递哪些参数）
// 2. resolve：成功的回调
// 3. reject：失败的回调
// 修改原型对象中的push函数
VueRouter.prototype.push = function push(location, resolve, reject) {
  if (resolve && reject) {
    // call与apply的区别
    // 相同点，都可以调用函数一次，都可以修改函数上下文一次
    // 不同点，call与apply传递参数，call传递参数用逗号隔开，apply方法执行，传递数组
    originalPush.call(this, location, resolve, reject);
  } else {
    originalPush.call(
      this,
      location,
      () => { },
      () => { }
    );
  }
};
// 修改原型对象中的replace函数
VueRouter.prototype.push = function push(location, resolve, reject) {
  if (resolve && reject) {
    originalReplace.call(this, location, resolve, reject);
  } else {
    originalReplace.call(
      this,
      location,
      () => { },
      () => { }
    );
  }
};
let routes = [
  {
    name: 'pay',
    path: '/pay',
    component: Pay,
    // meta: { "isShow": true }   //自定义元数据属性，判断Footer组件在底部是否显示
  },
  {
    name: 'trade',
    path: '/trade',
    component: Trade,
    // meta: { "isShow": true }   //自定义元数据属性，判断Footer组件在底部是否显示
  },

  {
    path: '/register',
    component: Register
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/shopcart',
    name: 'shopcart',
    component: ShopCart
  },
  {
    path: '/addcartsuccess',
    name: 'addcartsuccess',
    component: AddCartSuccess
  },
  {
    path: '/detail/:skuId?',
    component: Detail
  },
  {
    path: '/search/:keyword?',  // 参数可传可不传
    name: 'search',
    component: Search
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/',
    redirect: '/home'
  }
]
let router = new VueRouter({
  routes,
  //滚动行为
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    return { y: 0 }
  },
})
router.beforeEach(async (to, from, next) => {
  let token = store.state.user.token
  let username = store.state.user.userInfo.name
  const whiteList = ['/trade', '/pay', '/center']
  if (token) {
    if (username) {
      next()
    } else {
      // await store.dispatch('getUserInfo');
      // next();
      try {
        await store.dispatch('getUserInfo');
        next();
      } catch (error) {
        //token失效从新登录
        await store.dispatch('logout');
        next('/login')
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next('/login');
    } else {
      next()
    }
  }
})

//   if (token) {
//     // 用户已经登陆：去登陆页面->不可以，去往首页
//     if (to.path == '/login') {
//       next('/home')
//     } else {
//       // 用户登陆了：但去往的页面不是login
//       if (username) {
//         // 如果用户信息已经得到了，就放行去全部页面（除去'/login'）
//         next();
//       }
//       else {
//         try {
//           // 如果没有用户信息，派发action得到用户信息再跳转
//           await store.dispatch('getUserInfo')
//           // 获取用户信息成功，再放行
//           next('/home')
//         } catch (error) {
//           await store.dispatch('logout')
//           next('/login')
//         }
//       }
//     }
//   } else {
//     next()
//   }
// })


export default router
