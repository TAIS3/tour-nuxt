<template>
  <div class="cart-page member-page">
    <div class="container">
      <h3 class="fw-bold mb-4">{{ t('member.cartTitle') || 'Shopping Cart' }}</h3>

      <ul class="nav nav-tabs custom-tabs mb-4">
        <li class="nav-item">
          <a class="nav-link" :class="{ active: activeTab === 'tours' }" @click="activeTab = 'tours'">
            <i class="bi bi-geo-alt-fill me-2"></i>
            {{ t('member.tourRoutes') || 'Tour Routes' }}
            <span class="badge rounded-pill bg-danger ms-1" v-if="tourItems.length">{{ tourItems.length }}</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="{ active: activeTab === 'sceneries' }" @click="activeTab = 'sceneries'">
            <i class="bi bi-ticket-fill me-2"></i>
            {{ t('member.sceneryTickets') || 'Scenery Tickets' }}
            <span class="badge rounded-pill bg-danger ms-1" v-if="sceneryItems.length">{{ sceneryItems.length }}</span>
          </a>
        </li>
      </ul>

      <div class="row">
        <div class="col-lg-8">
          <div v-if="activeCartItems.length === 0" class="empty-cart text-center py-5 bg-white rounded shadow-sm">
            <i class="bi bi-cart-x display-1 text-muted opacity-25"></i>
            <p class="mt-3 text-muted">
              {{ activeTab === 'tours' 
                 ? (t('member.cartEmptyTour') || 'No tour routes in your cart.') 
                 : (t('member.cartEmptyScenery') || 'No scenery tickets in your cart.') 
              }}
            </p>
            <NuxtLink :to="localePath(activeTab === 'tours' ? '/tourlist' : '/scenerylist')" class="btn btn-theme mt-2 rounded-pill px-4">
              {{ activeTab === 'tours' ? (t('member.browseTours') || 'Browse Tours') : (t('member.browseSceneries') || 'Browse Sceneries') }}
            </NuxtLink>
          </div>

          <div v-else>
            <div class="bg-white p-3 rounded shadow-sm mb-3 d-flex justify-content-between align-items-center">
              <div class="form-check">
                <input class="form-check-input theme-checkbox" type="checkbox" id="selectAll" 
                       :checked="isAllSelected" @change="toggleSelectAll">
                <label class="form-check-label fw-bold cursor-pointer" for="selectAll">
                  {{ t('member.selectAll') || 'Select All' }}
                </label>
              </div>
            </div>

            <div class="card shadow-sm border-0 mb-3 cart-item-card" v-for="item in activeCartItems" :key="item.id">
              <div class="card-body p-3 p-md-4">
                <div class="d-flex align-items-center">
                  <div class="form-check me-3">
                    <input class="form-check-input theme-checkbox" type="checkbox" v-model="item.selected">
                  </div>
                  
                  <div class="flex-shrink-0 bg-light rounded d-flex align-items-center justify-content-center item-img-box">
                    <i class="bi bi-image text-muted fs-4"></i>
                  </div>
                  
                  <div class="ms-3 flex-grow-1">
                    <h5 class="mb-1 text-dark fw-bold fs-6 fs-md-5">{{ item.title }}</h5>
                    <p class="text-muted small mb-0">{{ item.subtitle || 'Standard Package' }}</p>
                    <div class="text-theme fw-bold mt-1 d-md-none">${{ item.price }}</div> </div>
                  
                  <div class="mx-4 text-end d-none d-md-block" style="min-width: 80px;">
                    <div class="fw-bold text-dark fs-5">${{ item.price }}</div>
                  </div>
                  
                  <div class="d-flex align-items-center border rounded-pill px-2 py-1 me-3 qty-controller">
                    <button class="btn btn-sm btn-link text-dark text-decoration-none p-0" @click="updateQty(item.id, -1)" :disabled="item.quantity <= 1">
                      <i class="bi bi-dash"></i>
                    </button>
                    <span class="mx-3 small fw-bold">{{ item.quantity }}</span>
                    <button class="btn btn-sm btn-link text-dark text-decoration-none p-0" @click="updateQty(item.id, 1)">
                      <i class="bi bi-plus"></i>
                    </button>
                  </div>
                  
                  <button class="btn btn-link text-danger p-0 delete-btn" @click="removeItem(item.id)">
                    <i class="bi bi-trash fs-5"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4" v-if="activeCartItems.length > 0">
          <div class="card shadow-sm border-0 sticky-summary">
            <div class="card-body p-4">
              <h5 class="fw-bold mb-4">{{ t('member.cartSummary') || 'Order Summary' }}</h5>
              
              <div class="d-flex justify-content-between mb-3">
                <span class="text-muted">{{ t('member.selectedItems') || 'Selected Items' }}</span>
                <span class="fw-bold">{{ selectedItemsCount }}</span>
              </div>
              <hr class="text-muted opacity-25">
              <div class="d-flex justify-content-between mb-4 align-items-end">
                <span class="fw-bold fs-5">{{ t('member.cartTotal') || 'Total' }}</span>
                <span class="fw-bold fs-3 text-theme">${{ subtotal.toFixed(2) }}</span>
              </div>

              <button class="btn btn-theme w-100 py-3 rounded-pill fw-bold shadow-sm d-flex justify-content-center align-items-center" 
                      @click="handleCheckout" :disabled="selectedItemsCount === 0 || isProcessing">
                <span v-if="isProcessing" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {{ t('member.checkout') || 'Proceed to Checkout' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import swal from 'sweetalert'
// import { useI18n, useRoute, useRouter } from '#imports'

const { t } = useI18n()
const localePath = useLocalePath()
const api = useApi()

const activeTab = ref('tours') 
const isProcessing = ref(false)

// 模拟数据 
const cartItems = ref([
  { id: 101, type: 'tour', title: 'Grand Canyon Tour', price: 150.00, quantity: 1, selected: true },
  { id: 102, type: 'tour', title: 'City Bus Pass', price: 25.00, quantity: 2, selected: false },
  { id: 201, type: 'scenery', title: 'Eiffel Tower Ticket', price: 55.00, quantity: 2, selected: true },
])

const tourItems = computed(() => cartItems.value.filter(item => item.type === 'tour'))
const sceneryItems = computed(() => cartItems.value.filter(item => item.type === 'scenery'))

const activeCartItems = computed(() => activeTab.value === 'tours' ? tourItems.value : sceneryItems.value)
const selectedActiveItems = computed(() => activeCartItems.value.filter(item => item.selected))

const selectedItemsCount = computed(() => selectedActiveItems.value.reduce((sum, item) => sum + item.quantity, 0))
const subtotal = computed(() => selectedActiveItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0))

const isAllSelected = computed(() => activeCartItems.value.length > 0 && activeCartItems.value.every(item => item.selected))

const toggleSelectAll = (event) => {
  const isChecked = event.target.checked
  activeCartItems.value.forEach(item => item.selected = isChecked)
}

const updateQty = (id, change) => {
  const item = cartItems.value.find(i => i.id === id)
  if (item) {
    const newQty = item.quantity + change
    if (newQty > 0) item.quantity = newQty
  }
}

const removeItem = (id) => {
  swal({
    title: t('commonConfig.confirm') || "Are you sure?",
    text: t('member.confirmRemove') || "Do you want to remove this item?",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) cartItems.value = cartItems.value.filter(i => i.id !== id)
  })
}

