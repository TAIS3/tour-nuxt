export default defineNuxtRouteMiddleware((to, from) => {
  // Check for the token cookie.
  const token = useCookie('fa-token');

  // If the token doesn't exist and the user is trying to access a protected route,
  // redirect them to the login page.
  if (!token.value) {
    return navigateTo('/login');
  }
});

