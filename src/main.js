import Vue from 'vue'
import Vuelidate from "vuelidate/src";
import App from './App.vue'
import router from './router'
import store from './store'
import dateFilter from '@/filters/date.filter'
import Loader from "@/components/app/Loader";
import './registerServiceWorker'
import 'materialize-css/dist/js/materialize.min'
import currencyFilter from "@/filters/cyrrency.filter";

Vue.config.productionTip = false
Vue.use(Vuelidate)
Vue.filter('date', dateFilter)
Vue.filter('currency', currencyFilter)
Vue.component('Loader', Loader)
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
