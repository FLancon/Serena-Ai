<script setup>

import { useToast } from 'primevue/usetoast';
const { t } = useI18n();
const router = useRouter();
const toast = useToast();
const productName = ref('')
const productSlug = ref('')
const productActif = ref('Actif')
const loaded = ref(false)
const drawer = ref(false)
const products = ref([]);
const editMode = ref(false)
const displayModal = ref(false)
const globalFilter = ref('')
const productNameSeverity = ref(false);
const productSlugSeverity = ref(false);

const productToDelete = ref(null);
const selectedProductId = ref(null); // Store the id of the selected product for editing



const options = ref(["Actif", "Inactif"]);

const drawerTitle = computed(() => {
  return editMode.value ? 'Edit Product' : 'Add Product'
})

const globalFilterComputed = computed(() => {
  return products.value.filter((product) => {
    return product.product_name.toLowerCase().includes(globalFilter.value.toLowerCase());
  });
})

const getProducts = async () => {
  loaded.value = false
  const data = await $fetch('/api/products')
  products.value = data

  setTimeout(() => {
    loaded.value = true
  }, 1000)
}

const isActif = (product) => {
  return product.isActif === true ? 'success' : 'danger'
}



const openDialog = (isEdit = false) => {
  drawer.value = true
  editMode.value = isEdit

  if (!isEdit) {
    // Reset form for adding a new product
    productName.value = ''
    productSlug.value = ''

    productActif.value = 'Actif'
    selectedProductId.value = null
  }
}

const editProduct = (product) => {
  // Set form fields with product data
  productName.value = product.product_name
  productSlug.value = product.product_slug
  productActif.value = product.isActif ? 'Actif' : 'Inactif'

  selectedProductId.value = product.id
  openDialog(true) // Open in edit mode
}

const confirmDelete = (product) => {
  displayModal.value = true
  productToDelete.value = product

};

const manageProduct = async () => {
  productNameSeverity.value = false;
  productSlugSeverity.value = false;

  const product = {
    product_name: productName.value,
    product_slug: productSlug.value,
    isActif: productActif.value === 'Actif' ? true : false
  }

  // Validation TO REFACTO
  if (product.product_name === '' || product.product_slug === '') {
    product.product_name === '' ? productNameSeverity.value = true : productNameSeverity.value = false;
    product.product_slug === '' ? productSlugSeverity.value = true : productSlugSeverity.value = false;

    toast.add({
      position: 'bottom-right',
      severity: 'error',
      summary: t("toastErrorWarning"),
      detail: t("fillAllFields"),
      life: 3000,
    });
    return false;
  }

  // Add new product
  try {
    const { data, error } = await $fetch('/api/products', {
      method: 'POST',
      body: product,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (error || data.statusCode !== 200) throw error.value

    toast.add({
      position: 'bottom-right',
      severity: 'success',
      summary: t("success"),
      detail: t("productAdded"),
      life: 3000
    })
    getProducts()
    drawer.value = false

  } catch (error) {
    toast.add({
      position: 'bottom-right',
      severity: 'error',
      summary: t("toastErrorWarning"),
      detail: `${t("failedToAddProduct")}: ${error.message}`,
      life: 3000
    })
  }
}

const updateProduct = async () => {
  // Prepare product data for update
  const product = {
    product_name: productName.value,
    product_slug: productSlug.value,

    isActif: productActif.value === 'Actif'
  };

  try {
    const { data, error } = await $fetch(`/api/products/${selectedProductId.value}`, {
      method: 'PATCH',
      body: product,
      headers: {
        'Content-Type': 'application/json',
      },
    });


    if (error || data.statusCode != 200) throw error.value;

    toast.add({
      position: 'bottom-right',
      severity: 'success',
      summary: t('toastSuccess'),
      detail: t('productUpdated'),
      life: 3000,
    });
    getProducts();
    drawer.value = false; // Close drawer after success
  } catch (error) {
    toast.add({
      position: 'bottom-right',
      severity: 'error',
      summary: 'Error',
      detail: `${t('failedToUpdateProduct')}: ${error.message}`,
      life: 3000,
    });
  }
};

const deleteProduct = (action) => {
  if (!action) {
    productToDelete.value = null;
    displayModal.value = false;
    return;
  }

  const id = productToDelete.value.id;

  $fetch(`/api/products/${id}`, {
    method: 'DELETE',
  })
    .then(() => {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Product deleted successfully',
        life: 3000,
      });
      getProducts();
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: t('toastErrorWarning'),
        detail: `${t('failedToDeleteProduct')}: ${error.message}`,
        life: 3000,
      });
    })
    .finally(() => {
      productToDelete.value = null;
      displayModal.value = false;
      getProducts();
    });

}

