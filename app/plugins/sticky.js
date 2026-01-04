// app/plugins/sticky.client.js

export default defineNuxtPlugin((nuxtApp) => {
  // 1. 定义配置默认值
  const defaults = {
    topSpacing: 0,
    bottomSpacing: 0,
    className: 'is-sticky',
    wrapperClassName: 'sticky-wrapper',
    center: false,
    getWidthFrom: '',
    widthFromWrapper: true,
    responsiveWidth: false
  }

  // 2. 状态变量
  let sticked = []
  // 注意：在 .client.js 中可以安全访问 window，但为了保险，初始化放后面
  let windowHeight = 0 

  // 3. 核心逻辑函数 (保持原有逻辑的大部分)
  const scroller = () => {
    const scrollTop = window.scrollY
    const documentHeight = document.documentElement.scrollHeight
    const dwh = documentHeight - windowHeight
    const extra = scrollTop > dwh ? dwh - scrollTop : 0

    sticked.forEach(s => {
      const elementTop = s.stickyWrapper.getBoundingClientRect().top + scrollTop
      const etse = elementTop - s.topSpacing - extra

      s.stickyWrapper.style.height = `${s.stickyElement.offsetHeight}px`

      if (scrollTop <= etse) {
        if (s.currentTop !== null) {
          s.stickyElement.style.width = ''
          s.stickyElement.style.position = ''
          s.stickyElement.style.top = ''
          s.stickyWrapper.classList.remove(s.className)
          // 触发自定义事件 (Vue 3/Nuxt 3 写法调整)
          emitEvent(s.stickyElement, 'sticky-end', s)
          s.currentTop = null
        }
      } else {
        let newTop = documentHeight - s.stickyElement.offsetHeight - s.topSpacing - s.bottomSpacing - scrollTop - extra
        newTop = newTop < 0 ? newTop + s.topSpacing : s.topSpacing

        if (s.currentTop !== newTop) {
          let newWidth = null
          if (s.getWidthFrom) {
            newWidth = document.querySelector(s.getWidthFrom)?.offsetWidth || null
          } else if (s.widthFromWrapper) {
            newWidth = s.stickyWrapper.offsetWidth
          }
          newWidth = newWidth ?? s.stickyElement.offsetWidth

          s.stickyElement.style.width = `${newWidth}px`
          s.stickyElement.style.position = 'fixed'
          s.stickyElement.style.top = `${newTop}px`
          s.stickyWrapper.classList.add(s.className)

          if (s.currentTop === null) {
            emitEvent(s.stickyElement, 'sticky-start', s)
          } else {
            emitEvent(s.stickyElement, 'sticky-update', s)
          }

          if ((s.currentTop === s.topSpacing && s.currentTop > newTop) ||
            (s.currentTop === null && newTop < s.topSpacing)) {
            emitEvent(s.stickyElement, 'sticky-bottom-reached', s)
          } else if (s.currentTop !== null && newTop === s.topSpacing && s.currentTop < newTop) {
            emitEvent(s.stickyElement, 'sticky-bottom-unreached', s)
          }

          s.currentTop = newTop
        }
      }
    })
  }

  const resizer = () => {
    windowHeight = window.innerHeight
    sticked.forEach(s => {
      let newWidth = null
      if (s.getWidthFrom && s.responsiveWidth) {
        newWidth = document.querySelector(s.getWidthFrom)?.offsetWidth
      } else if (s.widthFromWrapper) {
        newWidth = s.stickyWrapper.offsetWidth
      }
      if (newWidth !== null) {
        s.stickyElement.style.width = `${newWidth}px`
      }
    })
  }

  // 辅助函数：触发事件
  const emitEvent = (el, eventName, data) => {
    el.dispatchEvent(new CustomEvent(eventName, {
      detail: data,
      bubbles: true
    }))
  }

  // 4. 定义指令对象
  const stickyDirective = {
    mounted(el, binding) {
      // 安全检查：防止在服务端执行（虽然文件名已经是 .client 了）
      if (typeof window === 'undefined') return

      windowHeight = window.innerHeight

      const options = { ...defaults, ...binding.value }

      // DOM 操作：插入 wrapper
      // 注意：这修改了 DOM 结构，可能导致 Vue DevTools 里的组件树结构看起来怪怪的
      const wrapper = document.createElement('div')
      wrapper.className = options.wrapperClassName
      if (el.id) {
        wrapper.id = `${el.id}-${defaults.wrapperClassName}`
      }

      el.parentNode.insertBefore(wrapper, el)
      wrapper.appendChild(el)

      if (options.center) {
        wrapper.style.width = `${el.offsetWidth}px`
        wrapper.style.marginLeft = 'auto'
        wrapper.style.marginRight = 'auto'
      }

      if (getComputedStyle(el).float === 'right') {
        el.style.float = 'none'
        wrapper.style.float = 'right'
      }

      wrapper.style.height = `${el.offsetHeight}px`

      const state = {
        ...options,
        stickyElement: el,
        stickyWrapper: wrapper,
        currentTop: null
      }

      sticked.push(state)

      if (sticked.length === 1) {
        window.addEventListener('scroll', scroller, { passive: true })
        window.addEventListener('resize', resizer, { passive: true })
      }

      setTimeout(scroller, 0)
    },

    unmounted(el) {
      sticked = sticked.filter(s => {
        if (s.stickyElement === el) {
          el.style.width = ''
          el.style.position = ''
          el.style.top = ''
          el.style.float = ''

          const wrapper = s.stickyWrapper
          if (wrapper.parentNode) {
            wrapper.parentNode.insertBefore(el, wrapper)
            wrapper.parentNode.removeChild(wrapper)
          }
          return false
        }
        return true
      })

      if (sticked.length === 0) {
        window.removeEventListener('scroll', scroller)
        window.removeEventListener('resize', resizer)
      }
    },

    updated(el, binding) {
      const index = sticked.findIndex(s => s.stickyElement === el)
      if (index !== -1) {
        sticked[index] = { ...sticked[index], ...binding.value }
        scroller()
      }
    },
    // ✅ 新增这个方法，专门安抚服务端的
    getSSRProps(binding, vnode) {
      return {}
    }
  }

  // 5. 注册为全局指令 v-sticky
  nuxtApp.vueApp.directive('sticky', stickyDirective)
})