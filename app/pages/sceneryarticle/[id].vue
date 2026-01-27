<template>
  <div class="page-detail-wrapper">
    <section
      class="hero-section section-bg-image article-banner"
      id="section_top"
      :style="bannerStyle"
    >
      <div class="container">
        <div class="row">
          <div class="col-12 text-center center-both-column">
            <h1 class="text-white">{{ scenery.name }}</h1>
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

    <div class="container main-container">
      <div v-if="pending" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div v-else-if="scenery && scenery.id" class="row g-4">
        
        <div class="col-lg-8">
          
          <div class="info-card shadow-sm">
            <div class="title-row d-flex justify-content-between align-items-center gap-2 mb-2">
              <div class="row-title d-flex align-items-center">
                <span class="level-badge" v-if="scenery.level_id">{{ scenery.level_id }}A</span>
                <span class="scenery-title mb-0">{{ scenery.name }}</span>
              </div>
              <div class="view-count small">{{ scenery.view_count || 0 }} {{ t('sceneryArticle.views') }}</div>
            </div>

            <p class="scenery-desc">
              {{ scenery.introduce || '-' }}
            </p>

            <div class="meta-box mt-3">
              <div class="meta-row">
                <span class="label theme-color">{{ t('sceneryArticle.openTime') }}</span>
                <span class="value">{{ scenery.work_time || '09:00 - 18:00' }}</span>
                <i class="iconfont icon-time text-warning ms-2"></i>
              </div>
            </div>
          </div>

          <div class="tabs-header sticky-top mt-3" ref="tabsRef">
            <div 
              class="tab-item" 
              :class="{ active: currentTab === 'projects' }" 
              @click="currentTab = 'projects'"
            >
              {{ t('sceneryArticle.project') }}
              <div class="indicator"></div>
            </div>
            <div 
              class="tab-item" 
              :class="{ active: currentTab === 'detail' }" 
              @click="currentTab = 'detail'"
            >
              {{ t('sceneryArticle.detail') }}
              <div class="indicator"></div>
            </div>
            <div 
              class="tab-item" 
              :class="{ active: currentTab === 'cost' }" 
              @click="currentTab = 'cost'"
            >
              {{ t('sceneryArticle.cost') }}
              <div class="indicator"></div>
            </div>
            <div 
              class="tab-item" 
              :class="{ active: currentTab === 'mustread' }" 
              @click="currentTab = 'mustread'"
            >
              {{ t('sceneryArticle.itinerary') }}
              <div class="indicator"></div>
            </div>
          </div>

          <div class="tab-content p-3 shadow-sm">
            <div v-show="currentTab === 'projects'" class="projects-grid">
              <div v-for="item in scenery.projects" :key="item.id" class="project-card">
                <div class="thumb-wrapper">
                  <img :src="item.thumb_image" :alt="item.name">
                </div>
                <div class="card-info">
                  <h3 class="item-name text-truncate">{{ item.name }}</h3>
                  <div class="bottom-action mt-auto pt-3 d-flex justify-content-between align-items-center">
                    <div class="price text-danger">
                      <small>¥</small><span class="num">{{ parseFloat(item.salesprice) }}</span>
                    </div>
                    <button class="btn-book-sm" @click="addToCart(item)">{{ t('commonConfig.book') }}</button>
                  </div>
                </div>
              </div>
              <div v-if="!scenery.projects?.length" class="text-center py-4 text-muted">{{ t('commonConfig.noData') }}</div>
            </div>

            <div v-show="currentTab !== 'projects'" class="rich-text-card bg-white rounded">
              <div v-show="currentTab === 'detail'" v-html="scenery.content || t('commonConfig.noData')"></div>
              <div v-show="currentTab === 'cost'" v-html="scenery.statement || t('commonConfig.noData')"></div>
              <div v-show="currentTab === 'mustread'" v-html="scenery.travel_know || t('commonConfig.noData')"></div>
            </div>
          </div>
        </div>

        <div class="col-lg-4 d-none d-lg-block">
          
          <div class="sidebar-card mb-4 p-0 overflow-hidden" v-if="scenery.lat && scenery.lng">
             <div class="map-square">
                <div id="amap-container"></div>
             </div>
             <div class="p-2 bg-light text-left small text-truncate text-muted border-top">
                <i class="iconfont icon-location me-1"></i>{{ scenery.address }}
             </div>
          </div>

          <div class="sidebar-card mb-4 sticky-action">
            <h5 class="card-title mb-3">{{ t('commonConfig.cart') }}</h5>
            
            <div class="mini-cart mb-3" v-if="cart.length > 0">
              <div v-for="(cItem, idx) in cart" :key="idx" class="d-flex justify-content-between mb-2 small">
                <span>{{ cItem.name }}</span>
                <span class="text-danger">¥{{ cItem.salesprice }}</span>
              </div>
              <div class="border-top pt-2 fw-bold d-flex justify-content-between">
                <span>{{ t('commonConfig.totalPrice') }}:</span>
                <span class="text-danger">¥{{ cartTotal }}</span>
              </div>
            </div>
            <div v-else class="text-muted small mb-3 text-center bg-light p-2 rounded">
              {{ t('commonConfig.chooseProject') }}
            </div>

            <div class="d-grid gap-2">
              <button class="btn btn-theme fw-bold">{{ t('commonConfig.buyNow') }}</button>
              <div class="d-flex gap-2">
                <button class="btn btn-outline-secondary flex-grow-1" @click="toggleCollect">
                  <i class="iconfont" :class="isCollected ? 'icon-star-fill text-warning' : 'icon-star'"></i> 
                  {{ isCollected ? 'Collected' : 'To Collect' }}
                </button>
                <button class="btn btn-outline-secondary flex-grow-1">
                  <i class="iconfont icon-service"></i> {{ t('commonConfig.contactOnline') }}
                </button>
              </div>
            </div>
          </div>

          <div class="sidebar-card">
            <div class="sidebar-header mb-3">
              <h5 class="card-title mb-0">{{ t('commonConfig.hotPicks') }}</h5>
            </div>
            <div class="recommend-list">
              <div class="recommend-item d-flex gap-3 mb-3 pb-3 border-bottom" v-for="(item, index) in recommendList" :key="index">
                <NuxtLink :to="localePath(`/sceneryarticle/${item.id}`)" class="flex-shrink-0">
                  <img :src="item.thumb_image" :alt="item.name" class="recommend-img rounded" />
                </NuxtLink>
                <div class="recommend-text flex-grow-1 overflow-hidden">
                  <h6 class="mb-1 text-truncate">
                    <NuxtLink :to="localePath(`/sceneryarticle/${item.id}`)" class="text-dark text-decoration-none">
                      {{ item.name }}
                    </NuxtLink>
                  </h6>
                  <p class="mb-0 text-danger fw-bold">
                    {{ t('sceneryArticle.price') }} ¥{{ parseFloat(item.salesprice) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <NoData v-else />
    </div>

    <div class="mobile-bottom-bar d-lg-none">
      <div class="icons">
        <div class="icon-btn" @click="toggleCollect">
          <i class="iconfont" :class="isCollected ? 'icon-star-fill text-warning' : 'icon-star'"></i>
          <span>{{ t('commonConfig.collect') }}</span>
        </div>
        <div class="icon-btn">
          <i class="iconfont icon-service"></i>
          <span>{{ t('commonConfig.contactOnline') }}</span>
        </div>
        <div class="icon-btn position-relative">
          <i class="iconfont icon-cart"></i>
          <span>{{ t('commonConfig.cart') }}</span>
          <span v-if="cart.length" class="badge rounded-pill bg-danger position-absolute top-0 start-100 translate-middle-x" style="font-size: 10px;">{{ cart.length }}</span>
        </div>
      </div>
      <button class="btn btn-theme flex-grow-1 ms-3 rounded-pill fw-bold">
        ¥{{ cartTotal }} {{ t('commonConfig.buyNow') }}
      </button>
    </div>

    <CommonPageBanner />
    <CommonContact />
  </div>
</template>

<script setup>
// 【核心修改】不要在顶层 import AMapLoader
// import AMapLoader from '@amap/amap-jsapi-loader'; // <--- 已删除
import { onUnmounted, shallowRef, onMounted } from 'vue';

const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { getSceneryDetail, getSceneryRecommend } = useApi()

const sceneryId = computed(() => route.params.id)
const currentTab = ref('projects')
const cart = ref([])
const isCollected = ref(false)

// 地图实例
const map = shallowRef(null)

const bannerImg = '/static/images/page9_banner.png' 

const bannerStyle = computed(() => {
  return {
    backgroundImage: `url(${bannerImg})`,
    height: 'calc(100vw / 1920 * 595)',
    maxHeight: '595px',
    marginBottom: '0'
  }
})

const cartTotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + parseFloat(item.salesprice), 0).toFixed(2)
})

