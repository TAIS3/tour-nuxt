<template>
  <div class="order-page member-page">
    <div class="py-4 text-center mb-4">
      <h2 class="fw-bold">{{ t('member.orderDetailTitle') || 'Order Details' }}</h2>
    </div>

    <div class="container pb-5">
      
      <div class="mb-4">
        <NuxtLink :to="localePath({ path: '/member/orderlist', query: { type: orderType } })" class="btn btn-outline-secondary btn-sm shadow-sm">
          <i class="bi bi-arrow-left me-1"></i> {{ t('member.backToOrders') || 'Back to Orders' }}
        </NuxtLink>
      </div>

      <div v-if="pending" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2 text-muted">{{ t('member.orderLoading') || 'Loading order details...' }}</p>
      </div>
      
      <div v-else-if="error || !order" class="text-center py-5">
        <i class="bi bi-exclamation-circle display-1 text-muted opacity-25"></i>
        <h4 class="mt-3 text-muted">{{ t('member.orderNotFound') || 'Order not found' }}</h4>
        <p class="text-danger">{{ error }}</p>
      </div>
      
      <div v-else>
        <div class="card shadow-sm border-0">
          <div class="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
            <h5 class="mb-0 fw-bold">{{ t('member.orderInfo') || 'Order Information' }}</h5>
            <span class="badge" :class="order.pay_status == 1 ? 'bg-success' : 'bg-warning text-dark'">
              {{ order.pay_status == 1 ? (t('member.statusPaid') || 'Paid') : (t('member.statusUnpaid') || 'Unpaid') }}
            </span>
          </div>
          <div class="card-body p-4">
            <div class="row mb-4">
              <div class="col-sm-6 mb-3 mb-sm-0">
                <p class="text-muted mb-1 small">{{ t('member.orderNumber') || 'Order Number' }}</p>
                <p class="fw-bold mb-0">{{ order.order_no }}</p>
              </div>
              <div class="col-sm-6">
                <p class="text-muted mb-1 small">{{ t('member.totalAmount') || 'Total Amount' }}</p>
                <p class="fw-bold fs-5 text-primary mb-0">${{ order.pay_price }}</p>
              </div>
            </div>

            <div class="row mb-4" v-if="order.pay_type">
              <div class="col-sm-6 mb-3 mb-sm-0">
                <p class="text-muted mb-1 small">{{ t('member.payMethod') || 'Payment Method' }}</p>
                <p class="fw-bold mb-0 text-capitalize">{{ getPayTypeName(order.pay_type) }}</p>
              </div>
            </div>

            <div class="bg-light p-3 rounded mb-4 shadow-sm">
              <div class="row mb-2" v-if="order.createtime">
                <div class="col-5 text-muted small">{{ t('member.orderDate') || 'Order Date' }}</div>
                <div class="col-7 fw-bold small text-end">{{ formatDate(order.createtime) }}</div>
              </div>
              <div class="row mb-2" v-if="order.paytime">
                <div class="col-5 text-muted small">{{ t('member.payDate') || 'Pay Date' }}</div>
                <div class="col-7 fw-bold small text-end">{{ formatDate(order.paytime) }}</div>
              </div>
              <template v-if="order.refundtime && !order.completetime">
                <div class="row mb-0">
                  <div class="col-5 text-muted small">{{ t('member.refundDate') || 'Refund Date' }}</div>
                  <div class="col-7 fw-bold small text-end">{{ formatDate(order.refundtime) }}</div>
                </div>
              </template>
              <template v-else-if="order.completetime && !order.refundtime">
                <div class="row mb-0">
                  <div class="col-5 text-muted small">{{ t('member.completeDate') || 'Complete Date' }}</div>
                  <div class="col-7 fw-bold small text-end">{{ formatDate(order.completetime) }}</div>
                </div>
              </template>
            </div>

            <div class="row mb-4">
              <div class="col-sm-6 mb-3 mb-sm-0">
                <p class="text-muted mb-1 small">{{ t('member.payMethod') || 'Payment Method' }}</p>
                <p class="fw-bold mb-0 text-capitalize">{{ getPayTypeName(order.pay_type) }}</p>
              </div>
              <div class="col-sm-6">
                <p class="text-muted mb-1 small">{{ t('member.totalAmount') || 'Total Amount' }}</p>
                <p class="fw-bold fs-5 text-primary mb-0">${{ order.pay_price }}</p>
              </div>
            </div>

            <hr class="text-muted opacity-25">

            <h6 class="fw-bold mt-4 mb-3">{{ t('member.sceneryInfo') || 'Attraction Info' }}</h6>
            <div v-if="order.order_project" class="d-flex align-items-center mb-4 p-3 bg-light rounded shadow-sm">
              <NuxtLink :to="localePath('/sceneryarticle/' + order.order_project.scenery_id)" class="me-3 flex-shrink-0">
                <img :src="order.order_project.thumb_image" alt="scenery image" class="rounded" style="width: 80px; height: 80px; object-fit: cover;">
              </NuxtLink>
              <div>
                <NuxtLink :to="localePath('/sceneryarticle/' + order.order_project.scenery_id)" class="text-decoration-none text-dark fw-bold d-block mb-1 fs-5">
                  {{ order.order_project.scenery_name }}
                </NuxtLink>
                <span class="badge bg-info text-dark mb-1">{{ order.order_project.project_name }}</span>
              </div>
            </div>

            <div v-if="order.order_qrcode && order.order_qrcode.length > 0">
              <h6 class="fw-bold mt-4 mb-3">{{ t('member.verificationCodes') || 'Verification Codes' }}</h6>
              <div class="list-group mb-4 shadow-sm">
                <div v-for="(item, index) in order.order_qrcode" :key="index" class="list-group-item d-flex justify-content-between align-items-center py-3">
                  <span class="fs-5 font-monospace fw-bold text-primary" style="letter-spacing: 2px;">
                    {{ formatCode(item.code) }}
                  </span>
                  <span class="badge rounded-pill px-3 py-2" :class="getCodeStatusClass(item.verifier_status)">
                    {{ getCodeStatusText(item.verifier_status) }}
                  </span>
                </div>
              </div>
            </div>

            <hr class="text-muted opacity-25">

            <!-- <h6 class="fw-bold mt-4 mb-3">{{ t('member.customerInfo') || 'Customer Information' }}</h6>
            <p class="card-text mb-1"><strong>{{ t('member.customerName') || 'Name' }}:</strong> {{ order.contact_name || order.name || 'N/A' }}</p>
            <p class="card-text mb-1"><strong>{{ t('member.customerPhone') || 'Phone' }}:</strong> {{ order.contact_mobile || order.mobile || 'N/A' }}</p> -->
          </div>
          
          <div class="card-footer bg-light d-flex justify-content-between align-items-center py-3">
            <div class="text-muted" v-if="order.pay_status == 1">
              <i class="bi bi-check-circle-fill text-success me-2"></i> {{ t('member.thankYouPurchase') || 'Thank you for your purchase!' }}
            </div>
            <div v-else></div>
            
            <button 
              v-if="order.pay_status == 1 && order.order_status == 1 && (order.refund_status == 0 || order.refund_status == 3)" 
              @click="handleRefund" 
              class="btn btn-outline-danger btn-sm rounded-pill px-4 shadow-sm"
            >
              {{ t('member.applyRefund') || 'Refund' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import swal from 'sweetalert'; // 确保引入了 swal
const { getStateName, getPayTypeName, formatDate } = useFormatter();

// 引入国际化和路由工具
const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const router = useRouter(); // 预留，部分情况可能用到
const api = useApi();

const orderId = route.params.id;
// 接收列表页传过来的 type，如果没有则默认 tour_order
const orderType = route.query.type || 'tour_order'; 

const pending = ref(true);
const order = ref(null);
const error = ref(null);

// 格式化 10 位核验码 (1234-567890)
const formatCode = (code) => {
  if (!code) return '';
  const str = String(code);
  if (str.length > 4) {
    return str.slice(0, 4) + '-' + str.slice(4);
  }
  return str;
};

// --- 修改点 2 配套函数：核验码状态与样式 ---
const getCodeStatusClass = (status) => {
  const s = Number(status);
  if (s === 2) return 'bg-dark text-white opacity-75'; // 2 = 已作废
  if (s === 1) return 'bg-secondary';                  // 1 = 已核销/已使用
  return 'bg-success';                                 // 0 = 未使用
};

const getCodeStatusText = (status) => {
  const s = Number(status);
  if (s === 2) return t('member.statusVoided') || 'Voided'; // 使用我们新加的多语言 Key
  if (s === 1) return t('member.codeStatusUsed') || 'Used';
  return t('member.codeStatusUnused') || 'Unused';
};
// ------------------------------------------

// 退款逻辑
const handleRefund = () => {
  swal({
    title: t('member.refundConfirmTitle') || "Are you sure?",
    text: t('member.refundConfirmText', { orderNo: order.value.order_no }) || `Apply for a refund for order ${order.value.order_no}?`,
    icon: "warning",
    buttons: {
      cancel: t('common.cancel') || "Cancel",
      confirm: {
        text: t('common.confirm') || "Confirm",
        value: true,
        closeModal: false,
      },
    },
    dangerMode: true,
  }).then(async (willProceed) => {
    if (willProceed) {
      try {
        // 修改点 3：这里必须使用 api.applyRefund，否则会报 ReferenceError
        const { data: response, error } = await api.applyRefund({
          order_id: order.value.order_no, 
          type: orderType 
        });

        if (error.value || response.value.code !== 1) {
          throw new Error(error.value?.data?.message || response.value?.msg || 'Refund application failed.');
        }

        swal(t('member.refundSuccessTitle') || 'Success', t('member.refundSuccessMsg') || 'Your refund application has been submitted.', 'success');
        
        pending.value = true;
        const { data: refreshRes } = await api.getOrderDetail({ order_id: parseFloat(orderId), type: orderType });
        if(refreshRes.value.code === 1) order.value = refreshRes.value.data;
        pending.value = false;

      } catch (e) {
        swal(t('common.error') || "Error", e.message, "error");
      }
    }
  });
};

onMounted(async () => {
  try {
    const { data: response, error: apiErr } = await api.getOrderDetail({
      order_id: parseFloat(orderId),
      type: orderType
    });

    if (apiErr.value || response.value.code !== 1) {
      throw new Error(response.value?.msg || t('member.errorLoadOrder') || 'Failed to load order details.');
    }

    order.value = response.value.data;

  } catch (err) {
    console.error("Fetch order detail error:", err);
    error.value = err.message;
  } finally {
    pending.value = false;
  }
});
</script>