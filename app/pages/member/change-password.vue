<template>
  <div class="password-page member-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-5">
              <h3 class="fw-bold mb-4 text-center">{{ t('member.passwordTitle') || 'Change Password' }}</h3>

              <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                  <label class="form-label small fw-bold text-secondary">{{ t('member.passwordOld') || 'Current Password' }}</label>
                  <input type="password" v-model="form.oldpassword" class="form-control" required>
                </div>

                <div class="mb-3">
                  <label class="form-label small fw-bold text-secondary">{{ t('member.passwordNew') || 'New Password' }}</label>
                  <input type="password" v-model="form.newpassword" class="form-control" required minlength="6" maxlength="15">
                   <div v-if="isPasswordInvalid" class="text-danger small mt-1">
                    {{ t('register.passwordInvalid') || 'Password must be 6-15 characters and contain both letters and numbers.' }}
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label small fw-bold text-secondary">{{ t('member.passwordConfirm') || 'Confirm New Password' }}</label>
                  <input type="password" v-model="form.renewpassword" class="form-control" required>
                  <div v-if="passwordMismatch" class="text-danger small mt-1">
                    {{ t('member.passwordMismatch') || 'Passwords do not match' }}
                  </div>
                </div>

                <button 
                  type="submit" 
                  class="btn btn-theme w-100 py-2 rounded-pill fw-bold"
                  :disabled="loading || passwordMismatch || isPasswordInvalid"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ t('member.passwordSubmit') || 'Update Password' }}
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
import { useValidators } from '~/composables/useValidators'

const { t } = useI18n()
const router = useRouter()
const localePath = useLocalePath()
const { changePassword } = useApi() // 使用正确的 changePassword 函数
const mainStore = useMainStore()
const { isValidPassword } = useValidators()
const loading = ref(false)

const form = reactive({
  oldpassword: '',
  newpassword: '',
  renewpassword: ''
})

const passwordMismatch = computed(() => {
  return form.renewpassword && form.newpassword !== form.renewpassword
})

const isPasswordInvalid = computed(() => {
  return form.newpassword && !isValidPassword(form.newpassword)
})

const handleSubmit = async () => {
  if (passwordMismatch.value) return
  if (!form.oldpassword || !form.newpassword) {
    swal(t('login.errorFill'), { icon: 'error' })
    return
  }
  if (isPasswordInvalid.value) {
    swal(t('member.passwordInvalid') || 'Password must be 6-15 characters and contain both letters and numbers.', { icon: 'error' })
    return
  }

  loading.value = true
  try {
    const { data, error } = await changePassword({
      oldpassword: form.oldpassword,
      newpassword: form.newpassword,
    })
    
    const res = data.value
    if (error.value || (res && res.code !== 1)) {
      swal(error.value?.message || res?.msg || 'Error', { icon: 'error' })
    } else {
      swal(res.msg || t('member.passwordSuccess'), { icon: 'success' }).then(() => {
        mainStore.clearAuth()
        router.push(localePath('/login'))
      })
    }
  } catch (err) {
    swal(t('register.errorUnknown'), { icon: 'error' })
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
