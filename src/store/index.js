import Vue from 'vue';
import Vuex from 'vuex';
import authModule from './modules/auth'
import ordersModule from './modules/orders'
import categoriesModule from "@/store/modules/categories";
import productsModule from '@/store/modules/products'
Vue.use(Vuex);

export default new Vuex.Store({
    mutations: {
    },
    actions: {
    },
    modules: {
        auth: authModule,
        orders:ordersModule,
        categories:categoriesModule,
        products:productsModule
    },
});