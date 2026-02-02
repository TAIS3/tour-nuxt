// app/plugins/auth.client.js
export default defineNuxtPlugin(async (nuxtApp) => {
  const mainStore = useMainStore(nuxtApp.$pinia);
  
  // If there's a token but no user data in the store, fetch the user.
  // This handles re-hydrating the user state on page refresh.
  if (mainStore.token && !mainStore.isLoggedIn) {
    await mainStore.fetchUser();
  }
});
