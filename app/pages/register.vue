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
                <label class="form-label small fw-bold text-secondary">{{ t('login.email') || 'Email Address' }}</label>
                <div class="input-group">
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
                  <button type="button" class="btn btn-outline-secondary" @click="handleSendCode" :disabled="countdown > 0">
                    {{ countdown > 0 ? `${countdown}s` : t('register.sendCode') || 'Send Code' }}
                  </button>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label small fw-bold text-secondary">{{ t('register.verificationCode') || 'Verification Code' }}</label>
                <div class="input-group">
                  <span class="input-group-text bg-white border-end-0 text-muted">
                    <i class="bi bi-shield-check"></i>
                  </span>
                  <input 
                    v-model="form.code"
                    type="text" 
                    class="form-control border-start-0 ps-0" 
                    :placeholder="t('register.verificationCodePlaceholder') || 'Enter your code'"
                    required
                  >
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label small fw-bold text-secondary">{{ t('login.password') || 'Password' }}</label>
                <div class="input-group">
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
                  >
                  <span 
                    class="input-group-text bg-white border-start-0 cursor-pointer text-muted"
                    @click="showPassword = !showPassword"
                  >
                    <i class="bi" :class="showPassword ? 'bi-eye' : 'bi-eye-slash'"></i>
                  </span>
                </div>
              </div>

              <div class="mb-4">
                <label class="form-label small fw-bold text-secondary">{{ t('register.confirmPassword') || 'Confirm Password' }}</label>
                <div class="input-group">
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
                <div v-if="passwordMismatch" class="text-danger small mt-1">
                  {{ t('register.passwordMismatch') || 'Passwords do not match' }}
                </div>
              </div>

              <button 
                type="submit" 
                class="btn btn-theme w-100 py-2 rounded-pill fw-bold"
                :disabled="loading || passwordMismatch"
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
const { t } = useI18n()
const localePath = useLocalePath()
const router = useRouter()
const { sendCode, register } = useApi()

const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  code: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const countdown = ref(0)
let timer = null

const passwordMismatch = computed(() => {
  return form.confirmPassword && form.password !== form.confirmPassword
})

const handleSendCode = async () => {
  if (!form.email) {
    // You might want to add a toast notification here
    alert('Please enter your email address.');
    return;
  }
  
  // Start countdown
  countdown.value = 60;
  timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);

  try {
    // 实际调用 API
    // const { error } = await sendCode({
    //   email: form.email,
    //   event: 'register' 
    // });
    // if (error.value) {
    //   console.error('Failed to send code:', error.value);
    //   alert('Failed to send verification code. Please try again.');
    //   countdown.value = 0;
    //   clearInterval(timer);
    // } else {
    //   alert('Verification code sent successfully.');
    // }
    console.log('Sending code to:', form.email);
    
  } catch (err) {
    console.error('An unexpected error occurred:', err);
    alert('An unexpected error occurred. Please try again.');
    countdown.value = 0;
    clearInterval(timer);
  }
}

const handleRegister = async () => {
  if (!form.email || !form.password || !form.code || passwordMismatch.value) return

  loading.value = true
  try {
    // 实际调用API
    // const { error } = await register({
    //   email: form.email,
    //   password: form.password,
    //   captcha: form.code,
    //   // 可能还需要其他字段
    // });

    // if (error.value) {
    //   console.error('Registration failed:', error.value);
    //   alert('Registration failed. Please check your information.');
    // } else {
    //   alert('Registration successful! Please login.');
    //   router.push(localePath('/login'));
    // }

    // 模拟请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Register payload:', form)
    router.push(localePath('/login'))
    
  } catch (error) {
    console.error('Register failed:', error)
  } finally {
    loading.value = false
  }
}

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
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

.form-control, .input-group-text {
  padding: 0.75rem 1rem;
  &:focus {
    box-shadow: none;
    border-color: $theme-color;
  }
}

.input-group-text {
  font-size: 1.1rem;
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