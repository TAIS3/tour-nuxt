<template>
  <div class="cart-page py-5">
    <div class="container">
      <h3 class="fw-bold mb-4">{{ t('cart.title') || 'Shopping Cart' }}</h3>

      <div class="row">
        <!-- Cart Items -->
        <div class="col-lg-8">
          <div v-if="cartItems.length === 0" class="text-center py-5 bg-white rounded shadow-sm">
            <i class="bi bi-cart-x display-1 text-muted opacity-25"></i>
            <p class="mt-3 text-muted">{{ t('cart.empty') || 'Your cart is empty' }}</p>
            <NuxtLink :to="localePath('/')" class="btn btn-theme mt-2 rounded-pill px-4">
              {{ t('commonConfig.home') || 'Go Shopping' }}
            </NuxtLink>
          </div>

          <div v-else class="card shadow-sm border-0 mb-4" v-for="(item, index) in cartItems" :key="item.id">
            <div class="card-body p-4">
              <div class="d-flex align-items-center">
                <!-- Image -->
                <div class="flex-shrink-0 bg-light rounded d-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
                   <i class="bi bi-image text-muted fs-4"></i>
                </div>
                
                <!-- Info -->
                <div class="ms-4 flex-grow-1">
                  <h5 class="mb-1 text-dark fw-bold">{{ item.title }}</h5>
                  <p class="text-muted small mb-0">{{ item.subtitle || 'Standard Package' }}</p>
                </div>

                <!-- Price -->
                <div class="me-4 text-end d-none d-md-block">
                  <div class="fw-bold text-dark">${{ item.price }}</div>
                </div>

                <!-- Quantity -->
                <div class="d-flex align-items-center border rounded-pill px-2 py-1 me-4">
                  <button class="btn btn-sm btn-link text-dark text-decoration-none p-0" @click="updateQty(index, -1)">
                    <i class="bi bi-dash"></i>
                  </button>
                  <span class="mx-3 small fw-bold">{{ item.quantity }}</span>
                  <button class="btn btn-sm btn-link text-dark text-decoration-none p-0" @click="updateQty(index, 1)">
                    <i class="bi bi-plus"></i>
                  </button>
                </div>

                <!-- Remove -->
                <button class="btn btn-link text-danger p-0" @click="removeItem(index)">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="col-lg-4" v-if="cartItems.length > 0">
          <div class="card shadow-sm border-0 sticky-top" style="top: 100px; z-index: 1;">
            <div class="card-body p-4">
              <h5 class="fw-bold mb-4">{{ t('cart.summary') || 'Order Summary' }}</h5>
              
              <div class="d-flex justify-content-between mb-3">
                <span class="text-muted">{{ t('cart.subtotal') || 'Subtotal' }}</span>
                <span class="fw-bold">${{ subtotal.toFixed(2) }}</span>
              </div>
              <hr>
              <div class="d-flex justify-content-between mb-4">
                <span class="fw-bold fs-5">{{ t('cart.total') || 'Total' }}</span>
                <span class="fw-bold fs-5 theme-text">${{ subtotal.toFixed(2) }}</span>
              </div>

              <button class="btn btn-theme w-100 py-3 rounded-pill fw-bold shadow-sm" @click="handleCheckout">
                {{ t('cart.checkout') || 'Proceed to Checkout' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import swal from 'sweetalert'

const { t } = useI18n()
const localePath = useLocalePath()

// Mock Data
const cartItems = ref([
  { id: 101, title: 'Grand Canyon Tour', price: 150.00, quantity: 1 },
  { id: 102, title: 'City Bus Pass', price: 25.00, quantity: 2 }
])

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const updateQty = (index, change) => {
  const newQty = cartItems.value[index].quantity + change
  if (newQty > 0) {
    cartItems.value[index].quantity = newQty
  }
}

const removeItem = (index) => {
  swal({
    title: t('commonConfig.confirm') || "Are you sure?",
    text: t('cart.confirmRemove') || "Do you want to remove this item?",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
      cartItems.value.splice(index, 1)
    }
  });
}

const handleCheckout = () => {
  swal(t('cart.checkoutSuccess') || 'Proceeding to payment...', { icon: 'success' })
  // router.push(localePath('/checkout'))
}
</script>

<style lang="scss" scoped>
@use "sass:color";
$theme-color: $mainColor;

.cart-page {
  background-color: #f5f7fa;
  min-height: 80vh;
}

.btn-theme {
  background-color: $theme-color;
  border-color: $theme-color;
  color: #fff;
  transition: opacity 0.3s;
  
  &:hover {
    opacity: 0.9;
    color: #fff;
  }
}

.theme-text {
  color: $theme-color;
}
</style>