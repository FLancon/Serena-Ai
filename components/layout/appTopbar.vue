<script setup>
const darkModeCookie = useCookie('darkMode');
import AppConfigurator from './AppConfigurator.vue';
import UserConfigurator from './UserConfigurator.vue';
const appName = useRuntimeConfig().public.appName
const { onMenuToggle, toggleDarkMode, isDarkTheme } = useLayout();

onBeforeMount(() => {
    if(darkModeCookie.value === true) {
    
    toggleDarkMode();
}
})



</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="onMenuToggle">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <svg id="logo-54" width="200opx" viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M20.6841 40.138C31.7298 40.138 40.6841 31.1837 40.6841 20.138C40.6841 9.09234 31.7298 0.138031 20.6841 0.138031C9.63837 0.138031 0.684082 9.09234 0.684082 20.138C0.684082 31.1837 9.63837 40.138 20.6841 40.138ZM26.9234 9.45487C27.2271 8.37608 26.1802 7.73816 25.2241 8.41933L11.8772 17.9276C10.8403 18.6663 11.0034 20.138 12.1222 20.138L15.6368 20.138V20.1108H22.4866L16.9053 22.0801L14.4448 30.8212C14.1411 31.9 15.1879 32.5379 16.1441 31.8567L29.491 22.3485C30.5279 21.6098 30.3647 20.138 29.246 20.138L23.9162 20.138L26.9234 9.45487Z"
                            class="ccustom" fill="var(--primary-color)"></path>
                    </svg>

                <span>{{ appName }}</span>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
                <div class="relative">
                    <button
                        v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                        type="button"
                        class="layout-topbar-action "
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <AppConfigurator />
                </div>
            </div>

            <button
                class="layout-topbar-menu-button layout-topbar-action"
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
            >
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" style="display: none;" class="layout-topbar-action">
                        <i class="pi pi-calendar"></i>
                        <span>Calendar</span>
                    </button>
                    <button type="button" style="display: none;" class="layout-topbar-action">
                        <i class="pi pi-inbox"></i>
                        <span>Messages</span>
                    </button>
                    <div class="relative">
                    <button
                        v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                        type="button"
                        class="layout-topbar-action "
                    >
                        <i class="pi pi-user"></i>
                    </button>
                    <UserConfigurator />
                </div>
                </div>
            </div>
        </div>
    </div>
</template>
