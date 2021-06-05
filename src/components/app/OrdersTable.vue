<template>
  <div class="order-table">
    <section class="scroll-table">
      <table>
        <thead>
        <tr>
          <th>#</th>
          <th>Имя заказчика</th>
          <th>Дата</th>
          <th>Сумма</th>
          <th>Тип</th>
          <th>Открыть</th>
        </tr>
        </thead>
      </table>
      <div class="scroll-table-body">
        <table>
          <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{order.id}}</td>
            <td>{{order.first_name}} {{order.last_name}}</td>
            <td>{{order.order_date | date('datetime')}}</td>
            <td>{{order.basket.total_price | currency()}}</td>
            <td>
              <span class="white-text badge red">{{order.buying_type}}</span>
            </td>
            <td>
              <button class="btn-small btn" @click="showOrder(order)">
                <i class="material-icons">open_in_new</i>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script>
    export default {
        name: "OrdersTable",
        props: {
            orders: {
                type: Array,
            }
        },
        methods: {
            showOrder(order) {
                this.$emit('showOrder',order)
            },
        },
    }
</script>

<style scoped>

  .scroll-table-body {
    height: 25rem;
    overflow-x: auto;
    margin-top: 0px;
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
  }

  .scroll-table table {
    width: 100%;
    table-layout: fixed;
    border: none;
  }

  .scroll-table thead th {
    font-weight: bold;
    text-align: left;
    border: none;
    padding: 10px 15px;
    font-size: 14px;
  }

  .scroll-table tbody td {
    text-align: left;
    padding: 10px 15px;
    font-size: 14px;
    vertical-align: top;
  }

  .scroll-table tbody tr:nth-child(even) {
    background: #b7ffb1;
  }

  /* Стили для скролла */
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