<template>
  <div class="orders-page">

    <OrderPopup
        v-if="isPopupVisible && oredrDetail"
        @closePopup="closeOrder"
        :order="oredrDetail"
    />

    <div class="page-title" style="justify-content: left">
      <h3>Заказы</h3>
      <button class="btn-small btn" @click.prevent="selectStatus(statuses[activeItem].status, activeItem)">
        <i class="tiny material-icons">autorenew</i>
      </button>
    </div>
    <div>
      <div>
        <nav class="nav-extended" style="background-color: green;">
          <div class="nav-content">
            <ul class="tabs tabs-transparent" style=" display: flex; justify-content: space-around">
              <li v-for="(status, i) in statuses"
                  :key="status.status"
                  :class="{ active: i === activeItem}"
                  class="tab">
                <a @click="selectStatus(status.status, i)">{{status.title}}</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <Loader v-if="loading"/>
      <OrdersTable
          v-else
          @showOrder="showOrder"
          :orders="orders"
      />
    </div>
  </div>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";
    import OrderPopup from "@/components/popup/OrderPopup";
    import OrdersTable from "@/components/app/OrdersTable";

    export default {
        name: "Orders",
        components: {
            OrdersTable,
            OrderPopup
        },
        data: () => ({
            loading: true,
            orders: null,
            statuses: [
                {title: 'НОВЫЕ ЗАКАЗЫ', status: 'new'},
                {title: 'ОБРАБОТАННЫЕ ЗАКАЗЫ', status: 'ready'},
                {title: 'ВЫПОЛНЕННЫЕ ЗАКАЗЫ', status: 'completed'},
                {title: 'ОТМЕНЁННЫЕ ЗАКАЗЫ', status: 'cancelled'},
            ],
            activeItem: 0,
            isPopupVisible: false,
            oredrDetail: null,
        }),
        async mounted() {
            await this.$store.dispatch('orders/getAllOrders', 'new')
            this.orders = this.gettersGetAllOrders
            this.loading = false
        },
        computed: {
            ...mapGetters('orders', {
                gettersGetAllOrders: 'allOrders'
            })
        },
        methods: {
            async selectStatus(status, item) {
                this.loading = true
                this.activeItem = item;
                await this.$store.dispatch('orders/getAllOrders', status)
                this.orders = this.gettersGetAllOrders
                this.loading = false
            },
            ...mapActions('orders', {
                actionGetOrders: 'getAllOrders'
            }),
            showOrder(order) {
                this.isPopupVisible = true
                this.oredrDetail = order
            },
            closeOrder() {
                this.selectStatus(this.statuses[this.activeItem].status,this.activeItem)
                this.isPopupVisible = false
            }
        }

    }
</script>

<style scoped>

</style>