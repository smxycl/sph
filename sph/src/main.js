import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import TypeNav from '@/components/TypeNav'
Vue.component(TypeNav.name, TypeNav)
import '@/mock/mockServer'
import 'swiper/css/swiper.css'
//全局注册分页组件
import Pagination from '@/components/Pagination'
Vue.component(Pagination.name, Pagination)
import * as API from '@/api'
Vue.config.productionTip = false
// 引入element-ui组件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 将ElementUI插件变为Vue的
Vue.use(ElementUI)
new Vue({
  render: h => h(App),
  beforeCreate() {
    Vue.prototype.$bus = this
    Vue.prototype.$API = API
  },
  router,
  store,

}).$mount('#app')
