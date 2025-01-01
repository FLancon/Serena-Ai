<script setup>
definePageMeta({
    layout: 'empty'
});
const { t } = useI18n();
const appName = useRuntimeConfig().public.appName;
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const errorMessage = ref(null);
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const signinWithSupabase = async () => {
    if (!email.value || !password.value || !confirmPassword.value) {
        errorMessage.value = t('fillAllFields');
        return false;
    } else if (password.value !== confirmPassword.value) {
        console.log(password.value);
        console.log(confirmPassword.value);
        errorMessage.value = t('noMatchingPassword');
        return false;
    }

    try {
        const { data, error } = await supabase.auth.signUp({
            email: email.value,
            password: password.value
        });
        if (error) {
            errorMessage.value = t('form.loginFailed');
        } else {
            return navigateTo('/auth/login');
        }
    } catch (error) {}
};
</script>

<template>
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <svg id="logo-54" class="mb-8 w-16 shrink-0 mx-auto" viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M20.6841 40.138C31.7298 40.138 40.6841 31.1837 40.6841 20.138C40.6841 9.09234 31.7298 0.138031 20.6841 0.138031C9.63837 0.138031 0.684082 9.09234 0.684082 20.138C0.684082 31.1837 9.63837 40.138 20.6841 40.138ZM26.9234 9.45487C27.2271 8.37608 26.1802 7.73816 25.2241 8.41933L11.8772 17.9276C10.8403 18.6663 11.0034 20.138 12.1222 20.138L15.6368 20.138V20.1108H22.4866L16.9053 22.0801L14.4448 30.8212C14.1411 31.9 15.1879 32.5379 16.1441 31.8567L29.491 22.3485C30.5279 21.6098 30.3647 20.138 29.246 20.138L23.9162 20.138L26.9234 9.45487Z"
                                class="ccustom"
                                fill="var(--primary-color)"
                            ></path>
                        </svg>
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">{{ $t('form.joinUs') }} {{ appName }} !</div>
                        <span class="text-muted-color font-medium">{{ $t('form.signUpToContinue') }}</span>
                    </div>
                    <Message icon="pi pi-exclamation-circle" class="mb-2" v-if="errorMessage" severity="error"
                        ><b>{{ errorMessage }} </b></Message
                    >
                    <div>
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">{{ $t('form.email') }}</label>
                        <InputText id="email1" type="text" :placeholder="`${t('form.email')}`" class="w-full md:w-[30rem] mb-8" v-model="email" />

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">{{ $t('form.password') }}</label>
                        <Password id="password1" v-model="password" :placeholder="`${t('form.password')}`" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                        <label for="confirmPassword" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">{{ $t('form.confirmPassword') }}</label>
                        <Password id="confirmPassword" v-model="confirmPassword" :placeholder="`${t('form.confirmPassword')}`" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                        <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                            <div class="flex items-center"></div>
                            <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">{{ $t('form.forgotPassword') }} ?</span>
                        </div>
                        
                        <Button :label="`${t('form.createAccount')}`" class="w-full" @click="signinWithSupabase"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
