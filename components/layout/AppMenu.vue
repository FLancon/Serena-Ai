<script setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppMenuItem from './AppMenuItem.vue';

const { t, locale } = useI18n();

// Fonction pour créer le modèle de menu
const createMenuModel = () => [
    {
        label: t('menu.home'),
        items: [
            { label: t('menu.dashboard'), icon: 'pi pi-fw pi-home', to: '/pages/dashboard' },
            { label: t('menu.messages'), icon: 'pi pi-fw pi-inbox', to: '/pages/messages' },
            { label: t('menu.product'), icon: 'pi pi-fw pi-shopping-bag', to: '/pages/products' },
            { label: t('menu.statistics'), icon: 'pi pi-fw pi-chart-bar', to: '/pages/statistic' }
        ]
    },
    {
        label: t('menu.administration'),
        items: [{ label: t('menu.users'), icon: 'pi pi-fw pi-users', to: '/pages/admin/users' }]
    }
];

// Utiliser un ref pour le modèle de menu réactif
const model = ref(createMenuModel());

// Regarder les changements de langue et mettre à jour le modèle de menu
watch(locale, () => {
    model.value = createMenuModel(); // Recrée le menu avec les nouvelles traductions
});
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>
