// app/composables/useHttp.js

export const useHttp = (url, options = {}) => {
  const config = useRuntimeConfig()
  const nuxtApp = useNuxtApp() // 获取 nuxt 实例
  
  // ✅ 核心改进：直接从 i18n 实例获取当前语言
  // 这样能确保跟随 URL 变化，比 cookie 更准
  const i18nLocale = nuxtApp.$i18n?.locale?.value
  const currentLang = i18nLocale || 'en'

  options.headers = options.headers || {}
  
  // 1. 基础 Header 设置
  const apiTarget = config.public.apiTarget || 'https://www.eztripcn.com'
  options.headers.Referer = apiTarget

  // 2. Token 鉴权
  const token = useCookie('fa-token').value
  if (token) {
    options.headers.token = token
  }

  // 3. GET 请求处理 (自动注入 lang)
  if (!options.method || options.method === 'GET') {
    options.params = options.params || {}
    if (!options.params.lang) {
      options.params.lang = currentLang
    }
  }

  // 4. POST 请求处理 (自动注入 lang + 转换为 Form Data)
  if (options.method === 'POST' || options.method === 'PUT') {
    let payload = options.body || {}
    
    // 解包 ref
    if (isRef(payload)) payload = payload.value

    // 仅处理纯对象
    if (Object.prototype.toString.call(payload) === '[object Object]') {
       // ✅ 自动注入 lang，上层 API 不用传
       if (!payload.lang) {
         payload.lang = currentLang
       }

       const formData = new URLSearchParams()
       for (const key in payload) {
         if (Array.isArray(payload[key])) {
           formData.append(key, payload[key].join(','))
         } else if (payload[key] !== undefined && payload[key] !== null) {
           formData.append(key, payload[key])
         }
       }
       
       options.body = formData.toString()
       options.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }
  }

  return useFetch(url, {
    baseURL: config.public.apiBase,
    ...options
  })
}