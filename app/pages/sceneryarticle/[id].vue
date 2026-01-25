<template>
  <div class="page-wrapper">
    <section
      class="hero-section section-bg-image"
      id="section_top"
      :style="bannerStyle"
    >
      <div class="container">
        <div class="row">
          <div class="col-12 text-center center-both-column">
            <h1 class="text-white">Scenery Details</h1>
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

    <div class="container py-5 main-container">
      
      <div v-if="pending" class="loading-skeleton py-5 text-center text-muted">
        <div class="spinner-border text-primary" role="status"></div>
        <div class="mt-2">Loading details...</div>
      </div>

      <div v-else-if="tour && tour.id" class="row g-4">
        
        <div class="col-lg-8">
          
          <div class="content-card mb-4">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div>
                <span class="badge bg-success mb-2" v-if="tour.level_id">{{ tour.level_id }}A景区</span>
                <h2 class="content-title">{{ tour.langData?.name }}</h2>
              </div>
              <div class="share-btn d-none d-md-block">
                <button class="btn btn-light btn-sm rounded-circle shadow-sm">
                  <span class="iconfont icon-share"></span>
                </button>
              </div>
            </div>

            <div class="info-grid">
              <div class="info-box">
                <div class="icon-wrap bg-green-light text-green">
                  <span class="iconfont icon-jinqian"></span>
                </div>
                <div class="text-wrap">
                  <small>{{ t('tourArticle.price') }}</small>
                  <strong>{{ tour.salesprice }}</strong>
                </div>
              </div>
              <div class="info-box">
                <div class="icon-wrap bg-yellow-light text-yellow">
                  <span class="iconfont icon-date"></span>
                </div>
                <div class="text-wrap">
                  <small>{{ t('tourArticle.date') }}</small>
                  <strong>{{ tour.series_days }} {{ t('tourArticle.days') }}</strong>
                </div>
              </div>
              <div class="info-box">
                <div class="icon-wrap bg-cyan-light text-cyan">
                  <span class="iconfont icon-people"></span>
                </div>
                <div class="text-wrap">
                  <small>{{ t('tourArticle.people') }}</small>
                  <strong>{{ tour.team_count }}</strong>
                </div>
              </div>
            </div>
          </div>

          <div class="sticky-tabs-wrapper">
            <nav class="nav nav-pills nav-justified custom-tabs">
              <a class="nav-link" :class="{ active: currentTab === 'highlights' }" @click.prevent="scrollTo('highlights')">
                {{ t('tourArticle.travelHighlights') }}
              </a>
              <a class="nav-link" :class="{ active: currentTab === 'itinerary' }" @click.prevent="scrollTo('itinerary')">
                {{ t('tourArticle.itineraryOverview') }}
              </a>
              <a class="nav-link" :class="{ active: currentTab === 'cost' }" @click.prevent="scrollTo('cost')">
                {{ t('tourArticle.costBreakdown') }}
              </a>
            </nav>
          </div>

          <div class="content-card mt-3">
            <section id="highlights" class="detail-section">
              <h3 class="section-header"><span class="line"></span>{{ t('tourArticle.travelHighlights') }}</h3>
              <div class="rich-text" v-html="safeContent(tour.langData?.highlights_content)"></div>
            </section>

            <hr class="section-divider">

            <section id="itinerary" class="detail-section">
              <h3 class="section-header"><span class="line"></span>{{ t('tourArticle.itineraryOverview') }}</h3>
              <div class="rich-text" v-html="safeContent(tour.langData?.introduction_content)"></div>
            </section>

            <hr class="section-divider">

            <section id="cost" class="detail-section">
              <h3 class="section-header"><span class="line"></span>{{ t('tourArticle.costBreakdown') }}</h3>
              <div class="rich-text" v-html="safeContent(tour.langData?.fee_explain)"></div>
            </section>
            
            <hr class="section-divider">
            
            <section id="mustread" class="detail-section">
              <h3 class="section-header"><span class="line"></span>{{ t('tourArticle.mustRead') }}</h3>
              <div class="rich-text" v-html="safeContent(tour.langData?.see_content)"></div>
            </section>
          </div>
        </div>

        <div class="col-lg-4">
          
          <div class="booking-card sidebar-sticky mb-4 d-none d-lg-block">
            <div class="price-area">
              <span class="currency">¥</span>
              <span class="amount">{{ parseFloat(tour.salesprice) || 0 }}</span>
              <span class="unit">/{{ t('tourArticle.person') || 'p' }}</span>
            </div>
            <button class="btn btn-primary btn-lg w-100 mb-3 shadow-sm fw-bold">
              {{ t('common.bookNow') || 'Book Now' }}
            </button>
            <div class="d-flex justify-content-between text-muted small">
              <span><i class="iconfont icon-check-circle text-success"></i> No Shopping</span>
              <span><i class="iconfont icon-check-circle text-success"></i> Free Cancel</span>
            </div>
          </div>

          <div class="sidebar-card">
            <div class="card-header-custom">
              <h5>{{ t('tourArticle.mayLike') }}</h5>
            </div>
            <div class="list-group list-group-flush">
              <NuxtLink 
                v-for="(item, index) in recommendList" 
                :key="index"
                :to="localePath(`/tourarticle/${item.id}`)" 
                class="list-group-item d-flex gap-3 py-3 border-0 border-bottom px-0"
              >
                <div class="thumb-wrapper">
                  <img :src="getImageUrl(item.thumb_image)" class="rounded recommend-thumb" :alt="item.name">
                </div>
                <div class="recommend-info d-flex flex-column justify-content-between">
                  <h6 class="mb-1 text-truncate-2">{{ item.name }}</h6>
                  <div class="text-danger fw-bold mt-auto">¥{{ item.salesprice }}</div>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <NoData v-else />
    </div>

    <div class="mobile-bottom-bar d-lg-none">
      <div class="icons">
        <NuxtLink :to="localePath('/')" class="icon-btn">
          <span class="iconfont icon-home"></span>
          <span>Home</span>
        </NuxtLink>
        <div class="icon-btn">
          <span class="iconfont icon-service"></span>
          <span>Service</span>
        </div>
      </div>
      <button class="btn btn-primary flex-grow-1 ms-3 rounded-pill fw-bold shadow-sm">
        ¥{{ parseFloat(tour?.salesprice) || 0 }} Book Now
      </button>
    </div>

    <CommonPageBanner />
    <CommonContact />
  </div>
