console.log('product.js');

// # 使用 vue3 option 來撰寫登入方法
import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import pagination from './pagination.js';
import delModal from './delModal.js';
import productModal from './productModal.js'

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
      // delProductModal: null,
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
      ]
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
      axios
        .get(`${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`)
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
        this.activeStar(0);
        this.$refs.pModal.openModal();
      } else if (state === 'edit') {
        this.temProduct = { ...item };
        this.activeStar(this.temProduct.star)
        console.log('edit', this.temProduct);
        if (!Array.isArray(this.temProduct.imagesUrl)) {
          this.temProduct.imagesUrl = [];
        }
        this.isNew = false;

        this.$refs.pModal.openModal();
      } else if (state === 'del') {
        this.temProduct = { ...item };
        this.$refs.delModal.openModal();
      }
    },
    updateProduct(localProduct) {
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${localProduct.id}`;
      let http = 'put';
      if (this.isNew) {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/`;
        http = 'post';
      }
      axios[http](url, { data: localProduct })
        .then((res) => {
          alert(res.data.message);
          this.$refs.pModal.closeModal();
          this.getProducts();
        })
        .catch((err) => {
          alert(err.data);
        });
    },
    delProduct() {
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.temProduct.id}`;
      axios
        .delete(url)
        .then((res) => {
          alert(res.data.message);
          this.$refs.delModal.closeModal();
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
    uploadCheck(e) {
      if (e.target.files && e.target.files.length > 0) {
        this.file = e.target.files[0];
        console.log('files-e', e);
        console.log('files-size', this.file.size);

        const sizeKB = (this.file.size / 1024).toFixed(2);
        const maxFileSize = 3 * 1024;
        if (sizeKB >= maxFileSize) {
          this.sizeCheck = true;
        }
      } else {
        // 如果沒有選擇文件，重置相關狀態
        this.temProduct.imageUrl = '';
      }
    },
    uploadImg(){
      const formDate = new FormData();
      formDate.append('file-to-upload', this.file);
      axios.post(`${this.apiUrl}/api/${this.apiPath}/admin/upload`, formDate)
        .then(res => {
          this.temProduct.imageUrl = res.data.imageUrl;
          alert('圖片上傳成功!')
        })
        .catch(err => {
          console.log(err);
        })
    },
    changeStar(starNum){
      this.temProduct.star = starNum;
      this.activeStar(starNum);
    },
    activeStar(num){
      this.starArray.forEach((star, index) => {
        // console.log(star);
        if (star.id <= num) {
          this.starArray[index].colorActive = true;
        } else {
          this.starArray[index].colorActive = false;
        }
      });
      this.temProduct.star = num;
    }
  },
  computed: {
    showStarArray(){
      return this.starArray.map((star) => ({
        ...star,
        colorActive: star.id <= this.temProduct.star
      }))
    },
  },
  mounted() {
    // openModal
    

    // 取得 cookie
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('Ryan='))
      ?.split('=')[1];
    axios.defaults.headers.common['Authorization'] = token;
    this.checkAdmin();
  },
});

app.component('pagination', pagination);
app.component('productModal', productModal);
app.component('delModal', delModal);
app.mount('#app');
