<template>
  <div class="order-page member-page">
    <div class="container py-4">
      <h3 class="fw-bold mb-4">{{ t('member.orderTitle') || 'My Orders' }}</h3>
      
      <div class="d-flex justify-content-center mb-4">
        <ul class="nav nav-pills pills-type gap-2">
          <li class="nav-item" v-for="tab in orderTypeTabs" :key="tab.value">
            <a 
              class="nav-link cursor-pointer rounded-pill px-4" 
              :class="{ active: orderTypeTab === tab.value }"
              @click="handleTypeTabChange(tab.value)"
            >
              {{ tab.label }}
            </a>
          </li>
        </ul>
      </div>

      <ul class="nav nav-pills mb-4 gap-2">
        <li class="nav-item" v-for="tab in statusTabs" :key="tab.value">
          <a 
            class="nav-link cursor-pointer rounded-pill px-4" 
            :class="{ active: statusTab === tab.value, 'bg-white text-dark border': statusTab !== tab.value }"
            @click="handleStatusTabChange(tab.value)"
          >
            {{ tab.label }}
          </a>
        </li>
      </ul>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-theme" role="status"></div>
        <p class="mt-2 text-muted">{{ t('member.orderLoading') || 'Loading...' }}</p>
      </div>

      <div v-else-if="!orders.length" class="text-center py-5 bg-white rounded shadow-sm">
        <i class="bi bi-inbox display-1 text-muted opacity-25"></i>
        <p class="mt-3 text-muted">{{ t('member.orderNoOrders') || 'No orders found' }}</p>
        <NuxtLink :to="localePath('/')" class="btn btn-theme mt-2 rounded-pill px-4">
          {{ t('commonConfig.home') || 'Go Shopping' }}
        </NuxtLink>
      </div>

      <div v-else class="row">
        <div class="col-12 mb-4" v-for="order in orders" :key="order.id">
          <div class="card shadow-sm border-0 overflow-hidden">
            
            <div class="card-header bg-white d-flex justify-content-between align-items-center py-3 border-bottom-0">
              <div>
                <span class="fw-bold me-3 text-dark">{{ t('member.orderNumber') || 'Order No' }}: {{ order.order_no }}</span>
                <span class="text-muted small"><i class="bi bi-clock me-1"></i>{{ order.createtime_text || formatDate(order.createtime) }}</span>
              </div>
              
              <div class="d-flex align-items-center gap-2">
                <span v-if="order.state" class="text-muted small fw-bold me-1">[{{ getStateName(order.state) }}]</span>
                <span class="badge rounded-pill px-3 py-2" :class="getStatusClass(order.pay_status, order.order_status)">
                  {{ getStatusText(order.pay_status, order.order_status) }}
                </span>
              </div>
            </div>
            
            <div class="card-body bg-light bg-opacity-10 pt-2">
              <div v-if="order.order_project && order.order_project.length > 0" class="d-flex align-items-start mb-2">
                <img 
                  v-if="order.order_project[0].thumb_image" 
                  :src="order.order_project[0].thumb_image" 
                  class="rounded me-3 shadow-sm" 
                  style="width: 80px; height: 80px; object-fit: cover;" 
                />
                <div v-else class="rounded me-3 bg-secondary bg-opacity-25 d-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
                  <i class="bi bi-image text-muted fs-3"></i>
                </div>
                
                <div class="flex-grow-1">
                  <h6 class="mb-1 fw-bold text-dark">
                    {{ order.order_project[0].scenery_name || order.order_project[0].project_name || 'Product Item' }}
                  </h6>
                  
                  <div class="text-muted small d-flex flex-wrap gap-3 mt-2">
                    <span>
                      <i class="bi bi-tag"></i> {{ t('member.unitPrice') || 'Unit Price' }}: ${{ order.order_project[0].project_price || '0.00' }}
                    </span>
                    <span>
                      <i class="bi bi-layers"></i> {{ t('member.quantity') || 'QTY' }}: {{ order.total_count }}
                    </span>
                    <span v-if="order.pay_status != 0 && order.pay_type">
                      <i class="bi bi-credit-card"></i> {{ getPayTypeName(order.pay_type) }}
                    </span>
                  </div>
                  
                  <div v-if="order.pay_status == 0 && order.expiretime_text" class="text-danger small mt-2 fw-bold">
                    <i class="bi bi-exclamation-triangle"></i> {{ t('member.expiresAt') || 'Expires at' }}: {{ order.expiretime_text }}
                  </div>
                </div>
              </div>
              
              <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                <div class="fw-bold fs-5">
                  {{ t('member.totalAmount') || 'Total' }}: <span class="theme-text">${{ order.pay_price }}</span>
                </div>
                <div>
                  <button v-if="order.pay_status == 0" @click="handlePay(order)" class="btn btn-theme btn-sm rounded-pill px-4 fw-bold shadow-sm">
                    {{ t('member.payNow') || 'Pay Now' }}
                  </button>
                  <button @click="handleViewDetails(order)" class="btn btn-outline-secondary btn-sm rounded-pill px-4 ms-2">
                    {{ t('member.viewDetails') || 'Details' }}
                  </button>
                  <button v-if="order.pay_status == 1 && order.order_status == 1" @click="handleRefund(order)" class="btn btn-outline-danger btn-sm rounded-pill px-4 ms-2">
                     {{ t('member.applyRefund') || 'Refund' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="totalPages > 1" class="d-flex justify-content-center mt-4">
        <Pagination
          v-model="page"
          :total-pages="totalPages"
          :total-items="total"
          @page-change="handlePageChange"
        />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import swal from 'sweetalert';

const { t } = useI18n();
const localePath = useLocalePath();
const router = useRouter();
const route = useRoute(); // 【新增】引入 route 以获取 URL 参数
const { getOrderList, applyRefund } = useApi();
const { getStateName, getPayTypeName, formatDate } = useFormatter();

const orderTypeTab = ref('tour_order'); 
const statusTab = ref('all'); 
const loading = ref(true);
const orders = ref([]);

const page = ref(1);
const limit = ref(10);
const total = ref(0);

// 【新增】计算总页数
const totalPages = computed(() => Math.ceil(total.value / limit.value));

const orderTypeTabs = computed(() => [
  { label: t('member.tourOrders') || 'Tour Orders', value: 'tour_order' },
  { label: t('member.sceneryOrders') || 'Scenery Orders', value: 'scenery_order' }
]);

const statusTabs = computed(() => [
  { label: t('member.orderTabAll') || 'All', value: 'all' },
  { label: t('member.orderTabUnpaid') || 'Unpaid', value: 'unpaid' },
  { label: t('member.orderTabPaid') || 'Paid', value: 'paid' },
  { label: t('member.orderTabCompleted') || 'Completed', value: 'completed' },
  { label: t('member.orderTabRefunded') || 'Refunded', value: 'refunded' }
]);

const getStateValue = (tabString) => {
  switch(tabString) {
    case 'unpaid': return 0;   
    case 'paid': return 1;     
    case 'completed': return 2; 
    case 'refunded': return 3;  
    default: return 999;       
  }
};

const fetchOrders = async () => {
  loading.value = true;
  orders.value = [];
  try {
    const { data: response, error } = await getOrderList({
      type: orderTypeTab.value,
      state: getStateValue(statusTab.value),
      page: page.value, 
      limit: limit.value 
    });
    
    if (error.value || response.value.code !== 1) {
      throw new Error(error.value?.data?.message || response.value?.msg || 'Failed to fetch orders.');
    }
    
    orders.value = response.value.data.data || [];
    total.value = response.value.data.total || 0;

  } catch (e) {
    console.error("Fetch orders failed:", e);
  } finally {
    loading.value = false;
  }
};

const getStatusText = (payStatus, orderStatus) => {
  const pStatus = Number(payStatus);
  const oStatus = Number(orderStatus);
  
  if (oStatus === 3 || oStatus === -1) return t('member.statusRefunded') || 'Refunded/Cancelled';
  if (oStatus === 2) return t('member.statusCompleted') || 'Completed';
  if (pStatus === 1) return t('member.statusPaid') || 'Paid';
  if (pStatus === 0) return t('member.statusUnpaid') || 'Unpaid';
  return 'Unknown';
};

const getStatusClass = (payStatus, orderStatus) => {
  const pStatus = Number(payStatus);
  const oStatus = Number(orderStatus);
  
  if (oStatus === 3 || oStatus === -1) return 'bg-secondary text-white';
  if (oStatus === 2) return 'bg-info text-white';
  if (pStatus === 1) return 'bg-success text-white';
  return 'bg-warning text-dark';
};

const handleTypeTabChange = (val) => {
  orderTypeTab.value = val;
  page.value = 1; 
  fetchOrders();
};

const handleStatusTabChange = (val) => {
  statusTab.value = val;
  page.value = 1;
  fetchOrders();
};

// 【新增】处理分页跳转事件
const handlePageChange = (newPage) => {
  page.value = newPage;
  // 翻页后自动滚回顶部
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  fetchOrders();
};

const handlePay = (order) => {
  router.push(localePath({
    path: '/member/pay',
    query: { order_id: order.order_no, type: orderTypeTab.value }
  }));
};

const handleViewDetails = (order) => {
  // 注意这里：我们将当前的分类 type 传给了详情页
  router.push(localePath({
    path: `/orderdetail/${order.id}`,
    query: { type: orderTypeTab.value }
  }));
};

const handleRefund = (order) => {
  swal({
    title: t('member.refundConfirmTitle') || "Are you sure?",
    text: t('member.refundConfirmText', { orderNo: order.order_no }) || `Apply for a refund for order ${order.order_no}?`,
    icon: "warning",
    buttons: {
      cancel: t('commonConfig.cancel') || "Cancel",
      confirm: {
        text: t('commonConfig.confirm') || "Confirm",
        value: true,
        closeModal: false,
      },
    },
    dangerMode: true,
  }).then(async (willProceed) => {
    if (willProceed) {
      if(!applyRefund) {
         swal("提示", "退款接口暂未接入", "info");
         return;
      }
      try {
        const { data: response, error } = await applyRefund({
          order_id: order.order_no,
          type: orderTypeTab.value 
        });

        if (error.value || response.value.code !== 1) {
          throw new Error(error.value?.data?.message || response.value?.msg || 'Refund application failed.');
        }

        swal(t('member.refundSuccessTitle') || 'Success', t('member.refundSuccessMsg') || 'Your refund application has been submitted.', 'success');
        fetchOrders();

      } catch (e) {
        swal(t('common.error') || "Error", e.message, "error");
      }
    }
  });
};

onMounted(() => {
  // 【新增】检查 URL 是否有 type 参数 (用于从详情页返回时选中对应的 Tab)
  if (route.query.type) {
    orderTypeTab.value = route.query.type;
  }
  fetchOrders();
});
</script>

<style lang="scss" scoped>
@use "sass:color";
$theme-color: $mainColor;

.order-page {
  background-color: #f5f7fa;
  min-height: 80vh;
}

.pills-type {
  border: 1px solid $theme-color;
  border-radius: 99px;
  width: fit-content;
  
  .nav-link {
    color: $theme-color;
    border: none;
    font-weight: 500;
    &.active {
      background-color: $theme-color;
      color: white;
    }
  }
}

.nav-pills .nav-link {
  font-weight: 500;
  &.active {
    background-color: $theme-color;
    color: white;
  }
}

.theme-text { color: $theme-color; }
.cursor-pointer { cursor: pointer; }
.btn-theme {
  background-color: $theme-color;
  color: white;
  border: none;
  &:hover {
    background-color: color.adjust($theme-color, $lightness: -10%);
    color: white;
  }
}
</style>