// app/utils/common.js
import DOMPurify from 'dompurify'

// 1. 获取 URL 参数值
export function getUrlParam(key, url) {
  // 兼容服务端渲染 (SSR)，如果没有 window 对象则直接返回 null
  if (typeof window === 'undefined') return null
  
  if (!key) return null
  if (!url) url = window.location.href

  const params = new URL(url).searchParams
  return params.get(key)
}

// 2. 判断是否为空
export function isEmpty(val) {
  return val === null || val === undefined || val === '' || (Array.isArray(val) && val.length === 0)
}

// 3. 格式化时间
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return ''
  const d = new Date(date)

  const pad = (n) => (n < 10 ? '0' + n : n)

  return format
    .replace('YYYY', d.getFullYear())
    .replace('MM', pad(d.getMonth() + 1))
    .replace('DD', pad(d.getDate()))
    .replace('HH', pad(d.getHours()))
    .replace('mm', pad(d.getMinutes()))
    .replace('ss', pad(d.getSeconds()))
}

// 4. 深拷贝
export function deepClone(obj) {
  // 注意：JSON 方法无法克隆函数和 RegExp，但在简单数据场景下足够快
  return JSON.parse(JSON.stringify(obj))
}

// 5. 内容净化 (防 XSS)
export function safeContent(data) {
  if (!data) return ''
  // 确保只在客户端执行 DOMPurify，因为它是基于 DOM 的
  if (import.meta.server) return data 
  
  try {
    return DOMPurify.sanitize(data)
  } catch (e) {
    console.error('内容解析失败:', e)
    return ''
  }
}

/**
 * 6. 判断是否绝对路径
 */
export function isAbsoluteUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return /^(?:https?:)?\/\//.test(url) ||
    /^\s*data:/i.test(url) ||
    /^[a-z][a-z0-9+.-]*:/i.test(url);
}

/**
 * 7. 获取完整图片/资源路径 (核心改造)
 * 替代了旧的 getImageUrl 和我之前给你的 resolveUrl
 */
export function getImageUrl(path) {
  if (!path) return ''

  // A. 如果已经是绝对路径，直接返回
  if (isAbsoluteUrl(path)) {
    return path
  }

  // B. 获取 Nuxt 运行时配置
  // 注意：在 utils 里也能使用 useRuntimeConfig，只要是在 Nuxt 上下文中调用
  const config = useRuntimeConfig()
  // 读取我们在 nuxt.config.js 里配置的 public.resourceBase
  const base = config.public.resourceBase || ''

  // C. 拼接逻辑
  const cleanPath = path.startsWith('/') ? path.substring(1) : path
  const cleanBase = base.endsWith('/') ? base.substring(0, base.length - 1) : base

  // 如果 base 为空（本地开发或同域），补回开头的 /
  if (!cleanBase) {
      return '/' + cleanPath
  }

  return `${cleanBase}/${cleanPath}`
}

/**
 * 8. 通用跳转方法 (Nuxt 适配版)
 * 替代了旧的 router 和 window.open 混合写法
 */
export function toLink(link, options = {}) {
  const { newTab = false } = options // 默认为 false 更符合 SPA 习惯，你原本是 true
  if (!link) return

  // ---- 外部链接 ----
  if (typeof link === 'string' && isAbsoluteUrl(link)) {
    if (newTab) {
      if (typeof window !== 'undefined') window.open(link, '_blank')
    } else {
      if (typeof window !== 'undefined') window.location.href = link
    }
    return
  }

  // ---- 内部路由 ----
  // 在 Nuxt 中，我们尽量使用 navigateTo 而不是 router.push
  // 但为了兼容你的旧逻辑（手动拼语言前缀），我们先保留部分逻辑
  
  const router = useRouter() // 获取 Nuxt 路由实例
  const i18n = useNuxtApp().$i18n // 获取 i18n 实例
  const currentLang = i18n.locale.value || 'en' // 获取当前语言

  let targetPath = ''

  if (typeof link === 'string') {
    // 处理字符串路径
    targetPath = link.startsWith('/') ? link : '/' + link
    
    // 如果没有语言前缀且当前不是默认语言(或者你策略是都加)，则手动添加
    // 注意：Nuxt i18n 的 localePath() 是更好的选择，但为了兼容你的逻辑：
    if (currentLang && !targetPath.startsWith(`/${currentLang}`)) {
       // 这里简单判断，实际建议改用 const localePath = useLocalePath(); localePath(link)
       targetPath = `/${currentLang}${targetPath}`
    }
  } else if (typeof link === 'object') {
    // 如果是对象，建议直接用 router 解析
    // 暂时简单处理
    console.warn('toLink暂不支持对象格式，请使用 navigateTo', link)
    return
  }

  // 执行跳转
  if (newTab) {
    // 获取完整 URL
    const resolved = router.resolve(targetPath)
    if (typeof window !== 'undefined') window.open(resolved.href, '_blank')
  } else {
    // SPA 跳转
    navigateTo(targetPath)
  }
}

// 9. 样式辅助函数 (保持原样)
export function setSectionClass(settype = '0') {
  return ['2', '3', '4'].includes(settype) ? 'section-bg-image' : false;
}

export function setContainerCLass(settype = '0') {
  const classNameArr = [
    'text-left-img-right',
    'text-right-img-left',
    'text-left-img-all',
    'text-right-img-all',
    'text-center-img-all',
  ]
  return classNameArr[Number(settype)]
}

// 定义一个简单的去标签函数 (也可以写在 utils 里)
export function stripHtml (html) {
  if (!html) return ''
  return html.replace(/<[^>]+>/g, '')
}