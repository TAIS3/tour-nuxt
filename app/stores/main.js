// app/stores/main.js
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', () => {
    const categories = ref([])
    const articles = ref([]) // 这里的 articles 对应你的 旅游列表
    const articleDetail = ref(null)

    // 获取分类列表
    async function fetchCategories() {
        const { getTourCategories } = useApi()
        const { data } = await getTourCategories()
        // 假设后端返回的数据结构是 result.data
        categories.value = data.value?.data || []
    }

    // 获取列表 (对应 getTourList)
    async function fetchArticles(payload) {
        const { getTourList } = useApi()
        const { data } = await getTourList(payload)
        articles.value = data.value?.data || []
    }

    // 获取详情 (对应 getTourDetail)
    async function fetchArticleDetail(id) {
        const { getTourDetail } = useApi()
        // 注意参数结构，根据 API 定义可能需要传对象 { id: id }
        const { data } = await getTourDetail({ id }) 
        articleDetail.value = data.value?.data || null
    }

    return {
        categories,
        articles,
        articleDetail,
        fetchCategories,
        fetchArticles,
        fetchArticleDetail
    }
})