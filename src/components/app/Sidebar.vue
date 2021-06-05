<template>
  <ul class="sidenav app-sidenav" :class="{open: value}">
    <router-link
        v-for="link in links"
        :key="link.url"
        tag="li"
        active-class="active"
        :to="link.url"
    >
      <a v-if="link.url!=='/login'" :href="link.url" class="waves-effect waves-orange pointer">{{ link.title }}</a>
      <a v-else @click="logout">{{ link.title }}</a>
    </router-link>
  </ul>
</template>

<script>
    import {mapActions} from "vuex";

    export default {
        name: "Sidebar",
        props: ['value'],
        data: () => ({
            links: [
                {title: 'Заказы', url: '/orders'},
                {title: 'Продукты', url: '/products'},
                {title: 'Категории', url: '/categories'},
                {title: 'Выход', url: '/login'},
            ]
        }),
        methods: {
            ...mapActions('auth', {
                actionLogout: 'logout'
            }),
            logout(){
                    this.actionLogout()
                }
            }
    }
</script>

<style scoped>

</style>