<template>
  <div class="card" style="width: 30%">
    <div class="card-content" >
      <span class="card-title" >Моя Фасоль. Администратор</span>
      <p>
        Вы находитесь на административной панели приложения
        "Моя Фосоль. Доставка" Для входа в панель Вам были выданы телефонный номер и пароль доступа.
        Если у вас нет этих данных обратитесь к админестратору.
      </p>
    </div>
    <div class="card-action">
      <div style="display: flex;justify-content: center">
        <router-link to="/login" class="blue-text">Продолжить</router-link>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "Main"
    }
</script>

<style scoped>

</style>