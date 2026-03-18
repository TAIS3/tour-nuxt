// nuxt.config.js
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  srcDir: 'app/', // ✅ 只有加了这行，Nuxt 才会去 app/pages 找页面
  app: {
    // 启用全局页面过渡
    pageTransition: { name: 'page', mode: 'out-in' },
    // 启用布局过渡 (如果你的布局也会变)
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },

  // 1. 注册模块
  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/i18n'
  ],

  // 2. 全局样式引入 (先注释掉 scss 防止没文件报错)
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    '~/assets/css/style.scss' 
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // 自动为每个组件引入变量文件
          // 注意：因为你在 Nuxt 4 的 app 目录下，路径通常是 ~/app/assets/...
          additionalData: '@use "~/assets/css/variables.scss" as *;'
        }
      }
    }
  },

  // 3. 国际化配置 (远程模式)
  i18n: {
    // 🔴 核心修改：使用 no_prefix，完全关闭自动路由生成
    strategy: 'prefix_except_default', 
    
    // 这里只定义默认的，其他的我们动态加
    locales: [
      { code: 'en', iso: 'en-US', name: 'English' },
      { code: 'zh_CN', iso: 'zh-CN', name: '简体中文' }
    ], 
    defaultLocale: 'en',
    detectBrowserLanguage: false, // 我们自己用中间件控制
    vueI18n: './i18n.config.js'
  },

  // 4. API 代理配置
  // nitro: {
  //   devProxy: {
  //     '/api': {
  //       target: 'https://www.eztripcn.com', // 这里稍后改成你真实的后端地址
  //       changeOrigin: true,
  //       prependPath: false,
  //     }
  //   }
  // },

  // 5. 运行时配置
  runtimeConfig: {
    // 【私有键】这里放数据库密码、SecretKey 等绝对不能泄露给浏览器的东西
    // 目前你暂时不需要在这里放 apiTarget，除非你只在 server/routes 里用它

    // 【公开键】暴露给前端使用的配置
    public: {
      // 1. API 基础路径 (给客户端代理用)
      apiBase: '/api',

      // 2. ✅ 核心修正：必须放在 public 里！
      // 这样 store/lang.js 里的 config.public.apiTarget 才能读到它
      // 默认值是开发环境或兜底，生产环境用 NUXT_PUBLIC_API_TARGET 覆盖
      apiTarget: process.env.NUXT_PUBLIC_API_TARGET || 'https://www.eztripcn.com',

      // 3. 静态资源/图片域名
      resourceBase: process.env.NUXT_PUBLIC_RESOURCE_BASE || 'https://www.eztripcn.com'
    }
  },
  // ssr: false,

  // paypal配置
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.includes('paypal-') || tag.includes('venmo-')
    }
  },
  postcss: {
    plugins: {
      autoprefixer: {},
    },
  },
})