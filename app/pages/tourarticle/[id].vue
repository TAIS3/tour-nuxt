<template>
  <div>
    <section
      class="hero-section section-bg-image"
      id="section_top"
      :style="bannerStyle"
    >
      <div class="container">
        <div class="row">
          <div class="col-12 text-center center-both-column">
            <h1 class="text-white">Tour Details</h1>
          </div>
        </div>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1918.73 59.75">
        <path fill="#ffffff" d="M1163.86,59.75c-58.71-4.12-118.48-59.75-178.39-59.75s-120.87,55.63-180.55,59.75h358.94Z" />
        <path fill="#ffffff" d="M1688.6,30c-57.05,0-122.46,26.96-193.64,29.75h423.77c-8.95-2.86-96.66-29.75-230.13-29.75Z" />
        <path fill="#ffffff" d="M1475.65,59.75c-46.85-2.79-96.03-29.75-146.85-29.75s-98.81,26.96-149.83,29.75h296.68Z" />
        <path fill="#ffffff" d="M404.97,59.75c-76.02-3.37-144.97-39.75-203.58-39.75C82.97,20,6.79,56.38,0,59.75h404.97Z" />
        <path fill="#ffffff" d="M784.44,59.75c-64.66-2.29-128.22-19.75-189.45-19.75s-114.69,17.46-167.8,19.75h357.25Z" />
      </svg>
    </section>

    <section class="container py-5">
      <LoadingComponent v-if="pending" />
      
      <div v-else-if="tour && tour.id" class="row">
        <div class="col-lg-8">
          <div class="tour-card">
            <h1>{{ tour.langData?.name }}</h1>
            <p class="text-muted middle">{{ tour.langData?.sub_name }}</p>
            <hr />
            
            <div class="info-wrap d-flex justify-content-between align-items-center mb-4">
              <div class="d-flex flex-wrap align-items-center">
                <div class="info-item">
                  <span class="iconfont icon-jinqian"></span>
                  <span class="info-item-content">
                    <span class="item-name">{{ t('tourArticle.price') }}</span>
                    <span class="item-value">{{ tour.salesprice }}</span>
                  </span>
                </div>
                <div class="info-item">
                  <span class="iconfont icon-date"></span>
                  <span class="info-item-content">
                    <span class="item-name">{{ t('tourArticle.date') }}</span>
                    <span class="item-value">{{ tour.series_days }} {{ t('tourArticle.days') }}</span>
                  </span>
                </div>
                <div class="info-item">
                  <span class="iconfont icon-people"></span>
                  <span class="info-item-content">
                    <span class="item-name">{{ t('tourArticle.people') }}</span>
                    <span class="item-value">{{ tour.team_count }}</span>
                  </span>
                </div>
              </div>
              <button class="btn theme-btn" type="button">Book Now</button>
            </div>

            <h2 class="h4 mb-3">{{ t('tourArticle.travelHighlights') }}</h2>
            <div class="info-content" v-html="safeContent(tour.langData?.highlights_content)"></div>

            <h2 class="h4 mb-3">{{ t('tourArticle.itineraryOverview') }}</h2>
            <div class="info-content" v-html="safeContent(tour.langData?.introduction_content)"></div>

            <h2 class="h4 mb-3">{{ t('tourArticle.costBreakdown') }}</h2>
            <div class="info-content" v-html="safeContent(tour.langData?.fee_explain)"></div>

            <h2 class="h4 mb-3">{{ t('tourArticle.mustRead') }}</h2>
            <div class="info-content" v-html="safeContent(tour.langData?.see_content)"></div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="sidebar-card">
            <div class="sidebar-header">
              <h3 class="h5 mb-0">{{ t('tourArticle.mayLike') }}</h3>
            </div>
            <div class="p-3">
              <div class="recommend-item" v-for="(item, index) in recommendList.data" :key="index">
                <NuxtLink :to="localePath(`/tourarticle/${item.id}`)" class="img-wrap d-block">
                  <img :src="getImageUrl(item.thumb_image)" :alt="item.name" class="recommend-img" />
                </NuxtLink>
                <div class="recommend-text">
                  <h5>
                    <NuxtLink :to="localePath(`/tourarticle/${item.id}`)" class="img-wrap d-block">
                      {{ item.name }}
                    </NuxtLink>
                  </h5>
                  <h6>{{ item.sub_name }}</h6>
                  <p>
                    {{ t('tourArticle.price') }}
                    <span class="price-highlight">{{ item.salesprice }}</span>
                  </p>
                </div>
              </div>
            </div>
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
// safeContent, getImageUrl 应在 utils/common.js 中定义并自动导入
const route = useRoute()
const { t, locale } = useI18n()
const { getTourDetail, getTourRecommend } = useApi()

// 这个工具会自动处理 '/tourarticle/123' -> '/en/tourarticle/123' (取决于当前语言)
const localePath = useLocalePath()

