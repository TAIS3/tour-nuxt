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

    <section class="container py-5">
      <LoadingComponent v-if="pending" />
      
      <div v-else-if="pageData && pageData.id" class="row justify-content-center">
        <div class="col-12 col-lg-10">
          <div class="mb-4">
            <div class="mb-3">
              <span class="text-muted">{{ pageData.createTime }}</span>
            </div>
            
            <div class="rich-text-content" v-html="pageContent"></div>
          </div>
        </div>
      </div>

      <NoData v-else />
    </section>

    <CommonPageBanner />
    <CommonContact />
  </div>
</template>

<script setup>
// 1. 自动导入
const route = useRoute()
const { locale } = useI18n()
const { getSinglePageDetail } = useApi()

// 2. 响应式状态
const pageId = computed(() => route.params.id)

// ----------------------------------------------------------------
// 3. 获取单页详情 (SSR + 响应式)
// ----------------------------------------------------------------
const { data: pageRaw, pending } = await useAsyncData(
  // Key: 包含 ID 和 locale，确保唯一性
  () => `singlepage-${pageId.value}-${locale.value}`,
  
  async () => {
    if (!pageId.value) return null
    
    // 调用接口 (useHttp 会自动注入 lang, 无需手动传)
    const res = await getSinglePageDetail({ id: pageId.value })
    
    // 🔴 核心修复：必须解包 Ref (.value)，防止 Hydration Mismatch
    return res.data.value || null
  },
  {
    // 监听：ID 或 语言 变化时自动重刷
    watch: [pageId, locale]
  }
)

// 4. 数据处理 (Computed)
// 提取页面主体数据
const pageData = computed(() => {
  const apiRes = pageRaw.value || {}
  return apiRes.data || apiRes || {}
})

// 提取内容 (处理 safeContent 逻辑，如果 safeContent 不是自动导入的，可以直接在这里处理)
const pageContent = computed(() => {
  const content = pageData.value.langData?.content || ''
  // 如果你有 safeContent 函数，可以在这里调用，或者直接返回 content
  return safeContent(content) 
//   return content
})

// 提取 Banner 数据 (映射结构)
const currentCategory = computed(() => {
  const data = pageData.value
  if (!data || !data.id) return {}

  return {
    id: data.id,
    settype: data.settype,
    image: data.thumb_image, // 注意：旧代码是 thumb_image，确认一下是否需要 getImageUrl 包裹
    title: data.langData?.bannertitle || '',
    subtitle: data.langData?.bannersubtitle || '',
    content: data.langData?.bannercontent || '',
  }
})

// ----------------------------------------------------------------
// 5. SEO 设置
// ----------------------------------------------------------------
useHead({
  title: computed(() => stripHtml(currentCategory.value.title) || 'EZTRIPCN'),
  meta: [
    { 
      name: 'description', 
      // 简单去除 HTML 标签作为描述
      content: computed(() => (stripHtml(currentCategory.value.subtitle) || '').replace(/<[^>]+>/g, '').slice(0, 150)) 
    }
  ]
})
</script>

<style lang="scss" scoped>
.rich-text-content {
  :deep(img) {
    max-width: 100%;
    height: auto;
  }
}
</style>