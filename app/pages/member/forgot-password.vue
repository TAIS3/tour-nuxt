<template>
  <div class="register-page d-flex align-items-center justify-content-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5 col-xl-4">
          <div class="register-card shadow-lg">
            <div class="text-center mb-4">
              <h3 class="fw-bold mb-1">{{ t('forgotPassword.title') || 'Reset Password' }}</h3>
              <p class="text-muted small">{{ t('forgotPassword.subtitle') || 'Enter your email to reset password' }}</p>
            </div>

            <form @submit.prevent="handleReset">
              <div class="mb-3">
                <label class="form-label small fw-bold text-secondary">{{ t('login.email') || 'Email Address' }}</label>
                <div class="input-group custom-input-group">
                  <span class="input-group-text bg-white border-end-0 text-muted">
                    <i class="bi bi-envelope"></i>
                  </span>
                  <input 
                    v-model="form.email"
                    type="email" 
                    class="form-control border-start-0 ps-0" 
                    :placeholder="t('login.emailPlaceholder') || 'name@example.com'"
                    required
                  >
                  <button 
                    type="button" 
                    class="btn btn-outline-secondary" 
                    @click="handleSendCode" 
                    :disabled="countdown > 0 || !isEmailValid || sendingCode"
                  >
                    <span v-if="sendingCode" class="spinner-border spinner-border-sm me-1"></span>
                    {{ countdown > 0 ? `${countdown}s` : t('register.sendCode') || 'Send Code' }}
                  </button>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label small fw-bold text-secondary">{{ t('register.verificationCode') || 'Verification Code' }}</label>
                <div class="input-group custom-input-group">
                  <span class="input-group-text bg-white border-end-0 text-muted">
                    <i class="bi bi-shield-check"></i>
                  </span>
                  <input 
                    v-model="form.code"
                    type="text" 
                    class="form-control border-start-0 ps-0" 
                    :placeholder="t('register.verificationCodePlaceholder') || 'Enter code'"
                    required
                  >
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label small fw-bold text-secondary">{{ t('forgotPassword.newPassword') || 'New Password' }}</label>
                <div class="input-group custom-input-group">
                  <span class="input-group-text bg-white border-end-0 text-muted">
                    <i class="bi bi-lock"></i>
                  </span>
                  <input 
                    v-model="form.newPassword"
                    :type="showPassword ? 'text' : 'password'" 
                    class="form-control border-start-0 ps-0 border-end-0" 
                    :placeholder="t('login.passwordPlaceholder') || 'Enter new password'"
                    required
                    minlength="6"
                    maxlength="15"
                  >
                  <span 
                    class="input-group-text bg-white border-start-0 cursor-pointer text-muted"
                    @click="showPassword = !showPassword"
                  >
                    <i class="bi" :class="showPassword ? 'bi-eye' : 'bi-eye-slash'"></i>
                  </span>
                </div>
                <div v-if="isPasswordInvalid" class="text-danger small mt-1 ps-1">
                  <i class="bi bi-exclamation-circle me-1"></i>
                  {{ t('register.passwordInvalid') || 'Password must be 6-15 characters and contain both letters and numbers.' }}
                </div>
              </div>

              <div class="mb-4">
                <label class="form-label small fw-bold text-secondary">{{ t('register.confirmPassword') || 'Confirm Password' }}</label>
                <div class="input-group custom-input-group">
                  <span class="input-group-text bg-white border-end-0 text-muted">
                    <i class="bi bi-lock-fill"></i>
                  </span>
                  <input 
                    v-model="form.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'" 
                    class="form-control border-start-0 ps-0 border-end-0" 
                    :placeholder="t('register.confirmPasswordPlaceholder') || 'Confirm new password'"
                    required
                  >
                  <span 
                    class="input-group-text bg-white border-start-0 cursor-pointer text-muted"
                    @click="showConfirmPassword = !showConfirmPassword"
                  >
                    <i class="bi" :class="showConfirmPassword ? 'bi-eye' : 'bi-eye-slash'"></i>
                  </span>
                </div>
                <div v-if="passwordMismatch" class="text-danger small mt-1 ps-1">
                  <i class="bi bi-exclamation-circle me-1"></i>
                  {{ t('register.passwordMismatch') || 'Passwords do not match' }}
                </div>
              </div>

              <button 
                type="submit" 
                class="btn btn-theme w-100 py-2 rounded-pill fw-bold"
                :disabled="loading || passwordMismatch || isPasswordInvalid"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ t('forgotPassword.submit') || 'Reset Password' }}
              </button>
            </form>

            <div class="mt-4 text-center small text-muted">
              {{ t('forgotPassword.remembered') || "Remember your password?" }}
              <NuxtLink :to="localePath('/login')" class="theme-text fw-bold text-decoration-none ms-1">
                {{ t('login.signIn') || 'Sign In' }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import swal from 'sweetalert'
import { useValidators } from '~/composables/useValidators'

const { t } = useI18n()
const localePath = useLocalePath()
const router = useRouter()
const { sendCode, resetPassword } = useApi() // 需在 useApi.js 增加 resetPassword
const { isValidPassword } = useValidators()

const form = reactive({
  email: '',
  code: '',
  newPassword: '',
  confirmPassword: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const sendingCode = ref(false)
const countdown = ref(0)
let timer = null

const isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
const passwordMismatch = computed(() => form.confirmPassword && form.newPassword !== form.confirmPassword)
const isPasswordInvalid = computed(() => form.newPassword && !isValidPassword(form.newPassword))


// 发送验证码 (事件类型 resetpwd)
const handleSendCode = async () => {
  if (!isEmailValid.value) {
    swal(t('login.emailError') || 'Invalid Email', { icon: 'error' })
    return
  }
  
  sendingCode.value = true
  try {
    const { data, error } = await sendCode({
      email: form.email,
      event: 'resetpwd' // 关键：事件类型改为 resetpwd
    })
    const res = data.value
    
    if (error.value || (res && res.code !== 1)) {
      swal(error.value?.message || res?.msg || 'Error', { icon: 'error' })
    } else {
      swal(res.msg || t('register.codeSent'), { icon: 'success' })
      startCountdown()
    }
  } catch (err) {
    swal(t('register.errorNetwork'), { icon: 'error' })
  } finally {
    sendingCode.value = false
  }
}

const startCountdown = () => {
  countdown.value = 60
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) clearInterval(timer)
  }, 1000)
}

