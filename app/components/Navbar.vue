<template>
  <div class="sticky-top-custom sticky-wrapper">
    <nav class="navbar navbar-expand-lg">
      <div class="container">
        <NuxtLink
          class="navbar-brand d-flex align-items-center"
          :to="localePath('/')"
        >
          <img
            src="~/assets/images/logo.png"
            class="navbar-brand-image img-fluid"
            alt="EZTRIPCN"
          />
        </NuxtLink>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li>
              <NuxtLink class="nav-link" :to="localePath('/')">
                {{ t("commonConfig.home") }}
              </NuxtLink>
            </li>

            <li
              v-for="cat in categoryList"
              :key="cat.id"
              class="nav-item"
              :class="{ dropdown: cat.children && cat.children.length > 0 }"
            >
              <NuxtLink
                v-if="!cat.children || cat.children.length === 0"
                class="nav-link"
                :to="resolvePath(cat)"
              >
                {{ cat.name }}
              </NuxtLink>

              <template v-else>
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  {{ cat.name }}
                </a>
                <ul class="dropdown-menu dropdown-menu-light">
                  <li v-for="child in cat.children" :key="child.id">
                    <NuxtLink class="dropdown-item" :to="resolvePath(child)">
                      {{ child.name }}
                    </NuxtLink>
                  </li>
                </ul>
              </template>
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
              <ul class="dropdown-menu dropdown-menu-light">
                <template v-if="singlePageList && singlePageList.length">
                  <li v-for="child in singlePageList" :key="child.id">
                    <NuxtLink
                      v-if="child.id"
                      class="dropdown-item"
                      :to="localePath(`/singlepage/${child.id}`)"
                    >
                      {{ child.title }}
                    </NuxtLink>
                  </li>
                </template>
              </ul>
            </li>

            <li class="nav-item dropdown ms-3">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                🌐 {{ currentLangLabel }}
              </a>
              <ul class="dropdown-menu">
                <li v-for="lang in supportedLangs" :key="lang.code || lang">
                  <a
                    class="dropdown-item cursor-pointer"
                    href="javascript:void(0)"
                    :class="{ active: locale === (lang.code || lang) }"
                    @click="handleLangSwitch(lang.code || lang)"
                  >
                    {{ (lang.name || lang).toUpperCase() }}
                  </a>
                </li>
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
// 1. 引入
const {
  getTourCategories,
  getSinglePageNav,
  getSupportedLangs,
  getLanguageJson,
} = useApi();
const { t, locale, setLocaleMessage, getLocaleMessage } = useI18n();
const langStore = useLangStore();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
const loadingIndicator = useLoadingIndicator();

// 2. 数据获取 (SSR + 响应式重刷)
// ✅ 使用 useAsyncData 包裹，确保语言切换时菜单也能跟着变 (如 Category 名称变中文)
const { data: navData } = await useAsyncData(
  // Key 加上 locale.value，确保缓存隔离
  () => `navbar-data-${locale.value}`,
  
  async () => {
    // 并行请求：分类、单页菜单、支持语言
    // ✅ 不需要传 lang 参数！useHttp 会自动注入当前 locale.value
    const [categoriesRes, singlePageRes, langRes] = await Promise.all([
      getTourCategories(),
      getSinglePageNav(),
      getSupportedLangs(),
    ]);

    // 解包 .value (因为 getXXX 返回的是 useFetch 的响应引用)
    return {
      categories: categoriesRes.data.value,
      singlePages: singlePageRes.data.value,
      langs: langRes.data.value
    };
  },
  {
    // ✅ 核心：监听 locale，语言变了立刻重发请求
    watch: [locale]
  }
);

// 3. 数据处理 (Computed)
const categoryList = computed(() => navData.value?.categories?.data || []);
const singlePageList = computed(() => navData.value?.singlePages?.data || []);

const supportedLangs = computed(() => {
  // 优先用接口数据
  const apiLangs = navData.value?.langs?.data || langStore.supportedLangs || ["en"];
  
  return apiLangs.map((lang) => {
    // 字符串兼容处理
    if (typeof lang === "string") {
      return { code: lang === "zh-cn" ? "zh_CN" : lang, name: lang };
    }
    // 对象处理 & 纠正 zh-cn 为 zh_CN
    const code = lang.code || lang.name || "";
    if (code.toLowerCase() === "zh-cn") {
      return { ...lang, code: "zh_CN" };
    }
    return lang;
  });
});

const currentLangLabel = computed(() => {
  if (!supportedLangs.value.length) return locale.value.toUpperCase();
  const current = supportedLangs.value.find((l) => l.code === locale.value);
  return (current?.name || current?.code || locale.value).toUpperCase();
});

// 路径解析
const resolvePath = (item) => {
  let path = "";
  if (item.route === "tourlist") {
    path = `/tourlist/${item.id}`;
  } else {
    path = item.route
      ? item.route.startsWith("/")
        ? item.route
        : "/" + item.route
      : "/";
  }
  return localePath(path);
};

// ✅ 语言切换逻辑 (保持不变)
const handleLangSwitch = async (targetLang) => {
  if (targetLang === locale.value) return;

  try {
    const existingMessages = getLocaleMessage(targetLang);
    const hasData = existingMessages && Object.keys(existingMessages).length > 0;

    if (!hasData) {
      loadingIndicator.start();
      console.log(`切换语言: 正在拉取 ${targetLang} 数据...`);

      // ✅ 这里必须显式传参！
      // 因为我们要拉取的是 targetLang (未来语言)，而不是 useHttp 默认注入的 currentLang
      const { data: res } = await getLanguageJson(targetLang);

      if (res.value && res.value.data) {
        setLocaleMessage(targetLang, res.value.data);
      }
    }

    loadingIndicator.finish();
    const targetPath = switchLocalePath(targetLang);
    await navigateTo(targetPath);
  } catch (error) {
    console.error("切换语言失败:", error);
    loadingIndicator.finish();
    const targetPath = switchLocalePath(targetLang);
    await navigateTo(targetPath);
  }
};
</script>

<style lang="scss" scoped>
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
}

.navbar-brand-image {
  max-height: 40px;
}

.cursor-pointer {
  cursor: pointer;
}
</style>