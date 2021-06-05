<template>
  <div class="popup_wrapper" ref="popup_wrapper">
    <div class="popup">
      <form class="card">
        <div class="card-content">
          <span class="card-title" style="font-weight:bold">Заказ № {{order.id}}</span>
          <div class="property">
            <span style="font-weight:bold">Имя заказчика</span><span>{{`${order.first_name} ${order.last_name}`}}</span>
          </div>
          <div class="property">
            <span style="font-weight:bold">Адрес</span><span>{{order.address}}</span>
          </div>
          <div class="property">
            <span style="font-weight:bold">Телефон</span><span>{{order.phone}}</span>
          </div>
          <div class="property">
            <span style="font-weight:bold">Дата заказа</span><span>{{order.order_date | date('datetime')}}</span>
          </div>
          <div class="property">
            <span style="font-weight:bold">Тип доставки</span><span>{{order.buying_type}}</span>
          </div>
          <div class="property">
            <span style="font-weight:bold">Коментарий</span><span>"{{order.comment}}"</span>
          </div>
          <div class="property">
            <span style="font-weight:bold">Состав</span>
          </div>
          <section class="scroll-table">
            <table>
              <thead>
              <tr>
                <th>Название</th>
                <th>Кол-во</th>
                <th>Цена</th>
                <th>Итого</th>
              </tr>
              </thead>
            </table>
            <div class="scroll-table-body">
              <table>
                <tbody>
                <tr v-for="product in order.basket.products" :key="product.id">
                  <td>{{product.product}}</td>
                  <td>{{product.quantity}}</td>
                  <td>{{product.total_price/product.quantity | currency()}}</td>
                  <td>{{product.total_price | currency()}}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </section>
          <div class="property">
            <span
                style="font-weight:bold">Итоговая стоимость:</span><span>{{order.basket.total_price | currency()}}</span>
          </div>
        </div>
        <div class="card-action">
          <div class="property">
            <label style="color: black">
              <input
                  id="status"
                  type="checkbox"
                  :value="order.status==='Новый заказ'?status='ready':status='completed'"
              />
              <span v-if="order.status==='Новый заказ'">Обработан</span>
              <span v-if="order.status==='Заказ обработан'">Выполнен</span>
            </label>
          </div>
          <button v-if="order.status==='Заказ выполнен' || order.status==='Заказ отменен'"
                  @click.prevent="deleteOrder"
                  class="btn waves-effect waves-light green"
                  type="button"
          >Удалить
          </button>
          <button v-else
                  @click.prevent="changeStatus"
                  class="btn waves-effect waves-light green"
                  type="button"
          >Сохранить
          </button>
          <button class="btn waves-effect waves-light red" @click="closePopup">
            Закрыть
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
    export default {
        name: "OrderPopup",
        props: {
            order: {
                type: Object,
                required: true
            }
        },
        data: () => ({
            status: '',
        }),
        methods: {
            closePopup() {
                this.$emit('closePopup')
            },
            async changeStatus() {
                const payload = {
                    pk: this.order.id,
                    status: this.status
                }
                await this.$store.dispatch('orders/patchChangeStatus', payload)
                this.closePopup()
            },
            async deleteOrder() {
                const payload = {
                    pk: this.order.id
                }
                await this.$store.dispatch('orders/deleteOrder', payload)
                this.closePopup()
            }

        },
        mounted() {
            let vm = this
            document.addEventListener('click', function (item) {
                if (item.target === vm.$refs['popup_wrapper']) {
                    vm.closePopup()
                }
            })

        }
    }
</script>

<style lang="scss">
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

  .property {
    display: flex;
    justify-content: space-around;
    margin: 1rem;
  }

  .property span {
    width: 30%;
  }


  // Для таблички
  .scroll-table-body {
    height: 5rem;
    overflow-x: auto;
    margin-top: 0px;
    margin-bottom: 0px;
  }

  .scroll-table table {
    width: 100%;
    table-layout: fixed;
    border: none;
  }

  .scroll-table thead th {
    font-weight: bold;
    text-align: center;
    border: none;
    padding: 5px 10px;
    font-size: 14px;
  }

  .scroll-table tbody td {
    text-align: center;
    padding: 2px 5px;
    font-size: 14px;
    vertical-align: top;
  }

  /* Стили для скролла */
  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }

  ::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }


</style>