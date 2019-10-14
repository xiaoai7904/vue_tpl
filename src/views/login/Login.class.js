import Rule from '@/module/rule/Rule.module';
import Utils from '@/module/utils/Utils.module';
import { httpUrl } from '@/module/systemConfig/SystemConfig.module.js';

export default {
  name: 'login',

  data() {
    const isRemeber = localStorage.getItem('username') || '';
    return {
      loginFormModel: {
        username: 'admin' || isRemeber,
        password: '123123'
      },
      loginFormRule: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }, { validator: Rule.of().validate.userlength, trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { validator: Rule.of().validate.passwordlength, trigger: 'blur' }]
      },
      remember: !!isRemeber,
      pageLoaidng: false
    };
  },

  watch: {
    remember(newValue) {
      if (newValue) {
        localStorage.setItem('username', this.loginFormModel.username);
      } else {
        localStorage.removeItem('username');
      }
    }
  },

  mounted() {

  },

  methods: {
    enterEvent() {
      this.login()
    },
    login() {
      this.$refs.loginFormRef.validate(valid => {
        if (valid) {
          if (this.remember) {
            localStorage.setItem('username', this.loginFormModel.username);
          }
          this.requestLogin();
        }
      });
    },
    requestLogin() {
      this.pageLoaidng = true
      this.$http.post(httpUrl.login, { loginSource: 'PC', userType: 1, rememberMe: 1, safeCode: '123123', username: this.loginFormModel.username, password: Utils.of().encrypt(this.loginFormModel.password) }).then(
        data => {
          console.log(data)
          if (data.data.code === 0) {
            this.$store.dispatch('requestUserInfo').then(data => {
              this.$customEvent.trigger('login_success', data.data.userfront)
              localStorage.setItem('isLogin', true);
              this.$router.push('/home');
              this.$Notice.success({
                title: `${this.loginFormModel.username},登录成功`,
                desc: ''
              });
            });
          }
          this.pageLoaidng = false
        },
        err => {
          this.pageLoaidng = false
        }
      );
    }
  }
};
