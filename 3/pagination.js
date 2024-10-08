export default {
  props: ['pages'],
  emits: ['getProducts'],
  template: `
  <nav aria-label="Page navigation example">
        <pre>{{pages}}</pre>
        <ul class="pagination">
          <li class="page-item" :class="{disabled: !pages.has_pre}">
            <a class="page-link" href="#" aria-label="Previous" @click.prevent="getProducts(pages.current_page - 1)">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <li class="page-item" :class="{ active: page === pages.current_page }" v-for="(page, key) in pages.total_pages" :key="'page' + key">
            <a class="page-link" href="#" @click.prevent="getProducts(page)">{{ page }}</a>
          </li>
          <li class="page-item" :class="{disabled: !pages.has_next}">
            <a class="page-link" href="#" aria-label="Next" @click.prevent="getProducts(pages.current_page + 1)">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
  `,
  methods: {
    getProducts(page){
      this.$emit('getProducts', page);
    },
    // openModal(){
    //   this.delProductModal.show();
    // },
    // closeModal(){
    //   this.delProductModal.hide();
    // }
  },
  mounted() {
    
  },
};