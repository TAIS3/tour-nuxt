<template>
  <div class="page-detail-wrapper">
    <div class="hero-banner" :style="{ backgroundImage: `url(${scenery.thumb_image || '/placeholder.jpg'})` }">
      <div class="hero-overlay"></div>
      <div class="container h-100 d-flex align-items-end pb-5 d-none d-lg-flex">
        <h1 class="text-white fw-bold">{{ scenery.name }}</h1>
      </div>
    </div>

    <div class="container main-container">
      <div v-if="pending" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div v-else-if="scenery && scenery.id" class="row g-4">
        
        <div class="col-lg-8">
          
          <div class="info-card shadow-sm">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <div class="price-row mb-1">
                  <span class="currency">¥</span>
                  <span class="amount">{{ parseFloat(scenery.salesprice) }}</span>
                  <span class="suffix">起</span>
                </div>
              </div>
              <div class="view-count small">{{ scenery.view_count || 0 }}人浏览</div>
            </div>

            <div class="title-row d-flex align-items-center gap-2 mb-2">
              <span class="level-badge" v-if="scenery.level_id">{{ scenery.level_id }}A</span>
              <h1 class="scenery-title mb-0">{{ scenery.name }}</h1>
            </div>

            <p class="scenery-desc">
              {{ scenery.introduce || '暂无简介' }}
            </p>

            <div class="meta-box mt-3">
              <div class="meta-row">
                <span class="label theme-color">开放时间</span>
                <span class="value">{{ scenery.work_time || '09:00 - 18:00' }}</span>
                <i class="iconfont icon-time text-warning ms-2"></i>
              </div>
              <div class="divider"></div>
              <div class="meta-row" @click="openMap">
                <span class="value address-text text-truncate">{{ scenery.address }}</span>
                <i class="iconfont icon-location theme-color ms-auto cursor-pointer"></i>
              </div>
            </div>
          </div>

          <div class="tabs-header sticky-top bg-white shadow-sm mt-3" ref="tabsRef">
            <div 
              class="tab-item" 
              :class="{ active: currentTab === 'projects' }" 
              @click="currentTab = 'projects'"
            >
              景区项目
              <div class="indicator"></div>
            </div>
            <div 
              class="tab-item" 
              :class="{ active: currentTab === 'detail' }" 
              @click="currentTab = 'detail'"
            >
              景区详情
              <div class="indicator"></div>
            </div>
            <div 
              class="tab-item" 
              :class="{ active: currentTab === 'cost' }" 
              @click="currentTab = 'cost'"
            >
              费用说明
              <div class="indicator"></div>
            </div>
            <div 
              class="tab-item" 
              :class="{ active: currentTab === 'mustread' }" 
              @click="currentTab = 'mustread'"
            >
              行程必看
              <div class="indicator"></div>
            </div>
          </div>

          <div class="tab-content mt-3">
            
            <div v-if="currentTab === 'projects'" class="projects-grid">
              <div v-for="item in scenery.projects" :key="item.id" class="project-card shadow-sm">
                <div class="thumb-wrapper">
                  <img :src="item.thumb_image" :alt="item.name">
                </div>
                <div class="card-info">
                  <h3 class="item-name text-truncate">{{ item.name }}</h3>
                  <div class="bottom-action mt-auto pt-3 d-flex justify-content-between align-items-center">
                    <div class="price text-danger">
                      <small>¥</small><span class="num">{{ parseFloat(item.salesprice) }}</span>
                    </div>
                    <button class="btn-book-sm" @click="addToCart(item)">预定</button>
                  </div>
                </div>
              </div>
              <div v-if="!scenery.projects?.length" class="text-center py-4 text-muted">暂无项目</div>
            </div>

            <div v-else class="rich-text-card shadow-sm p-3 bg-white rounded">
              <div v-if="currentTab === 'detail'" v-html="scenery.content || '暂无详情'"></div>
              <div v-if="currentTab === 'cost'" v-html="scenery.statement || '暂无费用说明'"></div>
              <div v-if="currentTab === 'mustread'" v-html="scenery.travel_know || '暂无行程须知'"></div>
            </div>

          </div>
        </div>

        <div class="col-lg-4 d-none d-lg-block">
          
          <div class="sidebar-card mb-4 sticky-action">
            <h5 class="card-title mb-3">预订中心</h5>
            
            <div class="mini-cart mb-3" v-if="cart.length > 0">
              <div v-for="(cItem, idx) in cart" :key="idx" class="d-flex justify-content-between mb-2 small">
                <span>{{ cItem.name }}</span>
                <span class="text-danger">¥{{ cItem.salesprice }}</span>
              </div>
              <div class="border-top pt-2 fw-bold d-flex justify-content-between">
                <span>总计:</span>
                <span class="text-danger">¥{{ cartTotal }}</span>
              </div>
            </div>
            <div v-else class="text-muted small mb-3 text-center bg-light p-2 rounded">
              请选择左侧项目加入行程
            </div>

            <div class="d-grid gap-2">
              <button class="btn btn-theme fw-bold">立即购买</button>
              <div class="d-flex gap-2">
                <button class="btn btn-outline-secondary flex-grow-1" @click="toggleCollect">
                  <i class="iconfont" :class="isCollected ? 'icon-star-fill text-warning' : 'icon-star'"></i> 
                  {{ isCollected ? '已收藏' : '收藏' }}
                </button>
                <button class="btn btn-outline-secondary flex-grow-1">
                  <i class="iconfont icon-service"></i> 联系客服
                </button>
              </div>
            </div>
          </div>

          <div class="sidebar-card">
            <h5 class="card-title mb-3">热门推荐</h5>
            <div class="recommend-list">
              <NuxtLink 
                v-for="rec in recommendList" 
                :key="rec.id" 
                :to="localePath(`/scenery/${rec.id}`)"
                class="d-flex gap-3 py-3 border-bottom text-decoration-none text-dark"
              >
                <img :src="rec.thumb_image" class="rounded" width="80" height="60" object-fit="cover">
                <div class="flex-grow-1">
                  <h6 class="mb-1 text-truncate-2">{{ rec.name }}</h6>
                  <div class="text-danger fw-bold">¥{{ parseFloat(rec.salesprice) }}</div>
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
        <div class="icon-btn" @click="toggleCollect">
          <i class="iconfont" :class="isCollected ? 'icon-star-fill text-warning' : 'icon-star'"></i>
          <span>收藏</span>
        </div>
        <div class="icon-btn">
          <i class="iconfont icon-service"></i>
          <span>客服</span>
        </div>
        <div class="icon-btn position-relative">
          <i class="iconfont icon-cart"></i>
          <span>购物车</span>
          <span v-if="cart.length" class="badge rounded-pill bg-danger position-absolute top-0 start-100 translate-middle-x" style="font-size: 10px;">{{ cart.length }}</span>
        </div>
      </div>
      <button class="btn btn-theme flex-grow-1 ms-3 rounded-pill fw-bold">
        ¥{{ cartTotal }} 立即购买
      </button>
    </div>

    <CommonPageBanner />
    <CommonContact />
  </div>
