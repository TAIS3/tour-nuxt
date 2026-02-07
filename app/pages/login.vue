<template>
  <div class="login-page d-flex align-items-center justify-content-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5 col-xl-4">
          <div class="login-card shadow-lg">
            <div class="text-center mb-4">
              <h3 class="fw-bold mb-1">{{ t('login.title') || 'Welcome Back' }}</h3>
              <p class="text-muted small">{{ t('login.subtitle') || 'Please sign in to continue' }}</p>
            </div>

            <form @submit.prevent="handleLogin">
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
                </div>
              </div>

              <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center">
                  <label class="form-label small fw-bold text-secondary">{{ t('login.password') || 'Password' }}</label>
                </div>
                <div class="input-group custom-input-group">
                  <span class="input-group-text bg-white border-end-0 text-muted">
                    <i class="bi bi-lock"></i>
                  </span>
                  <input 
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'" 
                    class="form-control border-start-0 ps-0 border-end-0" 
                    :placeholder="t('login.passwordPlaceholder') || 'Enter your password'"
                    required
                  >
                  <span 
                    class="input-group-text bg-white border-start-0 cursor-pointer text-muted"
                    @click="showPassword = !showPassword"
                  >
                    <i class="bi" :class="showPassword ? 'bi-eye' : 'bi-eye-slash'"></i>
                  </span>
                </div>
              </div>

              <div class="d-flex justify-content-between align-items-center mb-4">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="rememberMe" v-model="form.remember">
                  <label class="form-check-label small text-muted" for="rememberMe">
                    {{ t('login.rememberMe') || 'Remember me' }}
                  </label>
                </div>
                <NuxtLink :to="localePath('/forgot-password')" class="small text-decoration-none theme-text">
                  {{ t('login.forgotPassword') || 'Forgot Password?' }}
                </NuxtLink>
              </div>

              <button 
                type="submit" 
                class="btn btn-theme w-100 py-2 rounded-pill fw-bold"
                :disabled="loading"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ t('commonConfig.login') || 'Sign In' }}
              </button>
            </form>

            <div class="mt-4 text-center small text-muted">
              {{ t('login.noAccount') || "Don't have an account?" }}
              <NuxtLink :to="localePath('/register')" class="theme-text fw-bold text-decoration-none ms-1">
                {{ t('commonConfig.register') || 'Sign Up' }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import swal from 'sweetalert' // 引入 SweetAlert

const { t } = useI18n()
const localePath = useLocalePath()
const router = useRouter()
const { login } = useApi()
const store = useMainStore()

const form = reactive({
  email: '',
  password: '',
  remember: false
})

const showPassword = ref(false)
const loading = ref(false)

const handleLogin = async () => {
  // 1. 必填校验
  if (!form.email || !form.password) {
    swal(t('login.errorFill') || 'Please fill in all required fields.', { icon: 'error' })
    return
  }

  loading.value = true
  try {
    // 2. 真实 API 调用
    // 后端接口 user/login 接收 'account' 和 'password'
    const { data: response, error } = await login({ 
      account: form.email, 
      password: form.password 
    });

    if (error.value) {
      console.error('Login failed:', error.value)
      // 错误提示国际化
      swal(t('login.errorCredentials') || 'Login failed. Please check your credentials.', { icon: 'error' })
    } else {
      const resData = response.value; // useFetch 返回的是 Ref
      
      // FastAdmin 标准：code=1 为成功
      if (resData && resData.code === 1) {
        const token = resData.data?.userinfo?.token;
        if (token) {
          store.setToken(token);
          
          await store.fetchUser(); 
          swal(t('login.success') || 'Login successful!', { 
            icon: 'success' 
          }).then(() => {
             router.push(localePath('/'));
          });

        } else {
          swal(t('login.errorToken') || 'Login failed: Token not found.', { icon: 'error' })
        }
      } else {
        // 业务逻辑错误（如密码错误）
        const msg = resData?.msg || t('login.errorCredentials');
        swal(msg, { icon: 'error' });
      }
    }
    
  } catch (error) {
    console.error('Login system error:', error)
    swal(t('register.errorNetwork') || 'Network error.', { icon: 'error' })
  } finally {
    loading.value = false
  }
}

useHead({
  title: computed(() => t('login.title') || 'Login')
})
</script>

<style lang="scss" scoped>
@use "sass:color";
$theme-color: $mainColor; 
$bg-page: #f5f7fa;

.login-page {
  min-height: 100vh;
  background-color: $bg-page;
}

.login-card {
  background: #fff;
  padding: 2.5rem;
  border-radius: 1rem;
  border: 1px solid rgba(0,0,0,0.04);
}

// 统一输入框样式 (参考 Register)
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