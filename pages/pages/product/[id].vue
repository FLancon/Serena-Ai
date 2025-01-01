<template>
  <div v-if="!loaded">
    <div class="card">
      <LoaderComponent />
    </div>

  </div>
  <div v-else>
    <!-- Filter part -->
    <div class="grid grid-cols-12 mb-2">
      <div class="col-span-6 lg:col-span-6 xl:col-span-6 sm:col-span-6">
        <InputText type="text" :placeholder="`${t('filter')}`" v-model="globalFilter" class="p-inputtext" />
      </div>
      <div class="col-span-6 lg:col-span-6 xl:col-span-6 sm:col-span-6 flex justify-end">
        <Button dense="compact" type="button" :label="`${t('addVideo')}`" icon="pi pi-plus"
          @click="openDialog(false)" />
      </div>
    </div>
    <!-- DataView part -->
    <div class="card">
      <DataView :value="globalFilterComputed" paginator :rows="5">
        <template #list="slotProps">
          <div class="flex flex-col">
            <div v-for="(item, index) in slotProps.items" :key="index">
              <div class="flex flex-col sm:flex-row sm:items-end p-6 gap-4"
                :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }">
                <div class="md:w-20 relative">
                  <Image alt="Image" preview>
                    <template #previewicon>
                      <i class="pi pi-search"></i>
                    </template>
                    <template #image>
                      <img class="block xl:block mx-auto rounded w-full" :src="item.video_cover" alt="image" />
                      <div class="absolute bg-black/70 rounded-border" style="right: 4px; bottom: 10px">
                        <Tag style="height: 15px;" :value="item.isactif ? $t('active') : $t('inactive')"
                          :severity="isActif(item)" />
                      </div>
                    </template>
                    <template #preview="slotProps">
                      <video :src="item.video_url" alt="preview" :style="slotProps.style" autoplay width="300" />
                    </template>
                  </Image>

                </div>

                <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                  <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                    <div>
                      <div class="text-lg font-medium mt-2">
                        <Tag style="height: 15px;"><b>{{  $t('title') }} : </b>{{ item.video_title }}</Tag>
                      </div>
                      <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">
                        <Tag style="height: 15px;"><b>{{ $t('language')}} : </b> <img 
                            src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
                            :class="`mr-2 flag flag-${item.video_lang.toLowerCase()}`" style="width: 18px" />{{
                              item.video_lang
                          }}</Tag>
                      </span>
                    </div>
                  </div>
                  <div class="flex flex-col md:items-end gap-8">
                    <span class="text-xl font-semibold" style="visibility: hidden">?</span>
                    <div class="flex flex-row-reverse md:flex-row gap-2">

                      <Button icon="pi pi-cog" outlined @click="editVideo(item)" />
                      <Button icon="pi pi-trash" outlined @click="confirmDelete(item)" />

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </DataView>
    </div>
    <!-- Add/Edit Dialog -->
    <Dialog v-model:visible="drawer" modal header="Video Form" :style="{ width: '25rem' }">
      <form>
        <div class="inset-x-2 mt-2 grid grid-cols-12">
          <div class="col-span-12 mb-2">
            <FloatLabel class="w-full" variant="on">
              <InputText class="w-full" id="videoName" inputId="videoName" v-model="formFields.videoName" />
              <label for="videoName">{{ $t('video.videoName') }}</label>
            </FloatLabel>
          </div>

          <div class="col-span-12 mb-2">
            <FloatLabel variant="on">
              <Select inputId="actifSelect" v-model="formFields.videoActif" :options="options" optionLabel="text"
                class="w-full">
                <template #option="slotProps">
                  {{ slotProps.option.text }}
                </template>
              </Select>
              <label for="actifSelect">{{ $t('video.videoActive') }}</label>
            </FloatLabel>
          </div>
          <div class="col-span-12 mb-2">
            <FloatLabel variant="on">
              <Select inputId="langSelect" v-model="formFields.selectedLang" placeholder="‎ " :options="countries"
                filter class="w-full">
                <template #value="slotProps">
                  <div v-if="slotProps.value" class="flex items-center">
                    <img :alt="slotProps.value.label"
                      src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
                      :class="`mr-2 flag flag-${slotProps.value.code.toLowerCase()}`" style="width: 18px" />
                    <div>{{ slotProps.value.name }}</div>
                  </div>
                  <span v-else>
                    {{ slotProps.placeholder }}
                  </span>
                </template>
                <template #option="slotProps">
                  <div class="flex items-center">
                    <img :alt="slotProps.option.label"
                      src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
                      :class="` flag flag-${slotProps.option.code.toLowerCase()}`" style="width: 18px" />
                    <div>{{ slotProps.option.name }}</div>
                  </div>
                </template>
              </Select>
              <label for="langSelect">{{ $t('video.videoLang') }}</label>
            </FloatLabel>
          </div>

          <div class="col-span-12 mb-1">
            <input v-if="!editMode"  type="file" @change="handleFileChange" />
          </div>
        </div>

        <div class="inset-x-2 mt-2 grid grid-cols-12">
          <div class="col-span-12 mb-2">
            <Button class="w-full" severity="danger" outlined raised @click="cancelEdit">{{ $t('cancel') }}</Button>
          </div>
          <div class="col-span-12">
            <Button v-if="!editMode" class="w-full" @click="addVideo" raised>{{ $t('save') }}</Button>
            <Button v-else class="w-full" @click="updateProduct" raised>{{ $t('update') }}</Button>
          </div>
        </div>
      </form>
    </Dialog>

    <!-- Dialog delete -->
    <DialogComponent @closeConfirmation="deleteVideo" :display="displayModal" />
  </div>


