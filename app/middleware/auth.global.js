// app/middleware/auth.global.js
export default defineNuxtRouteMiddleware((to, from) => {
  const mainStore = useMainStore();
  const localePath = useLocalePath();

  // Define base paths for login and register
  const loginBasePath = '/login';
  const registerBasePath = '/register';

  // Check if the user is logged in and trying to access login or register pages
  if (mainStore.isLoggedIn && (to.path.endsWith(loginBasePath) || to.path.endsWith(registerBasePath))) {
    // Redirect them to the member center using a localized path
    return navigateTo(localePath('/member/member-center'));
  }

  // Check if the user is trying to access a member page without being logged in
  if (!mainStore.isLoggedIn && to.path.startsWith('/member')) {
    // Redirect them to the login page using a localized path
    return navigateTo(localePath('/login'));
  }
});

