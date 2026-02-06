<template>
  <div class="password-page py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-5">
              <h3 class="fw-bold mb-4 text-center">{{ t('password.title') || 'Change Password' }}</h3>

              <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                  <label class="form-label small fw-bold text-secondary">{{ t('password.old') || 'Current Password' }}</label>
                  <input type="password" v-model="form.oldpassword" class="form-control" required>
                </div>

                <div class="mb-3">
                  <label class="form-label small fw-bold text-secondary">{{ t('password.new') || 'New Password' }}</label>
                  <input type="password" v-model="form.newpassword" class="form-control" required minlength="6">
                </div>

                <div class="mb-4">
                  <label class="form-label small fw-bold text-secondary">{{ t('password.confirm') || 'Confirm New Password' }}</label>
                  <input type="password" v-model="form.renewpassword" class="form-control" required>
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
                  {{ t('password.submit') || 'Update Password' }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import swal from 'sweetalert'

const { t } = useI18n()
const router = useRouter()
const localePath = useLocalePath()
const loading = ref(false)

const form = reactive({
  oldpassword: '',
  newpassword: '',
  renewpassword: ''
})

const passwordMismatch = computed(() => {
  return form.renewpassword && form.newpassword !== form.renewpassword
})

const handleSubmit = async () => {
  if (passwordMismatch.value) return

  loading.value = true
  try {
    // 模拟 API: await changePassword(form)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    swal(t('password.success') || 'Password changed successfully. Please login again.', { icon: 'success' })
    
    // 通常修改密码后需要重新登录
    setTimeout(() => {
      router.push(localePath('/login'))
    }, 1500)
    
  } catch (error) {
    swal(t('commonConfig.error') || 'Operation failed', { icon: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
@use "sass:color";
$theme-color: $mainColor;

.password-page {
  background-color: #f5f7fa;
  min-height: 80vh;
}

.form-control {
  padding: 0.6rem 1rem;
  border-color: #ced4da;
  &:focus {
    border-color: $theme-color;
    box-shadow: 0 0 0 0.25rem rgba($theme-color, 0.15);
  }
}

.btn-theme {
  background-color: $theme-color;
  border-color: $theme-color;
  color: #fff;
  
  &:hover {
    opacity: 0.9;
    color: #fff;
  }
  
  &:disabled {
    background-color: color.scale($theme-color, $lightness: 15%);
    border-color: color.scale($theme-color, $lightness: 15%);
  }
}
</style>