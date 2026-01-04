<template>
  <div class="row g-3 sm:g-4">
    <div v-for="product in products" :key="product.id" class="col-6 col-md-4">
      <div
        class="tour-card bg-white rounded-2 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 h-100"
      >
        <div class="tour-image h-40 sm:h-48 overflow-hidden">
          <NuxtLink :to="localePath(`/tourarticle/${product.id}`)" class="img-wrap d-block">
            <img
              :src="getImageUrl(product.images)"
              :alt="product.lang_name"
              class="w-100 h-100 object-cover transition-transform duration-500 hover:scale-105"
            />
          </NuxtLink>
        </div>

        <div class="p-3 sm:p-4">
          <NuxtLink :to="localePath(`/tourarticle/${product.id}`)" class="text-decoration-none">
            <h3 class="h6 sm:h5 font-semibold text-gray-800 mb-2 line-clamp-1 title hover:text-theme">
              {{ product.lang_name }}
            </h3>
          </NuxtLink>
          
          <p class="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2 sub_title">
            {{ product.lang_sub_name }}
          </p>

          <div class="d-flex justify-between justify-content-between align-items-center">
            <button class="btn btn-xs btn-sm theme-btn">Add to Cart</button>
            
            <NuxtLink
              :to="localePath(`/tourarticle/${product.id}`)"
              class="text-theme fw-medium d-flex items-center gap-1 text-sm text-decoration-none"
            >
              VIEW
              <i class="bi bi-arrow-right text-xs"></i>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// import { baseUrl } from '@/config'
// 不需要 import useRouter，Nuxt 自动导入

const props = defineProps({
  products: {
    type: Array,
    required: true,
    default: () => [],
  },
})

// ✅ 核心修改：获取 localePath 工具
// 这个工具会自动处理 '/tourarticle/123' -> '/en/tourarticle/123' (取决于当前语言)
const localePath = useLocalePath()

// ❌ 移除了 goDetail 函数
// 1. 避免了 window is not defined 报错
// 2. 避免了手动拼接字符串的繁琐
</script>

<style lang="scss">
@use '~/assets/css/global.scss' as *;

h3.title {
  height: 1rem;
  font-size: clamp(14px, 1.5vw, 18px);
  font-weight: 700;
  // 增加标题 hover 效果
  transition: color 0.2s;
  &.hover\:text-theme:hover {
    color: $mainColor; 
  }
}

p.sub_title {
  height: 3rem;
  overflow: hidden;
  text-overflow: ellipsis;
  border-bottom: 1px solid;
  border-color: $mainColor;
  font-size: clamp(12px, 1vw, 16px);
}

.tour-card {
  display: flex;
  flex-direction: column;
}

.tour-image {
  flex-shrink: 0;
  .img-wrap {
    width: 100%;
    position: relative;
    padding-top: 75%; 
    overflow: hidden;
    cursor: pointer;
    
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s;
    }
    
    // 只有 hover 到 wrap 上时，img 才放大
    &:hover img {
      transform: scale(1.05);
    }
  }
}

@media (max-width: 575.98px) {
  .btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }
}
</style>