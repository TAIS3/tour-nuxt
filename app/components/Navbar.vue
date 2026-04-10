<template>
  <div class="sticky-top-custom sticky-wrapper">
    <nav class="navbar navbar-expand-lg navbar-dark bg-theme-dark">
      <div class="container position-relative">
        
        <NuxtLink class="navbar-brand d-flex align-items-center" :to="localePath('/')">
          <img
            src="~/assets/images/logo.png"
            class="navbar-brand-image img-fluid filter-white"
            alt="EZTRIPCN"
          />
        </NuxtLink>

        <button
          class="navbar-toggler border-0 focus-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul class="navbar-nav align-items-lg-center">
            
            <li class="nav-item">
              <NuxtLink class="nav-link" :to="localePath('/')">
                {{ t("commonConfig.home") }}
              </NuxtLink>
            </li>

            <li class="nav-item">
              <NuxtLink class="nav-link" :to="localePath('/tourlist/17')">
                {{ diyTourDetail.langData.name }}
              </NuxtLink>
            </li>

            <li class="nav-item dropdown position-static">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                @click.prevent="isMobile && toggleDropdown($event)"
              >
                {{ t("commonConfig.scenery") || 'Scenery' }}
              </a>
              
              <div class="dropdown-menu mega-menu w-100 p-0 border-0">
                <div class="mega-menu-inner d-flex">
                  
                  <div class="mega-left d-none d-lg-flex justify-content-center align-items-center">
                    <div class="placeholder-icon text-center">
                      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-white-50">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                      <div class="mt-3 text-white-50 fw-bold tracking-wider">SCENERY</div>
                    </div>
                  </div>

                  <div class="mega-right flex-grow-1 p-4 p-lg-5">
                    <div class="container-fluid">
                      <div class="row">
                        <div 
                          class="col-lg-3 col-md-6 mb-4" 
                          v-for="cat in sceneryCategoryList" 
                          :key="cat.id"
                        >
                          <div class="menu-column">
                            <span 
                              v-if="cat.children && cat.children.length > 0"
                              class="menu-title non-clickable d-block mb-2 mb-lg-3"
                            >
                              {{ cat.name }}
                            </span>
                            <NuxtLink 
                              v-else
                              class="menu-title clickable d-block mb-2 mb-lg-3" 
                              :to="resolvePath(cat, 'scenery')"
                            >
                              {{ cat.name }} >>
                            </NuxtLink>
                            <ul class="list-unstyled">
                              <li v-for="child in cat.children" :key="child.id" class="mb-2">
                                <NuxtLink 
                                  class="menu-link" 
                                  :to="resolvePath(child, 'scenery')"
                                >
                                  {{ child.name }} >>
                                </NuxtLink>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </li>

            <li class="nav-item dropdown position-static">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                @click.prevent="isMobile && toggleDropdown($event)"
              >
                {{ t("commonConfig.tour") || 'Tour' }}
              </a>
              
              <div class="dropdown-menu mega-menu w-100 p-0 border-0">
                <div class="mega-menu-inner d-flex">
                  
                  <div class="mega-left d-none d-lg-flex justify-content-center align-items-center">
                    <div class="placeholder-icon text-center">
                      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-white-50">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                      </svg>
                      <div class="mt-3 text-white-50 fw-bold tracking-wider">TOURS</div>
                    </div>
                  </div>

                  <div class="mega-right flex-grow-1 p-4 p-lg-5">
                    <div class="container-fluid">
                      <div class="row">
                        <div 
                          class="col-lg-3 col-md-6 mb-4" 
                          v-for="cat in tourCategoryList" 
                          :key="cat.id"
                        >
                          <div class="menu-column">
                            <span 
                              v-if="cat.children && cat.children.length > 0"
                              class="menu-title non-clickable d-block mb-2 mb-lg-3"
                            >
                              {{ cat.name }}
                            </span>
                            <NuxtLink 
                              v-else
                              class="menu-title clickable d-block mb-2 mb-lg-3" 
                              :to="resolvePath(cat, 'tour')"
                            >
                              {{ cat.name }} >>
                            </NuxtLink>
                            <ul class="list-unstyled">
                              <li v-for="child in cat.children" :key="child.id" class="mb-2">
                                <NuxtLink 
                                  class="menu-link" 
                                  :to="resolvePath(child, 'tour')"
                                >
                                  {{ child.name }} >>
                                </NuxtLink>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </li>

            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                {{ t("commonConfig.aboutus") }}
              </a>
              <ul class="dropdown-menu simple-menu border-0 shadow-lg p-2">
                <template v-if="singlePageList && singlePageList.length">
                  <li v-for="child in singlePageList" :key="child.id">
                    <NuxtLink
                      class="dropdown-item rounded"
                      :to="localePath(`/singlepage/${child.id}`)"
                    >
                      {{ child.title }}
                    </NuxtLink>
                  </li>
                </template>
              </ul>
            </li>

            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle lang-btn d-inline-flex align-items-center"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                <i class="iconfont icon-global me-2">🌐</i> {{ currentLangLabel }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end simple-menu border-0 shadow-lg p-2">
                <li v-for="lang in supportedLangs" :key="lang.code || lang">
                  <a
                    class="dropdown-item rounded"
                    href="javascript:void(0)"
                    :class="{ active: locale === (lang.code || lang) }"
                    @click="handleLangSwitch(lang.code || lang)"
                  >
                    {{ (lang.name || lang).toUpperCase() }}
                  </a>
                </li>
              </ul>
            </li>

            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle lang-btn" href="#" role="button" data-bs-toggle="dropdown">
                <i class="bi bi-person-fill me-2"></i>{{ t('commonConfig.member') }}
              </a>
              <ul class="dropdown-menu simple-menu border-0 shadow-lg p-2">
                <template v-if="!isLoggedIn">
                  <li>
                    <NuxtLink class="dropdown-item rounded" :to="localePath('/login')">
                      {{ t('commonConfig.login') }}
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink class="dropdown-item rounded" :to="localePath('/register')">
                      {{ t('commonConfig.register') }}
                    </NuxtLink>
                  </li>
                </template>
                <template v-if="isLoggedIn">
                  <li>
                    <NuxtLink class="dropdown-item rounded" :to="localePath('/member/orderlist')">
                      {{ t('commonConfig.myOrders') }}
                    </NuxtLink>
                  </li>
                 
                  <li>
                    <NuxtLink class="dropdown-item rounded" :to="localePath('/member/member-center')">
                      {{ t('commonConfig.memberCenter') }}
                    </NuxtLink>
                  </li>
                   <li>
                    <NuxtLink class="dropdown-item rounded" :to="localePath('/member/change-password')">
                      {{ t('commonConfig.changePassword') }}
                    </NuxtLink>
                  </li>
                  <li>
                    <hr class="dropdown-divider">
                  </li>
                  <li>
                    <a class="dropdown-item rounded" href="#" @click.prevent="logout">
                      {{ t('commonConfig.logout') }}
                    </a>
                  </li>
                </template>
              </ul>
            </li>

          </ul>
        </div>
      </div>
    </nav>

    <section
      class="hero-section d-flex justify-content-center align-items-center"
      id="topBgSvg"
    >
      <svg
        class="w-100 h-auto d-block"
        viewBox="0 0 1442 127"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.55795385e-13,0 L2.55795385e-13,127 C125.840763,67.122807 223.840763,45.7894737 294,63 C693.5,161 822.223321,5.84961885 1137.5,87 C1310.71191,131.583736 1316.88033,47.473666 1442,36.5 C1442,36.5 1442,24.3333333 1442,0 L2.55795385e-13,0 Z"
          fill="#3D405B"
        ></path>
        <path
          d="M2.55795385e-13,0 L2.55795385e-13,127 C125.840763,67.122807 223.840763,45.7894737 294,63 C693.5,161 822.223321,5.84961885 1137.5,87 C1310.71191,131.583736 1316.88033,47.473666 1442,36.5 C1442,36.5 1442,24.3333333 1442,0 L2.55795385e-13,0 Z"
          fill="#3D405B"
          opacity="0.15"
          transform="translate(0,8)"
        ></path>
      </svg>
    </section>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
