<template>
  <nav aria-label="Page navigation" class="mt-4">
    <ul class="pagination justify-content-center align-items-center flex-wrap gap-1">

      <!-- 总条数显示 -->
      <li class="page-info text-muted me-2 small">
        {{ i18n.t('pagination.total', { count: totalItems }) }}
      </li>

      <!-- 上一页 -->
      <li class="page-item" :class="{ disabled: modelValue === 1 }">
        <button class="page-link" @click="goToPage(modelValue - 1)">
          ‹ {{ i18n.t('pagination.prev') }}
        </button>
      </li>

      <!-- 首页 -->
      <li v-if="shouldShowFirstPage" class="page-item" :class="{ active: modelValue === 1 }">
        <button class="page-link" @click="goToPage(1)">1</button>
      </li>

      <!-- 省略号 -->
      <li v-if="shouldShowEllipsisBefore" class="page-item disabled">
        <span class="page-link">...</span>
      </li>

      <!-- 中间页码 -->
      <li
        v-for="page in visiblePages"
        :key="page"
        class="page-item"
        :class="{ active: modelValue === page }"
      >
        <button class="page-link" @click="goToPage(page)">
          {{ page }}
        </button>
      </li>

      <!-- 省略号 -->
      <li v-if="shouldShowEllipsisAfter" class="page-item disabled">
        <span class="page-link">...</span>
      </li>

      <!-- 末页 -->
      <li v-if="shouldShowLastPage" class="page-item" :class="{ active: modelValue === totalPages }">
        <button class="page-link" @click="goToPage(totalPages)">
          {{ totalPages }}
        </button>
      </li>

      <!-- 下一页 -->
      <li class="page-item" :class="{ disabled: modelValue === totalPages }">
        <button class="page-link" @click="goToPage(modelValue + 1)">
          {{ i18n.t('pagination.next') }} ›
        </button>
      </li>

      <!-- 跳页输入 -->
      <li class="ms-3 d-flex align-items-center gap-1">
        <span class="small text-muted">{{ i18n.t('pagination.jump_to') }}</span>
        <input
          type="number"
          v-model.number="inputPage"
          min="1"
          :max="totalPages"
          class="form-control form-control-sm text-center"
          style="width: 60px"
          @keyup.enter="goToPage(inputPage)"
        />
        <span class="small">{{ i18n.t('pagination.page') }}</span>
        <button class="btn btn-sm theme-btn ms-1" @click="goToPage(inputPage)">
          {{ i18n.t('pagination.go') }}
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()// 使用 vue-i18n

const props = defineProps({
  modelValue: { type: Number, default: 1 },        // 当前页
  totalPages: { type: Number, default: 1 },        // 总页数
  totalItems: { type: Number, default: 0 },        // 总条数
  visiblePages: { type: Number, default: 5 },      // 中间可见页码数量
})
const emit = defineEmits(['update:modelValue', 'page-change'])

const inputPage = ref(props.modelValue)

// 自适应中间可见页码数量
const getVisiblePageCount = () => (window.innerWidth < 576 ? 3 : props.visiblePages)

// 中间页码计算
const visiblePages = computed(() => {
  const pages = []
  const half = Math.floor(getVisiblePageCount() / 2)
  let start = Math.max(1, props.modelValue - half)
  let end = start + getVisiblePageCount() - 1

  if (end > props.totalPages) {
    end = props.totalPages
    start = Math.max(1, end - getVisiblePageCount() + 1)
  }

  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

// 省略号显示逻辑
const shouldShowFirstPage = computed(() => visiblePages.value[0] > 1)
const shouldShowLastPage = computed(() => visiblePages.value.at(-1) < props.totalPages)
const shouldShowEllipsisBefore = computed(() => visiblePages.value[0] > 2)
const shouldShowEllipsisAfter = computed(() => visiblePages.value.at(-1) < props.totalPages - 1)

// 跳转页函数
const goToPage = (page) => {
  if (page < 1 || page > props.totalPages || page === props.modelValue) return
  emit('update:modelValue', page)
  emit('page-change', page)
  inputPage.value = page
}

// 同步输入框
watch(() => props.modelValue, val => {
  inputPage.value = val
})
</script>

<style lang="scss" scoped>
@use '@/assets/css/global.scss' as *;

.page-link {
  color: $mainColor;
  font-size: 0.875rem;
  border-radius: 4px;
  min-width: 32px;
  text-align: center;
  transition: all 0.2s;
}
.page-item.active .page-link {
  background-color: $mainColor;
  border-color: $mainColor;
  color: white;
}
.page-item.disabled .page-link {
  opacity: 0.5;
  pointer-events: none;
}
.page-info {
  user-select: none;
}

/* 小屏优化 */
@media (max-width: 575.98px) {
  .page-link {
    min-width: 28px;
    font-size: 0.75rem;
  }
  .page-info {
    font-size: 0.7rem;
  }
}
</style>
