<template>
  <div class="carousel-container" ref="containerRef">
    <div class="item-wrap">
      <div
        class="carousel-track"
        ref="trackRef"
        :style="{
          transform: `translateX(-${currentIndex * slideWidth}px)`,
          transition: isAnimating ? 'transform 0.5s ease' : 'none',
          width: `${items.length * slideWidth}px`,
        }"
        @transitionend="onTransitionEnd"
      >
        <div
          class="carousel-item"
          v-for="(item, idx) in items"
          :key="idx"
          :style="{ width: `${slideWidth}px` }"
        >
          <img :src="item.image" :alt="item.alt" class="item-image" />
          <div class="item-info">
            <div class="date-badge">{{ item.date }}</div>
            <div class="user-info">
              <img src="https://picsum.photos/id/64/200" alt="User" class="user-avatar" />
              <span class="username">{{ item.username }}</span>
            </div>
            <p class="message">{{ item.message }}</p>
            <div class="rating">
              <span v-for="i in 5" :key="i" class="star">★</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 翻页按钮 -->
    <button class="nav-btn prev-btn" @click="prevSlide" :disabled="currentIndex === 0">←</button>
    <button class="nav-btn next-btn" @click="nextSlide" :disabled="currentIndex >= maxStartIndex">
      →
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

// 模拟数据（与你原来的一样）
const items = ref([
  {
    image: 'https://www.tai3.pw/uploads/20251025/064e460212b16db828bcf21bb7ecdce6.png',
    alt: 'Food display',
    date: '10 Mar',
    username: 'User admin',
    message: 'Supervisor Disapproved of Latest Work.',
  },
  {
    image: 'https://www.tai3.pw/uploads/20251016/54009b9a3fc73af2909096f28c1d6834.png',
    alt: 'City skyline',
    date: '15 Mar',
    username: 'User admin',
    message: 'Supervisor Disapproved of Latest Work.',
  },
  {
    image: 'https://www.tai3.pw/uploads/20251025/064e460212b16db828bcf21bb7ecdce6.png',
    alt: 'Landmark building',
    date: '16 Mar',
    username: 'User admin',
    message: 'Supervisor Disapproved of Latest Work.',
  },
  {
    image: 'https://www.tai3.pw/uploads/20251016/54009b9a3fc73af2909096f28c1d6834.png',
    alt: 'Food display',
    date: '17 Mar',
    username: 'User admin',
    message: 'Supervisor Disapproved of Latest Work.',
  },
  {
    image: 'https://www.tai3.pw/uploads/20251016/54009b9a3fc73af2909096f28c1d6834.png',
    alt: 'City skyline',
    date: '18 Mar',
    username: 'User admin',
    message: 'Supervisor Disapproved of Latest Work.',
  },
  {
    image: 'https://www.tai3.pw/uploads/20251025/064e460212b16db828bcf21bb7ecdce6.png',
    alt: 'City skyline',
    date: '19 Mar',
    username: 'User admin',
    message: 'Supervisor Disapproved of Latest Work.',
  },
  {
    image: 'https://www.tai3.pw/uploads/20251016/54009b9a3fc73af2909096f28c1d6834.png',
    alt: 'City skyline',
    date: '20 Mar',
    username: 'User admin',
    message: 'Supervisor Disapproved of Latest Work.',
  },
])

// refs DOM
const containerRef = ref(null)
const trackRef = ref(null)

// 状态
const currentIndex = ref(0) // 当前起始 item 索引（以 item 为单位）
const isAnimating = ref(false)
const visibleItems = ref(3) // 默认显示 3 个
const slideWidth = ref(0) // 每个 item 的宽度（px）

// 当窗口尺寸改变时调整 visibleItems 的规则
const handleResizeMode = () => {
  if (window.innerWidth < 991) visibleItems.value = 2
  else visibleItems.value = 3
}

// 计算最大可起始索引（防止溢出）
// 当 items.length <= visibleItems 时，maxStartIndex = 0
const maxStartIndex = computed(() => {
  const max = Math.max(0, items.value.length - visibleItems.value)
  return max
})

// 计算每次点击要移动的步长（就是 visibleItems）
const step = computed(() => visibleItems.value)

