<template>
  <div class="popup_wrapper" ref="popup_wrapper">
    <div class="popup">
      <form class="card">
        <div class="card-content">
          <span class="card-title" style="font-weight:bold">Подкатегория {{subcategory.name}}</span>
          <div class="input-field">
            <input
                id="name"
                type="text"
                v-model.trim="name"
                :class="{invalid: ($v.name.$dirty && !$v.name.minLength)}"
            >
            <label for="name">Название</label>
            <small class="helper-text invalid"
                   v-if="$v.name.$dirty && !$v.name.required"
            >Введите название подкатегории</small>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between">
            <button
                v-if="subcategory.id!==undefined"
                class="btn waves-effect waves-light red"
                type="button"
                @click="deleteSubcategory"
            >
              <i class="large material-icons">delete</i>
            </button>
            <div style="display: flex; align-items: center; justify-content: flex-end">
              <button
                  class="btn waves-effect waves-light green"
                  type="button"
                  @click="changeSubcategory"
              >Сохранить
              </button>
              <button class="btn waves-effect waves-light red" @click="closeSubcategoryPopup">
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
        name: "SubcategoryPopup",
        props: {
            subcategory: {
                type: Object,
            }
        },
        data: () => ({
            name: "",

        }),
        validations: {
            name: {required, minLength: minLength(3)},
        },
        created() {
            const {name} = this.subcategory
            this.name = name

        },
        methods: {
            closeSubcategoryPopup() {
                this.$emit('closeSubcategoryPopup')
            },
            closeWhitChangeSubcategoryPopup() {
                this.$emit('closeWhitChangeSubcategoryPopup')
            },
            async changeSubcategory() {
                if (this.$v.$invalid) {
                    this.$v.$touch()
                    return
                }
                if (this.subcategory.id===undefined) {
                    const payload = {
                        category: this.subcategory.category,
                        name: this.name,
                    }
                    await this.$store.dispatch('categories/createSubcategory',payload)
                } else {
                    const payload = {
                        id: this.subcategory.id,
                        name: this.name
                    }
                    await this.$store.dispatch('categories/patchChangeSubcategory', payload)
                }

                this.closeWhitChangeSubcategoryPopup()
            },
            async deleteSubcategory() {
                await this.$store.dispatch('categories/deleteSubcategory', this.subcategory.id)
                this.closeWhitChangeSubcategoryPopup()
            }

        },
        mounted() {
            M.updateTextFields();
            let vm = this
            document.addEventListener('click', function (item) {
                if (item.target === vm.$refs['popup_wrapper']) {
                    vm.closeSubcategoryPopup()
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

  .btn {
    margin: 0 0.5rem;
  }
</style>