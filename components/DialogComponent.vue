<template>
  <Dialog header="Confirmation" v-model:visible="displayConfirmationComputed" :style="{ width: '350px' }" :modal="true">
    <div class="flex items-center justify-center">
      <i class="pi pi-exclamation-triangle mr-4" style="font-size: 2rem" />
      <span>Are you sure you want to proceed?</span>
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" @click="closeConfirmation(false)" text severity="secondary" />
      <Button label="Yes" icon="pi pi-check" @click="closeConfirmation(true)" severity="danger" outlined autofocus />
    </template>
  </Dialog>
</template>

<script setup>
const props = defineProps({
  display: Boolean
});

const emit = defineEmits([ 'closeConfirmation', 'closeDeny']);





const displayConfirmationComputed = computed(() => {
  return props.display;
});

const closeConfirmation = (action) => {

  emit('closeConfirmation', action);

  
};




</script>

<style>

</style>