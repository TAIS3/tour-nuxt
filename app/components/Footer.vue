<template>
  <footer class="text-white py-4 mt-auto">
    <div class="logo">
      <img src="~/assets/images/logo.png" class="footer-image img-fluid" alt="EZTRIPCN" />
    </div>
    <div class="container text-center">
      <p>© 2026 All Right Reserved.</p>
    </div>
  </footer>
</template>

<script setup>
// 不需要 import ref, onMounted 如果没用到
// 不需要 import logo，直接在 template 里写路径更方便 Nuxt 优化
</script>

<style lang="scss" scoped>
// ❌ 不要 @use global.scss，因为里面包含 CSS 输出代码，会导致重复打包
// ✅ 如果你需要变量，Nuxt 配置里已经全局注入了 variables.scss，直接用变量即可
// @use '@/assets/css/global.scss' as *;

footer {
  // $mainColor 应该已经在 nuxt.config.js 注入了，直接用
  background-color: $mainColor; 
  
  .logo {
    margin: 10px auto;
    text-align: center;
    img {
      width: auto;
      height: 18px;
    }
  }
  .container {
    width: 100%;
    color: $primaryColor; // 直接使用变量
    text-align: center;
    max-width: 100%;
  }
}
</style>