const addToCart = (item) => {
  cart.value.push(item)
}

const toggleCollect = () => {
  isCollected.value = !isCollected.value
}

// ================= 地图逻辑 (修复 window is not defined) =================

// 初始化地图
const initMap = async () => {
  // 1. SSR 环境检查：如果不是客户端，直接返回
  if (typeof window === 'undefined') return;
  if (!scenery.value.lat || !scenery.value.lng) return

  try {
    // 2. 【关键】动态导入 AMapLoader，确保只在客户端执行
    const AMapLoader = (await import('@amap/amap-jsapi-loader')).default;

    // 设置安全密钥
    window._AMapSecurityConfig = {
      securityJsCode: '5881bd001825947bafa36b4ecff40400', // <--- 【请替换】你的安全密钥
    }

    // 加载地图 API
    const AMap = await AMapLoader.load({
      key: '97dc8062594d886a4f138801315afc7e', // <--- 【请替换】你的高德Key
      version: '2.0',
      plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.Marker'],
    });

    // 销毁旧实例防止冲突
    if (map.value) map.value.destroy();

    // 创建地图
    map.value = new AMap.Map('amap-container', {
      viewMode: '2D',
      zoom: 15,
      center: [scenery.value.lng, scenery.value.lat],
    })

    const marker = new AMap.Marker({
      position: [scenery.value.lng, scenery.value.lat],
      title: scenery.value.name,
    })
    map.value.add(marker)
    
    map.value.addControl(new AMap.Scale())
    map.value.addControl(new AMap.ToolBar())

  } catch (e) {
    console.error('地图加载失败:', e)
  }
}

