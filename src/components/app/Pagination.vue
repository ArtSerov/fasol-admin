<template>
  <div>
    <ul class="pagination">
      <li v-for="p in total" :key="p" :class="{active: currentPage===p}">
        <a @click="changePage(p)">{{p}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
    export default {
        name: "Pagination",
        props: ['total', 'item'],
        data: () => ({
            currentPage: 1
        }),
        methods: {
            changePage(pageNumber) {
                this.currentPage = pageNumber
                this.$emit('pageChanged', pageNumber)
            }
        }
    }
</script>

<style scoped>
li.active{
  background-color: #26A69A;
}
  .pagination{
    display: flex;
    justify-content: center;
  }
</style>