<template>
  <div>
    <CategoryPopup
        v-if="CategoryPopupVisible && categories"
        :category="categories[activeCategory]"
        @closeCategoryPopup="closeCategoryPopup"
        @closeWhitChangeCategoryPopup="closeWhitChangeCategoryPopup"
        @closeWhitDeleteCategoryPopup="closeWhitDeleteCategoryPopup"
    />
    <SubcategoryPopup
        v-if="SubcategoryPopupVisible && selectSubcategory"
        :subcategory="selectSubcategory"
        @closeSubcategoryPopup="closeSubcategoryPopup"
        @closeWhitChangeSubcategoryPopup="closeWhitChangeSubcategoryPopup"
    />
    <div class="page-title">
      <h3>Категории</h3>
    </div>
    <Loader v-if="loadingCategory"/>
    <section v-else class="categories">
      <div class="collection ">
        <div v-if="categories.length!==0">
          <a
              v-for="(category, i) in categories"
              :key="category.id"
              class="collection-item"
              :class="{ active: i === activeCategory}"
              @click="selectCategories(category.id, i)"
          >{{category.name}}</a>
        </div>
        <div v-else>
          <span>Категорий пока что нет...</span>
        </div>
        <a
            class="collection-item"
            style="color:#26A69A"
            @click="showCategoryPopup('new')"
        >
          Добавить новую категорию
        </a>
      </div>

      <Loader v-if="loadingSubcategory"/>

      <div v-else-if="categories.length!==0" class="collection" style="width: 60%">
        <div>
          <a class="collection-header">
            <h4>
              {{categories[activeCategory].name}}
              <button @click="showCategoryPopup" class="btn-small btn">
                <i class="tiny material-icons">create</i>
              </button>
            </h4>
            <img :src="categories[activeCategory].representation" alt="">
          </a>
        </div>
        <div v-if="subcategories.length!==0">
          <a
              v-for="subcategory in subcategories"
              :key="subcategory.id"
              class="collection-item"
              @click="showSubcategoryPopup(subcategory)"
          >{{subcategory.name}}</a>
        </div>
        <a
            class="collection-item"
            @click="showSubcategoryPopup({name:'',category:categories[activeCategory].id})"
            style="color:#26A69A; border-top: 1px solid #ddd;">
          Добавить новую подкатегорию
        </a>
      </div>
    </section>
  </div>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";
    import CategoryPopup from "@/components/popup/CategoryPopup";
    import SubcategoryPopup from "@/components/popup/SubcategoryPopup";

    export default {
        name: "Categories",
        components: {SubcategoryPopup, CategoryPopup},
        data: () => ({
            loadingCategory: true,
            loadingSubcategory: true,
            categories: [],
            subcategories: [],
            activeCategory: 0,
            selectSubcategory: null,
            CategoryPopupVisible: false,
            SubcategoryPopupVisible: false
        }),
        async mounted() {
            await this.$store.dispatch('categories/getAllCategories')
            if (this.gettersGetAllCategories.length !== 0) {
                this.categories = this.gettersGetAllCategories
                await this.$store.dispatch('categories/getSelectSubcategories', this.categories[this.activeCategory].id)
                this.subcategories = this.gettersGetSelectSubcategories
            }
            this.loadingCategory = false
            this.loadingSubcategory = false
        },
        computed: {
            ...mapGetters('categories', {
                gettersGetAllCategories: 'allCategories',
                gettersGetSelectSubcategories: 'selectSubcategories'
            }),

        },
        methods: {
            async selectCategories(id, item) {
                this.loadingSubcategory = true
                this.activeCategory = item;
                await this.$store.dispatch('categories/getSelectSubcategories', id)
                this.subcategories = this.gettersGetSelectSubcategories
                this.loadingSubcategory = false
            },
            ...mapActions('orders', {
                actionGetOrders: 'getAllOrders'
            }),
            showCategoryPopup(status) {
                if (status === 'new') {
                    const newCategory = {
                        name: '',
                        representation: ''
                    }
                    this.categories.push(newCategory)
                    this.activeCategory = this.categories.length - 1
                }
                this.CategoryPopupVisible = true
            },
            closeCategoryPopup() {
                if (this.categories[this.categories.length - 1].name === "") {
                    this.categories.pop()
                    this.activeCategory = 0
                }
                this.CategoryPopupVisible = false
            },
            async closeWhitChangeCategoryPopup() {
                this.CategoryPopupVisible = false
                await this.$store.dispatch('categories/getAllCategories')
                this.categories = this.gettersGetAllCategories
                await this.$store.dispatch('categories/getSelectSubcategories', this.categories[this.activeCategory].id)
                this.subcategories = this.gettersGetSelectSubcategories
                this.loadingCategory = false
                this.loadingSubcategory = false
            },
            closeWhitDeleteCategoryPopup() {
                this.closeWhitChangeCategoryPopup()
                this.activeCategory = 0
            },


            showSubcategoryPopup(subcategory) {
                this.selectSubcategory = subcategory
                this.SubcategoryPopupVisible = true
            },
            closeSubcategoryPopup() {
                this.SubcategoryPopupVisible = false
            },
            closeWhitChangeSubcategoryPopup() {
                this.SubcategoryPopupVisible = false
                this.selectCategories(this.categories[this.activeCategory].id, this.activeCategory)
            }
        }
    }
</script>

<style scoped>
  .categories {
    display: flex;
    align-items: flex-start;
  }

  .collection {
    min-width: 40%;
    max-height: 33rem;
    overflow-y: scroll;
  }

  .collection::-webkit-scrollbar {
    width: 0;

  }

  .collection-header {
    color: black;
    border-bottom: 1px solid #e0e0e0;
  }

  .collection-header img {
    object-fit: cover;
    width: 300px;
    height: 250px;
  }

  a.collection-item {
    color: black;
    border-top: 1px solid #e0e0e0;
  }

  .collection-item.active {
    background-color: green;
    color: white;
  }
</style>