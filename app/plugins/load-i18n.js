// app/plugins/i18n-loader.js
export default defineNuxtPlugin(async (nuxtApp) => {
  const { $i18n } = nuxtApp
  const langStore = useLangStore() // 假设你使用了 Pinia

  // 1. 获取当前 Nuxt 决定的语言 (根据 URL 自动判断的)
  const currentLocale = $i18n.locale.value || 'en'

  // 2. 检查 store 里是否已经有数据 (防止重复请求)
  // 如果你的 store 还没实现这个检查，可以先忽略，直接请求
  
  // 3. 核心：请求后端 API 获取翻译 JSON
  // 注意：这里我们使用 store 的方法，或者直接用 useApi
  try {
    // 假设你的 store 里有一个 fetchLangMessages 动作
    // 如果没有，请在下面直接写 API 请求逻辑
    // await langStore.fetchLangMessages(currentLocale)
    
    // --- 临时方案：如果你后端接口还没通，先用这个模拟数据顶一下 ---
    if (Object.keys($i18n.getLocaleMessage(currentLocale)).length === 0) {
        console.log(`正在加载语言包: ${currentLocale}`)
        
        // 替换成真实的 API 请求: 
        const res = await useApi().getLanguageJson(currentLocale)
        const messages = res.data
        
        // 4. 设置翻译内容
        $i18n.setLocaleMessage(currentLocale, messages.value.data)
    }
  } catch (e) {
    console.error('语言包加载失败:', e)
  }
})