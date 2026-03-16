<template>
  <div class="payment-section container py-5">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card shadow">
          <div class="card-body p-4 text-center">
            <h3 class="card-title fw-bold mb-3">{{ t('pay.title') || 'Complete Your Payment' }}</h3>
            <p class="text-muted mb-4" v-if="orderId">
              {{ t('pay.orderNumber') || 'Order Number' }}: {{ orderId }}
            </p>

            <!-- Loading Spinner -->
            <div v-if="loading" class="d-flex justify-content-center my-4">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="ms-2 mb-0">{{ t('pay.loading') || 'Loading Payment Gateway...' }}</p>
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
import { ref, onMounted, onBeforeMount } from 'vue';
import swal from 'sweetalert'

// --- CONFIGURATION ---
// IMPORTANT: Replace with your actual PayPal Client ID from your developer dashboard
const PAYPAL_CLIENT_ID = "ATAhdZ6LUCDh6MWBv-elnv4ZfEsNI2M7jSr-_yI91sUp97CeJHgapZLG62AekzvOt5Stsh76ZoGZ8-DV";
// --------------------

// Composables
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const localePath = useLocalePath();
// Assuming you have these API functions defined in your useApi composable
const { createPaypalOrder, capturePaypalOrder } = useApi(); 

// Component State
const loading = ref(true);
const error = ref(null);
const orderId = ref(null); // The internal order ID from your system (e.g., from FastAdmin)
const orderDetails = ref({ // This should be fetched from your API based on orderId
  currency_code: 'USD',
  value: '100.00' // Example value. Fetch the real amount from your backend.
});

// onBeforeMount is executed on server and client.
// We get the orderId here to prepare for fetching data.
onBeforeMount(() => {
  // Get order ID from route query parameters, e.g., /member/pay?orderId=123
  if (route.query.orderId) {
    orderId.value = route.query.orderId;
    // --- TODO: Fetch Order Details ---
    // In a real app, you should fetch the order details from your backend here.
    // This is to get the correct amount and currency for the transaction.
    // Example:
    // const { data: fetchedOrder, error: fetchError } = await useApi().getOrderDetails(orderId.value);
    // if (fetchError.value) {
    //   error.value = "无法获取订单详情。";
    // } else {
    //   orderDetails.value.value = fetchedOrder.value.amount;
    //   orderDetails.value.currency_code = fetchedOrder.value.currency;
    // }
    // ---------------------------------
  } else {
    error.value = t('pay.errorOrderMissing') || "Order information is missing. Payment cannot proceed.";
    loading.value = false;
  }
});

// onMounted is executed only on the client-side.
// We load the PayPal script here because it interacts with the window object.
onMounted(() => {
  if (!orderId.value) {
    // Stop if there's no orderId
    return;
  }
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
    error.value = t('pay.errorSdkLoad') || "Failed to load PayPal payment component. Please refresh the page or contact support.";
    loading.value = false;
  };

  document.body.appendChild(script);
}

function renderPayPalButtons() {
  // Ensure the SDK is loaded and we have a container.
  if (!window.paypal || !document.getElementById('paypal-button-container')) {
    error.value = t('pay.errorSdkRender') || "Failed to initialize PayPal buttons. Please try again.";
    loading.value = false;
    return;
  }

  loading.value = false;

  window.paypal.Buttons({
    // 1. createOrder: Called when the user clicks the PayPal button.
    createOrder: async () => {
      try {
        error.value = null;
        // Call your backend to set up the transaction.
        // The backend must call PayPal's Orders API and return the PayPal order ID.
        const { data: response, error: apiError } = await createPaypalOrder({
            orderId: orderId.value, // Pass your internal order ID to the backend
            // You might need to pass amount and currency if your backend doesn't fetch it itself
        });

        if (apiError.value || response.value.code !== 1) {
            throw new Error(apiError.value?.data?.message || response.value?.msg || 'Could not create payment order.');
        }

        const paypalOrderID = response.value.data.paypalOrderId; // Adjust based on your API response
        console.log(`Backend created PayPal order: ${paypalOrderID}`);
        return paypalOrderID;

      } catch (err) {
        error.value = `${t('pay.errorCreate') || 'Failed to create payment'}: ${err.message}`;
        return null; // Must return null or a rejected promise to stop the payment flow
      }
    },

    // 2. onApprove: Called after the user approves the payment in the PayPal popup.
    onApprove: async (data) => {
      try {
        loading.value = true;
        error.value = null;

        // Call your backend to capture the payment.
        // The backend must call PayPal's Orders API to finalize the transaction.
        const { data: response, error: apiError } = await capturePaypalOrder({
            paypalOrderId: data.orderID
        });

        if (apiError.value || response.value.code !== 1) {
            throw new Error(apiError.value?.data?.message || response.value?.msg || 'Payment verification failed.');
        }

        console.log("Backend successfully captured the payment.");
        swal(t('pay.successTitle') || "Payment Successful!", t('pay.successMsg') || "Your order has been paid.", "success").then(() => {
            router.push(localePath({ name: 'orderdetail-id', params: { id: orderId.value }}));
        });
        
      } catch (err) {
        error.value = `${t('pay.errorProcess') || 'Failed to process payment'}: ${err.message}`;
        swal(t('pay.errorTitle') || "Payment Failed", err.message, "error");
        loading.value = false;
      }
    },

    // 3. onError: Handle errors from the PayPal button/modal itself.
    onError: (err) => {
      console.error("PayPal button or modal error:", err);
      error.value = t('pay.errorUnexpected') || "An unexpected error occurred during the payment process. Please try again.";
    },

    // 4. onCancel: Handle the case where the user closes the PayPal popup.
    onCancel: (data) => {
        console.log("User cancelled the payment.", data);
        swal(t('pay.cancelTitle') || "Payment Cancelled", t('pay.cancelMsg') || "You have closed the payment window.", "info");
    }

  }).render('#paypal-button-container').catch(err => {
      console.error("Failed to render PayPal buttons:", err);
      error.value = t('pay.errorRender') || "Could not display PayPal buttons. Please check the configuration.";
      loading.value = false;
  });
}

useHead({
  title: computed(() => t('pay.pageTitle') || 'Complete Payment')
})
</script>

<style scoped>
.payment-section {
  background-color: #f8f9fa;
  min-height: 80vh;
  display: flex;
  align-items: center;
}
</style>
