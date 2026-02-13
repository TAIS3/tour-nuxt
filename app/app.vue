<template>
  <div>
    <!-- 骨架屏, 使用 v-if 即可，因为它会覆盖在所有内容之上 -->
    <SkeletonLoader v-if="loadingStore.isLoading" />
    
    <!-- 主内容始终渲染 -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useLoadingStore } from '~/stores/loading';
import SkeletonLoader from '~/components/SkeletonLoader.vue';

const loadingStore = useLoadingStore();
const nuxtApp = useNuxtApp();

// 监听 Nuxt 的页面加载事件
nuxtApp.hook('page:start', () => {
  loadingStore.setLoading(true);
});

nuxtApp.hook('page:finish', () => {
  // 延迟一点时间关闭，防止闪烁
  setTimeout(() => {
    loadingStore.setLoading(false);
  }, 500); // 延迟 0.5 秒
});

// 处理首次加载
onMounted(() => {
  // 同样延迟关闭，确保首次加载时骨架屏可见
  setTimeout(() => {
    loadingStore.setLoading(false);
  }, 500);
});

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
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease-in-out;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(5px);
  filter: blur(4px);
}
</style>