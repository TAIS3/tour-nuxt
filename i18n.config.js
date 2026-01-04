// i18n.config.js
export default defineI18nConfig(() => ({
  legacy: false, // 使用 Vue 3 组合式 API
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    // 空着就行，因为我们会通过 API 加载
    en: {}
  }
}))