</template>

<script setup>
// script 部分逻辑保持不变，不需要修改
const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { getSceneryDetail, getTourRecommend } = useApi()

const sceneryId = computed(() => route.params.id)
const currentTab = ref('projects')
const cart = ref([])
const isCollected = ref(false)

const cartTotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + parseFloat(item.salesprice), 0).toFixed(2)
})

const addToCart = (item) => {
  cart.value.push(item)
}

const toggleCollect = () => {
  isCollected.value = !isCollected.value
}

const openMap = () => {
  const { lat, lng, address, name } = scenery.value
  if (lat && lng) {
    const url = `https://uri.amap.com/marker?position=${lng},${lat}&name=${name}&address=${address}&coordinate=gaode&callnative=1`
    window.open(url, '_blank')
  }
}

const { data: pageDataRaw, pending } = await useAsyncData(
  () => `scenery-detail-${sceneryId.value}-${locale.value}`,
  async () => {
    if (!sceneryId.value) return null
    const [sceneryRes, recommendRes] = await Promise.all([
      getSceneryDetail({ id: sceneryId.value }),
      getTourRecommend({ number: 5 })
    ])
    return {
      scenery: sceneryRes.data.value || null,
      recommend: recommendRes.data.value || [] 
    }
  },
  { watch: [sceneryId, locale] }
)

watch(pageDataRaw, (newVal) => {
  if (!newVal || newVal.scenery === null || newVal.scenery?.code === 404) {
    showError({ statusCode: 404, message: '该景点不存在或已下架', fatal: true })
  }
}, { immediate: true, deep: true })

