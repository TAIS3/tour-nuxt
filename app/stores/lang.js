// app/stores/lang.js
import { defineStore } from 'pinia'

export const useLangStore = defineStore('lang', () => {
  const nuxtApp = useNuxtApp()
  const i18n = nuxtApp.$i18n
  const config = useRuntimeConfig()
  
  // 1. 定义两个地址
  const API_PATH = config.public.apiBase     // '/api'
  const API_TARGET = config.public.apiTarget // 'https://www.eztripcn.com'

  // 2. 智能判断 BaseURL
  // import.meta.server 在服务端为 true，客户端为 false
  // 服务端：直接连 https://www.eztripcn.com/api
  // 客户端：连 /api
  const currentBaseURL = import.meta.server ? `${API_TARGET}/api` : API_PATH

  const supportedLangs = ref([]) 
  const langCookie = useCookie('user_lang')

  async function initEnv(routeLang) {
    if (supportedLangs.value.length === 0) {
        try {
            // ✅ 移除 Token，使用智能 BaseURL
            const res = await $http('/common/getSupportLang', { 
                method: 'GET',
                baseURL: currentBaseURL,   
                referer: API_TARGET,
                lang: routeLang      
            })
            supportedLangs.value = res.data || ['en']
        } catch (e) {
            console.error('加载语言列表失败', e)
            supportedLangs.value = ['en']
        }
    }

    const isSupported = supportedLangs.value.some(l => (l.code || l) === routeLang)
    if (!isSupported) {
        return false 
    }

    i18n.locale.value = routeLang 
    langCookie.value = routeLang

    const existingMessages = i18n.getLocaleMessage(routeLang)
    
    if (!existingMessages || Object.keys(existingMessages).length === 0) {
        try {
            const res = await $http('/common/getLangJson', {
                method: 'POST',
                body: { lang: routeLang },
                baseURL: currentBaseURL,   // ✅ 使用智能地址
                referer: API_TARGET,
                lang: routeLang      
            })
            console.log(res);
            
            if (res.data) {
                i18n.setLocaleMessage(routeLang, res.data)
            }
        } catch (e) {
            console.error(`加载 ${routeLang} 语言包失败`, e)
        }
    }
    
    return true
  }

  return {
    locale: i18n.locale, 
    supportedLangs,
    initEnv
  }
})