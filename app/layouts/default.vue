<template>
  <div class="main-layout d-flex flex-column min-vh-100">
    <Navbar />

    <main class="flex-grow-1">
      <slot />
    </main>

    <Footer />
  </div>
</template>

<script setup>
// Nuxt 自动导入 components 目录下的组件
// 所以不需要 import Navbar 和 Footer
</script>

<style scoped>
/* 确保 footer 沉底 */
.min-vh-100 {
  min-height: 100vh;
}
.flex-grow-1 {
  flex-grow: 1;
}
</style>