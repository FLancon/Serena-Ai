import Aura from '@primevue/themes/aura';
export default defineNuxtConfig({
    compatibilityDate: '2024-12-17',
    modules: ['@primevue/nuxt-module', '@nuxtjs/tailwindcss', '@nuxtjs/supabase', '@nuxtjs/i18n'],

    runtimeConfig: {
        public: {
            appName: 'SERENAi'
        }
    },
    supabase: {
        redirect: false,
        redirectOptions: {
            login: '/login',
            register:'/register',
            callback: '/confirm'
        }
    },

    i18n: {
        locales: [
          {
            code: 'gb',
            name: 'English',
            file: 'en.json'
          },
          {
            code: 'fr',
            name: 'Français',
            file: 'fr.json'
          }
        ],
        defaultLocale: 'fr',
        langDir: 'locales/',
    
        detectBrowserLanguage: {
          useCookie: true,
          cookieKey: 'i18n_redirected',
          cookieSecure: false, // Assurez-vous de le mettre à true si vous utilisez HTTPS
          alwaysRedirect: true,
          fallbackLocale: 'fr',
        },
        strategy: 'no_prefix', // Vous pouvez changer selon vos besoins
      },

    css: ['@/assets/styles.scss', 'primeicons/primeicons.css', '@/assets/tailwind.css'],
    primevue: {
        options: {
            theme: {
                preset: Aura,
                options: {
                    darkModeSelector: '.app-dark'
                }
            }
        }
    }
});
