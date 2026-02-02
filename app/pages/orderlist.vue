<template>
  <div>
    <CommonPageBanner :banner-data="bannerData" />
    <div class="container py-5">
      <div v-if="pending" class="text-center">
        <LoadingComponent />
      </div>
      <div v-else-if="error" class="text-center">
        <NoData />
      </div>
      <div v-else>
        <div class="row">
          <div class="col-md-12">
            <h2 class="mb-4">My Orders</h2>
            <div v-if="orders.length === 0" class="text-center">
              <NoData message="You have no orders." />
            </div>
            <div v-else class="list-group">
              <NuxtLink
                v-for="order in orders"
                :key="order.id"
                :to="`/orderdetail/${order.id}`"
                class="list-group-item list-group-item-action"
              >
                <div class="d-flex w-100 justify-content-between">
                  <h5 class="mb-1">{{ order.productName }}</h5>
                  <small>{{ new Date(order.orderDate).toLocaleDateString() }}</small>
                </div>
                <p class="mb-1">Order ID: {{ order.id }}</p>
                <small>Status: {{ order.status }}</small>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CommonPageBanner from '~/app/components/CommonPageBanner.vue';
import LoadingComponent from '~/app/components/LoadingComponent.vue';
import NoData from '~/app/components/NoData.vue';
import { useHttp } from '~/app/composables/useHttp';

definePageMeta({
  middleware: 'auth',
});

const bannerData = ref({
  title: 'My Orders',
  backgroundImage: '/static/images/public_bannerBg.png',
});

const { data: orders, pending, error } = await useHttp('/api/orders');

</script>

<style scoped>
.container {
  min-height: 50vh;
}
</style>
