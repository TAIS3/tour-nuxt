<template>
  <div>
    <section
      class="hero-section hero-section-top d-flex justify-content-center align-items-center"
      id="section_1"
    >
      <div class="section-overlay"></div>
      <div
        class="inside-page container container-top banner-content"
        :class="setContainerCLass(banner7?.settype)"
      >
        <Banner
          v-if="banner7?.id"
          :id="banner7?.id"
          :key="`banner${banner7?.id}`"
          :bannerData="banner7"
          btnMsg="GIT IT NOW!"
        />
      </div>
    </section>

    <section
      v-if="banner8?.id"
      class="hero-section"
      :class="setSectionClass(banner8?.settype)"
      :style="getSectionStyle(banner8)"
      id="section_2"
    >
      <div
        class="inside-page container container-top banner-content food-part"
        :class="setContainerCLass(banner8?.settype)"
      >
        <Banner
          v-if="banner8?.id"
          :id="banner8?.id"
          :key="`banner${banner8?.id}`"
          :bannerData="banner8"
          btnMsg="GIT IT NOW!"
        />
      </div>
    </section>

    <section
      v-if="banner9?.id"
      class="hero-section"
      :class="setSectionClass(banner9?.settype)"
      :style="getSectionStyle(banner9)"
      id="section_3"
    >
      <div
        class="inside-page container container-top banner-content"
        :class="setContainerCLass(banner9?.settype)"
      >
        <Banner
          v-if="banner9?.id"
          :id="banner9?.id"
          :key="`banner${banner9?.id}`"
          :bannerData="banner9"
          btnMsg="GIT IT NOW!"
        />
      </div>
    </section>

    <section class="hero-section" id="comment">
      <div class="container">
        <TourComment />
      </div>
    </section>

    <CommonContact />
  </div>
</template>

<script setup>
// 1. 自动导入
// setContainerCLass, setSectionClass, getImageUrl 应该是自动导入的
const { locale, t } = useI18n()
const { getBanner } = useApi()

// 2. 数据获取 (SSR + 响应式)
const { data: bannerRaw } = await useAsyncData(
  // Key: 加上 locale 确保语言切换时刷新
  () => `chinatour-data-${locale.value}`,
  
  async () => {
    // 请求 7,8,9 号 Banner
    // useHttp 会自动注入 lang 参数
    const res = await getBanner('7,8,9')
    
    // 🔴 核心修复：必须解包 .value，防止 Hydration Mismatch
    return res.data.value || null
  },
  {
    watch: [locale]
  }
)

// 3. 数据处理 (Computed)
const bannerData = computed(() => {
  const apiRes = bannerRaw.value || {}
  // 兼容不同的后端返回结构
  return apiRes.data || apiRes || {}
})

// 提取各个 Banner
const banner7 = computed(() => bannerData.value['banner7'])
const banner8 = computed(() => bannerData.value['banner8'])
const banner9 = computed(() => bannerData.value['banner9'])

// 4. 辅助函数：处理背景图样式
// 统一使用 getImageUrl，替代旧代码里的 baseUrl + ...
const getSectionStyle = (item) => {
  if (['2', '3', '4'].includes(item?.settype)) {
    // 假设 getImageUrl 已在 utils/common.js 中定义并自动导入
    return `background-image: url(${getImageUrl(item?.image)});`
  }
  return {}
}

// 5. SEO 设置
useHead({
  title: computed(() => t('China Tours') + ' - EZTRIPCN'), // 假设你有对应的翻译 Key，或者直接写死字符串
  meta: [
    { name: 'description', content: 'Explore the best China Tours with us.' }
  ]
})
</script>

<style lang="scss" scoped>
section {
  // background-color: #f0ede5;
  margin-bottom: 0;
  .text-right-img-left, .text-left-img-right{

    :deep(.row) {
      flex: 1;
      div[class*="info-wrap"] {
        width: 35%;
      }
      .img-wrap{
        width: 65%;
      }
    }
  }
}
.food-part {
  :deep(.row img) {
    max-width: 100%;
    // width: 500px;
    height: auto;
    display: block;
    margin: 0 auto;
  }
}
#comment {
  margin-bottom: 20px;
}
</style>