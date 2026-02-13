<template>
  <div class="profile-page member-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-5">
              <h3 class="fw-bold mb-4 text-center">{{ t('member.profileTitle') || 'Personal Profile' }}</h3>

              <form @submit.prevent="handleSave">
                <div class="text-center mb-4">
                  <div class="d-inline-block position-relative">
                    <div class="bg-light rounded-circle d-flex align-items-center justify-content-center border" style="width: 100px; height: 100px;">
                      <i class="bi bi-person-fill display-4 text-secondary"></i>
                    </div>
                    <button type="button" class="btn btn-sm btn-theme rounded-circle position-absolute bottom-0 end-0 shadow-sm" style="width: 32px; height: 32px;">
                      <i class="bi bi-camera-fill small"></i>
                    </button>
                  </div>
                </div>

                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-secondary">{{ t('login.username') || 'Username' }}</label>
                    <input type="text" class="form-control bg-light" v-model="form.username" disabled>
                    <div class="form-text small">{{ t('member.usernameDisabled') || 'Username cannot be changed' }}</div>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-secondary">{{ t('member.nickname') || 'Nickname' }}</label>
                    <input type="text" class="form-control" v-model="form.nickname" required>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-secondary">{{ t('login.email') || 'Email' }}</label>
                    <input type="email" class="form-control" v-model="form.email" required>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-secondary">{{ t('member.mobile') || 'Mobile' }}</label>
                    <input type="tel" class="form-control" v-model="form.mobile">
                  </div>

                  <div class="col-12 mt-4">
                    <button type="submit" class="btn btn-theme w-100 py-2 rounded-pill fw-bold" :disabled="loading">
                      <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                      {{ t('member.saveProfile') || 'Save Changes' }}
                    </button>
                  </div>
                </div>
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
const store = useMainStore()
const { user } = storeToRefs(store)
const loading = ref(false)

const form = reactive({
  username: '',
  nickname: '',
  email: '',
  mobile: ''
})

// Init form with store data
watchEffect(() => {
  if (user.value) {
    form.username = user.value.username || ''
    form.nickname = user.value.nickname || ''
    form.email = user.value.email || ''
    form.mobile = user.value.mobile || ''
  }
})

const handleSave = async () => {
  loading.value = true
  try {
    // 模拟 API 调用
    // await updateProfile(form)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    swal(t('member.profileSuccess') || 'Profile updated successfully!', { icon: 'success' })
  } catch (error) {
    swal(t('commonConfig.error') || 'Error', { icon: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
@use "sass:color";
$theme-color: $mainColor;

.profile-page {
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