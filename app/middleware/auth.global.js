// app/middleware/auth.global.js
export default defineNuxtRouteMiddleware((to, from) => {
  const mainStore = useMainStore();
  const localePath = useLocalePath();
  
  // 核心优化：增加读取 fa-token Cookie。这是为了防止 SSR 刷新时 Pinia 丢失状态
  const tokenCookie = useCookie('fa-token');
  
  // 判断是否登录：只要有 Token 或者 Store 里是登录状态，就算登录
  const isAuthenticated = !!tokenCookie.value || mainStore.isLoggedIn;

  // Define base paths for login and register
  const loginBasePath = '/login';
  const registerBasePath = '/register';

  // Check if the user is logged in and trying to access login or register pages
  if (isAuthenticated && (to.path.endsWith(loginBasePath) || to.path.endsWith(registerBasePath))) {
    // Redirect them to the member center using a localized path
    return navigateTo(localePath('/member/member-center'));
  }

  // Whitelist of public paths under /member that don't require authentication
  const publicMemberPaths = [
    '/member/forgot-password',
    // You can add other public paths here in the future
  ].map(path => localePath(path));

  // 核心优化：定义哪些路径需要保护。
  // 包含所有 /member 开头的，并且为了保险起见，把 /orderdetail 也加进去（防止你把它放到了外面）
  const isProtectedPath = to.path.startsWith('/member') || to.path.includes('/orderdetail');

  // Check if the user is trying to access a protected page without being logged in
  if (!isAuthenticated && isProtectedPath && !publicMemberPaths.includes(to.path)) {
    // Redirect them to the login page
    return navigateTo(localePath('/login'));
  }
});