<template>
  <div class="payment-section container py-5">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card shadow">
          <div class="card-body p-4 text-center">
            <h3 class="card-title fw-bold mb-3">{{ t('member.paytitle') || 'Complete Your Payment' }}</h3>
            <p class="text-muted mb-4" v-if="order_id">
              {{ t('member.payorderNumber') || 'Order Number' }}: {{ order_id }}
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
import { ref, onMounted, computed } from 'vue'; // 移除了 onBeforeMount
import swal from 'sweetalert';

// --- 配置你的 PayPal Sandbox / Live Client ID ---
const PAYPAL_CLIENT_ID = "ATAhdZ6LUCDh6MWBv-elnv4ZfEsNI2M7jSr-_yI91sUp97CeJHgapZLG62AekzvOt5Stsh76ZoGZ8-DV";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const localePath = useLocalePath();
const { createPaypalOrder, capturePaypalOrder } = useApi(); 

// 组件状态
const loading = ref(true); // 初始值保持为 true，确保和服务器端渲染一致
const error = ref(null);
const order_id = ref(null);   
const order_type = ref(null); 
const orderDetails = ref({
  currency_code: 'USD',
  value: '0.00' 
});

onMounted(() => {
  // 1. 将原本 onBeforeMount 的逻辑移到这里。这里已经安全完成了水合。
  if (route.query.order_id && route.query.type) {
    order_id.value = route.query.order_id;
    order_type.value = route.query.type;
    
    // 2. 拿到参数后，立刻开始加载 SDK
    loadPayPalSDK();
  } else {
    error.value = t('member.payerrorOrderMissing') || "Order information is missing. Payment cannot proceed.";
    loading.value = false;
  }
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

  // 此时 SDK 加载完毕，才关掉 loading 动画
  loading.value = false;

  window.paypal.Buttons({
    createOrder: async () => {
      try {
        error.value = null;
        const { data: response, error: apiError } = await createPaypalOrder({
            order_id: order_id.value,   
            type: order_type.value      
        });

        if (apiError.value || response.value.code !== 1) {
            throw new Error(apiError.value?.data?.message || response.value?.msg || 'Could not create payment order.');
        }

        return response.value.data.paypalOrderId; 

      } catch (err) {
        error.value = `${t('member.payerrorCreate') || 'Failed to create payment'}: ${err.message}`;
        return null; 
      }
    },

    onApprove: async (data) => {
      try {
        loading.value = true;
        error.value = null;

        const { data: response, error: apiError } = await capturePaypalOrder({
            paypalOrderId: data.orderID, 
            order_id: order_id.value,    
            type: order_type.value       
        });

        if (apiError.value || response.value.code !== 1) {
            throw new Error(apiError.value?.data?.message || response.value?.msg || 'Payment verification failed.');
        }

        // 👇 核心修正：拿到真实的数据库主键 ID
        const realDbId = response.value.data.id;

        swal(t('member.paysuccessTitle') || "Payment Successful!", t('member.paysuccessMsg') || "Your order has been paid.", "success").then(async () => {
            try {
                // 👇 路径拼接改为使用 realDbId
                const targetPath = localePath({
                    path: `/orderdetail/${realDbId}`, 
                    query: { type: order_type.value }
                });
                
                console.log("准备跳转的路径:", targetPath); 
                await router.push(targetPath);
                
            } catch (navErr) {
                console.error("路由跳转异常:", navErr);
            } finally {
                loading.value = false; // 关掉转圈动画
            }
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
