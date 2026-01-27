<template>
  <div>
    <section
      v-if="currentCategory && currentCategory.id"
      class="hero-section hero-section-top d-flex justify-content-center align-items-center"
      id="section_top"
    >
      <div class="inside-page container container-top banner-content">
        <Banner
          :id="currentCategory.id"
          :key="`banner${currentCategory.id}`"
          :bannerData="currentCategory"
        />
      </div>
    </section>
    <div class="container my-4 sm:my-8 px-2">
      <template v-if="currentProducts && currentProducts.length">
        <CommonList :products="currentProducts" article-type="sceneryarticle" />

        <Pagination
          v-if="totalPages > 1"
          v-model="currentPage"
          :total-pages="totalPages"
          @page-change="handlePageChange"
        />
      </template>

      <NoData v-else />
    </div>

    <CommonPageBanner />
    <CommonContact />
  </div>
</template>

<script setup>
// 1. 自动导入
const route = useRoute()
const { locale } = useI18n()
const { getSceneryList, getSceneryCategoryDetail } = useApi()

// 2. 响应式状态
const categoryId = computed(() => route.params.id)
const currentPage = ref(1)
const itemsPerPage = 9

// ----------------------------------------------------------------
// 3. 获取分类详情 (Banner数据)
// ----------------------------------------------------------------
const { data: categoryRaw } = await useAsyncData(
  () => `scenery-category-${categoryId.value}-${locale.value}`,
  async () => {
    if (!categoryId.value) return null
    
    const res = await getSceneryCategoryDetail({ id: categoryId.value })
    
    return res.data.value || null
  },
  {
    watch: [categoryId, locale]
  }
)

// immediate: true 保证了 SSR 首屏渲染时也会执行这个检查
watch(categoryRaw, (newVal) => {
  // 打印日志方便调试，看看数据到底是不是 code: 404
  // console.log('API Result:', newVal) 

  if (newVal?.code === 404) {
    showError({
      statusCode: 404,
      message: 'Please try again later or contact support.',
      fatal: true // 💥 必须为 true，强制卸载当前页面组件，渲染 error.vue
    })
  }
}, { immediate: true })

// 数据映射
const currentCategory = computed(() => {
  const apiRes = categoryRaw.value || {}
  const data = apiRes.data || apiRes 
  
  if (!data || !data.id) return {}
  return {
    id: data.id,
    settype: data.settype,
    image: data.bannerimage,
    title: data.langData?.bannertitle || '',
    content: data.langData?.bannercontent || '',
  }
})

// ----------------------------------------------------------------
// 4. 获取景点列表
// ----------------------------------------------------------------
const { data: sceneryListRaw } = await useAsyncData(
  () => `scenerylist-${categoryId.value}-${currentPage.value}-${locale.value}`,
  async () => {
    if (!categoryId.value) return null
    
    const res = await getSceneryList({
      category_id: categoryId.value,
      page: currentPage.value,
      limit: itemsPerPage
    })
    
    return res.data.value || null
  },
  {
    watch: [categoryId, currentPage, locale]
  }
)

// 数据处理
const currentProducts = computed(() => {
  const apiRes = sceneryListRaw.value || {}
  const data = apiRes.data || apiRes
  return data.rows || []
})

const totalPages = computed(() => {
  const apiRes = sceneryListRaw.value || {}
  const data = apiRes.data || apiRes
  const total = data.total || 0
  return Math.ceil(total / itemsPerPage)
})

// ----------------------------------------------------------------
// 5. 事件处理
// ----------------------------------------------------------------
const handlePageChange = (page) => {
  currentPage.value = page
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// ----------------------------------------------------------------
// 6. SEO 设置
// ----------------------------------------------------------------
useHead({
  title: computed(() => stripHtml(currentCategory.value.seo_title) || 'Scenery List'),
  meta: [
    { name: 'keywords', content: computed(() => stripHtml(currentCategory.value.seo_keywords) || 'Best Scenery') },
    { name: 'description', content: computed(() => stripHtml(currentCategory.value.seo_description) || '') }
  ]
})
</script>

<style lang="scss" scoped>
/* 保持原有样式 */
</style>