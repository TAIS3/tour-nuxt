<template>
  <div class="text-center text-gray-500 py-10">
    <i class="bi bi-inbox fs-2 d-block mb-2"></i>
    {{ i18n.t('commonConfig.noData') }}
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n'

const i18n = useI18n() // 使用 vue-i18n
</script>
<script>
export default {}
</script>
<style scoped>
.text-center {
  text-align: center;
}
.text-gray-500 {
  color: #6b7280;
}
.py-10 {
  padding: 4rem 0;
}
.fs-2 {
  font-size: 2rem;
}
</style>