<template>
  <h1 class="fw-bold">
    <span>{{ currentText }}</span>
    <span class="cursor">|</span>
  </h1>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  texts: { type: Array, default: () => ['旅游', '美食', '文化'] },
  interval: { type: Number, default: 2000 },
})

const currentText = ref('')
let index = 0

onMounted(() => {
  currentText.value = props.texts[index]
  setInterval(() => {
    index = (index + 1) % props.texts.length
    currentText.value = props.texts[index]
  }, props.interval)
})
</script>

<style scoped>
.cursor {
  display: inline-block;
  margin-left: 4px;
  animation: blink 1s infinite;
}
@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  50.1%,
  100% {
    opacity: 0;
  }
}
</style>
