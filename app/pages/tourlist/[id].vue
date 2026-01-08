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
        <CommonList :products="currentProducts" />

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
const { getTourList, getTourCategoryDetail } = useApi()

// 2. 响应式状态
const categoryId = computed(() => route.params.id)
const currentPage = ref(1)
const itemsPerPage = 9

// ----------------------------------------------------------------
// 3. 获取分类详情 (Banner数据)
// ----------------------------------------------------------------
const { data: categoryRaw } = await useAsyncData(
  () => `category-${categoryId.value}-${locale.value}`,
  async () => {
    // ✅ 你的建议：请求前先判断 ID 是否存在
    if (!categoryId.value) return null
    
    const res = await getTourCategoryDetail({ id: categoryId.value })
    
    // 🔴 核心修复：必须取 .value！(解决 Hydration Mismatch 报错)
    // res.data 是一个 Ref，必须取 .value 拿到纯数据返回给 Nuxt
    return res.data.value || null
  },
  {
    watch: [categoryId, locale]
  }
)

// 数据映射
const currentCategory = computed(() => {
  // 因为上面返回了纯数据，这里 categoryRaw.value 就是那个对象
  const apiRes = categoryRaw.value || {}
  // 兼容直接返回数据或 { data: ... } 结构
  const data = apiRes.data || apiRes 
  
  if (!data || !data.id) return {}

  return {
    id: data.id,
    settype: data.settype,
    image: data.bannerimage,
    title: data.langData?.bannertitle || '',
    subtitle: data.langData?.bannersubtitle || '',
    content: data.langData?.bannercontent || '',
    seo_title: data.langData?.seo_title || '',
    seo_keywords: data.langData?.seo_keywords || '',
    seo_description: data.langData?.seo_description || '',
  }
})

// ----------------------------------------------------------------
// 4. 获取线路列表
// ----------------------------------------------------------------
const { data: tourListRaw } = await useAsyncData(
  () => `tourlist-${categoryId.value}-${currentPage.value}-${locale.value}`,
  async () => {
    // ✅ 你的建议：请求前先判断 ID 是否存在
    if (!categoryId.value) return null
    
    const res = await getTourList({
      category_id: categoryId.value,
      page: currentPage.value,
      limit: itemsPerPage
    })
    
    // 🔴 核心修复：必须取 .value！(解决 Hydration Mismatch 报错)
    return res.data.value || null
  },
  {
    watch: [categoryId, currentPage, locale]
  }
)

// 数据处理
const currentProducts = computed(() => {
  const apiRes = tourListRaw.value || {}
  const data = apiRes.data || apiRes
  return data.rows || []
})

const totalPages = computed(() => {
  const apiRes = tourListRaw.value || {}
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
  title: computed(() => stripHtml(currentCategory.value.seo_title) || 'Tour List'),
  meta: [
    { name: 'keywords', content: computed(() => stripHtml(currentCategory.value.seo_keywords) || 'Best Tours') },
    { name: 'description', content: computed(() => stripHtml(currentCategory.value.seo_description) || '') }
  ]
})
</script>

<style lang="scss" scoped>
/* 保持原有样式 */
</style>