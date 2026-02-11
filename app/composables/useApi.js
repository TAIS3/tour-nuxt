// app/composables/useApi.js
export const useApi = () => {
  // 内部封装的请求方法，处理 Token 和基础响应
  const request = async (url, options = {}) => {
    const config = useRuntimeConfig()
    // 使用 cookie 存储 token，支持 SSR
    const token = useCookie('token')

    // useNuxtApp() 在 Nuxt 的任何上下文中均可用
    const nuxtApp = useNuxtApp()
    // 获取当前语言代码，如果获取失败则默认为 zh-cn
    const currentLang = nuxtApp.$i18n?.locale?.value || 'zh-cn'
    
    // 自动携带 Token
    const headers = {
      ...options.headers,
      token: token.value || ''
    }

    // 3. 自动注入 lang 参数 (对齐 useHttp 的行为)
    // 这样后端可以通过 $this->request->param('lang') 获取
    if (!options.method || options.method.toUpperCase() === 'GET') {
      options.params = options.params || {}
      options.params.lang = currentLang
    } else {
      // POST 请求处理
      options.body = options.body || {}
      // 仅当 body 是普通对象时注入，防止破坏 FormData 等格式
      if (typeof options.body === 'object' && options.body !== null && !options.body.lang) {
        options.body.lang = currentLang
      }
    }

    // API 基础路径，如果没有配置 public.apiBase，默认为空字符串 (即同域)
    const baseURL = config.public?.apiBase || ''

    return await useFetch(url, {
      baseURL,
      headers,
      ...options,
      // 响应拦截，处理 token 过期等通用逻辑
      onResponse({ response }) {
        // FastAdmin 默认 401 为未登录/Token过期
        if (response._data?.code === 401) {
           const token = useCookie('token')
           token.value = null
        }
      }
    })
  }

  return {
    // ================= 公共/基础接口 =================

    // 1. 获取 Banner
    getBanner: (ids) => {
      return request('/api/banner/getBanner', {
        method: 'POST',
        body: { ids }
      })
    },

    // 2. 获取支持语言
    getSupportedLangs: () => {
      return request('/api/common/getSupportLang', {
        method: 'GET'
      })
    },

    // 3. 获取语言包 JSON
    getLanguageJson: (locale) => {
      return request('/api/common/getLangJson', {
        method: 'POST',
        body: { lang: locale }
      })
    },

    // ================= 旅游/景点业务接口 =================

    // 4. 获取旅游分类
    getTourCategories: () => {
      return request('/api/xilutour.common/tour_category', {
        method: 'POST'
      })
    },

    // 5. 获取旅游列表
    getTourList: (payload) => {
      return request('/api/xilutour.tour/lists', {
        method: 'POST',
        body: payload
      })
    },

    // 6. 获取旅游详情
    getTourDetail: (payload) => {
      return request('/api/xilutour.tour/detail', {
        method: 'POST',
        body: payload
      })
    },

    // 7. 推荐线路
    getTourRecommend: (payload) => {
      return request('/api/xilutour.tour/recommend_list', {
        method: 'POST',
        body: payload
      })
    },

    // 8. 旅游分类详情
    getTourCategoryDetail: (payload) => {
      return request('/api/xilutour.tour/category_detail', {
        method: 'POST',
        body: payload
      })
    },

    // 9. 获取景点分类
    getSceneryCategories: () => {
      return request('/api/xilutour.common/scenery_category', {
        method: 'POST'
      })
    },

    // 10. 景点列表
    getSceneryList: (payload) => {
      return request('/api/xilutour.scenery/lists', {
        method: 'POST',
        body: payload
      })
    },

    // 11. 获取景点详情
    getSceneryDetail: (payload) => {
      return request('/api/xilutour.scenery/detail', {
        method: 'POST',
        body: payload
      })
    },

    // 12. 景点分类详情
    getSceneryCategoryDetail: (payload) => {
      return request('/api/xilutour.scenery/category_detail', {
        method: 'POST',
        body: payload
      })
    },

    // 13. 推荐景点
    getSceneryRecommend: (payload) => {
      return request('/api/xilutour.scenery/hot_list', {
        method: 'POST',
        body: payload
      })
    },

    // 14. 单页文章导航
    getSinglePageNav: () => {
      return request('/api/xilutour.singlepage/nav_article_list', {
        method: 'POST'
      })
    },

    // 15. 单页详情
    getSinglePageDetail: (payload) => {
      return request('/api/xilutour.singlepage/singlePageArticle', {
        method: 'POST',
        body: payload
      })
    },

    // ================= 用户/会员接口 =================

    // 16. 发送邮箱验证码 (EMS)
    // 注意：FastAdmin 后端使用的是 Ems::check，所以这里调用 ems 接口
    sendCode: (payload) => {
      return request('/api/xilutour.user/send', {
        method: 'POST',
        body: payload, // 格式: { email: 'xx@xx.com', event: 'register' }
      });
    },

    // 17. 用户注册
    register: (payload) => {
      // 【修改】指向西陆旅游插件下的 User 控制器
      return request('/api/xilutour.user/register', {
        method: 'POST',
        body: payload, // { username, password, email, mobile, code }
      });
    },

    // 18. 用户登录 (修改路径)
    login: (payload) => {
      // 改为调用 xilutour.user 下的 login
      return useHttp('/api/xilutour.user/login', {
        method: 'POST',
        body: payload, // payload 需包含 { account: '...', password: '...' }
      });
    },

    // 19. 用户登出 (修改路径)
    logout: () => {
      // 改为调用 xilutour.user 下的 logout
      return useHttp('/api/xilutour.user/logout', {
        method: 'POST',
      });
    },

    // 20. 获取用户信息
    getUserInfo: () => {
      return request('/api/xilutour.user/info', {
        method: 'POST',
      });
    },

    // 21. 重置密码 (新增)
    resetPassword: (payload) => {
      return request('/api/xilutour.user/resetpwd', {
        method: 'POST',
        body: payload, // { email, code, newpassword }
      });
    },
  }
}