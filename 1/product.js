console.log('product.js');

// # 使用 vue3 option 來撰寫登入方法
import { createApp } from 'https://unpkg.com/vue@3.4.31/dist/vue.esm-browser.js';

import pagination from './pagination.js';
import productModal from './productModal.js';

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
      file: null,
      sizeCheck: false,
      starArray: [
        {
          id: 1,
          colorActive: false,
        },
        {
          id: 2,
          colorActive: false,
        },
        {
          id: 3,
          colorActive: false,
        },
        {
          id: 4,
          colorActive: false,
        },
        {
          id: 5,
          colorActive: false,
        },
      ],
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
    getProducts(page = 1) {
      // 參數預設值
      axios
        .get(`${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`)
        .then((res) => {
          // console.log(res.data);
          this.products = res.data.products;
          this.pages = res.data.pagination;
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // openModal(state, item) {
    //   if (state === 'new') {
    //     this.temProduct = {
    //       imagesUrl: [],
    //     };
    //     this.isNew = true;
    //     this.$refs.poModal.openModal();
    //   } else if (state === 'edit') {
    //     this.temProduct = { ...item };
    //     this.active(this.temProduct.star); // 繪製星星
    //     console.log('edit', this.temProduct);
    //     console.log('starArray', this.starArray);
    //     if (!Array.isArray(this.temProduct.imagesUrl)) {
    //       this.temProduct.imagesUrl = [];
    //     }
    //     this.isNew = false;
    //     this.$refs.poModal.openModal();
    //   } else if (state === 'del') {
    //     this.temProduct = { ...item };
    //     this.delProductModal.show();
    //   }
    // },
    openModal(state, item) {
      if (state === 'new') {
        this.temProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        this.$refs.poModal.openModal();
      } else if (state === 'edit') {
        this.temProduct = JSON.parse(JSON.stringify(item)); // 深拷貝
        console.log('edit', this.temProduct);
        console.log('starArray', this.starArray);
        if (!Array.isArray(this.temProduct.imagesUrl)) {
          this.temProduct.imagesUrl = [];
        }
        this.isNew = false;
        this.$refs.poModal.openModal();
      } else if (state === 'del') {

        this.temProduct = { ...item };
        this.delProductModal.show();
      }
    },
    updateTemProduct(updatedProduct) {
      this.temProduct = updatedProduct;
    },
    updateProduct() {
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.temProduct.id}`;
      let http = 'put';
      if (this.isNew) {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/`;
        http = 'post';
      }
      axios[http](url, { data: this.temProduct })
        .then((res) => {
          alert(res.data.message);
          this.$refs.poModal.closeModal();
          this.getProducts();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    delProduct() {
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.temProduct.id}`;
      axios
        .delete(url)
        .then((res) => {
          alert(res.data.message);
          this.delProductModal.hide();
          this.getProducts();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    addImage() {
      if (!this.temProduct.imagesUrl) {
        this.temProduct.imagesUrl = [''];
      } else {
        this.temProduct.imagesUrl.push('');
      }
    },

    // 【檢查圖片】: 判斷引入圖片檔是否大於 3 MB。
    uploadCheck(e) {
      this.file = e.target.files[0];
      // 取得檔案大小並轉換為 KB
      const sizeKB = (e.target.files[0].size / 1024).toFixed(2);
      // 設定檔案最大為 3 MB
      const maxFileSize = 3 * 1024;
      if (sizeKB >= maxFileSize) {
        this.sizeCheck = true;
      } else {
        this.sizeCheck = false;
      }
    },

    // 【上傳圖片】
    upload() {
      const formData = new FormData();
      formData.append('file-to-upload', this.file);

      axios
        .post(`${this.apiUrl}/api/${this.apiPath}/admin/upload`, formData)
        .then((res) => {
          this.temProduct.imageUrl = res.data.imageUrl;
          alert('圖片上傳成功');
        })
        .catch((err) => console.log(err));
    },
    // 【設定變色邏輯】: 依據點擊到的 id 來比對渲染數目。
    active(num) {
      this.starArray.forEach((item, idx) => {
        if (item.id <= num) {
          this.starArray[idx].colorActive = true;
        } else {
          this.starArray[idx].colorActive = false;
        }
      });
      this.temProduct.star = num;
    },
    // 【重置】: 回復星級預設值。
    reset() {
      this.active(0);
    },
    updateStar(id) {
      this.temProduct.star = id;
      this.active(id);
    },
  },
  mounted() {
    // openModal

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
app.component('product-modal', productModal);
app.component('pagination', pagination);
app.mount('#app');