</template>

<script setup>
// 1. 导入
// 假设 safeContent, getImageUrl 等工具函数已经在 utils/common.js 并自动导入
// 如果没有自动导入，请手动 import { getImageUrl, safeContent } from '@/utils/common'
const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
// 假设 useApi 封装了 API 请求
const { getTourDetail, getTourRecommend } = useApi()

// 2. 状态与参数
const tourId = computed(() => route.params.id)
const currentTab = ref('highlights')
// Banner 背景图 (可根据详情图动态替换，这里使用默认)
const bannerImg = '/static/images/page9_banner.png' 

// 计算 Banner 样式
const bannerStyle = computed(() => {
  return {
    backgroundImage: `url(${bannerImg})`,
    // 这里不再需要复杂的 height calc，CSS 中已固定高度
  }
})

// ----------------------------------------------------------------
// 3. 数据获取 (SSR + 404 处理)
// ----------------------------------------------------------------
const { data: pageDataRaw, pending } = await useAsyncData(
  // Key: 加上 tourId 和 locale 确保切换时缓存隔离
  () => `tour-detail-${tourId.value}-${locale.value}`,
  
  async () => {
    // 基础校验
    if (!tourId.value) return null
    
    // 并行请求：详情 + 推荐
    const [tourRes, recommendRes] = await Promise.all([
      getTourDetail({ id: tourId.value }),
      getTourRecommend({ number: 5 })
    ])
    
    // 这里的返回值必须解包 .value，否则会引起 Hydration Mismatch
    return {
      tour: tourRes.data.value || null,
      recommend: recommendRes.data.value || [] 
    }
  },
  {
    watch: [tourId, locale] // 监听 ID 或语言变化自动重新请求
  }
)

// ----------------------------------------------------------------
// 4. 监听与计算属性
// ----------------------------------------------------------------

// 监听 404 错误跳转
watch(pageDataRaw, (newVal) => {
  // 如果 API 返回的 code 是 404，或者数据本身是 null
  if (!newVal || newVal.tour === null || newVal.tour?.code === 404) {
    showError({
      statusCode: 404,
      message: '该线路不存在或已下架',
      fatal: true // 强制渲染 error.vue
    })
  }
}, { immediate: true, deep: true })

// 格式化后的 Tour 数据
const tour = computed(() => {
  const data = pageDataRaw.value?.tour
  // 兼容直接返回数据对象 或 嵌套在 data 字段里的情况
  return data?.data || data || {}
})

// 格式化后的推荐列表
const recommendList = computed(() => {
  const data = pageDataRaw.value?.recommend
  // 兼容数组直接返回 或 {data: []} 结构
  return Array.isArray(data) ? data : (data?.data || [])
})

// ----------------------------------------------------------------
// 5. SEO 设置
// ----------------------------------------------------------------
useHead({
  title: computed(() => tour.value.langData?.seo_title || tour.value.langData?.name || 'Tour Detail'),
  meta: [
    { name: 'keywords', content: computed(() => tour.value.langData?.seo_keywords || '') },
    { name: 'description', content: computed(() => tour.value.langData?.seo_description || '') }
  ]
})

// ----------------------------------------------------------------
// 6. 交互逻辑 (Tab 滚动)
// ----------------------------------------------------------------
const scrollTo = (id) => {
  currentTab.value = id
  const el = document.getElementById(id)
  if (el) {
    // 偏移量：头部导航高度 + Sticky Tab 高度 + 缓冲
    const offset = 80 
    const top = el.getBoundingClientRect().top + window.pageYOffset - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }
}
</script>

<style lang="scss" scoped>
// 定义主题变量 (建议在 global.scss 中定义，这里为了独立性写出)


.page-wrapper {
  background-color: $whiteColor;
  min-height: 100vh;
}

