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
            <form @submit.prevent="handleSubscribe" class="custom-form contact-form" role="form">
              <div class="row">
                <div class="col-lg-12 col-md-12 col-12">
                  <div class="form-floating">
                    <input
                      type="text"
                      name="full-name"
                      id="full-name"
                      class="form-control"
                      placeholder="Full Name"
                      v-model="formData.name"
                      required=""
                    />
                    <label for="full-name">Full Name</label>
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
                      v-model="formData.email"
                      required=""
                    />
                    <label for="email">Email address</label>
                  </div>
                </div>

                <div class="col-lg-12 col-12">
                  <div class="form-floating">
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      class="form-control"
                      placeholder="Phone Number"
                      v-model="formData.phone"
                      required=""
                    />
                    <label for="phone">Phone Number</label>
                  </div>
                </div>

                <div class="col-lg-12 col-12">
                  <div class="input-group mb-3" style="height: 58px;">
                    <div class="form-floating flex-grow-1 h-100">
                      <input
                        type="text"
                        class="form-control h-100"
                        id="captcha"
                        placeholder="Captcha"
                        v-model="formData.captcha"
                        required=""
                        style="border-top-right-radius: 0; border-bottom-right-radius: 0;"
                      />
                      <label for="captcha">Captcha</label>
                    </div>
                    <img
                      :src="captchaUrl" 
                      @click="refreshCaptcha" 
                      alt="captcha" 
                      title="Click to refresh"
                      style="width: 120px; object-fit: cover; cursor: pointer; border: 1px solid #ced4da; border-left: none; border-radius: 0 0.375rem 0.375rem 0;"
                    />
                  </div>
                </div>

                <div class="col-lg-12 col-12">
                  <button type="submit" class="form-control" :disabled="isSubmitting || submitCooldown > 0">
                    <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                    {{ isSubmitting ? 'Submitting...' : (submitCooldown > 0 ? `${submitCooldown}s` : 'Submit') }}
                  </button>
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
import swal from 'sweetalert'

// 1. 自动导入
// safeContent, setSectionClass, setContainerCLass, getImageUrl 等工具函数通常由 Nuxt 自动导入
const { t, locale } = useI18n()
const { getBanner, getCaptcha, addContact } = useApi()

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

// ----------------------------------------------------------------
// 4. 联系我们表单处理 (带图形验证码)
// ----------------------------------------------------------------
const formData = ref({
  name: '',
  email: '',
  phone: '',
  captcha: '',
  captcha_id: ''
})

const isSubmitting = ref(false)
const submitCooldown = ref(0)
let cooldownTimer = null
// 图形验证码基础接口地址 (请根据实际后端接口替换)
const captchaBaseUrl = '/api/common/captcha' 
const captchaUrl = ref('')

const refreshCaptcha = () => {
  // 附加时间戳防止浏览器缓存相同的 URL
  captchaUrl.value = `${captchaBaseUrl}?t=${new Date().getTime()}`
}

onMounted(() => {
  refreshCaptcha()
})

const handleSubscribe = async () => {
  if (isSubmitting.value || submitCooldown.value > 0) return

  formData.value.captcha = (formData.value.captcha || '').trim()
  if (!formData.value.captcha) {
    swal('Notice', 'Please enter the captcha.', 'warning')
    return
  }
  
  const captchaRegex = /^[A-Za-z0-9]{4,6}$/
  if (!captchaRegex.test(formData.value.captcha)) {
    swal('Notice', 'Invalid captcha format. (4-6 chars)', 'warning')
    return
  }

  isSubmitting.value = true
  try {
    const { data: res, error } = await addContact(formData.value)
    if (error.value || res.value?.code !== 1) throw new Error(res.value?.msg || error.value?.data?.message || 'Submit failed')
    
    swal('Success', 'Submitted successfully, we will contact you soon!', 'success')
    
    formData.value = { email: '', phone: '', name: '', captcha: '', captcha_id: '' }
    refreshCaptcha()

    submitCooldown.value = 30
    cooldownTimer = setInterval(() => {
      submitCooldown.value--
      if (submitCooldown.value <= 0) clearInterval(cooldownTimer)
    }, 1000)
  } catch (err) {
    swal('Error', err.message, 'error')
    refreshCaptcha()
  } finally {
    isSubmitting.value = false
  }
}

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