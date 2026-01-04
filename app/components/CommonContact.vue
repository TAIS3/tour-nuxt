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
          <form class="w-100">
            <!-- 输入框区域 -->
            <div class="row gy-3 gx-4 mb-4">
              <div class="col-12 col-sm-4 px-md-2 px-sm-1 py-1">
                <input
                  type="email"
                  class="form-control form-control-lg px-3 py-2"
                  :placeholder="i18n.t('commonConfig.contactEmail')"
                  required
                />
              </div>
              <div class="col-12 col-sm-4 px-md-2 px-sm-1 py-1">
                <input
                  type="tel"
                  class="form-control form-control-lg px-3 py-2"
                  :placeholder="i18n.t('commonConfig.contactPhone')"
                  required
                />
              </div>
              <div class="col-12 col-sm-4 px-md-2 px-sm-1 py-1">
                <input
                  type="text"
                  class="form-control form-control-lg px-3 py-2"
                  :placeholder="i18n.t('commonConfig.contactName')"
                  required
                />
              </div>
            </div>

            <!-- 按钮区域 -->
            <div
              class="d-flex flex-nowrap flex-sm-row align-items-center justify-content-center gap-3"
            >
              <button type="submit" class="btn theme-btn px-4 py-2 fw-medium">
                {{ i18n.t('commonConfig.contactSubscribe') }}
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
const i18n = useI18n() // 使用 vue-i18n
</script>

<style lang="scss" scoped>
@use '@/assets/css/global.scss' as *;
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