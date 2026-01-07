<template>
  <div>
    <section class="hero-section hero-section-top d-flex justify-content-center align-items-center" id="section_1">
      <div class="section-overlay"></div>
      <div 
        class="aboutus container container-top banner-content" 
        :class="setContainerCLass(banner1?.settype)"
      >
        <Banner
          v-if="banner1?.id"
          :id="banner1?.id"
          :itemKey="`banner${banner1?.id}`"
          :bannerData="banner1"
          infoMsg="ABOUT US"
          btnMsg="MORE ABOUT US"
        />
      </div>
    </section>

    <section
      v-if="banner3?.id"
      class="hero-section"
      :class="setSectionClass(banner3?.settype)"
      :style="getSectionStyle(banner3)"
    >
      <div class="container banner-content" :class="setContainerCLass(banner3?.settype)">
        <Banner
          v-if="banner3?.id"
          :id="banner3?.id"
          :itemKey="`banner${banner3?.id}`"
          :bannerData="banner3"
          btnMsg="Get It Now!"
        />
      </div>
    </section>

    <section
      v-if="banner4?.id"
      class="hero-section d-flex justify-content-center align-items-center"
      id="section_3"
    >
      <div class="container banner-content right-content">
        <Banner
          v-if="banner4?.id"
          :id="banner4?.id"
          :itemKey="`banner${banner4?.id}`"
          :bannerData="banner4"
          btnMsg="Get It Now!"
        />
      </div>
    </section>

    <section
      v-if="banner5?.id"
      :class="setSectionClass(banner5?.settype)"
      class="hero-section"
      :style="getSectionStyle(banner5)"
      id="section_5"
    >
      <div class="container banner-content">
        <Banner
          v-if="banner5?.id"
          :id="banner5?.id"
          :itemKey="`banner${banner5?.id}`"
          :bannerData="banner5"
          btnMsg="Get It Now!"
        />
      </div>
    </section>

    <section
      class="contact-section d-flex section-padding justify-content-center align-items-center"
      id="section_contact"
    >
      <div class="container banner-content">
        <div class="row">
          <div class="col-lg-7 col-12 order-lg-1 order-2 text-wrap" v-if="banner6?.id">
            <h2 class="title">Contact Us</h2>
            <p class="t2" v-html="safeContent(banner6?.title)"></p>
            <p class="text" v-html="safeContent(banner6?.content)"></p>
            
            <div class="items">
              <div class="item col-lg-4 col-md-4 col-12">
                <span class="icon icon-email"></span>
                <div class="info">
                  <h4>E-mail</h4>
                  <p>{{ t('commonConfig.email') }}</p>
                </div>
              </div>
              <div class="item col-lg-4 col-md-4 col-12">
                <span class="icon icon-phone"></span>
                <div class="info">
                  <h4>Phone Number</h4>
                  <p>{{ t('commonConfig.phone') }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-5 col-12 order-lg-2 order-1 form-wrap shadow">
            <form action="#" method="post" class="custom-form contact-form" role="form">
              <div class="row">
                <div class="col-lg-12 col-md-12 col-12">
                  <div class="form-floating">
                    <input
                      type="text"
                      name="full-name"
                      id="full-name"
                      class="form-control"
                      placeholder="Full Name"
                      required=""
                    />
                    <label for="floatingInput">Full Name</label>
                  </div>
                </div>

                <div class="col-lg-12 col-md-12 col-12">
                  <div class="form-floating">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      pattern="[^ @]*@[^ @]*"
                      class="form-control"
                      placeholder="Email address"
                      required=""
                    />
                    <label for="floatingInput">Email address</label>
                  </div>
                </div>

                <div class="col-lg-12 col-12">
                  <div class="form-floating">
                    <textarea
                      class="form-control"
                      id="message"
                      name="message"
                      placeholder="Describe message here"
                    ></textarea>
                    <label for="floatingTextarea">Message</label>
                  </div>
                  <button type="submit" class="form-control">Submit</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// 1. 自动导入
// safeContent, setSectionClass, setContainerCLass, getImageUrl 等工具函数通常由 Nuxt 自动导入
const { t, locale } = useI18n()
const { getBanner } = useApi()

// 2. 数据获取
const { data: bannerRes } = await useAsyncData(
  // Key 依然要加 locale，确保缓存唯一
  () => `home-banner-${locale.value}`,
  
  async () => {
    // ✅ 还原：这里只需要传字符串！
    // useHttp 会自动检测当前的 locale.value 并注入到请求中
    const res = await getBanner('1,3,4,5,6')
    
    return res.data.value
  },
  {
    // ✅ 关键：虽然参数没传 locale，但必须 watch 它
    // 这样语言切换时，useAsyncData 会重新执行 -> 调用 getBanner -> 调用 useHttp (注入新语言)
    watch: [locale]
  }
)

// 3. 数据处理 (保持不变)
const bannerData = computed(() => {
  const data = bannerRes.value
  return data?.data || data || {}
})

// 提取各个 Banner，保持响应式
const banner1 = computed(() => bannerData.value['banner1'])
const banner3 = computed(() => bannerData.value['banner3'])
const banner4 = computed(() => bannerData.value['banner4'])
const banner5 = computed(() => bannerData.value['banner5'])
const banner6 = computed(() => bannerData.value['banner6'])

// 4. 辅助函数：处理背景图样式
const getSectionStyle = (item) => {
  if (['2', '3', '4'].includes(item?.settype)) {
    // 使用 getImageUrl 智能处理图片路径
    return `background-image: url(${getImageUrl(item?.image)});`
  }
  return {}
}

// 5. SEO 设置
useHead({
  title: computed(() => t('commonConfig.webTitle') || 'EZTRIPCN'),
  meta: [
    // 这里的 content 记得加上默认值防止报错
    { name: 'keywords', content: computed(() => t('commonConfig.webKeywords') || 'Best Tours') },
    { name: 'description', content: computed(() => t('commonConfig.webDescription') || 'Best Tours') }
  ]
})
</script>

<style lang="scss" scoped>
// 这里的样式建议从你的 Home.vue 直接粘过来
// 记得变量 (如 $primaryColor) 现在是全局注入的，可以直接用
</style>