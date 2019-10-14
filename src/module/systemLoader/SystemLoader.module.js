import Vue from 'vue';
import router from '@/router/router';
import store from '@/store/store';
import iview from 'iview';

import Observer from '@/module/observer/Observer.module';
import Http from '@/module/http/Http.module';

import PageScrollbar from '@/components/pageScrollbar/PageScrollbar.view';
import PageLoading from '@/components/pageLoading/PageLoading.view';

import 'iview/dist/styles/iview.css';
import '@/icons'; // svg图标
import '@/styles/index.less';

const ObserverClass = Observer.of();
/**
 * 系统初始化加载器
 * 全局对象 全局组件可以在这里进行初始化
 */
class SystemLoader {
  mountGlobalVariable() {
    window.xa = {};
    window.xa.vue = Vue;
    window.xa.router = router;
    window.xa.store = store;
    window.xa.systemEvent = ObserverClass;
    return this;
  }
  mountGlobalComponents() {
    const componentsMap = {
      PageScrollbar,
      PageLoading
    };
    Object.keys(componentsMap).map(item => Vue.component(item, componentsMap[item]));
    return this;
  }
  mountGlobalVueConfig() {
    Vue.config.productionTip = false;
    return this;
  }
  mountGlobalVuePrototype() {
    Vue.prototype.$http = Http.of();
    Vue.prototype.$customEvent = ObserverClass;
    return this;
  }
  mountGlobalPlugin() {
    Vue.use(iview);
    return this;
  }
  bootstrap() {
    return new Promise((resolve, reject) => {
      this.mountGlobalVariable()
        .mountGlobalComponents()
        .mountGlobalVueConfig()
        .mountGlobalVuePrototype()
        .mountGlobalPlugin();

      resolve({ router, store });
    });
  }
}

SystemLoader.of = function() {
  return new SystemLoader();
};

export default SystemLoader;
