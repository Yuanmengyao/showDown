import Vue from "vue";
import VueRouter from "vue-router";
import ShutDown from 'views/shutDown'
import Login from '../views/login.vue'

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },

  {
    path: "/shutDown",
    name: "ShutDown",
    component: ShutDown
  },
  {
    path: "/channelManage",
    name: "ChannelManage",
    component: () => import('views/channelManage'),
  },
  {
    path: "/operateRecord",
    name: "OperateRecord",
    component: () => import('views/operateRecord'),
  },
  {
    path: "/userManage",
    name: "UserManage",
    component: () => import('views/userManage'),
  },
  {
    path: '/',
    redirect: {
      name: 'ShutDown'
    }
  },
  //  非法路由
  {
    path: '*',
    redirect: {
      name: 'ShutDown'
    }
  }
];

const router = new VueRouter({
  routes
});

export default router;