// 1. 引入依赖
const {
  getTourCategories,
  getSceneryCategories,
  getSinglePageNav,
  getSupportedLangs,
  getLanguageJson,
  getTourCategoryDetail,
  logout: apiLogout,
} = useApi();
const { t, locale, setLocaleMessage, getLocaleMessage } = useI18n();
const langStore = useLangStore();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
const loadingIndicator = useLoadingIndicator();
const router = useRouter();

const mainStore = useMainStore();
const { isLoggedIn, user } = storeToRefs(mainStore);

const isMobile = ref(false)

onMounted(() => {
  const checkMobile = () => isMobile.value = window.innerWidth < 992
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

const logout = async () => {
  await apiLogout(); // Call the API to invalidate the token on the server
  mainStore.clearAuth(); // Clear local state and cookie
  await router.push(localePath('/'));
};

// 2. 数据获取
const { data: navData } = await useAsyncData(
  () => `navbar-data-${locale.value}`,
  async () => {

    const [tourRes, sceneryRes, singlePageRes, langRes, diyTourRes] = await Promise.all([
      getTourCategories(),
      getSceneryCategories(), 
      getSinglePageNav(),
      getSupportedLangs(),
      getTourCategoryDetail({id: 17})
    ]);
    
    return {
      tourCats: tourRes.data.value,
      sceneryCats: sceneryRes?.data?.value || [],
      singlePages: singlePageRes.data.value,
      langs: langRes.data.value,
      diyTour: diyTourRes.data.value
    };
  },
  { watch: [locale] }
);


// 3. 数据处理
const tourCategoryList = computed(() => navData.value?.tourCats?.data || []);
const sceneryCategoryList = computed(() => navData.value?.sceneryCats?.data || []);
const singlePageList = computed(() => navData.value?.singlePages?.data || []);

const supportedLangs = computed(() => {
  const apiLangs = navData.value?.langs?.data || langStore.supportedLangs || ["en"];
  return apiLangs.map((lang) => {
    if (typeof lang === "string") {
      return { code: lang === "zh-cn" ? "zh_CN" : lang, name: lang };
    }
    const code = lang.code || lang.name || "";
    if (code.toLowerCase() === "zh-cn") {
      return { ...lang, code: "zh_CN" };
    }
    return lang;
  });
});
const diyTourDetail = computed(() => navData.value?.diyTour.data || {});

const currentLangLabel = computed(() => {
  if (!supportedLangs.value.length) return locale.value.toUpperCase();
  const current = supportedLangs.value.find((l) => l.code === locale.value);
  return (current?.name || current?.code || locale.value).toUpperCase();
});

const resolvePath = (item, type = 'tour') => {
  let path = "";
  
  if (item.route && item.route !== '#' && item.route !== 'tourlist') {
    path = item.route.startsWith("/") ? item.route : "/" + item.route;
  } else {
    path = type === 'scenery' ? `/scenerylist/${item.id}` : `/tourlist/${item.id}`;
  }
  
  return localePath(path);
};

const toggleDropdown = (event) => {
  // Mobile Only
};

const handleLangSwitch = async (targetLang) => {
  if (targetLang === locale.value) return;
  try {
    const existingMessages = getLocaleMessage(targetLang);
    if (!existingMessages || Object.keys(existingMessages).length === 0) {
      loadingIndicator.start();
      const { data: res } = await getLanguageJson(targetLang);
      if (res.value && res.value.data) setLocaleMessage(targetLang, res.value.data);
    }
    loadingIndicator.finish();
    const targetPath = switchLocalePath(targetLang);
    await navigateTo(targetPath);
  } catch (error) {
    loadingIndicator.finish();
    const targetPath = switchLocalePath(targetLang);
    await navigateTo(targetPath);
  }
};
</script>

<style lang="scss" scoped>
// ====== 1. 主题变量 ======
$theme-color: $mainColor; // 深蓝背景
$mega-bg: $mainColor;     // 下拉菜单也用深蓝
$mega-left-bg: $mainColor; // 左侧装饰区稍微加深
$text-light: #ffffff;
$hover-gold: #F2CC8F;  // 金色高亮

// ====== 2. 导航栏布局 ======
.sticky-top-custom {
  position: -webkit-relative;
  position: relative;
  top: 0;
  z-index: 1020;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

#topBgSvg {
  &.hero-section {
    margin-bottom: -100px;
    padding-bottom: 0;
    padding-top: 100px;
    z-index: -1;
    position: relative;
  }
}

.navbar{
  position: fixed;
  width: 100%;
  height: auto;
  .nav-item{
    .dropdown-toggle{
      &:not(.lang-btn)::before {
        content: "\f282";
        display: inline-block;
        font-family: bootstrap-icons;
        position: absolute;
        right: -5px;
        border: 0;
        top: 50%;
        transform: translateY(-50%);
        transition: transform 0.3s;
      }
    }
    &:hover{
      .dropdown-toggle{
        &::before {
          transform: translateY(-50%) rotate(180deg);
          transition: transform 0.3s;
        }
      }
    }
  }
}

.bg-theme-dark {
  background-color: $theme-color !important;
  padding: 1rem 0;
}

// Logo 反白
.navbar-brand-image {
  height: 20px;
  &.filter-white {
    filter: brightness(0) invert(1);
  }
}

// 导航链接样式
.navbar-dark .navbar-nav {
  // 【新增】给 nav-item 增加底部透明填充，防止鼠标滑向菜单时断开
  .nav-item {
    padding-bottom: 20px; 
    margin-bottom: -20px;
    &:hover{
      .nav-link{
        color: $hover-gold;
        &::after {
          width: 80%; 
        }
      }
    }
  }
  .nav-link {
    color: rgba(255, 255, 255, 0.9);
    position: relative;
    font-weight: 500;
    text-transform: uppercase;
    font-size: 15px;
    padding: 0.5rem 1rem;
    transition: color 0.3s;

    &:hover, &.show {
      color: $hover-gold;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: 5px; // 根据需要调整距离文字的位置
      left: 50%;
      width: 0; // 初始宽度为0
      height: 2px;
      background-color: $hover-gold; // 使用你的金色变量 #F2CC8F
      transition: all 0.3s ease-in-out;
      transform: translateX(-50%); // 居中
      border: 0;
    }
    // 鼠标移上去时，宽度变大
    // &:hover::after {
    //   width: 80%; 
    // }
  }
}

// ====== 3. Mega Menu (关键修复) ======
.mega-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%; // 占满整个导航栏宽度
  background-color: $mega-bg; // 背景深蓝
  border-radius: 0 0 8px 8px;
  margin-top: 0;
  overflow: hidden; // 防止圆角溢出
  
  // 内部容器 flex 布局
  .mega-menu-inner {
    min-height: 300px;
  }

  // 左侧装饰区 (25%)
  .mega-left {
    width: 25%;
    // background-color: $mega-left-bg; // 深色背景块
    border-right: 1px solid rgba(255,255,255,0.05);
    
    .tracking-wider {
      letter-spacing: 2px;
    }
  }

  // 右侧内容区 (75%)
  .mega-right {
    width: 75%;
  }

  // 标题样式
  .menu-title {
    color: $text-light;
    font-weight: 700;
    font-size: 16px;
    text-transform: uppercase;
    text-decoration: none;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding-bottom: 5px;
    margin-bottom: 10px;
    &.clickable{
      cursor: pointer;
      &:hover {
        color: $hover-gold;
      }
    }
  }

  // 链接样式
  .menu-link {
    color: rgba(255,255,255,0.6);
    font-size: 14px;
    text-decoration: none;
    transition: all 0.2s;
    
    &:hover {
      color: $hover-gold;
      padding-left: 5px;
    }
  }
}

// 普通下拉菜单
.simple-menu {
  background-color: $darkMainColor;
  border-radius: 8px;
  margin-top: 10px;
  
  .dropdown-item {
    color: rgba(255,255,255,0.8);
    font-size: 14px;
    padding: 8px 16px;
    
    &:hover {
      background-color: rgba(255,255,255,0.1);
      color: $hover-gold;
    }
  }
}

// 语言按钮
.lang-btn {
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 50px;
  padding: 5px 15px !important;
  font-size: 13px !important;
  margin-top: -2px; // 微调对齐
  
  &:hover {
    border-color: #fff;
    background: rgba(255,255,255,0.1);
  }
  &::after { display: none; }
}

// ====== 4. 波浪 SVG ======
.svg-wave-divider {
  line-height: 0;
  width: 100%;
  background-color: transparent; // 关键：背景透明
  position: relative;
  z-index: 10;
  margin-top: -1px; // 消除缝隙
  
  svg {
    display: block;
    width: 100%;
    height: auto;
    // 确保 SVG 顶部的颜色和导航栏背景色完全一致
    path:first-child {
      fill: $theme-color;
    }
  }
}

// ====== 5. 交互动画 (PC) ======
@media (min-width: 992px) {
  // 悬停展开
  .navbar-nav .dropdown {
    
    // 【修改】悬停触发下拉 + 动画
    &:hover > .dropdown-menu {
      display: block;
      animation: slideDown 0.2s ease forwards;
    }
    .dropdown-menu{
      display: block;
      animation: slideUp 0.1s ease forwards;
    }
  }
  
  .container.position-relative {
    position: static !important;
  }

}

// 【新增】定义动画关键帧
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px); // 从上方 20px 处下落
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 1;
    transform: translateY(0); // 从上方 20px 处下落
    pointer-events: none;
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
    display: none;
    pointer-events: none;
  }
}

