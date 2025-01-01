export default defineNuxtRouteMiddleware((to, from) => {
    const user = useSupabaseUser();
    // console.log('user', user.value)

    if (user.value && to.path === '/auth/login') {
        return navigateTo('/pages/dashboard');
    }

    if (user.value && to.path === '/') {
        return navigateTo('/pages/dashboard');
    }

    // Si l'utilisateur n'est pas connecté et essaie d'accéder à une autre page que la page de connexion, rediriger vers /login
    if (!user.value && to.path !== '/auth/login' && to.path !== '/' && to.path !== '/auth/register') {
        return navigateTo('/');
    }
});