</template>

<script setup>
// npm parts
import { generateVideoThumbnailViaUrl } from '@rajesh896/video-thumbnails-generator';
import axios from 'axios';
import { CountryService } from '@/utils/CountryService.js';
const toast = useToast();
const { t } = useI18n();
// vue parts
const router = useRouter();


// ref parts
const countries = ref(await CountryService.getCountries());
const options = ref([{ bool: true, text: "Actif" }, { bool: false, text: "Inactif" }]);
const dialog = ref(false);
const displayModal = ref(false);
const videoToDelete = ref(null);
const $route = useRoute();
const loaded = ref(false);
const globalFilter = ref('');
const videoName = ref('');
const videoInput = ref(null);
const productActif = ref('Actif')

const editMode = ref(false);
const drawer = ref(false);
const id = $route.params.id;

const videos = ref(null);
const drawerTitle = computed(() => {
  return editMode.value ? 'Edit Product' : 'Add Product'
})

const formFields = reactive({
  videoName: '',
  video: null,
  videoActif: '',
  productId: '',
  updateId: '',
})

const globalFilterComputed = computed(() => {
  return videos.value.filter((video) => {
    return video.video_title.toLowerCase().includes(globalFilter.value.toLowerCase());
  });
});

const checkRights = async () => {
  const { data, error } = await $fetch('/api/videos/checkRight', {
    method: 'POST',
    body: { id },
  })

  if (!data || data.status !== 200) {

    router.push({
      path: '/utils/error',    // Path to your error page
      query: {
        code: '401',
        errorTitle: 'Access denied',          // Example query parameter
        message: 'Please contact support if needed' // Example query parameter
      }
    })

  }

}

const cancelEdit = () => {
  drawer.value = false;
  videoName.value = '';
  videoInput.value = null;
  productActif.value = '';
}

const openDialog = () => {

  resetForm();
  drawer.value = true;
}

const confirmDelete = (product) => {
  displayModal.value = true
  videoToDelete.value = product

};

const resetForm = () => {
  editMode.value = false;
  formFields.videoName = '';
  formFields.video = null;
  formFields.selectedLang = '';
  formFields.videoActif = '';
  formFields.productId = '';
  formFields.updateId = '';
}

const isActif = (video) => {
  return video.isactif === true ? 'success' : 'danger'
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    formFields.video = file;

  }
}