// 点击左侧地址，右侧地图居中
const centerMap = () => {
  if (map.value && scenery.value.lat && scenery.value.lng) {
    map.value.setZoomAndCenter(16, [scenery.value.lng, scenery.value.lat])
  }
}

// 销毁地图
onUnmounted(() => {
  if (map.value) {
    map.value.destroy()
    map.value = null
  }
})

// ================= 数据获取 =================

const { data: pageDataRaw, pending } = await useAsyncData(
  () => `scenery-detail-${sceneryId.value}-${locale.value}`,
  async () => {
    if (!sceneryId.value) return null
    const [sceneryRes, recommendRes] = await Promise.all([
      getSceneryDetail({ id: sceneryId.value }),
      getSceneryRecommend({ number: 5 })
    ])
    return {
      scenery: sceneryRes.data.value || null,
      recommend: recommendRes.data.value || [] 
    }
  },
  { watch: [sceneryId, locale] }
)

const scenery = computed(() => pageDataRaw.value?.scenery?.data || {})
const recommendList = computed(() => Array.isArray(pageDataRaw.value?.recommend) ? pageDataRaw.value.recommend : (pageDataRaw.value?.recommend?.data || []))

// 【核心修复】使用 onMounted 确保只在客户端初始化地图
onMounted(() => {
  // 确保 DOM 元素存在且数据已有
  if(scenery.value.lat && scenery.value.lng) {
      initMap();
  }
})

// 监听数据变化（例如切换语言或ID后），重新初始化地图
watch(scenery, (val) => {
  // 再次检查 process.client 确保安全
  if (process.client && val && val.lat && val.lng) {
    // 延迟确保 DOM 渲染完成
    setTimeout(() => {
        initMap()
    }, 500)
  }
})

watch(pageDataRaw, (newVal) => {
  if (!newVal || newVal.scenery === null || newVal.scenery?.code === 404) {
    showError({ statusCode: 404, message: '该景点不存在或已下架', fatal: true })
  }
}, { immediate: true, deep: true })

useHead({
  title: computed(() => scenery.value.name || '景点详情'),
  meta: [
    { name: 'description', content: computed(() => scenery.value.introduce || '') }
  ]
})
</script>

<style lang="scss" scoped>

$theme-color: $mainColor; 
$text-main: $darkMainColor;
$text-sub: $primaryColor;
$bg-page: #f5f7fa; 

.page-detail-wrapper {
  background-color: $whiteColor;
  min-height: 100vh;
}

// Banner
.hero-banner {
  height: 260px;
  background-size: cover;
  background-position: center;
  position: relative;
  @media (min-width: 992px) {
    height: 400px;
  }
  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba($darkMainColor, 0.1), rgba($darkMainColor, 0.5));
  }
}

.main-container {
  position: relative;
  z-index: 10;
  margin-top: -20px;
  @media (min-width: 992px) {
    margin-top: 30px;
  }
}

// 通用卡片样式
.info-card, .project-card, .sidebar-card {
  background: $bg-page;
  border-radius: $borderRadius;
  padding: 20px;
}
.rich-text-card{
  background: $bg-page;
  border-radius: $borderRadius;
}

