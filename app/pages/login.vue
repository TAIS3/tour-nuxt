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
                </div>
              </div>

              <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center">
                  <label class="form-label small fw-bold text-secondary">{{ t('login.password') || 'Password' }}</label>
                </div>
                <div class="input-group">
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
                {{ t('login.signIn') || 'Sign In' }}
              </button>
            </form>

            <div class="mt-4 text-center small text-muted">
              {{ t('login.noAccount') || "Don't have an account?" }}
              <NuxtLink :to="localePath('/register')" class="theme-text fw-bold text-decoration-none ms-1">
                {{ t('login.signUp') || 'Sign Up' }}
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
  if (!form.email || !form.password) return

  loading.value = true
  try {
    // 模拟API调用 - start
    await new Promise(resolve => setTimeout(resolve, 1000));
    const fakeResponse = {
      data: {
        value: {
          data: {
            token: 'fake-token-from-api-12345',
            userinfo: {
              id: 1,
              username: 'testuser',
              email: form.email
            }
          }
        }
      },
      error: ref(null)
    };
    // 模拟API调用 - end
    
    // TODO: 实际调用登录接口
    // const { data: response, error } = await login({ 
    //   account: form.email, 
    //   password: form.password 
    // });
    
    const response = fakeResponse; // 使用模拟数据
    const error = fakeResponse.error; // 使用模拟数据

    if (error.value) {
      console.error('Login failed:', error.value)
      alert('Login failed. Please check your credentials.')
    } else {
      const token = response.data.value?.data?.token;
      if (token) {
        store.setToken(token);
        await store.fetchUser(); // 获取用户信息
        router.push(localePath('/'));
      } else {
        alert('Login failed: Token not found in response.')
      }
    }
    
  } catch (error) {
    console.error('Login failed:', error)
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
// 变量映射，保持与项目一致
$theme-color: $mainColor; 
$bg-page: #f5f7fa;

.login-page {
  min-height: 100vh;
  background-color: $bg-page;
  // 如果有背景图可以取消注释
  // background-image: url('/static/images/login-bg.jpg');
  // background-size: cover;
}

.login-card {
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