const cancelEdit = () => {
  drawer.value = false;
};

const redirectProduct = (product) => {
  router.push(`/pages/product/${product.id}`);
};

getProducts();
</script>

<template>
  <div v-if="!loaded">
    <div class="card">
      <LoaderComponent />
    </div>

  </div>
  <div v-else>
    <div class="grid grid-cols-12 mb-2">
      <div class="col-span-6 lg:col-span-6 xl:col-span-6 sm:col-span-6">
        <InputText type="text" :placeholder="$t('filter')" v-model="globalFilter" class="p-inputtext" />
      </div>
      <div class="col-span-6 lg:col-span-6 xl:col-span-6 sm:col-span-6 flex justify-end">
        <Button dense="compact" type="button" :label="$t('addArticle')" icon="pi pi-plus" @click="openDialog(false)" />
      </div>
    </div>

    <div>
      <div class="card">
        <DataView :value="globalFilterComputed" paginator :rows="5">
          <template #list="slotProps">
            <div class="flex flex-col">
              <div v-for="(item, index) in slotProps.items" :key="index">
                <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4"
                  :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }">
                  <div class="md:w-40 relative">
                    <img class="block xl:block mx-auto rounded w-full"
                      src="https://i.insider.com/5eea74504dca6821d9197a61?width=800&format=jpeg&auto=webp"
                      :alt="item.name" />
                    <div class="absolute bg-black/70 rounded-border" style="left: 4px; top: 4px">
                      <Tag :value="item.isActif ? $t('active') : $t('inactive')" :severity="isActif(item)" />
                    </div>
                  </div>

                  <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                    <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                      <div>
                        <div class="text-lg font-medium mt-2"><Tag style="height: 15px;"><b>{{  $t('title') }} : </b>{{ item.product_name }}</Tag></div>
                        <span class="font-medium text-surface-500 dark:text-surface-400 text-sm"><Tag style="height: 15px;"><b>{{  $t('product_slug') }} : </b>{{ item.product_slug
                          }}</Tag></span>

                      </div>
                      <!--
                    <div class="bg-surface-100 p-1" style="border-radius: 30px">
                      <div class="bg-surface-0 flex items-center gap-2 justify-center py-1 px-2"
                        style="border-radius: 30px;">
                        <Badge v-for="lang in item.product_lang" :value="lang" />
                      </div>
                    </div>
                    -->
                    </div>

                    <div class="flex flex-col md:items-end gap-8">
                      <span class="text-xl font-semibold" style="visibility: hidden">?</span>
                      <div class="flex flex-row-reverse md:flex-row gap-2">
                        <Button icon="pi pi-trash" outlined @click="confirmDelete(item)" />
                        <Button icon="pi pi-cog" outlined @click="editProduct(item)" />
                        <Button icon="pi pi-shopping-cart" :label="$t('manage')" @click="redirectProduct(item)"
                          class="flex-auto md:flex-initial whitespace-nowrap" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </DataView>
      </div>
    </div>
  </div>


  <!-- Drawer part -->
  <Dialog v-model:visible="drawer" :header="drawerTitle" :modal="true" :closable="true" :dismissableMask="true"
    :style="{ width: '25rem' }">
    <div class="p-fluid grid">
      <div class="col-12 mb-3">
        <FloatLabel variant="in">
          <InputText :invalid="productNameSeverity" class="w-full" id="productName" v-model="productName" />
          <label class="w-full" for="productName">{{ $t('productName') }}</label>
        </FloatLabel>
      </div>
      <div class="col-12 mb-3">
        <FloatLabel variant="in">
          <InputText :invalid="productSlugSeverity" class="w-full" id="productSlug" v-model="productSlug" />
          <label class="w-full" for="productSlug">{{ $t('productSlug') }}</label>
        </FloatLabel>
      </div>
      <div class="col-12 mb-3">
        <SelectButton style="width: 100%;" v-model="productActif" :options="options" aria-labelledby="basic" />
      </div>
      <div class="col-6">
        <Button class="w-full" severity="danger" outlined raised @click="cancelEdit">{{ $t('cancel') }}</Button>
      </div>
      <div class="col-6">
        <Button v-if="!editMode" class="w-full" @click="manageProduct" raised>{{ $t('save') }}</Button>
        <Button v-else class="w-full" @click="updateProduct" raised>{{ $t('update') }}</Button>
      </div>
    </div>
  </Dialog>

  <DialogComponent @closeConfirmation="deleteProduct" :display="displayModal" />
</template>