// 2. 响应式参数
const tourId = computed(() => route.params.id)
const bannerImg = '/static/images/page9_banner.png' // 静态资源建议放 public/static 下

// 处理 Banner 样式
const bannerStyle = computed(() => {
  return {
    backgroundImage: `url(${bannerImg})`,
    height: 'calc(100vw / 1920 * 595)',
    maxHeight: '595px',
    marginBottom: '0'
  }
})

// ----------------------------------------------------------------
// 3. 并行获取数据 (SSR核心)
// ----------------------------------------------------------------
const { data: pageDataRaw, pending } = await useAsyncData(
  // Key: ID 和 语言 决定唯一性
  () => `tour-detail-${tourId.value}-${locale.value}`,
  
  async () => {
    if (!tourId.value) return null
    
    // 并行请求：详情 + 推荐列表
    // useHttp 会自动注入 lang 参数
    const [tourRes, recommendRes] = await Promise.all([
      getTourDetail({ id: tourId.value }),
      getTourRecommend({ number: 5 })
    ])
    
    // 🔴 核心修复：必须解包 .value 防止 Hydration Mismatch
    return {
      tour: tourRes.data.value || null,
      recommend: recommendRes.data.value || [] // 假设推荐接口返回结构是 { code:1, data: [] }
    }
  },
  {
    watch: [tourId, locale]
  }
)

// 4. 数据处理 (Computed)
const tour = computed(() => {
  const data = pageDataRaw.value?.tour
  // 兼容直接返回或嵌套 data 的情况
  return data?.data || data || {}
})

const recommendList = computed(() => {
  const data = pageDataRaw.value?.recommend
  
  // 假设推荐列表接口直接返回数组，或者在 data 字段里
  if (Array.isArray(data)) return data
  return data?.data || []
})

// ----------------------------------------------------------------
// 5. SEO 设置
// ----------------------------------------------------------------

useHead({
  title: computed(() => stripHtml(tour.value.langData?.name) || 'Tour Details'),
  meta: [
    { 
      name: 'description', 
      content: computed(() => stripHtml(tour.value.langData?.highlights_content || '')) 
    }
  ]
})
</script>

<style lang="scss" scoped>
// 你的全局样式引入 (如果 nuxt.config 已配置 css 则不需要这里引入)
// @use '@/assets/css/global.scss' as *;

.section-bg-image {
  background-size: cover;
  background-position: center;
  position: relative;
  .container {
    margin: 0 auto;
    padding: 0;
    height: 100%;
    .row {
      margin: 0;
      padding: 0;
      height: 100%;
      h1 {
        font-size: clamp(18px, 6.5vw, 70px);
        font-family: 'AznauriSquareBold', 'Microsoft YaHei', Arial, sans-serif;
      }
    }
  }
}

.tour-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-right: 25px;
  height: 80px;
  // 使用 CSS 变量或直接写死颜色，如果变量未定义
  $color-green: #66d056;
  $color-yellow: #f9c928;
  $color-cyan: #47c5bb;
  $mainColor: #333; // 示例

  &:first-child {
    span.iconfont {
      background-color: rgba($color-green, 0.2);
      color: $color-green;
    }
  }
  &:nth-child(2) {
    span.iconfont {
      background-color: rgba($color-yellow, 0.2);
      color: $color-yellow;
    }
  }
  &:nth-child(3) {
    span.iconfont {
      background-color: rgba($color-cyan, 0.2);
      color: $color-cyan;
    }
  }
  span.iconfont {
    display: inline-block;
    font-size: 35px;
    line-height: 50px;
    text-align: center;
    width: 50px;
    height: 50px;
    border-radius: 4px;
  }
  .info-item-content {
    display: flex;
    flex-direction: column;
    margin-left: 5px;
    font-size: 15px;
    .item-name {
      font-size: 13px;
      color: #808080;
    }
    .item-value {
      color: $mainColor;
      font-weight: 700;
    }
  }
}

h2.h4 {
  // color: $mainColor; 
  font-size: clamp(18px, 3vw, 22px);
  font-family: 'AznauriSquareBold', 'Microsoft YaHei', Arial, sans-serif;
  background-color: rgba(229, 229, 229, 0.6); // #e5e5e5
  padding: 8px 2px;
}

.info-content {
  margin-bottom: 20px;
  padding: 5px;
  // 加上 img 样式防止富文本图片溢出
  :deep(img) {
    max-width: 100%;
    height: auto;
  }
}

.sidebar-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.sidebar-header {
  background-color: #4a4e69;
  color: #fff;
  padding: 15px;
}

.recommend-item {
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
}

.recommend-img {
  width: 80px;
  max-width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 10px;
}

.recommend-text {
  h5 {
    font-size: 15px;
    margin-bottom: 5px;
  }
  h6 {
    font-size: 13px;
    color: #898989;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 3px;
  }
  p {
    font-size: 12px;
    color: #666;
    margin-bottom: 0;
  }
}

.price-highlight {
  color: #e63946;
  font-weight: bold;
}
</style>