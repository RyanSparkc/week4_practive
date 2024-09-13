export default {
  props: ['temProduct', 'isNew', 'sizeCheck', 'starArray', 'file'],
  emits: [
    'uploadCheck',
    'uploadImg',
    'addImage',
    'changeStar',
    'activeStar',
    'updateProduct',
  ],
  data() {
    return {
      productModal: null,
    };
  },
  template: /*html*/ `
    <div id="productModal" ref="productModal" class="modal fade" tabindex="-1"
      aria-labelledby="productModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 id="productModalLabel" class="modal-title">
              <span v-if="isNew">新增產品</span>
              <span v-else>編輯產品</span>
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"
              aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="mb-2">
                  <div class="mb-3">
                    <label for="imageUrl" class="form-label">主要圖片網址</label>
                    <input type="text" class="form-control" placeholder="主要圖片連結" v-model="temProduct.imageUrl">
                  </div>
                  <img class="img-fluid" :src="temProduct.imageUrl" alt="">
                </div>
                <div class="mb-3">
                  <div class="input-group mb-2">
                    <input type="file" class="form-control"  accept=".jpg, .jpeg, .png" @change="uploadCheck($event)">
                    <button class="btn btn-outline-secondary" type="button" @click="uploadImg()">上傳</button>
                  </div>
                  <div v-if="sizeCheck"  class="text-danger">檔案不可大於 3MB !</div>
                  <div v-else class="text-success">檔案可以上傳 !</div>
                </div>
                <h3>新增多圖</h3>
                <div v-if="Array.isArray(temProduct.imagesUrl)">
                  <div class="mb-3" v-for="(img, key) in temProduct.imagesUrl" :key="key">
                    <div class="mb-2">
                      <label :for="'imageUrl' + key" class="form-label">圖片網址</label>
                      <input type="text" class="form-control" :id="'imageUrl' + key" v-model="temProduct.imagesUrl[key]" placeholder="圖片連結" >
                    </div>
                    <img class="img-fluid" :src="img" alt="">
                  </div>
                  <div v-if="!temProduct.imagesUrl.length || temProduct.imagesUrl.at(-1)">
                    <button class="btn btn-outline-primary btn-sm d-block w-100" @click="addImage">
                      新增圖片
                    </button>
                  </div>
                  <div v-else>
                    <button class="btn btn-outline-danger btn-sm d-block w-100" @click="temProduct.imagesUrl.pop()">
                      刪除圖片
                    </button>
                  </div>
                </div>
                <div v-else>
                  <button class="btn btn-outline-primary btn-sm d-block w-100" @click="addImage">
                    新增圖片1
                  </button>
                </div>
              </div>
              <div class="col-sm-8">
                <div class="mb-3">
                  <label for="title" class="form-label">標題</label>
                  <input id="title" type="text" class="form-control" placeholder="請輸入標題" v-model="temProduct.title">
                </div>

                <div class="row">
                  <div class="mb-3 col-md-6">
                    <label for="category" class="form-label">分類</label>
                    <input id="category" type="text" class="form-control" placeholder="請輸入分類" v-model="temProduct.category">
                  </div>
                  <div class="mb-3 col-md-6">
                    <label for="price" class="form-label">單位</label>
                    <input id="unit" type="text" class="form-control" placeholder="請輸入單位" v-model="temProduct.unit">
                  </div>
                </div>

                <div class="row">
                  <div class="mb-3 col-md-6">
                    <label for="origin_price" class="form-label">原價</label>
                    <input id="origin_price" type="number" min="0" class="form-control"
                      placeholder="請輸入原價" v-model="temProduct.origin_price">
                  </div>
                  <div class="mb-3 col-md-6">
                    <label for="price" class="form-label">售價</label>
                    <input id="price" type="number" min="0" class="form-control" placeholder="請輸入售價"  v-model="temProduct.price">
                  </div>
                  <div class="mb-3 col-md-6">

                    <pre>temProduct -  {{temProduct}}</pre>
                    
                    <label for="star" class="form-label">星級評價</label>
                    <div>
                      <a href="#" class="star bi bi-star-fill text-secondary fs-3 p-1" ref="starElement"
                      v-for="star in starArray" :key="star.id" :class="{'text-warning': star.colorActive, 'text-secondary': star.colorActive}" @click.prevent="changeStar(star.id)">
                      </a>
                      <button type="button" class="btn btn-sm btn-outline-secondary ms-3" @click="changeStar(0)">清除</button>
                    </div>
                  </div>
                </div>
                <hr>

                <div class="mb-3">
                  <label for="description" class="form-label">產品描述</label>
                  <textarea id="description" type="text" class="form-control" placeholder="請輸入產品描述" v-model="temProduct.description"></textarea>
                </div>
                <div class="mb-3">
                  <label for="content" class="form-label">說明內容</label>
                  <textarea id="content" type="text" class="form-control" placeholder="請輸入說明內容" v-model="temProduct.content"></textarea>
                </div>
                <div class="mb-3">
                  <div class="form-check">
                    <input id="is_enabled" class="form-check-input" type="checkbox" :true-value="1" :false-value="0" v-model="temProduct.is_enabled">
                    <label class="form-check-label" for="is_enabled">是否啟用</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
              取消
            </button>
            <button type="button" class="btn btn-primary" @click="updateProduct">
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  methods: {
    openModal() {
      this.productModal.show();
    },
    closeModal() {
      this.productModal.hide();
    },
    uploadImg() {
      this.$emit('uploadImg');
    },
    uploadCheck(event) {
      this.$emit('uploadCheck', event);
    },
    addImage() {
      this.$emit('addImage');
    },
    changeStar(num) {
      this.$emit('changeStar', num);
    },
    activeStar(num) {
      this.$emit('activeStar', num);
    },
    updateProduct() {
      this.$emit('updateProduct');
    },
  },
  mounted() {
    this.productModal = new bootstrap.Modal(this.$refs.productModal, {
      keyboard: false,
      backdrop: false,
    });
  },
};