/* ================= 1. Banner 区域 ================= */
.hero-section {
  position: relative;
  background-size: cover;
  background-position: center;
  height: 420px; // 固定高度，确保在所有设备一致
  display: flex;
  align-items: center;
  margin-bottom: 0;

  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.5));
    z-index: 1;
  }
  
  .container {
    position: relative;
    z-index: 2; // 确保文字在遮罩之上
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

  .hero-title {
    font-size: clamp(24px, 5vw, 48px);
    font-weight: 700;
    text-shadow: 0 4px 8px rgba(0,0,0,0.3);
    margin-bottom: 10px;
    font-family: 'AznauriSquareBold', sans-serif;
  }

  .hero-subtitle {
    font-size: clamp(14px, 3vw, 18px);
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }

  // 波浪 SVG 分割线
  .wave-divider {
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    line-height: 0;
    z-index: 3;
    svg {
      width: 100%;
      height: 40px; // 控制波浪高度
      @media (min-width: 768px) {
        height: 60px;
      }
    }
    // path {
    //   fill: $bg-page; // 与页面背景色一致，实现无缝融合
    // }
  }
}

/* ================= 2. 核心内容卡片 ================= */
.content-card, .sidebar-card, .booking-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  padding: 24px;
  border: none;
  
  // 移动端减少内边距
  @media (max-width: 768px) {
    padding: 16px;
  }
}

.content-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: $mainColor;
  margin-bottom: 0.2rem;
  line-height: 1.3;
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
}

/* ================= 3. 信息网格 (Info Grid) ================= */
.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; // 手机端单列显示
    gap: 10px;
    padding: 15px;
  }

  .info-box {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .icon-wrap {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      
      .iconfont { font-size: 20px; }
      
      &.bg-green-light { background: rgba(102, 208, 86, 0.1); }
      &.text-green { color: #66d056; }
      
      &.bg-yellow-light { background: rgba(249, 201, 40, 0.1); }
      &.text-yellow { color: #f9c928; }
      
      &.bg-cyan-light { background: rgba(71, 197, 187, 0.1); }
      &.text-cyan { color: #47c5bb; }
    }

    .text-wrap {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      small { color: #999; font-size: 12px; white-space: nowrap; }
      strong { color: $mainColor; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    }
  }
}

/* ================= 4. 吸顶 Tabs ================= */
.sticky-tabs-wrapper {
  position: sticky;
  top: 70px; // 根据顶部导航栏高度调整
  z-index: 99;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  margin-bottom: 20px;
  padding: 6px;
  
  .custom-tabs {
    .nav-link {
      color: $primaryColor;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
      
      &.active {
        background-color: rgba($primaryColor, 0.1);
        color: $primaryColor;
      }
      
      &:hover:not(.active) {
        background-color: #f8f9fa;
      }
    }
  }
}

/* ================= 5. 详情正文样式 ================= */
.detail-section {
  padding: 10px 0;
}

.section-header {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  color: $mainColor;
  
  .line {
    width: 4px;
    height: 18px;
    background: $primaryColor;
    margin-right: 10px;
    border-radius: 2px;
  }
}

.section-divider {
  margin: 30px 0;
  border-color: #eee;
  opacity: 0.5;
}

.rich-text {
  font-size: 15px;
  color: #555;
  line-height: 1.8;
  
  // 防止富文本图片撑破容器
  :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }
}

/* ================= 6. 右侧侧边栏组件 ================= */
.booking-card {
  border: 2px solid $primaryColor; // 强调边框
  
  .price-area {
    margin-bottom: 20px;
    color: #ff4d4f;
    .currency { font-size: 18px; vertical-align: top; margin-right: 2px; }
    .amount { font-size: 36px; font-weight: 800; line-height: 1; }
    .unit { color: #999; font-size: 14px; margin-left: 5px; }
  }
}

// 侧边栏吸顶
.sidebar-sticky {
  position: sticky;
  top: 90px;
  z-index: 90;
}

.card-header-custom {
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  margin-bottom: 10px;
  h5 { 
    margin: 0; 
    font-weight: 700; 
    border-left: 4px solid $primaryColor; 
    padding-left: 10px; 
    font-size: 16px;
  }
}

.thumb-wrapper {
  width: 80px;
  height: 60px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 6px;
}

.recommend-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.list-group-item:hover .recommend-thumb {
  transform: scale(1.1);
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 14px;
  line-height: 1.4;
  color: $mainColor;
}

/* ================= 7. 移动端底部栏 ================= */
.mobile-bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: white;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 -4px 16px rgba(0,0,0,0.08);
  z-index: 1000;
  // 适配 iPhone 底部安全区
  padding-bottom: calc(10px + env(safe-area-inset-bottom));

  .icons {
    display: flex;
    gap: 24px;
    margin-right: 16px;
    
    .icon-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 10px;
      color: $primaryColor;
      text-decoration: none;
      cursor: pointer;
      
      .iconfont { 
        font-size: 22px; 
        margin-bottom: 2px; 
        color: $mainColor;
      }
    }
  }
}
</style>