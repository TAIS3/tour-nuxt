<template>
  <div>
    <div class="row g-3 sm:g-4">
    <div v-for="product in products" :key="product.id" class="col-6 col-md-4">
      <div
        class="tour-card bg-white rounded-2 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 h-100"
      >
        <div class="tour-image h-40 sm:h-48 overflow-hidden">
          <NuxtLink :to="localePath(`/${articleType}/${product.id}`)" class="img-wrap d-block">
            <img
              :src="getImageUrl(product.images)"
              :alt="product.lang_name"
              class="w-100 h-100 object-cover transition-transform duration-500 hover:scale-105"
            />
          </NuxtLink>
        </div>

        <div class="p-3 sm:p-4">
          <NuxtLink :to="localePath(`/${articleType}/${product.id}`)" class="text-decoration-none">
            <h3 class="h6 sm:h5 font-semibold text-gray-800 mb-2 line-clamp-1 title hover:text-theme">
              {{ product.lang_name }}
            </h3>
          </NuxtLink>
          
          <p class="text-gray-600 text-xs sm:text-sm line-clamp-2 sub_title">
            {{ product.lang_sub_name || product.lang_introduce }}
          </p>

          <div v-if="articleType === 'tourarticle'" class="d-flex justify-between justify-content-between align-items-center control-bottom pt-3">
            <div class="d-flex align-items-center gap-2">
              <div class="text-danger fw-bold mb-0">
                <small>¥</small><span class="fs-5">{{ parseFloat(product.salesprice || product.price || 0) || 0 }}</span>
              </div>
              <button class="btn btn-xs btn-sm theme-btn" :disabled="!parseFloat(product.salesprice || product.price || 0)" @click="openConfirmModal(product)">{{ t('commonConfig.buyNow', '立即购买') }}</button>
            </div>

            <NuxtLink
              :to="localePath(`/${articleType}/${product.id}`)"
              class="text-theme fw-medium d-flex items-center gap-1 text-sm text-decoration-none"
            >
              VIEW
              <i class="bi bi-arrow-right text-xs"></i>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    </div>

    <PurchaseConfirmModal
      v-model:show="showModal"
      :item="checkoutItem"
      :is-submitting="isSubmitting"
      @confirm="handleConfirmCheckout"
    />
  </div>
</template>

<script setup>
import swal from 'sweetalert';
import PurchaseConfirmModal from '~/components/PurchaseConfirmModal.vue';

const { createTourOrder } = useApi(); // 假设 useApi() 中有 createTourOrder

const props = defineProps({
  products: {
    type: Array,
    required: true,
    default: () => [],
  },
  articleType: {
    type: String,
    required: false,
    default: 'tourarticle',
  }
})

const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();

const showModal = ref(false);
const checkoutItem = ref(null);
const isSubmitting = ref(false);

const openConfirmModal = (item) => {
  const token = useCookie('fa-token').value;
  if (!token) {
    swal({
      title: t('commonConfig.loginRequiredTitle', '需要登录'),
      text: t('commonConfig.loginRequiredText', '请先登录再进行购买。'),
      icon: 'warning',
      buttons: {
        cancel: t('commonConfig.cancel', '取消'),
        confirm: {
          text: t('commonConfig.goToLogin', '去登录'),
          value: true,
        },
      },
    }).then((willRedirect) => {
      if (willRedirect) {
        navigateTo(localePath(`/login?redirect=${route.fullPath}`));
      }
    });
    return;
  }

  checkoutItem.value = item;
  showModal.value = true;
};

const handleConfirmCheckout = async ({ quantity }) => {
  if (!checkoutItem.value || isSubmitting.value) return;

  isSubmitting.value = true;
  try {
    // 假设创建旅行团订单的API是 createTourOrder
    const { data: orderResult, error } = await createTourOrder({
      tour_id: checkoutItem.value.id,
      buy_num: quantity,
    });

    if (error.value || orderResult.value?.code !== 1) {
      throw new Error(orderResult.value?.msg || error.value?.data?.message || t('commonConfig.checkoutError', '创建订单失败'));
    }

    const order_id = orderResult.value.data.order_no;

    showModal.value = false;

    await navigateTo(localePath({
      path: '/member/pay',
      query: {
        order_id: order_id,
        type: 'tour_order', // 假设旅行团订单类型是 'tour_order'
      },
    }));
  } catch (err) {
    swal({ title: t('commonConfig.error', '错误'), text: err.message, icon: 'error' });
  } finally {
    isSubmitting.value = false;
  }
};

</script>

<style lang="scss">
@use '~/assets/css/global.scss' as *;

h3.title {
  height: 1rem;
  font-size: clamp(14px, 1.5vw, 18px);
  font-weight: 700;
  // 增加标题 hover 效果
  transition: color 0.2s;
  &.hover\:text-theme:hover {
    color: $mainColor; 
  }
}

p.sub_title {
  height: 3rem;
  overflow: hidden;
  text-overflow: ellipsis;
  
  font-size: clamp(12px, 1vw, 16px);
}

.tour-card {
  display: flex;
  flex-direction: column;
}
.control-bottom{
  border-top: 1px solid;
  border-color: $mainColor;
}

.tour-image {
  flex-shrink: 0;
  .img-wrap {
    width: 100%;
    position: relative;
    padding-top: 75%; 
    overflow: hidden;
    cursor: pointer;
    
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s;
    }
    
    // 只有 hover 到 wrap 上时，img 才放大
    &:hover img {
      transform: scale(1.05);
    }
  }
}

@media (max-width: 575.98px) {
  .btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }
}
</style>