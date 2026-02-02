<template>
  <div>
    <CommonPageBanner :banner-data="bannerData" />
    <div class="container py-5">
      <div v-if="pending" class="text-center">
        <LoadingComponent />
      </div>
      <div v-else-if="error || !order" class="text-center">
        <NoData message="Order not found." />
      </div>
      <div v-else>
        <div class="card">
          <div class="card-header">
            <h2>Order Details</h2>
          </div>
          <div class="card-body">
            <h5 class="card-title">Product: {{ order.productName }}</h5>
            <p class="card-text"><strong>Order ID:</strong> {{ order.id }}</p>
            <p class="card-text"><strong>Order Date:</strong> {{ new Date(order.orderDate).toLocaleString() }}</p>
            <p class="card-text"><strong>Status:</strong> <span class="badge bg-primary">{{ order.status }}</span></p>
            <p class="card-text"><strong>Total Amount:</strong> ${{ order.amount }}</p>
            <h5 class="mt-4">Customer Information</h5>
            <p class="card-text"><strong>Name:</strong> {{ order.customer.name }}</p>
            <p class="card-text"><strong>Email:</strong> {{ order.customer.email }}</p>
            <p class="card-text"><strong>Address:</strong> {{ order.customer.address }}</p>
          </div>
          <div class="card-footer text-muted">
            Thank you for your purchase!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import CommonPageBanner from '~/app/components/CommonPageBanner.vue';
import LoadingComponent from '~/app/components/LoadingComponent.vue';
import NoData from '~/app/components/NoData.vue';
import { useHttp } from '~/app/composables/useHttp';

definePageMeta({
  middleware: 'auth',
});

const route = useRoute();
const orderId = route.params.id;

const bannerData = ref({
  title: 'Order Details',
  backgroundImage: '/static/images/public_bannerBg.png',
});

const { data: order, pending, error } = await useHttp(`/api/orders/${orderId}`);

</script>

<style scoped>
.container {
  min-height: 50vh;
}
.card {
  border: 1px solid #ddd;
}
.card-header {
  background-color: #f5f5f5;
}
</style>
