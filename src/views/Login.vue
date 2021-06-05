<template>
  <form class="card auth-card" @submit.prevent="login">
    <div class="card-content">
      <span class="card-title">Моя Фасоль. Администратор</span>
      <div class="input-field">
        <input
            id="phone"
            type="text"
            v-model.trim="phone"
            :class="{invalid: ($v.phone.$dirty && !$v.phone.required) || ($v.phone.$dirty && !$v.phone.phoneMask)}"
        >
        <label for="phone">Телефон</label>
        <small class="helper-text invalid"
               v-if="$v.phone.$dirty && !$v.phone.required"
        >Поле телефон не должно быть пустым</small>
        <small class="helper-text invalid"
               v-if="$v.phone.$dirty && !$v.phone.phoneMask"
        >Введите корректый телефон <i>89XXXXXXXXX</i></small>
      </div>
      <div class="input-field">
        <input
            id="password"
            type="password"
            v-model.trim="password"
            :class="{invalid: ($v.password.$dirty && !$v.password.required) || ($v.password.$dirty && !$v.password.minLength)}"
        >
        <label for="password">Пароль</label>
        <small class="helper-text invalid"
               v-if="$v.password.$dirty && !$v.password.required"
        >Введите пароль</small>
        <small class="helper-text invalid"
               v-if="$v.password.$dirty && !$v.password.minLength"
        >Пароль не меньше 4 символов</small>
      </div>
    </div>
    <div class="card-action">
      <div>
        <button
            class="btn waves-effect waves-light auth-submit"
            type="submit"
        >
          Войти
        </button>
      </div>

      <p class="center">
        Забыли пароль?
        <router-link to="/" class="blue-text">Восстановить</router-link>
      </p>
    </div>
  </form>
</template>

<script>
    import {helpers, required, minLength} from "vuelidate/lib/validators"
    import {mapActions, mapGetters} from 'vuex'
    import router from "@/router";
    const phoneMask = helpers.regex('phoneMask', /^89.\d{8}$/)
    export default {
        name: 'login',
        data: () => ({
            phone: '',
            password: '',
        }),
        computed: {
            ...mapGetters('auth',{
                gettersLoginApiStatus:'getLoginApiStatus'
            })
        },
        validations: {
            phone: {phoneMask, required},
            password: {required, minLength: minLength(4)}
        },
        methods: {
            ...mapActions('auth',{
                actionLogin:'login'
            }),
            async login(){
                if(this.$v.$invalid){
                    this.$v.$touch()
                    return
                }
                await this.actionLogin({phone:this.phone, password:this.password})
                if(this.gettersLoginApiStatus === 'success'){
                    alert('login success')
                    router.push('/orders')
                }else{
                    alert('filed to login')
                }
            }
        }
    }
</script>