// 提交重置
const handleReset = async () => {
  if (!form.email || !form.code || !form.newPassword) {
    swal(t('login.errorFill'), { icon: 'error' })
    return
  }
  if (isPasswordInvalid.value) {
    swal(t('member.passwordInvalid') || 'Password must be 6-15 characters and contain both letters and numbers.', { icon: 'error' })
    return
  }
  if (passwordMismatch.value) return

  loading.value = true
  try {
    const { data, error } = await resetPassword({
      email: form.email,
      code: form.code,
      newpassword: form.newPassword
    })
    
    const res = data.value
    if (error.value || (res && res.code !== 1)) {
      swal(error.value?.message || res?.msg || 'Error', { icon: 'error' })
    } else {
      swal(res.msg || t('forgotPassword.success'), { icon: 'success' }).then(() => {
        router.push(localePath('/login'))
      })
    }
  } catch (err) {
    swal(t('register.errorUnknown'), { icon: 'error' })
  } finally {
    loading.value = false
  }
}

onUnmounted(() => { if (timer) clearInterval(timer) })
useHead({ title: computed(() => t('forgotPassword.title')) })
</script>

<style lang="scss" scoped>
/* 复用 register.vue 的样式 */
@use "sass:color";
$theme-color: $mainColor; 
$bg-page: #f5f7fa;

.register-page { min-height: 100vh; background-color: $bg-page; }
.register-card { background: #fff; padding: 2.5rem; border-radius: 1rem; border: 1px solid rgba(0,0,0,0.04); }
.custom-input-group {
  border-radius: 0.375rem; overflow: hidden; transition: all 0.2s ease; border: 1px solid #ced4da; 
  .input-group-text, .form-control { border: none; box-shadow: none !important; }
  .form-control::placeholder { color: #b0b0b0; font-weight: 300; font-size: 0.9rem; }
  &:focus-within { border-color: $theme-color; box-shadow: 0 0 0 0.25rem rgba($theme-color, 0.15); .input-group-text { color: $theme-color !important; } }
}
.input-group-text { font-size: 1.1rem; background-color: #fff; color: #6c757d; transition: color 0.2s ease; }
.btn-theme {
  background-color: $theme-color; border-color: $theme-color; color: #fff; transition: opacity 0.3s;
  &:hover { opacity: 0.9; color: #fff; }
  &:disabled { background-color: color.scale($theme-color, $lightness: 15%); border-color: color.scale($theme-color, $lightness: 15%); cursor: not-allowed; }
}
.theme-text { color: $theme-color; &:hover { color: color.scale($theme-color, $lightness: -10%); } }
.cursor-pointer { cursor: pointer; }
</style>