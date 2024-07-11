console.log('product.js');

// # 使用 vue3 option 來撰寫登入方法
import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const app = createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'ryanpro',
      products: [],
      temProduct: {
        imagesUrl: [],
      },
      isNew: false,
      pages: {},
      productModal: null,
      delProductModal: null,
    };
  },
  methods: {
    checkAdmin() {
      axios
        .post(`${this.apiUrl}/api/user/check`)
        .then((res) => {
          console.log(res);
          this.getProducts();
        })
        .catch((err) => {
          console.log(err);
          window.location = 'login.html';
        });
    },
    getProducts() {
      axios
        .get(`${this.apiUrl}/api/${this.apiPath}/admin/products`)
        .then((res) => {
          // console.log(res.data);
          this.products = res.data.products;
          this.pages = res.data.pagination;
          console.log(this.products);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    openModal(state, item) {
      if (state === 'new') {
        this.temProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        this.productModal.show();
      } else if (state === 'edit') {
        this.temProduct = { ...item };
        console.log('edit', this.temProduct);
        if (!Array.isArray(this.temProduct.imagesUrl)) {
          this.temProduct.imagesUrl = [];
        }
        this.isNew = false;
        this.productModal.show();
      } else if (state === 'del') {
        this.temProduct = { ...item };
        this.delProductModal.show();
      }
    },
    updateProduct(){
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.temProduct.id}`;
      let http = 'put'
      if(this.isNew){
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/`;
        http = 'post'
      }
      axios[http](url, {data:this.temProduct}).then(res => {
        alert(res.data.message)
        this.productModal.hide();
        this.getProducts()
      })
      .catch(err => {
        alert(err.data.message)
      })
    },
    delProduct(){
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.temProduct.id}`;
      axios.delete(url).then(res => {
        alert(res.data.message)
        this.delProductModal.hide();
        this.getProducts()
      })
      .catch(err => {
        alert(err.data.message)
      })
    },
    addImage() {
      if (!this.temProduct.imagesUrl) {
        this.temProduct.imagesUrl = [''];
      } else {
        this.temProduct.imagesUrl.push('');
      }
    },
  },
  mounted() {
    // openModal

    this.productModal = new bootstrap.Modal(this.$refs.productModal, {
      keyboard: false,
      backdrop: false,
    });

    this.delProductModal = new bootstrap.Modal(this.$refs.delProductModal, {
      keyboard: false,
      backdrop: false,
    });

    // 取得 cookie
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('Ryan='))
      ?.split('=')[1];
    axios.defaults.headers.common['Authorization'] = token;
    this.checkAdmin();
  },
});

app.mount('#app');
