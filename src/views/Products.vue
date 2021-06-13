<template>
  <div>
    <ProductPopup
        v-if="productPopupVisible && productDetail"
        :productId="productDetail.id"
        @closeProductPopup="closeProductPopup"
        @closeWhitChangeProductPopup="closeWhitChangeProductPopup"
        @closePostDelete="closePopupPostDelete"
    />
    <div class="page-title" style="justify-content: left">
      <h3>Продукты</h3>
      <button @click.prevent="showProductPopup(null)" class="btn-small btn" style="margin: 0 0.5rem">
        <i class="tiny material-icons">add</i>
      </button>
      <div style="display: flex; align-items: center;" >
        <input type="search" id="site-search" v-model="searchCondition"
               placeholder="Поиск продукта">
        <button class="btn-small" @click="searchProduct(searchCondition)">
          <i class="material-icons">search</i>
        </button>
      </div>
    </div>
    <Loader v-if="loading"/>
    <div v-else-if="products.length===0">
      <h3>Продуктов пока что нет...</h3>
    </div>
    <div v-else class="products-container">

      <div
          v-for="product in products"
          :key="product.id"
          style="display: flex; flex-direction: column"
          class="card">
        <div class="card-image">
          <img :src="product.representation" :alt="product.name">
          <a class="btn-floating halfway-fab waves-effect waves-light #26A69A"
             @click="showProductPopup(product)"
          ><i class="material-icons">create</i></a>
        </div>
        <div class="property"><b>Название:</b></div>
        <div class="property">{{product.name}}</div>
        <div class="property"><b>В наличии:</b></div>
        <div class="property" :style="{color:product.in_stock?'green':'red'}">{{product.in_stock?'Есть':'Нет'}}</div>
        <div class="property" style="margin-top:auto;"><b>Подкатегория:</b>
        </div>
        <div class="property">{{product.subcategory===null?'Не выбрана':product.subcategory}}</div>
        <div class="property" style="margin-top:auto; padding-bottom: 10px"><b>Цена:</b> {{product.price |
          currency('RUB')}}
        </div>
      </div>
    </div>
    <Pagination v-if="total>1"
        :total="total"
        @pageChanged="loadListProducts"
        :current="page"
    />
  </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import ProductPopup from "@/components/popup/ProductPopup";
    import Pagination from "@/components/app/Pagination";

    export default {
        name: "Products",
        components: {Pagination, ProductPopup},
        data: () => ({
            loading: true,
            products: [],
            productPopupVisible: false,
            productDetail: null,
            searchCondition: "",
            page:1,
            total:0,
        }),
        mounted() {
            this.loadListProducts(this.page)
        },
        methods: {
            async loadListProducts(pageNumber) {
                this.loading = true
                this.page=pageNumber
                await this.$store.dispatch('products/getAllProducts', pageNumber)
                this.products = this.gettersGetAllProducts
                this.total = this.gettersGetProductsCount
                this.loading = false
            },
            showProductPopup(selectedProduct) {
                if (selectedProduct) {
                    this.productDetail = selectedProduct
                } else {
                    this.productDetail = {
                        id: ""
                    }
                }
                this.productPopupVisible = true
            },
            closeProductPopup() {
                this.productPopupVisible = false
            },
            closeWhitChangeProductPopup(product) {
                this.productPopupVisible = false
                if (product.id !== "") {
                    const idx = this.products.findIndex(p => p.id === product.id)
                    this.products[idx].name = product.name
                    this.products[idx].subcategory = product.subcategory
                    this.products[idx].price = product.price
                    this.products[idx].representation = product.representation
                    this.products[idx].in_stock = product.in_stock
                }else if(this.products.length<=20){
                    const idx = this.products.length - 1
                    this.products[idx].subcategory = product.subcategory
                }else{
                    if(this.total===this.page){
                        this.page = this.total+1
                        this.total += 1
                    }
                    this.loadListProducts(this.page)
                }
            },
            closePopupPostDelete() {
                this.loading = true
                this.productPopupVisible = false
                if (this.products.length===19){
                    this.page = this.total-1
                    this.total -= 1
                }
                this.loadListProducts(this.total)
            },
            async searchProduct(condition){
                this.loading = true
                await this.$store.dispatch('products/getSearchProduct',condition)
                this.products = this.gettersGetAllProducts
                this.total = this.gettersGetProductsCount
                this.loading = false
            }

        },
        destroyed() {
            if (this.select && this.select.destroy) {
                this.select.destroy()
            }
        },
        computed: {
            ...mapGetters('products', {
                gettersGetAllProducts: 'allProducts'
            }),
            ...mapGetters('products', {
                gettersGetProductsCount: 'productsCount'
            }),

        },
    }
</script>

<style scoped>
  .products-container {
    display: flex;
    flex-wrap: wrap;
    overflow-y: scroll;
    max-height: 70vh;
  }

  .card {
    margin: 0.5rem;
    width: 23%;
    align-items: center;
  }

  .card img {
    object-fit: cover;
    height: 200px;
    width: 100%;
  }

  .property {
    padding: 0 15px;
    margin-top: 0;
    margin-bottom: 0;
    margin-right: auto;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }

  ::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }

</style>