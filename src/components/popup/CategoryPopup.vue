<template>
  <div class="popup_wrapper" ref="popup_wrapper">
    <div class="popup">
      <form class="card">
        <div class="card-content">
          <span class="card-title" style="font-weight:bold">Категория {{category.name}}</span>
          <div class="input-field">
            <input
                id="name"
                type="text"
                v-model="name"
                :class="{invalid: ($v.name.$dirty && !$v.name.minLength)}"
            >
            <label for="name">Название</label>
            <small class="helper-text invalid"
                   v-if="$v.name.$dirty && !$v.name.required"
            >Введите название категории</small>
          </div>
          <img :src="representation" :alt="representation" style="width: 200px; height: 150px">
          <div class="input-field">
            <input
                type="file"
                accept="image/jpeg, image/png"
                @change="onFileSelected"
            >
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between">
            <button v-if="category.id!==undefined"
                class="btn waves-effect waves-light red"
                type="button"
                @click="deleteCategory"
            >
              <i class="large material-icons">delete</i>
            </button>
            <div style="display: flex; align-items: center; justify-content: flex-end">
              <button
                  class="btn waves-effect waves-light green"
                  type="button"
                  @click="changeCategory"
              >Сохранить
              </button>
              <button class="btn waves-effect waves-light red" @click="closeCategoryPopup">
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
    import M from 'materialize-css'
    import {required, minLength} from "vuelidate/lib/validators"

    export default {
        name: "CategoryPopup",
        props: {
            category: {
                type: Object,
            }
        },
        data: () => ({
            name: "",
            representation: "",
            selectedFile: null,

        }),
        validations: {
            name: {required, minLength: minLength(1)},
        },
        created() {
            const {name, representation} = this.category
            this.name = name
            this.representation = representation

        },
        methods: {
            closeCategoryPopup() {
                this.$emit('closeCategoryPopup')
            },
            closeWhitChangeCategoryPopup() {
                this.$emit('closeWhitChangeCategoryPopup')
            },
            closeWhitDeleteCategoryPopup(){
                this.$emit('closeWhitDeleteCategoryPopup')
            }
            ,
            onFileSelected(event) {
                this.selectedFile = event.target.files[0]
                this.representation = event.target.files[0].name
                this.representation = URL.createObjectURL(this.selectedFile);
            },
            async changeCategory() {
                if (this.$v.$invalid) {
                    this.$v.$touch()
                    return
                }
                const fd = new FormData()
                if (this.selectedFile) {
                    fd.append('representation', this.selectedFile, this.selectedFile.name)
                }
                fd.append('name', this.name)
                if (this.category.id === undefined) {
                    const payload = {
                        data: fd
                    }
                    await this.$store.dispatch('categories/createCategory', payload)
                } else {
                    const payload = {
                        id: this.category.id,
                        data: fd
                    }
                    await this.$store.dispatch('categories/patchChangeCategory', payload)
                }

                this.closeWhitChangeCategoryPopup()
            },
            async deleteCategory() {
                await this.$store.dispatch('categories/deleteCategory', this.category.id)
                this.closeWhitDeleteCategoryPopup()
            }

        },
        mounted() {
            M.updateTextFields();
            let vm = this
            document.addEventListener('click', function (item) {
                if (item.target === vm.$refs['popup_wrapper']) {
                    vm.closeCategoryPopup()
                }
            })

        }
    }

</script>
<style scoped>
  .popup_wrapper {
    background: rgba(255, 255, 255, .6);
    z-index: 1;
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

  .card-action {
    display: flex;
    justify-content: flex-end;
  }

  .btn {
    margin: 0 0.5rem;
  }

</style>