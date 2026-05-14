<template>
  <div v-if="show" class="modal fade show" tabindex="-1" style="display: block; background: rgba(0,0,0,0.5);" @click.self="!isSubmitting && close()">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ t('commonConfig.confirmPurchase', '确认订单信息') }}</h5>
          <button type="button" class="btn-close" @click="close()" :disabled="isSubmitting" aria-label="Close"></button>
        </div>
        <div class="modal-body" v-if="item">
          <h6 class="mb-3 fw-bold">{{ item.name || item.lang_name }}</h6>
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span>{{ t('commonConfig.unitPrice', '单价') }}</span>
            <span class="text-danger">¥{{ unitPrice }}</span>
          </div>
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span>{{ t('commonConfig.quantity', '数量') }}</span>
            <div class="d-flex align-items-center gap-2">
              <button class="btn btn-sm btn-outline-secondary px-2 py-0 fs-5" @click="quantity > 1 ? quantity-- : null">-</button>
              <input type="number" class="form-control form-control-sm text-center" v-model.number="quantity" min="1" style="width: 70px;" />
              <button class="btn btn-sm btn-outline-secondary px-2 py-0 fs-5" @click="quantity++">+</button>
            </div>
          </div>
          <hr />
          <div class="d-flex justify-content-between align-items-center fw-bold mt-2">
            <span>{{ t('commonConfig.totalPrice', '总价') }}</span>
            <span class="text-danger fs-5">¥{{ totalPrice }}</span>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="close()" :disabled="isSubmitting">{{ t('commonConfig.cancel', '取消') }}</button>
          <button type="button" class="btn btn-theme" @click="confirm" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
            {{ isSubmitting ? t('commonConfig.processing', '处理中...') : t('commonConfig.confirm', '确定') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const { t } = useI18n();

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  item: {
    type: Object,
    default: null,
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:show', 'confirm']);

const quantity = ref(1);

const unitPrice = computed(() => {
    const price = props.item?.salesprice || props.item?.price || 0;
    return parseFloat(price).toFixed(2);
});

const totalPrice = computed(() => {
  return (parseFloat(unitPrice.value) * quantity.value).toFixed(2);
});

watch(() => props.show, (newVal) => {
  if (newVal) {
    quantity.value = 1; // Reset quantity when modal is shown
  }
});

const close = () => {
  emit('update:show', false);
};

const confirm = () => {
  emit('confirm', { quantity: quantity.value });
};
</script>