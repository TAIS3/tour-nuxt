// app/composables/useApi.js
export const useApi = () => {
  // 1. useCookie 必须放在最顶层
  const tokenCookie = useCookie('fa-token')
  const nuxtApp = useNuxtApp()

  // 2. 内部 Helper：暴力获取 Token (双重保险)
  const getToken = () => {
    // 优先用 Nuxt 的 useCookie
    if (tokenCookie.value) return tokenCookie.value
    
    // 如果是客户端，且 useCookie 没读到，直接读浏览器 Cookie
    if (process.client) {
      const match = document.cookie.match(new RegExp('(^| )fa-token=([^;]+)'))
      if (match) return match[2]
    }
    return ''
  }

  const request = async (url, options = {}) => {
    const config = useRuntimeConfig()
    
    // 3. 获取 Token
    const rawToken = getToken()
    
    // 4. 设置 Header
    const headers = {
      ...options.headers,
      token: rawToken 
    }

    // 5. 语言参数处理
    const currentLang = nuxtApp.$i18n?.locale?.value || 'zh-cn'

    if (!options.method || options.method.toUpperCase() === 'GET') {
      options.params = options.params || {}
      options.params.lang = currentLang
    } else {
      options.body = options.body || {}
      if (typeof options.body === 'object' && options.body !== null && !options.body.lang) {
        options.body.lang = currentLang
      }
    }

    const baseURL = config.public?.apiBase || ''

    // 核心修改：使用 $fetch 替代 useFetch，解决 mounted 后的请求警告
    try {
      const response = await $fetch(url, {
        baseURL,
        headers,
        ...options,
        onResponse({ response }) {
          if (response._data?.code === 401) {
             tokenCookie.value = null
          }
        }
      })
      // 模拟 useFetch 的成功返回结构，不影响其他组件的解构代码
      return { data: ref(response), error: ref(null) }
      
    } catch (err) {
      // 模拟 useFetch 的失败返回结构
      return { data: ref(null), error: ref(err) }
    }
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
      return request('/api/xilutour.user/login', {
        method: 'POST',
        body: payload, // payload 需包含 { account: '...', password: '...' }
      });
    },

    // 19. 用户登出 (修改路径)
    logout: () => {
      // 改为调用 xilutour.user 下的 logout
      return request('/api/xilutour.user/logout', {
        method: 'POST',
      });
    },

    // 20. 获取用户信息
    getUserInfo: () => {
      return request('/api/xilutour.user/info', {
        method: 'POST',
      });
    },

    // 21. 重置密码 (用于忘记密码)
    resetPassword: (payload) => {
      return request('/api/xilutour.user/resetpwd', {
        method: 'POST',
        body: payload, // { email, code, newpassword }
      });
    },

    // 22. 修改密码 (用于登录后修改)
    changePassword: (payload) => {
      return request('/api/xilutour.user/changepwd', {
        method: 'POST',
        body: payload, // { oldpassword, newpassword }
      });
    },

    // 23. 创建旅游路线订单 (修复了原有的方法名，匹配后端 create_order)
    createTourOrder: (payload) => {
      return request('/api/xilutour.tour_order/create_order', {
        method: 'POST',
        body: payload
      });
    },

    // 24. 创建景点订单 (修复了原有的方法名，匹配后端 create_order)
    createSceneryOrder: (payload) => {
      return request('/api/xilutour.scenery_order/create_order', {
        method: 'POST',
        body: payload
      });
    },

    // 25. 新增：向 PayPal 申请预支付单号 (指向刚合并的 Pay 控制器)
    createPaypalOrder: (payload) => {
      return request('/api/xilutour.pay/create_paypal_order', {
        method: 'POST',
        body: payload // { order_id, type }
      });
    },

    // 26. 新增：捕获 PayPal 扣款并更新本地状态
    capturePaypalOrder: (payload) => {
      return request('/api/xilutour.pay/capture_paypal_order', {
        method: 'POST',
        body: payload // { paypalOrderId, order_id, type }
      });
    },

    // 27. 新增：根据类型获取订单详情
    getOrderDetail: (payload) => {
      const endpoint = payload.type === 'tour_order'
        ? '/api/xilutour.tour_order/detail'
        : '/api/xilutour.scenery_order/detail';
      
      return request(endpoint, {
        method: 'POST',
        body: { order_id: payload.order_id }
      });
    },

    // 28. 新增：获取订单列表
    getOrderList: (payload) => {
      // 这里的 payload.type 最好和后端保持统一，用 'tour_order' 或 'scenery_order'
      const endpoint = payload.type === 'tour_order' 
        ? '/api/xilutour.tour_order/lists'
        : '/api/xilutour.scenery_order/lists';

      return request(endpoint, {
        method: 'POST',
        body: {
          // ThinkPHP 的 paginate 会自动去 request 里找 page 字段
          page: payload.page || 1, 
          // 将前端习惯的 limit 映射为后端需要的 pagesize
          pagesize: payload.limit || 10, 
          // 订单状态 (999=全部, 0=未支付, 1=已支付等，具体看你后端的 orderWhere 方法怎么写的)
          state: payload.state ?? 999 
        }
      });
    },

    // 29. 新增：申请退款 
    applyRefund: (payload) => {
      // 动态判断是路线订单还是景点订单
      const endpoint = payload.type === 'tour_order'
        ? '/api/xilutour.tour_order/applyRefund'
        : '/api/xilutour.scenery_order/applyRefund';

      return request(endpoint, {
        method: 'POST',
        // 注意：前端传过来的 payload.order_id 实际上装的是 order_no (如 B2026...)
        body: { order_no: payload.order_id } 
      });
    },

    // 30. 新增：客户联系人
    addContact: (payload) => {
      return request('/api/common/addContact', {
        method: 'POST',
        body: payload
      });
    },

    // 31. 获取图形验证码 (API 返回 Base64 与 ID)
    getCaptcha: () => {
      return request(`/api/common/captcha?t=${new Date().getTime()}`, {
        method: 'GET'
      });
    }
  }
}