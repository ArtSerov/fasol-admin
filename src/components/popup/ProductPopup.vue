<template>
  <div class="popup_wrapper" ref="popup_wrapper">
    <div class="popup">

      <form class="card">
        <Loader
            v-if="loading"
        />
        <div v-else class="card-content">
          <span class="card-title" style="font-weight:bold">Продукт {{name}}</span>

          <div class="input-field" v-if="subcategories.length!==0">
            <select id="subcategory" v-model="subcategoryId" ref="select">
              <option
                  v-for="sub of subcategories" :key="sub.id" :value="sub.id"
              >{{sub.name}}
              </option>
            </select>
            <label for="subcategory">Подкатегория</label>
          </div>
          <div v-else class="input-field">
            <input
                id="subcategory_disabled"
                type="text"
                disabled
                value="Подкатегорий не добавленно"
            >
            <label for="subcategory_disabled">Подкатегория</label>
          </div>

          <div class="input-field">
            <input
                id="name"
                type="text"
                v-model.trim="name"
                :class="{invalid: ($v.name.$dirty && !$v.name.required) || ($v.name.$dirty && !$v.name.minLength)}"
            >
            <label for="name">Название</label>
            <small class="helper-text invalid"
                   v-if="$v.name.$dirty && !$v.name.required"
            >Введите название</small>
            <small class="helper-text invalid"
                   v-if="$v.name.$dirty && !$v.name.minLength"
            >Не меньше 3 символов</small>
          </div>

          <img :src="representation" :alt="representation" style="width: 200px; height: 150px">
          <div class="input-field file-field">
            <div class="btn-small">
              <i class="material-icons">image</i>
              <input type="file" accept="image/jpeg, image/png" @change="onFileSelected">
            </div>
            <div class="file-path-wrapper">
              <input class="file-path validate" type="text">
            </div>
          </div>

          <div class="input-field">
            <input
                id="weight"
                type="text"
                v-model.trim="weight"
                :class="{invalid: ($v.weight.$dirty && !$v.weight.required) || ($v.weight.$dirty && !$v.weight.minLength)}"
            >
            <label for="weight">Вес</label>
            <small class="helper-text invalid"
                   v-if="$v.weight.$dirty && !$v.weight.required"
            >Укажите вес <i>(прим. 500 грамм)</i></small>
            <small class="helper-text invalid"
                   v-if="$v.weight.$dirty && !$v.weight.minLength"
            >Не меньше 2 символов</small>
          </div>

          <div class="input-field">
            <input
                id="composition"
                type="text"
                v-model="composition"
            >
            <label for="composition">Состав</label>
          </div>

          <div class="input-field">
            <input
                id="price"
                type="number"
                v-model.trim="price"
                min="0" value="0" step="0.01"
                :class="{invalid: ($v.price.$dirty && !$v.price.required) || ($v.price.$dirty && !$v.price.minLength)}"
            >
            <label class="active" for="price">Цена</label>
            <small class="helper-text invalid"
                   v-if="$v.weight.$dirty && !$v.weight.required"
            >Введите цену</small>
          </div>

          <p>
            <label>
              <input type="checkbox" class="filled-in" :checked="in_stock" @change="in_stock= !in_stock"/>
              <span>В наличии</span>
            </label>
          </p>

          <div class="input-field">
            <textarea id="description" v-model="description" class="materialize-textarea"></textarea>
            <label class="active" for="description">Описание</label>
          </div>


          <div  style="display: flex; align-items: center; justify-content: space-between">
            <button
                v-if="productId!==''"
                @click="deleteProduct"
                class="btn waves-effect waves-light red"
                type="button"
            >
              <i class="large material-icons">delete</i>
            </button>
            <div style="display: flex; align-items: center; justify-content: flex-end">
              <button
                  class="btn waves-effect waves-light green"
                  type="button"
                  @click.prevent="changeProduct"
              >Сохранить
              </button>
              <button @click="closeProductPopup" class="btn waves-effect waves-light red">
                Закрыть
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
    import Materialize from "materialize-css";
    import {mapGetters} from "vuex";
    import {required, minLength} from "vuelidate/lib/validators"

    export default {
        name: "ProductPopup",
        props: ["productId"],
        data: () => ({
            loading: true,
            select: null,
            subcategories: [],
            subcategoryId: "",
            name: "",
            representation: "",
            description:"",
            weight: "",
            composition: "",
            price: null,
            in_stock:true,
            selectedFile: null,
        }),
        validations: {
            name: {required, minLength: minLength(3)},
            weight: {required, minLength: minLength(2)},
            price: {required,}
        },
        async mounted() {
            if (this.productId !== "") {
                await this.$store.dispatch('products/getProduct', this.productId)
                const product = this.gettersGetSelectProduct
                if(product.subcategory){
                    this.subcategoryId = product.subcategory.id
                }
                this.name = product.name
                this.representation = product.representation
                this.weight = product.weight
                this.composition = product.composition
                this.price = product.price
                this.description = product.description
                this.in_stock = product.in_stock
            }
            await this.$store.dispatch('categories/getAllSubcategories')
            if (this.gettersGetAllSubcategories.length !== 0) {
                this.subcategories = this.gettersGetAllSubcategories
                if (this.productId === "") {
                    this.subcategoryId = this.subcategories[0].id
                }
            }
            setTimeout(() => {
                this.select = Materialize.FormSelect.init(this.$refs.select)
                Materialize.updateTextFields()
            }, 600)
            this.loading = false
            let vm = this
            document.addEventListener('click', function (item) {
                if (item.target === vm.$refs['popup_wrapper']) {
                    vm.closeProductPopup()
                }
            })
        },
        watch: {
            subcategoryId(value) {
                this.subcategoryId = value
            }
        },
        destroyed() {
            if (this.select && this.select.destroy) {
                this.select.destroy()
            }
        },
        computed: {
            ...mapGetters('products', {
                gettersGetSelectProduct: 'selectProduct'
            }),
            ...mapGetters('categories', {
                gettersGetAllSubcategories: 'allSubcategories'
            })
        },
        methods: {
            closeProductPopup() {
                this.$emit('closeProductPopup')
            },
            onFileSelected(event) {
                this.selectedFile = event.target.files[0]
                this.representation = event.target.files[0].name
                this.representation = URL.createObjectURL(this.selectedFile);
            },
            async changeProduct() {
                if (this.$v.$invalid) {
                    this.$v.$touch()
                    return
                }
                const fd = new FormData()
                if (this.selectedFile) {
                    fd.append('representation', this.selectedFile, this.selectedFile.name)
                }
                if(this.subcategoryId!==""){
                    fd.append('subcategory', this.subcategoryId)
                }
                fd.append('name', this.name)
                fd.append('weight', this.weight)
                fd.append('composition', this.composition)
                fd.append('price', this.price)
                fd.append('description', this.description)
                fd.append('in_stock', this.in_stock)
                const payload = {
                    id: this.productId,
                    data: fd
                }
                if (this.productId!=="") {
                    await this.$store.dispatch('products/patchChangeProduct', payload)

                }else{
                    await this.$store.dispatch('products/createProduct', payload)
                }
                const idx = this.subcategories.findIndex(s => s.id === this.subcategoryId)
                this.$emit('closeWhitChangeProductPopup', {
                    id: this.productId,
                    name: this.name,
                    subcategory: this.subcategories.length!==0 ? this.subcategories[idx].name : "Не выбрана",
                    price: this.price,
                    representation: this.representation,
                    in_stock: this.in_stock
                })
            },
            async deleteProduct() {
                await this.$store.dispatch('products/deleteProduct', this.productId)
                this.$emit('closePostDelete')
            }
        }
    }
</script>

<style scoped>
  .popup_wrapper {
    background: rgba(255, 255, 255, .6);
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
  }

  .popup {
    width: 45%;
    position: fixed;
    top: 10%;
    z-index: 1;
  }

  .card{
    max-height: 85vh;
    overflow-y: scroll;
  }


  .btn {
    margin: 0 0.5rem;
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