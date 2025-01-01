<script setup>

const { availableLocales, locale, t } = useI18n();
const langCookies = useCookie('i18n_redirected');
const availableLanguages = ref(availableLocales);
const supabase = useSupabaseClient();

const localeComputed = computed(() => locale.value);

const changeLanguage = (newLocale) => {
    locale.value = newLocale;
    langCookies.value = newLocale;
};

if (langCookies.value) {
    locale.value = langCookies.value;
}

const showDialog = ref(false); // State for dialog visibility

const confirmLogout = () => {
    showDialog.value = true; // Show dialog
};

const logout = async () => {
    await supabase.auth.signOut();
    navigateTo('/auth/login');
};

// Method to handle confirmation
const handleLogout = () => {
    logout(); // Call logout if confirmed
    showDialog.value = false; // Close dialog
};

const cancelLogout = () => {
    showDialog.value = false; // Close dialog on cancel
};

</script>

<template>
    <div
        class="config-panel hidden absolute top-[3.25rem] right-0 w-64 p-4 bg-surface-0 dark:bg-surface-900 border border-surface rounded-border origin-top shadow-[0px_3px_5px_rgba(0,0,0,0.02),0px_0px_2px_rgba(0,0,0,0.05),0px_1px_4px_rgba(0,0,0,0.08)]">
        <div class="flex flex-col gap-4">
            <div>
                <span class="text-sm text-muted-color font-semibold">{{ $t('language') }}</span>
                <div class="pt-2 flex gap-2 flex-wrap ">
                    <img v-for="lang in availableLanguages"
                        :class="['border-none w-8 h-8 rounded-full p-0 cursor-pointer outline-none outline-offset-1', { 'outline-primary': localeComputed === lang }]"
                        :src="`https://flagsapi.com/${lang.toUpperCase()}/flat/64.png`" @click="changeLanguage(lang)">
                </div>
            </div>
            <div>
                <span class="text-sm text-muted-color font-semibold">{{ $t('management') }}</span>
                <div class="pt-2 flex gap-2">
                    <Button class="w-full" :label="`${$t('logout')}`" @click="confirmLogout" outlined />
                </div>
            </div>
        </div>
    </div>

    <!-- Confirmation Dialog -->
    <Dialog 
        header="Confirm Logout" 
        :visible="showDialog" 
        modal 
        @hide="cancelLogout">
        <p>Are you sure you want to log out?</p>
        <template #footer>
            <Button label="No" icon="pi pi-times" @click="cancelLogout" />
            <Button label="Yes" icon="pi pi-check" @click="handleLogout" />
        </template>
    </Dialog>
</template>

<style scoped>
/* Add any additional styles if necessary */
</style>
