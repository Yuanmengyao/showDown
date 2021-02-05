import "babel-polyfill"
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import 'assets/css/main.scss';
import '@/utils/antd'; //按需引入 ant-design-vue
import './assets/css/icon/iconfont.css'

//全局路由守卫
router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    next()
  } else if (!sessionStorage.getItem('userInfo')) {
    next('/login')
  } else {
    next()
  }
})

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
