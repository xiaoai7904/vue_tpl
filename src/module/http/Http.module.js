/**
 * 请求工具
 */
import Vue from 'vue';
import axios from 'axios';
import { code } from '@/module/systemConfig/SystemConfig.module';

const blackCode = [1300];
let isExpired = false;

class Http {
  constructor() {
    this.local = localStorage.getItem('i18n') || 'zh-Hans-CN';
    this.$http = axios.create({});
    this.init();
  }
  init() {
    this._defaultsConfig();
    this._interceptRequest();
    this._interceptResponse();
  }
  _defaultsConfig() {
    this.$http.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
    this.$http.defaults.headers.get['X-Requested-With'] = 'XMLHttpRequest';
    this.$http.defaults.responseType = 'json';
    this.$http.defaults.validateStatus = function(status) {
      return true;
    };
  }
  _interceptRequest() {
    this.$http.interceptors.request.use(request => request, error => Promise.reject(error));
  }
  _interceptResponse() {
    this.$http.interceptors.response.use(
      response => {
        if (response.status === 200 && response.data && response.data.code === 0) {
          return Promise.resolve(response);
        }
        if (response.data && response.data.code === 1401 && window.xa.router.history.current.path !== '/login') {
          !isExpired &&
            Vue.prototype.$Modal.error({
              title: code[this.local][response.data.code],
              content: '',
              onOk() {
                isExpired = false;
                localStorage.removeItem('isLogin');
                window.xa.router.push('/login')
              }
            });
          isExpired = true;
          return Promise.reject(response);
        }
        if (response.data && response.data.code === 1401) {
          return Promise.reject(response);
        }
        if (response.data && blackCode.indexOf(response.data.code) > -1) {
          return Promise.reject(response);
        }
        if (response.data && response.data.code) {
          Vue.prototype.$Message.error(code[this.local][response.data.code]);
          return Promise.reject(response);
        }
        if (response.data && response.data.status) {
          Vue.prototype.$Message.error(code[this.local][response.data.status]);
        }
        if (!response.data) {
          Vue.prototype.$Message.error(code[this.local][response.status || 504]);
        }
        return Promise.reject(response);
      },
      error => {
        Vue.prototype.$Message.error('数据拉取失败,请检查您的网络');
        return Promise.reject(error);
      }
    );
  }
  get(url, params) {
    return this.$http.get(url, params);
  }
  post(url, params) {
    return this.$http.post(url, params);
  }
}

Http.of = function() {
  return new Http();
};

export default Http;
