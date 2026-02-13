<template>
  <div>
    <NuxtLoadingIndicator color="#ff6b6b" :height="3" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// 注意：这里没有 lang="ts"，纯 JS 写法
const mainStore = useMainStore();
if (mainStore.token && !mainStore.user) {
  await mainStore.fetchUser();
}
// 这里可以放一些全局初始化的逻辑，比如 SEO 配置
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Travel App` : "Travel App";
  },
});
</script>

<style>
/* 全局过渡动画样式 */

/* 页面进入和离开时的动画状态 */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease-in-out;
}

/* 页面进入前，和离开后的状态 (透明 + 轻微位移) */
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(5px); /* 可选：加一点点位移让它更有动感 */
  filter: blur(4px); /* 可选：加一点点模糊 */
}
</style>