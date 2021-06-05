<template>
  <div class="app-main-layout">
    <Navbar @show_navbar="isOpen = !isOpen"/>
    <Sidebar v-model="isOpen"/>
    <main class="app-content" :class="{full: !isOpen}">
      <div class="app-page">
        <router-view/>
      </div>
    </main>
  </div>
</template>
<script>
  import Navbar from '@/components/app/Navbar'
  import Sidebar from '@/components/app/Sidebar'
  export default {
      name:'MainLayout',
      data:()=>({
        isOpen: true
      }),
      components: {
          Navbar, Sidebar
      }
  }
</script>