// 发起结算 (核心修改区)
const handleCheckout = async () => {
  if (selectedItemsCount.value === 0) return

  isProcessing.value = true
  const isTourOrder = activeTab.value === 'tours'
  
  const orderPayload = {
    items: selectedActiveItems.value.map(item => ({
      id: item.id, quantity: item.quantity, price: item.price
    })),
    total: subtotal.value
  }

  try {
    const apiCall = isTourOrder ? api.createTourOrder : api.createSceneryOrder
    const { data: orderResult, error } = await apiCall(orderPayload)

    if (error.value || !orderResult.value || orderResult.value.code !== 1) {
      throw new Error(orderResult.value?.msg || error.value?.data?.message || (t('member.checkoutError') || 'Unable to create order. Please try again.'))
    }

    const order_id = orderResult.value.data.orderId // 假设后端建单返回的依然是 orderId
    
    const idsToRemove = new Set(selectedActiveItems.value.map(item => item.id))
    cartItems.value = cartItems.value.filter(item => !idsToRemove.has(item.id))

    // 核心修改：对齐统一支付网关的参数名
    await navigateTo(localePath({
      path: '/member/pay',
      query: { 
        order_id: order_id, 
        type: isTourOrder ? 'tour_order' : 'scenery_order' // 改为了下划线全称
      }
    }))
    
  } catch (err) {
    swal({ title: t('commonConfig.error') || 'Error', text: err.message, icon: 'error' })
  } finally {
    isProcessing.value = false
  }
}
</script><style lang="scss">
@use "sass:color";
:root {
  --theme-color: #{$mainColor}; /* 替换为你的 $mainColor */
  --theme-color-disabled: #{$disabledColor}; /* 替换为你的 $disabledColor */
}

.cart-page {
  background-color: #f8f9fa;
  min-height: calc(100vh - 200px);


  .text-theme {
    color: var(--theme-color, #0d6efd);
  }

  .btn-theme {
    background-color: var(--theme-color, #0d6efd);
    border-color: var(--theme-color, #0d6efd);
    color: #fff;
    transition: all 0.3s ease;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      color: #fff;
    }
    
    &:disabled {
      background-color: var(--theme-color-disabled, #9d9d9d);
      border-color: var(--theme-color-disabled, #9d9d9d);
      cursor: not-allowed;
    }
  }
}
.custom-tabs {
  border-bottom: 2px solid #e9ecef;
  
  .nav-item {
    margin-bottom: -2px;
    cursor: pointer;
  }
  
  .nav-link {
    border: none;
    color: #6c757d;
    font-weight: 600;
    padding: 1rem 1.5rem;
    position: relative;
    transition: color 0.3s;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background-color: transparent;
      transition: background-color 0.3s;
    }

    &.active, &:hover {
      color: var(--theme-color, #0d6efd);
    }
    
    &.active::after {
      background-color: var(--theme-color, #0d6efd);
      border-radius: 3px 3px 0 0;
    }
  }
}

.theme-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  
  &:checked {
    background-color: var(--theme-color, #0d6efd);
    border-color: var(--theme-color, #0d6efd);
  }
}

.cart-item-card {
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 .5rem 1rem rgba(0,0,0,.08)!important;
  }
}

.item-img-box {
  width: 70px; 
  height: 70px;
  
  @media (min-width: 768px) {
    width: 90px; 
    height: 90px;
  }
}

.qty-controller {
  background-color: #f8f9fa;
  
  button {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:disabled i {
      color: var(--theme-color-disabled, #9d9d9d);
    }
  }
}

.delete-btn {
  transition: color 0.2s;
  &:hover {
    color: #dc3545 !important;
  }
}

.sticky-summary {
  position: sticky;
  top: 100px;
  z-index: 10;
}

.cursor-pointer {
  cursor: pointer;
}
</style>