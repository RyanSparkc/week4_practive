export default {
  props: ['pages'],
  emits: ['get-products'],
  template: `
    <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li class="page-item" :class="{disabled: !pages.has_pre}">
            <a class="page-link" href="#" aria-label="Previous" @click.prevent="emitGetProducts(pages.current_page - 1)">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <li class="page-item" :class="{active: page === pages.current_page}" v-for="page in pages.total_pages" :key="page + 123">
            <a class="page-link" href="#" @click.prevent="emitGetProducts(page)">{{page}}</a>
          </li>
          <li class="page-item" :class="{disabled: !pages.has_next}">
            <a class="page-link" href="#" aria-label="Next" @click.prevent="emitGetProducts(pages.current_page + 1)">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
    </nav>
    `,
  methods: {
    emitGetProducts(page) {
      this.$emit('get-products', page);
    },
  },
};
