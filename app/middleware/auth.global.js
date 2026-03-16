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

  // Whitelist of public paths under /member that don't require authentication
  const publicMemberPaths = [
    '/member/forgot-password',
    // You can add other public paths here in the future
  ].map(path => localePath(path));

  // Check if the user is trying to access a protected member page without being logged in
  if (!mainStore.isLoggedIn && to.path.startsWith('/member') && !publicMemberPaths.includes(to.path)) {
    // Redirect them to the login page
    return navigateTo(localePath('/login'));
  }
});

