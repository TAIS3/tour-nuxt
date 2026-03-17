<template>
  <div class="payment-section container py-5">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card shadow">
          <div class="card-body p-4 text-center">
            <h3 class="card-title fw-bold mb-3">{{ t('member.paytitle') || 'Complete Your Payment' }}</h3>
            <p class="text-muted mb-4" v-if="orderId">
              {{ t('member.payorderNumber') || 'Order Number' }}: {{ orderId }}
            </p>

            <!-- Loading Spinner -->
            <div v-if="loading" class="d-flex justify-content-center my-4">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="ms-2 mb-0">{{ t('member.payloading') || 'Loading Payment Gateway...' }}</p>
            </div>

            <!-- PayPal Button Container -->
            <div v-show="!loading" id="paypal-button-container"></div>
            
            <!-- Error Message -->
            <div v-if="error" class="alert alert-danger mt-3">
              {{ error }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount, computed } from 'vue';
import swal from 'sweetalert';

// --- 配置你的 PayPal Sandbox / Live Client ID ---
const PAYPAL_CLIENT_ID = "ATAhdZ6LUCDh6MWBv-elnv4ZfEsNI2M7jSr-_yI91sUp97CeJHgapZLG62AekzvOt5Stsh76ZoGZ8-DV";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const localePath = useLocalePath();
const { createPaypalOrder, capturePaypalOrder } = useApi(); 

// 组件状态
const loading = ref(true);
const error = ref(null);
const order_id = ref(null);   // 改为 order_id
const order_type = ref(null); // 新增 order_type 接收路线或景点类型
const orderDetails = ref({
  currency_code: 'USD',
  value: '0.00' 
});

onBeforeMount(() => {
  // 从 URL 中严格接收 order_id 和 type
  if (route.query.order_id && route.query.type) {
    order_id.value = route.query.order_id;
    order_type.value = route.query.type;
  } else {
    error.value = t('member.payerrorOrderMissing') || "Order information is missing. Payment cannot proceed.";
    loading.value = false;
  }
});

onMounted(() => {
  if (!order_id.value) return;
  loadPayPalSDK();
});

function loadPayPalSDK() {
  const script = document.createElement('script');
  script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=${orderDetails.value.currency_code}`;
  script.async = true;
  
  script.onload = () => {
    console.log("PayPal SDK loaded successfully.");
    renderPayPalButtons();
  };
  
  script.onerror = () => {
    error.value = t('member.payerrorSdkLoad') || "Failed to load PayPal payment component. Please refresh the page or contact support.";
    loading.value = false;
  };

  document.body.appendChild(script);
}

function renderPayPalButtons() {
  if (!window.paypal || !document.getElementById('paypal-button-container')) {
    error.value = t('member.payerrorSdkRender') || "Failed to initialize PayPal buttons. Please try again.";
    loading.value = false;
    return;
  }

  loading.value = false;

  window.paypal.Buttons({
    // 1. 唤起弹窗前：向 FastAdmin 请求创建 PayPal 订单
    createOrder: async () => {
      try {
        error.value = null;
        const { data: response, error: apiError } = await createPaypalOrder({
            order_id: order_id.value,   // 传本地订单ID
            type: order_type.value      // 传订单类型 (tour_order / scenery_order)
        });

        if (apiError.value || response.value.code !== 1) {
            throw new Error(apiError.value?.data?.message || response.value?.msg || 'Could not create payment order.');
        }

        // 后端返回的 JSON 是 ['paypalOrderId' => $result['id']]
        const paypalOrderID = response.value.data.paypalOrderId; 
        return paypalOrderID;

      } catch (err) {
        error.value = `${t('member.payerrorCreate') || 'Failed to create payment'}: ${err.message}`;
        return null; 
      }
    },

    // 2. 弹窗同意后：向 FastAdmin 请求捕获扣款
    onApprove: async (data) => {
      try {
        loading.value = true;
        error.value = null;

        const { data: response, error: apiError } = await capturePaypalOrder({
            paypalOrderId: data.orderID, // PayPal 返回的流水号
            order_id: order_id.value,    // 本地订单ID
            type: order_type.value       // 订单类型
        });

        if (apiError.value || response.value.code !== 1) {
            throw new Error(apiError.value?.data?.message || response.value?.msg || 'Payment verification failed.');
        }

        swal(t('member.paysuccessTitle') || "Payment Successful!", t('member.paysuccessMsg') || "Your order has been paid.", "success").then(() => {
            // 支付成功后跳转回订单详情
            router.push(localePath({ name: 'orderdetail-id', params: { id: order_id.value }}));
        });
        
      } catch (err) {
        error.value = `${t('member.payerrorProcess') || 'Failed to process payment'}: ${err.message}`;
        swal(t('member.payerrorTitle') || "Payment Failed", err.message, "error");
        loading.value = false;
      }
    },

    onError: (err) => {
      console.error("PayPal button error:", err);
      error.value = t('member.payerrorUnexpected') || "An unexpected error occurred during the payment process. Please try again.";
    },

    onCancel: (data) => {
        swal(t('member.paycancelTitle') || "Payment Cancelled", t('member.paycancelMsg') || "You have closed the payment window.", "info");
    }

  }).render('#paypal-button-container').catch(err => {
      error.value = t('member.payerrorRender') || "Could not display PayPal buttons. Please check the configuration.";
      loading.value = false;
  });
}

useHead({
  title: computed(() => t('member.paypageTitle') || 'Complete Payment')
})
</script>

<style scoped>
.payment-section {
  /* background-color: #f8f9fa; */
  min-height: 80vh;
  display: flex;
  align-items: center;
}
.payment-section .row{
  width: 100%
}
</style>
