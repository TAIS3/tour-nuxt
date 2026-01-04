// app/stores/banner.js
import { defineStore } from 'pinia'

export const useBannerStore = defineStore('banner', () => {
    const banner = ref(null)

    async function fetchBanner(id) {
        try {
            // 1. 获取 API 实例 (Nuxt 自动导入 useApi)
            const { getBanner } = useApi()
            
            // 2. 发起请求
            // 注意：useApi 返回的是 useFetch 的结果，包含 { data, error }
            // 这里我们需要解构出 data
            const { data, error } = await getBanner(id)

            if (error.value) throw error.value

            // 3. 赋值
            banner.value = data.value?.data || null
        } catch (error) {
            console.error('获取banner失败', error)
        }
    }

    return { banner, fetchBanner }
})