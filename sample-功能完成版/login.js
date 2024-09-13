console.log('login.js');

// # 使用 vue3 option 來撰寫登入方法
import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const app = createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      user: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    login() {
      axios
        .post(`${this.apiUrl}/admin/signin`, this.user)
        .then((res) => {
          console.log(res);
          const { token, expired } = res.data;
          document.cookie = `Ryan=${token}; expires=${new Date(expired)}`;
          window.location = 'product.html'
        })
        .catch((err) => {
          console.log(err.data.message);
        });
    },
  },
  mounted() {},
});

app.mount('#app');
