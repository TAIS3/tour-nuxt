// app/stores/loading.js
import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoading: true, // Initially true to show skeleton on first load
  }),
  actions: {
    setLoading(loading) {
      this.isLoading = loading;
    },
  },
});