const editVideo = (video) => {
  formFields.videoName = video.video_title;
  formFields.videoActif = options.value.find((option) => option.bool === video.isactif);
  formFields.selectedLang = countries.value.find((country) => country.code === video.video_lang);
  formFields.productId = video.product_id;
  formFields.updateId = video.id;
  editMode.value = true;
  drawer.value = true;
}

const getVideos = async () => {
  const { data, error } = await $fetch('/api/videos/getVideos', {
    method: 'GET',
    params: { id },
  })


  if (!data || data.statusCode !== 200) {

    return;
  }

  videos.value = data.videos;


}

const getVideoCover = async (file) => {
  const thumbnail = await generateVideoThumbnailViaUrl(file, 1);
  return thumbnail;
}

const createVideoCover = async () => {

  videos.value.forEach(async (video) => {
    video.video_cover = await getVideoCover(video.video_url);
  })
}


const addVideo = async () => {

  const formData = new FormData();

  formFields.productId = id;


  // check if form is filled
  if (formFields.videoName === '' || formFields.video === null || formFields.videoActif === '' || formFields.selectedLang === '') {
    toast.add({
      position: 'bottom-right',
      severity: 'error',
      summary: t("toastErrorWarning"),
      detail: t("fillAllFields"),
      life: 3000,
    });
    return;
  }

  formData.append('videoTitle', formFields.videoName);
  formData.append('videoFile', formFields.video);
  formData.append('videoActif', formFields.videoActif.bool);
  formData.append('productId', formFields.productId);
  formData.append('videoLang', formFields.selectedLang.code);

  // Variable pour suivre la progression du téléchargement
  let uploadProgress = 0;

  try {
    loaded.value = false;
    drawer.value = false;
    toast.add({
      position: 'bottom-right',
      severity: 'success',
      summary: t("toastSuccess"),
      detail: t(""),
      life: 3000,
    });
    const { data, error } = await axios.post('/api/videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        console.log(progressEvent);
        if (progressEvent.total) {
          uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          toast.add({
            position: 'bottom-right',
            severity: 'info',
            summary: t("toastInfo"),
            detail: `${t("uploading")} ${uploadProgress}%`,
            life: 3000,
          });
        }
      },

    });

    if (!data || data.statusCode !== 200) {
      toast.add({
        position: 'bottom-right',
        severity: 'error',
        summary: t("toastErrorWarning"),
        detail: t("fillAllFields"),
        life: 3000,
      });

      resetForm();
      getVideos();
      return;
    }

    toast.add({
      position: 'bottom-right',
      severity: 'success',
      summary: t("toastErrorWarning"),
      detail: t("fillAllFields"),
      life: 3000,
    });
    await resetForm();
    await getVideos();
    await await createVideoCover();
    loaded.value = true;


  } catch (error) {
    console.error('Erreur lors de l’envoi de la vidéo :', error);
  }
}

const deleteVideo = async (bool) => {
  if(!bool){
    displayModal.value = false;
    return;
  }
  const id = videoToDelete.value.id;

  loaded.value = false;
  toast.add({
    position: 'bottom-right',
    severity: 'info',
    summary: t("toastInfo"),
    detail: t("deletingVideo"),
    life: 3000,
  });
  const { data, error} = await $fetch(`/api/videos/${id}`, {
    method: 'DELETE',
  })

  if (!data || data.statusCode !== 200) {
    toast.add({
      position: 'bottom-right',
      severity: 'error',
      summary: t("toastErrorWarning"),
      detail: t("errorDeleteVideo"),
      life: 3000,
    });
    return;
  }

  toast.add({
    position: 'bottom-right',
    severity: 'success',
    summary: t("toastSuccess"),
    detail: t("videoDeleted"),
    life: 3000,
  });

  displayModal.value = false;
  await getVideos();
  await createVideoCover();

  setTimeout(() => {
    loaded.value = true;
  }, 1000);


}

// init
onBeforeMount(async () => {
  console.log("checkRights");
  await checkRights();
  console.log("getVideos");
  await getVideos();
  console.log("getVideoCover");
  await createVideoCover();
  console.log("all Loaded");
  setTimeout(() => {
    loaded.value = true;
  }, 1000);


})
</script>
