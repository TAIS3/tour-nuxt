<template>
  <div class="register-page d-flex align-items-center justify-content-center">

    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5 col-xl-4">
          <div class="register-card shadow-lg">
            <div class="text-center mb-4">
              <h3 class="fw-bold mb-1">{{ t('register.title') || 'Create Account' }}</h3>
              <p class="text-muted small">{{ t('register.subtitle') || 'Get started with your free account' }}</p>
            </div>

            <form @submit.prevent="handleRegister">
              
              <div class="mb-3">
                <label class="form-label small fw-bold text-secondary">{{ t('login.username') || 'Username' }}</label>
                <div class="input-group custom-input-group">
                  <span class="input-group-text bg-white border-end-0 text-muted">
                    <i class="bi bi-person"></i>
                  </span>
                  <input 
                    v-model="form.username"
                    type="text" 
                    class="form-control border-start-0 ps-0" 
                    :placeholder="t('login.usernamePlaceholder') || 'Enter your username'"
                    required
                    minlength="3"
                    maxlength="30"
                  >
                </div>
              </div>

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
                    :placeholder="t('register.verificationCodePlaceholder') || 'Enter code from email'"
                    required
                  >
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label small fw-bold text-secondary">{{ t('login.password') || 'Password' }}</label>
                <div class="input-group custom-input-group">
                  <span class="input-group-text bg-white border-end-0 text-muted">
                    <i class="bi bi-lock"></i>
                  </span>
                  <input 
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'" 
                    class="form-control border-start-0 ps-0 border-end-0" 
                    :placeholder="t('login.passwordPlaceholder') || 'Create a password'"
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
                  {{ t('member.passwordInvalid') || 'Password must be 6-15 characters and contain both letters and numbers.' }}
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
                    :placeholder="t('register.confirmPasswordPlaceholder') || 'Confirm your password'"
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
                {{ t('register.submit') || 'Sign Up' }}
              </button>
            </form>

            <div class="mt-4 text-center small text-muted">
              {{ t('register.haveAccount') || "Already have an account?" }}
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
import swal from 'sweetalert' // 保持你文件中的 sweetalert 引用
import { useValidators } from '~/composables/useValidators'

const { t } = useI18n()
const localePath = useLocalePath()
const router = useRouter()
const { sendCode, register } = useApi()
const { isValidPassword } = useValidators()

// 表单数据
const form = reactive({
  username: '', 
  email: '',
  password: '',
  confirmPassword: '',
  code: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const sendingCode = ref(false)
const countdown = ref(0)
let timer = null

const isEmailValid = computed(() => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
})

const passwordMismatch = computed(() => {
  return form.confirmPassword && form.password !== form.confirmPassword
})

const isPasswordInvalid = computed(() => {
  return form.password && !isValidPassword(form.password)
})

const handleSendCode = async () => {
  if (!isEmailValid.value) {
    // 替换硬编码：邮箱格式错误
    swal(t('login.emailError') || 'Please enter a valid email address.', { icon: 'error' })
    return
  }
  
  sendingCode.value = true
  
  try {
    const { data, error } = await sendCode({
      email: form.email,
      event: 'register' 
    })

    const res = data.value
    const err = error.value

    if (err || (res && res.code !== 1)) {
      const msg = err ? err.message : (res ? res.msg : 'Error')
      swal(msg, { icon: 'error' })
    } else {
      // 替换硬编码：验证码发送成功
      swal(res.msg || t('register.codeSent') || 'Verification code sent successfully.', { icon: 'success' })
      startCountdown()
    }
  } catch (err) {
    console.error('API Error:', err)
    // 替换硬编码：网络错误
    swal(t('register.errorNetwork') || 'Network error, please try again.', { icon: 'error' })
  } finally {
    sendingCode.value = false
  }
}

const startCountdown = () => {
  countdown.value = 60
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const handleRegister = async () => {
  // 校验必填项
  if (!form.username || !form.email || !form.password || !form.code) {
    // 替换硬编码：必填项错误
    swal(t('register.errorFill') || 'Please fill in all required fields.', { icon: 'error' })
    return
  }
  if (isPasswordInvalid.value) {
    swal(t('register.passwordInvalid') || 'Password must be 6-15 characters and contain both letters and numbers.', { icon: 'error' })
    return
  }
  if (passwordMismatch.value) return

  loading.value = true
  try {
    const payload = {
      username: form.username,
      password: form.password,
      email: form.email,
      code: form.code,
      mobile: '' // 保持 mobile 为空字符串以符合后端接口要求
    }

    const { data, error } = await register(payload)
    
    const res = data.value
    const err = error.value

    if (err || (res && res.code !== 1)) {
      const msg = err ? err.message : (res ? res.msg : 'Error')
      swal(msg, { icon: 'error' })
    } else {
      // 统一处理：注册成功后，提示用户并跳转到登录页
      swal(t('register.successLogin') || 'Registration successful! Please login.', { 
        icon: 'success',
        button: t('commonConfig.confirm') || "OK",
      }).then(() => {
        router.push(localePath('/login'))
      })
    }
  } catch (err) {
    console.error('Register API Error:', err)
    // 替换硬编码：未知错误
    swal(t('register.errorUnknown') || 'An unexpected error occurred.', { icon: 'error' })
  } finally {
    loading.value = false
  }
}

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})

useHead({
  title: computed(() => t('register.title') || 'Sign Up')
})
</script>

<style lang="scss" scoped>
@use "sass:color";
$theme-color: $mainColor; 
$bg-page: #f5f7fa;

.register-page {
  min-height: 100vh;
  background-color: $bg-page;
}

.register-card {
  background: #fff;
  padding: 2.5rem;
  border-radius: 1rem;
  border: 1px solid rgba(0,0,0,0.04);
}

.custom-input-group {
  border-radius: 0.375rem; 
  overflow: hidden;
  transition: all 0.2s ease;
  border: 1px solid #ced4da; 

  .input-group-text,
  .form-control {
    border: none; 
    box-shadow: none !important; 
  }

  .form-control::placeholder {
    color: #b0b0b0;
    font-weight: 300;
    font-size: 0.9rem;
  }

  &:focus-within {
    border-color: $theme-color;
    box-shadow: 0 0 0 0.25rem rgba($theme-color, 0.15); 
    
    .input-group-text {
      color: $theme-color !important;
    }
  }
}

.input-group-text {
  font-size: 1.1rem;
  background-color: #fff;
  color: #6c757d; 
  transition: color 0.2s ease;
}

.btn-theme {
  background-color: $theme-color;
  border-color: $theme-color;
  color: #fff;
  transition: opacity 0.3s;
  
  &:hover {
    opacity: 0.9;
    color: #fff;
  }
  
  &:disabled {
    background-color: color.scale($theme-color, $lightness: 15%);
    border-color: color.scale($theme-color, $lightness: 15%);
    cursor: not-allowed;
  }
}

.theme-text {
  color: $theme-color;
  &:hover {
    color: color.scale($theme-color, $lightness: -10%);
  }
}

.cursor-pointer {
  cursor: pointer;
}
</style>