// A. 核心信息卡片
.info-card {
  .price-row {
    color: #ff4d4f; 
    font-weight: bold;
    .currency { font-size: 14px; }
    .amount { font-size: 24px; line-height: 1; }
    .suffix { font-size: 12px; color: $text-sub; margin-left: 2px; }
  }
  
  .view-count {
    color: $text-sub;
  }
  
  .title-row {
    .level-badge {
      background: $theme-color; 
      color: $whiteColor;
      font-size: 12px;
      padding: 2px 6px;
      border-radius: $buttonBorderRadius;
      font-weight: bold;
      margin-right: 8px;
    }
    .scenery-title {
      font-size: 20px;
      font-weight: 700;
      color: $text-main;
    }
  }

  .scenery-desc {
    font-size: $fontSizeBase;
    line-height: 1.6;
    margin-bottom: 15px;
    color: $text-sub;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .meta-box {
    background: #f8fcfb; 
    border-radius: $borderRadius;
    padding: 12px;
    .meta-row {
      display: flex;
      align-items: center;
      font-size: 14px;
      padding: 4px 0;
      .label { font-weight: bold; margin-right: 10px; color: $theme-color; }
      .value { color: $text-main; flex: 1; }
      &.cursor-pointer { cursor: pointer; &:hover { opacity: 0.8; } }
      .theme-color { color: $theme-color !important; }
    }
    .divider { height: 1px; background: #eee; margin: 8px 0; }
  }
}

// 【新增】地图容器样式 - 强制正方形
.map-square {
  width: 100%;
  // aspect-ratio: 1/1 是现代浏览器实现正方形最简单的方法
  aspect-ratio: 1 / 1; 
  position: relative;
  
  #amap-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1; // 确保地图可点击
  }
}

// B. Tab 导航栏
.tabs-header {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  border-radius: $borderRadius $borderRadius 0 0;
  border-bottom: 1px solid #eee;
  background: $bg-page;
  
  .tab-item {
    position: relative;
    padding: 10px;
    font-size: 15px;
    color: $text-sub;
    cursor: pointer;
    font-weight: 500;
    
    &.active {
      color: $theme-color; 
      font-weight: bold;
      .indicator {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 24px;
        height: 3px;
        background: $theme-color;
        border-radius: 2px;
      }
    }
  }
}

.tab-content{
  background: $whiteColor;
}

// C. 景区项目列表
.projects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .project-card {
    padding: 0; 
    overflow: hidden;
    display: flex;
    flex-direction: column; 
    
    .thumb-wrapper {
      width: 100%;
      height: 160px; 
      border-radius: $borderRadius $borderRadius 0 0;
      overflow: hidden;
      img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
    }
    
    &:hover .thumb-wrapper img {
      transform: scale(1.05);
    }
    
    .card-info {
      padding: 15px;
      flex: 1;
      display: flex;
      flex-direction: column;
      
      .item-name { 
        font-size: 16px; 
        font-weight: bold; 
        margin-bottom: 10px;
        color: $text-main;
      }
      
      .bottom-action {
        .price { font-size: 14px; .num { font-size: 20px; font-weight: bold; } }
        .btn-book-sm {
          background: $theme-color; 
          color: $bg-page; border: none;
          padding: 6px 18px; border-radius: $buttonBorderRadius;
          font-size: 13px; font-weight: bold;
          transition: opacity 0.3s;
          &:hover { opacity: 0.9; }
        }
      }
    }
  }
}

// PC端侧边栏
.sidebar-card {
  .card-title { 
    font-weight: bold; 
    border-left: 4px solid $theme-color; 
    padding-left: 10px; 
    color: $text-main;
  }
  
  .recommend-list {
    .recommend-img {
      width: 80px;
      height: 60px;
      object-fit: cover;
    }
  }
}

.sticky-action { position: sticky; top: 90px; z-index: 90; }

.btn-theme { 
  background-color: $theme-color; 
  border-color: $theme-color; 
  color: $bg-page;
  border-radius: $buttonBorderRadius;
  &:hover { opacity: 0.9; background-color: $theme-color; color: $bg-page;} 
}

// 移动端底部
.mobile-bottom-bar {
  position: fixed; bottom: 0; left: 0; width: 100%;
  background: $bg-page; padding: 10px 20px;
  display: flex; align-items: center;
  box-shadow: 0 -4px 16px rgba(0,0,0,0.08);
  z-index: 1000;
  padding-bottom: calc(10px + env(safe-area-inset-bottom));

  .icons {
    display: flex; gap: 20px; margin-right: 16px;
    .icon-btn {
      display: flex; flex-direction: column; align-items: center;
      font-size: 10px; color: $text-sub; cursor: pointer;
      .iconfont { font-size: 22px; margin-bottom: 2px; color: $text-main; }
    }
  }
}
</style>