// ====== 6. 移动端适配 ======
@media (max-width: 991px) {
  .navbar-collapse {
    // 这里的颜色改为你的深色主题变量
    background-color: $theme-color; 
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 1000;
    padding: 0;
    max-height: 85vh;
    overflow-y: auto;
    border-top: 1px solid rgba(255,255,255,0.1);
  }

  .navbar-nav {
    padding: 20px;
  }

  // 移动端不需要 Hover 桥梁，也不需要下划线
  .nav-item {
    margin-bottom: 0;
    padding-bottom: 0 !important;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .nav-link {
    padding: 15px 0 !important;
    font-size: 16px;
    color: #fff !important;
    &::after { display: none; } // 禁用下划线动画
  }

  // 【核心】强制重置下拉菜单样式：去阴影、去定位、去背景
  .mega-menu, .simple-menu {
    position: static; 
    float: none;
    width: auto;
    margin-top: 0;
    background-color: transparent !important;
    border: 0;
    box-shadow: none !important;
    padding-left: 15px; // 稍微缩进表示层级
    padding-bottom: 10px;
  }

  // 确保左侧装饰图不占位 (虽然 template 加了 d-none，这里双保险)
  .mega-left {
    display: none !important;
  }

  .mega-right {
    padding: 0 !important;
  }

  // 调整子菜单文字颜色
  .menu-title {
    color: rgba(255,255,255,0.5) !important; // 标题变暗
    border-bottom: none;
    margin-top: 10px;
    margin-bottom: 5px;
  }

  .menu-link, .dropdown-item {
    color: #fff !important; // 链接亮白
    padding: 8px 0;
  }
}

.focus-none {
  box-shadow: none !important;
  outline: none !important;
}
</style>