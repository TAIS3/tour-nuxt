<template>
  <section id="commonContact">
    <div class="container rounded-4 p-4">
      <div class="row align-items-center g-4">
        <!-- 左侧文本 -->
        <div class="col-md-4 text-center text-md-start">
          <h2>{{ i18n.t('commonConfig.contactInfo') }}</h2>
        </div>

        <!-- 右侧表单 -->
        <div class="col-md-8">
          <form class="w-100" @submit.prevent="handleSubscribe">
            <!-- 输入框区域 -->
            <div class="row gy-3 gx-4 mb-4">
              <div class="col-12 col-sm-6 px-md-2 px-sm-1 py-1">
                <input
                  type="email"
                  class="form-control form-control-lg px-3 py-2"
                  :placeholder="i18n.t('commonConfig.contactEmail')"
                  v-model="formData.email"
                  required
                />
              </div>
              <div class="col-12 col-sm-6 px-md-2 px-sm-1 py-1">
                <input
                  type="tel"
                  class="form-control form-control-lg px-3 py-2"
                  :placeholder="i18n.t('commonConfig.contactPhone')"
                  v-model="formData.phone"
                  required
                />
              </div>
              <div class="col-12 col-sm-6 px-md-2 px-sm-1 py-1">
                <input
                  type="text"
                  class="form-control form-control-lg px-3 py-2"
                  :placeholder="i18n.t('commonConfig.contactName')"
                  v-model="formData.name"
                  required
                />
              </div>
              <div class="col-12 col-sm-6 px-md-2 px-sm-1 py-1">
                <div class="input-group">
                  <input
                    type="text"
                    class="form-control form-control-lg px-3 py-2"
                    :placeholder="i18n.t('register.codePlaceholder') || '图形验证码'"
                    v-model="formData.captcha"
                    required
                  />
                  <img 
                    :src="captchaUrl" 
                    @click="refreshCaptcha" 
                    alt="captcha" 
                    title="点击刷新"
                    class="captcha-img"
                  />
                </div>
              </div>
            </div>

            <!-- 按钮区域 -->
            <div
              class="d-flex flex-nowrap flex-sm-row align-items-center justify-content-center gap-3"
            >
              <button type="submit" class="btn theme-btn px-4 py-2 fw-medium" :disabled="isSubmitting || submitCooldown > 0">
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                {{ isSubmitting ? (i18n.t('commonConfig.processing') || '提交中...') : (submitCooldown > 0 ? `${submitCooldown}s` : i18n.t('commonConfig.contactSubscribe')) }}
              </button>
              <span class="text-muted small">OR</span>
              <a href="#" class="fw-medium link-primary text-decoration-underline">
                {{ i18n.t('commonConfig.contactOnline') }}
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { ref, onMounted } from 'vue'
import swal from 'sweetalert'

const i18n = useI18n() // 使用 vue-i18n
const { addContact } = useApi() // 引入新增联系人接口

const formData = ref({
  email: '',
  phone: '',
  name: '',
  captcha: ''
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

  if (!formData.value.captcha) {
    swal('提示', '请输入图形验证码', 'warning')
    return
  }
  
  isSubmitting.value = true
  try {
    // 对接真实的添加联系人接口
    const { data: res, error } = await addContact(formData.value)
    
    if (error.value || res.value?.code !== 1) throw new Error(res.value?.msg || error.value?.data?.message || '提交失败')
    
    swal('成功', '提交成功，我们会尽快与您联系！', 'success')
    
    // 重置表单
    formData.value = { email: '', phone: '', name: '', captcha: '' }
    refreshCaptcha()

    // 提交成功后，开启 30 秒防频繁点击倒计时
    submitCooldown.value = 30
    cooldownTimer = setInterval(() => {
      submitCooldown.value--
      if (submitCooldown.value <= 0) {
        clearInterval(cooldownTimer)
      }
    }, 1000)
  } catch (err) {
    swal('错误', err.message, 'error')
    refreshCaptcha() // 失败也建议刷新验证码
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/css/global.scss' as *;

.captcha-img {
  height: 36px;
  width: 120px;
  object-fit: cover;
  border-radius: 0 0.5rem 0.5rem 0;
  border: 1px solid #ced4da;
  border-left: none;
  cursor: pointer;
  background-color: #f8f9fa;
}

#commonContact {
  margin-bottom: -10px;
  width: 100%;
  position: relative;
  z-index: 10;
  &::after {
    position: absolute;
    content: '';
    width: 100%;
    height: 50%;
    bottom: -10px;
    left: 0;
    background: $mainColor;
    z-index: 1;
  }
  .container {
    margin: 0 auto;
    background: linear-gradient(to right, #eeffe9, #fdf1e8);
    position: relative;
    z-index: 2;
  }

  h2 {
    font-size: clamp(14px, 3vw, 18px);
  }
}
@media screen and (max-width: 480px) {
  #commonContact {
    .container {
      width: calc(100% - 10px);
      margin: 0 auto;
    }
  }
}
</style>