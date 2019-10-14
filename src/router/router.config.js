import Login from '@/views/login/Login.view.vue';

export default [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/Home.view.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
];
