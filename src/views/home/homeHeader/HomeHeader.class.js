import Utils from '@/module/utils/Utils.module';
import { httpUrl } from '@/module/systemConfig/SystemConfig.module.js';

export default {
  name: 'HomeHeader', // 头部快捷菜单
  components: {},
  data() {
    return {
      userInfo: {
        userName: '',
        account: '0.00'
      }
    };
  },

  watch: {
    '$store.state.userInfo': {
      handler(newValue) {
        if (newValue && newValue.userfront) {
          this.userInfo = Object.assign({}, { userName: newValue.userfront.name, account: newValue.userfront.amount });
        }
      },
      deep: true,
      immediate: true
    }
  },

  mounted() {},

  beforeDestroy() {},

  destroyed() {},

  methods: {},

  render(h) {
    return <div class="home-header"></div>;
  }
};