// 重新计算 slideWidth（像素）——基于容器宽度 / visibleItems
const recalcSlideWidth = () => {
  const el = containerRef.value
  if (!el) return
  const w = el.clientWidth
  slideWidth.value = Math.floor(w / visibleItems.value) // 向下取整避免小数像素抖动
}

// 按组向右
const nextSlide = () => {
  if (isAnimating.value) return
  if (currentIndex.value >= maxStartIndex.value) return
  isAnimating.value = true
  // 计算目标索引：不要超过 maxStartIndex
  currentIndex.value = Math.min(currentIndex.value + step.value, maxStartIndex.value)
}

// 按组向左
const prevSlide = () => {
  if (isAnimating.value) return
  if (currentIndex.value <= 0) return
  isAnimating.value = true
  currentIndex.value = Math.max(currentIndex.value - step.value, 0)
}

// 过渡结束
const onTransitionEnd = () => {
  isAnimating.value = false
}

// 初始化
onMounted(() => {
  handleResizeMode()
  recalcSlideWidth()
  window.addEventListener('resize', () => {
    handleResizeMode()
    // recalcSlideWidth 需要放在下一生命周期里以确保 container 大小已经变化
    // 使用 requestAnimationFrame 使其更稳定
    window.requestAnimationFrame(recalcSlideWidth)
  })
})

// 当 visibleItems 改变（响应式断点切换）时重新计算 slideWidth 与 currentIndex 的可用范围
watch(visibleItems, () => {
  recalcSlideWidth()
  // 如果当前索引超出新的 maxStartIndex，收敛到边界
  if (currentIndex.value > maxStartIndex.value) {
    currentIndex.value = maxStartIndex.value
  }
})

// 如果容器宽度变化或 items 改变也重新计算 slideWidth
watch(
  () => items.value.length,
  () => {
    // 确保 slideWidth 与 maxStartIndex 一致
    window.requestAnimationFrame(recalcSlideWidth)
  }
)
</script>

<style lang="scss" scoped>
$primary-color: #4caf50;
$shadow-color: rgba(0, 0, 0, 0.08);
$nav-shadow: rgba(0, 0, 0, 0.16);
$rating-color: #ffc107;
$gap: 20px;

.carousel-container {
  position: relative;
  width: calc(100% - 100px);

  padding: 20px 0;
  margin: 20px auto 0;
  box-sizing: border-box;
  .item-wrap {
    overflow: hidden;
      width: 100%;
      height: 100%;
    .carousel-track {
      display: flex;
      margin: 0;
      padding: 0;
      transition: transform 0.5s ease;
      will-change: transform;

      
      .carousel-item {
        flex: 0 0 auto;
        padding: 0 10px;
        box-sizing: border-box;
        margin: 0;
        display: block;

        .item-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 8px 8px 0 0;
          display: block;
        }

        .item-info {
          background-color: #fff;
          padding: 16px;
          border-radius: 0 0 8px 8px;
          box-shadow: 0 2px 8px $shadow-color;

          .date-badge {
            display: inline-block;
            background-color: $primary-color;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            margin-bottom: 12px;
          }

          .user-info {
            display: flex;
            align-items: center;
            margin-bottom: 12px;

            .user-avatar {
              width: 24px;
              height: 24px;
              border-radius: 50%;
              margin-right: 8px;
            }

            .username {
              font-size: 14px;
              color: #666;
            }
          }

          .message {
            margin: 0 0 12px 0;
            color: #333;
            font-size: 14px;
          }

          .rating {
            color: $rating-color;

            .star {
              display: inline-block;
              margin-right: 2px;
            }
          }
        }
      }
    }
  }

  // 翻页按钮
  .nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(255, 255, 255, 0.9);
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 18px;
    cursor: pointer;
    box-shadow: 0 2px 4px $nav-shadow;
    z-index: 10;
    transition: background-color 0.2s, opacity 0.2s;

    &:hover {
      background-color: white;
    }

    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    &.prev-btn {
      left: -40px;
    }

    &.next-btn {
      right: -40px;
    }
  }
}
@media (max-width: 991px) {
  .carousel-container{
      margin-top: -200px;
  }
}
// 响应式
@media (max-width: 768px) {
  .carousel-track {
    .carousel-item {
      .item-image {
        height: 160px;
      }
    }
  }

  .nav-btn {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
}
</style>
