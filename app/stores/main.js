// app/stores/main.js
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', () => {
    // Existing state
    const categories = ref([])
    const articles = ref([])
    const articleDetail = ref(null)

    // Auth state
    const token = useCookie('fa-token')
    const user = ref(null)

    const isLoggedIn = computed(() => !!token.value)

    // Actions
    function setToken(newToken) {
      token.value = newToken
    }

    async function fetchUser() {
      const { getUserInfo } = useApi()
      if (token.value) {
        const { data, error } = await getUserInfo()
        if (error.value) {
          console.error('Failed to fetch user:', error.value)
          // Potentially clear token if it's invalid
          clearAuth()
        } else {
          user.value = data.value?.data || null
        }
      }
    }

    function clearAuth() {
      token.value = null
      user.value = null
    }

    // Existing actions
    async function fetchCategories() {
        const { getTourCategories } = useApi()
        const { data } = await getTourCategories()
        categories.value = data.value?.data || []
    }

    async function fetchArticles(payload) {
        const { getTourList } = useApi()
        const { data } = await getTourList(payload)
        articles.value = data.value?.data || []
    }

    async function fetchArticleDetail(id) {
        const { getTourDetail } = useApi()
        const { data } = await getTourDetail({ id }) 
        articleDetail.value = data.value?.data || null
    }

    return {
        // Existing
        categories,
        articles,
        articleDetail,
        fetchCategories,
        fetchArticles,
        fetchArticleDetail,
        // Auth
        token,
        user,
        isLoggedIn,
        setToken,
        fetchUser,
        clearAuth
    }
})