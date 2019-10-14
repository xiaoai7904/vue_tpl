import Vue from 'vue';
import Router from 'vue-router';
import routerConfig from './router.config';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routerConfig
});

router.beforeEach((to, from, next) => {
  if (!!localStorage.getItem('isLogin')) {
    // 如果登录成功,页面在登录页直接跳转到主页
    to.path === '/login' ? next('/home') : next();
  } else {
    // 如果未登录并且没有在登录页 直接跳转到登录页
    to.path !== '/login' ? next('/login') : next();
  }
});

export default router;