const scenery = computed(() => pageDataRaw.value?.scenery?.data || {})
const recommendList = computed(() => Array.isArray(pageDataRaw.value?.recommend) ? pageDataRaw.value.recommend : (pageDataRaw.value?.recommend?.data || []))

useHead({
  title: computed(() => scenery.value.name || '景点详情'),
  meta: [
    { name: 'description', content: computed(() => scenery.value.introduce || '') }
  ]
})
</script>

<style lang="scss" scoped>

// 定义一些局部辅助变量，映射到你提供的全局变量
// $mainColor 是你的主色调 (#404059 深色)
// $primaryColor 是次要文字颜色 (#686d73 灰色)
// $darkMainColor 是主要文字颜色 (#2b2b3e 深黑)
$theme-color: $mainColor; 
$text-main: $darkMainColor;
$text-sub: $primaryColor;
$bg-page: #f5f7fa; // 页面背景暂时保持浅灰，以突出白色卡片

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
    // 使用变量调整遮罩
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

// 通用卡片样式 - 使用变量定义的圆角和背景色
.info-card, .rich-text-card, .project-card, .sidebar-card {
  background: $bg-page;
  border-radius: $borderRadius;
  padding: 20px;
  // 如果需要更圆润的边框，可以使用 $textBorderRadius
  // border-radius: $textBorderRadius; 
}

// A. 核心信息卡片
.info-card {
  .price-row {
    color: #ff4d4f; // 价格保留醒目红色
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
      background: $theme-color; // 使用主色调
      color: $whiteColor;
      font-size: 12px;
      padding: 2px 6px;
      border-radius: $buttonBorderRadius;
      font-weight: bold;
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

  // 营业时间与地址栏
  .meta-box {
    background: #f8fcfb; // 可以微调这个背景色以匹配新主题
    border-radius: $borderRadius;
    padding: 12px;
    .meta-row {
      display: flex;
      align-items: center;
      font-size: 14px;
      padding: 4px 0;
      .label { font-weight: bold; margin-right: 10px; width: 70px; color: $theme-color; }
      .value { color: $text-main; flex: 1; }
      &.cursor-pointer { cursor: pointer; }
      // 图标颜色也使用主题色
      .theme-color { color: $theme-color !important; }
    }
    .divider { height: 1px; background: #eee; margin: 8px 0; }
  }
}

// B. Tab 导航栏
.tabs-header {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  border-radius: $borderRadius $borderRadius 0 0;
  border-bottom: 1px solid #eee;
  
  .tab-item {
    position: relative;
    padding: 10px;
    font-size: 15px;
    color: $text-sub;
    cursor: pointer;
    font-weight: 500;
    
    &.active {
      color: $theme-color; // 选中项使用主色
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

// 【修改点2】 C. 景区项目列表 - 网格布局重构
.projects-grid {
  display: grid;
  // 移动端一排1个
  grid-template-columns: 1fr;
  gap: 15px;
  
  // 平板端一排2个
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  // PC端一排3个
  @media (min-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  // 项目卡片样式重构为垂直布局
  .project-card {
    padding: 0; // 移除内边距，让图片撑满
    overflow: hidden;
    display: flex;
    flex-direction: column; // 垂直排列
    
    .thumb-wrapper {
      width: 100%;
      height: 160px; // 固定高度确保整齐
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
        // mt-auto 确保操作栏始终在卡片底部
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

// 富文本内容
.rich-text-card {
  font-size: $fontSizeBase;
  color: $text-main;
  line-height: 1.8;
  :deep(img) { max-width: 100%; border-radius: $borderRadius; }
}

// PC端侧边栏
.sidebar-card {
  .card-title { 
    font-weight: bold; 
    border-left: 4px solid $theme-color; 
    padding-left: 10px; 
    color: $text-main;
  }
}
.sticky-action { position: sticky; top: 90px; z-index: 90; }
// 通用按钮样式，使用主色调和变量圆角
.btn-theme { 
  background-color: $theme-color; 
  border-color: $theme-color; 
  color: $bg-page;
  border-radius: $buttonBorderRadius;
  &:hover { opacity: 0.9; background-color: $theme-color; color: $bg-page;} 
}

// 移动端底部固定栏
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