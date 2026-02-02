// app/composables/useApi.js
export const useApi = () => {
  return {
    // 1. 获取 Banner
    // 旧代码：getBanner(ids)
    getBanner: (ids) => {
      return useHttp('/api/banner/getBanner', {
        method: 'POST',
        body: { ids } // 不需要再写 lang 了，useHttp 会自动加
      })
    },

    // 2. 获取旅游分类
    getTourCategories: () => {
      return useHttp('/api/xilutour.common/tour_category', {
        method: 'POST'
      })
    },

    // 3. 获取旅游列表
    // payload 通常包含分页参数 page, limit 等
    getTourList: (payload) => {
      return useHttp('/api/xilutour.tour/lists', {
        method: 'POST',
        body: payload
      })
    },

    // 4. 获取旅游详情
    getTourDetail: (payload) => {
      return useHttp('/api/xilutour.tour/detail', {
        method: 'POST',
        body: payload
      })
    },

    // 5. 推荐线路
    getTourRecommend: (payload) => {
      return useHttp('/api/xilutour.tour/recommend_list', {
        method: 'POST',
        body: payload
      })
    },

    // 6. 分类详情
    getTourCategoryDetail: (payload) => {
      
      return useHttp('/api/xilutour.tour/category_detail', {
        method: 'POST',
        body: payload
      })
    },

    // 7. 单页文章导航
    getSinglePageNav: () => {
      return useHttp('/api/xilutour.singlepage/nav_article_list', {
        method: 'POST'
      })
    },

    // 8. 单页详情
    getSinglePageDetail: (payload) => {
      return useHttp('/api/xilutour.singlepage/singlePageArticle', {
        method: 'POST',
        body: payload
      })
    },

    // 9. 获取支持语言
    getSupportedLangs: () => {
      return useHttp('/api/common/getSupportLang', {
        method: 'GET'
      })
    },

    // 10. 获取语言包 JSON
    // 这个稍微特殊，参数直接传过来了，可能要覆盖默认逻辑，或者直接传
    getLanguageJson: (locale) => {
      return useHttp('/api/common/getLangJson', {
        method: 'POST',
        body: { lang: locale } // 这里显式传了 lang，会覆盖掉自动注入的(如果合并逻辑没问题)
                               // 或者因为 langStore 的值可能还没变，这里显式传更安全
      })
    },

    // 11.景点列表
    // payload 通常包含分页参数 page, limit 等
    getSceneryList: (payload) => {
      return useHttp('/api/xilutour.scenery/lists', {
        method: 'POST',
        body: payload
      })
    },

    // 12.景点分类详情
    getSceneryCategoryDetail: (payload) => {
      return useHttp('/api/xilutour.scenery/category_detail', {
        method: 'POST',
        body: payload
      })
    },

    // 13.获取景点分类
    getSceneryCategories: () => {
      return useHttp('/api/xilutour.common/scenery_category', {
        method: 'POST'
      })
    },

    // 14.获取景点详情
    getSceneryDetail: (payload) => {
      return useHttp('/api/xilutour.scenery/detail', {
        method: 'POST',
        body: payload
      })
    },

    // 15. 推荐景点
    getSceneryRecommend: (payload) => {
      return useHttp('/api/xilutour.scenery/hot_list', {
        method: 'POST',
        body: payload
      })
    },

    // 16. 发送验证码
    sendCode: (payload) => {
      return useHttp('/api/ems/send', {
        method: 'POST',
        body: payload,
      });
    },

    // 17. 用户注册
    register: (payload) => {
      return useHttp('/api/user/register', {
        method: 'POST',
        body: payload,
      });
    },

    // 18. 用户登录
    login: (payload) => {
      return useHttp('/api/user/login', {
        method: 'POST',
        body: payload,
      });
    },

    // 19. 用户登出
    logout: () => {
      return useHttp('/api/user/logout', {
        method: 'POST',
      });
    },

    // 20. 获取用户信息
    getUserInfo: () => {
      return useHttp('/api/user/getuserinfo', {
        method: 'POST',
      });
    },
  }
}