// app/utils/http.js
export const $http = (url, options = {}) => {
  const { 
    baseURL,      
    referer,      
    lang,         
    ...fetchOptions 
  } = options

  const defaults = {
    baseURL: baseURL || '/api',
    
    onRequest({ options }) {
      options.headers = options.headers || {}

      // ✅ 1. 核心修复：强制伪装成浏览器 (解决 SSR 403/405 问题)
      options.headers['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

      // 2. Referer 伪装
      if (referer) {
        options.headers.Referer = referer
      }

      // 3. 语言与参数处理
      const currentLang = lang || 'en'
      if (options.method === 'POST' || options.method === 'PUT') {
        const payload = options.body || {}
        payload.lang = currentLang
        
        const formData = new URLSearchParams()
        for (const key in payload) {
            if (Array.isArray(payload[key])) {
                formData.append(key, payload[key].join(',')) 
            } else if (payload[key] !== undefined && payload[key] !== null) {
                formData.append(key, payload[key])
            }
        }
        options.body = formData
      } else {
        options.params = options.params || {}
        options.params.lang = currentLang
      }
    }
  }

  return $fetch(url, {
    ...defaults,
    ...fetchOptions
  })
}