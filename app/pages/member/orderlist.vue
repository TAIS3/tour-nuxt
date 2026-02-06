<template>
  <div class="order-page py-5">
    <div class="container">
      <h3 class="fw-bold mb-4">{{ t('order.title') || 'My Orders' }}</h3>
      
      <!-- Tabs -->
      <ul class="nav nav-pills mb-4 gap-2">
        <li class="nav-item" v-for="tab in tabs" :key="tab.value">
          <a 
            class="nav-link cursor-pointer rounded-pill px-4" 
            :class="{ active: currentTab === tab.value, 'bg-white text-dark border': currentTab !== tab.value }"
            @click="handleTabChange(tab.value)"
          >
            {{ tab.label }}
          </a>
        </li>
      </ul>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-theme" role="status"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!orders.length" class="text-center py-5 bg-white rounded shadow-sm">
        <i class="bi bi-inbox display-1 text-muted opacity-25"></i>
        <p class="mt-3 text-muted">{{ t('order.noOrders') || 'No orders found' }}</p>
        <NuxtLink :to="localePath('/')" class="btn btn-theme mt-2 rounded-pill px-4">
          {{ t('commonConfig.home') || 'Go Shopping' }}
        </NuxtLink>
      </div>

      <!-- Order List -->
      <div v-else class="row">
        <div class="col-12 mb-3" v-for="order in orders" :key="order.id">
          <div class="card shadow-sm border-0 overflow-hidden">
            <div class="card-header bg-white d-flex justify-content-between align-items-center py-3 border-bottom-0">
              <div>
                <span class="fw-bold me-3 text-dark">{{ t('order.orderNo') }}: {{ order.order_no }}</span>
                <span class="text-muted small"><i class="bi bi-clock me-1"></i>{{ order.createtime }}</span>
              </div>
              <span class="badge rounded-pill px-3 py-2" :class="getStatusClass(order.status)">
                {{ getStatusText(order.status) }}
              </span>
            </div>
            <div class="card-body bg-light bg-opacity-10">
              <!-- Mock Items Loop -->
              <div class="d-flex align-items-center mb-3 bg-white p-3 rounded border" v-for="(item, idx) in order.items || []" :key="idx">
                <div class="flex-shrink-0 bg-light rounded d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
                   <i class="bi bi-image text-muted"></i>
                </div>
                <div class="ms-3 flex-grow-1">
                  <h6 class="mb-1 text-dark">{{ item.title || 'Product Name' }}</h6>
                  <p class="mb-0 text-muted small">x {{ item.quantity || 1 }}</p>
                </div>
                <div class="fw-bold text-dark">
                  ${{ item.price }}
                </div>
              </div>
              
              <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                <div class="fw-bold fs-5">
                  {{ t('order.total') }}: <span class="theme-text">${{ order.amount }}</span>
                </div>
                <div>
                  <button v-if="order.status === '0'" class="btn btn-theme btn-sm rounded-pill px-4 fw-bold">
                    {{ t('order.pay') || 'Pay Now' }}
                  </button>
                  <button class="btn btn-outline-secondary btn-sm rounded-pill px-4 ms-2">
                    {{ t('order.view') || 'Details' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const localePath = useLocalePath()
const { getOrderList } = useApi() // 假设您有这个 API

const currentTab = ref('all')
const loading = ref(false)
const orders = ref([])

const tabs = computed(() => [
  { label: t('order.tabAll') || 'All Orders', value: 'all' },
  { label: t('order.tabUnpaid') || 'Unpaid', value: 'unpaid' },
  { label: t('order.tabPaid') || 'Paid', value: 'paid' },
  { label: t('order.tabCompleted') || 'Completed', value: 'completed' }
])

const fetchOrders = async () => {
  loading.value = true
  try {
    // 模拟数据，实际请替换为 await getOrderList({ status: currentTab.value })
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock Data
    const mockData = [
      { id: 1, order_no: 'ORD-20231001-001', createtime: '2023-10-01 12:00', status: '0', amount: '120.00', items: [{ title: 'Amazing Tour Package', price: '120.00' }] },
      { id: 2, order_no: 'ORD-20230928-042', createtime: '2023-09-28 09:30', status: '1', amount: '350.50', items: [{ title: 'City Scenery Ticket', price: '350.50' }] },
      { id: 3, order_no: 'ORD-20230815-112', createtime: '2023-08-15 14:20', status: '2', amount: '99.00', items: [{ title: 'Museum Entry', price: '99.00' }] },
    ]
    
    // 简单的前端过滤模拟
    if (currentTab.value === 'all') orders.value = mockData
    else if (currentTab.value === 'unpaid') orders.value = mockData.filter(o => o.status === '0')
    else if (currentTab.value === 'paid') orders.value = mockData.filter(o => o.status === '1')
    else if (currentTab.value === 'completed') orders.value = mockData.filter(o => o.status === '2')
    
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const handleTabChange = (val) => {
  currentTab.value = val
  fetchOrders()
}

const getStatusText = (status) => {
  const map = {
    '0': t('order.statusUnpaid') || 'Unpaid',
    '1': t('order.statusPaid') || 'Paid',
    '2': t('order.statusCompleted') || 'Completed'
  }
  return map[status] || status
}

const getStatusClass = (status) => {
  const map = {
    '0': 'bg-warning text-dark',
    '1': 'bg-success text-white',
    '2': 'bg-secondary text-white'
  }
  return map[status] || 'bg-light text-dark'
}

onMounted(() => {
  fetchOrders()
})
</script>

<style lang="scss" scoped>
@use "sass:color";
$theme-color: $mainColor;

.order-page {
  background-color: #f5f7fa;
  min-height: 80vh;
}

.nav-pills .nav-link.active {
  background-color: $theme-color;
}

.theme-text { color: $theme-color; }
.cursor-pointer { cursor: pointer; }
</style>