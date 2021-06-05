<template>
  <nav class="navbar orange lighten-1">
    <div class="nav-wrapper">
      <div class="navbar-left">
        <a href="#" @click.prevent="$emit('show_navbar')">
          <i class="material-icons black-text">dehaze</i>
        </a>
        <span class="black-text">{{ date | date('datetime')}}</span>
      </div>
    </div>
  </nav>
</template>

<script>
    export default {
        name: "Navbar",
        data:() => ({
            date: new Date(),
            interval: null,
        }),
        mounted() {
            this.interval = setInterval(() => {this.date = new Date()},1000)
        },
        beforeDestroy() {
            clearInterval(this.interval)
        },

    }
</script>

<style scoped>

</style>