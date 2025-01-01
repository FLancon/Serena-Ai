<template>
    <div className="card">
        <div class="h-[calc(100vh-13rem)] flex">
            <!-- Conversations List -->
            <div class="w-1/4 rounded-l-xl flex flex-col h-full">
                <!-- Search Bar -->
                <div class="p-3 border-b border-white/10">
                    <div class="relative">
                        <input type="text" placeholder="Search messages..." class="w-full bg-white/5 text-grey placeholder-black/50 rounded-lg pl-10 pr-4 py-1.5 text-sm" v-model="searchQuery" />
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute left-3 top-2 text-grey/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <!-- Conversations -->
                <div class="flex-1 overflow-y-auto">
                    <div v-if="isLoading" class="p-3 text-grey/50">Loading conversations...</div>
                    <div v-else-if="error" class="p-3 text-red-400">
                        {{ error }}
                    </div>
                    <div v-else class="divide-y divide-white/10">
                        <div
                            v-for="conversation in filteredConversations"
                            :key="conversation.id"
                            @click="selectConversation(conversation.id)"
                            class="p-3 hover:bg-black/10 cursor-pointer transition-colors"
                            :class="{
                                'bg-black/5': selectedConversation?.id === conversation.id
                            }"
                        >
                            <div class="flex justify-between items-start">
                                <div class="flex items-center gap-2">
                                    <Avatar :label="getSourceLabel(conversation.apiSourceId).substring(0, 1)" :style="'background-color:' + getSourceLabelColor(conversation.apiSourceId)" size="large" shape="circle"></Avatar>
                                    <div>
                                        <div class="columns-2">
                                            <h3 class="font-medium text-grey">
                                                {{ capitalize(conversation.bookingDetails.firstName) }}
                                                {{ capitalize(conversation.bookingDetails.lastName) }}
                                            </h3>
                                            <div class="flex flex-col gap-0.5">
                                                <Chip :label="formatDate(conversation.bookingDetails.arrival)" icon="pi pi-arrow-down" class="bg-red-500/50 text-xs leading-none py-0.5 px-1.5 h-6" />
                                                <Chip :label="formatDate(conversation.bookingDetails.departure)" icon="pi pi-arrow-up" class="bg-cyan-500/50 text-xs leading-none py-0.5 px-1.5 h-6" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- <span class="text-xs text-grey/50">{{ conversation.lastMessageTimeDistance }}</span> -->
                            </div>

                            <p class="text-sm text-grey/70 truncate mt-0.5">
                                {{ conversation.lastMessage }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Chat Area -->
            <div class="w-1/2 rounded-r-xl flex flex-col h-full">
                <div v-if="selectedConversation" class="flex-1 flex flex-col h-full">
                    <!-- Chat Header -->
                    <div class="p-3 border-b border-black/10">
                        <div class="flex items-center gap-2">
                            <h2 class="font-medium text-grey">
                                {{ capitalize(selectedConversation.bookingDetails.firstName) }}
                                {{ capitalize(selectedConversation.bookingDetails.lastName) }}
                            </h2>
                            <span class="px-2 py-0.5 text-xs rounded-full text-grey" :class="selectedConversation.apiSourceId === 19 ? 'bg-blue-500/50' : 'bg-red-500/50'">
                                {{ getSourceLabel(selectedConversation.apiSourceId) }}
                            </span>

                            <!-- BADGE ARRIVAL -->
                            <span class="px-2 py-0.5 text-xs rounded-full text-grey bg-cyan-500/50 flex">
                                <svg viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-3 my-0.5 mr-1">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                                </svg>
                                {{ formatDate(selectedConversation.bookingDetails.arrival) }}
                            </span>

                            <!-- BADGE DEPARTURE -->
                            <span class="px-2 py-0.5 text-xs rounded-full text-grey bg-red-500/50 flex">
                                <svg viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-3 my-0.5 mr-1">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                                </svg>

                                {{ formatDate(selectedConversation.bookingDetails.departure) }}
                            </span>
                        </div>
                        <p class="text-sm text-grey/50">
                            {{ selectedConversation.propertyDetails.name }}
                        </p>
                    </div>

                    <!-- Messages -->
                    <div class="flex-1 overflow-y-auto p-3 space-y-3" ref="messageContainer">
                        <div v-for="message in selectedConversation.messages" :key="message.id" class="flex" :class="message.source === 'guest' ? 'justify-start' : 'justify-end'">
                            <div :class="['max-w-[70%] rounded-lg px-3 py-2', message.source === 'guest' ? 'bg-black/5' : 'bg-blue-500']">
                                <p :class="message.source === 'guest' ? 'text-black/80' : 'text-white/90'">{{ message.content }}</p>
                                <span class="text-xs mt-1 text-black/50 flex" :class="message.source === 'guest' ? 'justify-star text-black/50t' : 'justify-end text-white/50'">
                                    {{ message.time }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Input Area -->
                    <div class="p-3 border-t border-black/10">
                        <div class="flex gap-2">
                            <input type="text" placeholder="Type a message..." class="flex-1 bg-white/5 text-grey placeholder-white/50 rounded-lg px-3 py-2 border-black/5" v-model="newMessage" @keyup.enter="handleSendMessage" />
                            <button @click="handleSendMessage" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" :disabled="!newMessage.trim() || isSending">
                                {{ isSending ? 'Sending...' : 'Send' }}
                            </button>
                        </div>
                    </div>
                </div>
                <div v-else class="flex-1 flex items-center justify-center text-grey/50">Select a conversation to start messaging with a guest</div>
            </div>

            <!-- Booking info Area -->
            <div class="w-1/4 flex-1 rounded-r-xl flex flex-col h-full">
                <div v-if="selectedConversation" class="flex-1 flex flex-col h-full">
                    <!-- Booking Info : Listing -->
                    <div class="p-3 border-b border-white/10">
                        <h1 class="font-bold text-grey">Listing</h1>
                        <div class="flex flex-col gap-2">
                            <Chip :label="selectedConversation.propertyDetails.name.substring(0, 40) + ' ...'" image="/img/hotelRoom.jpg" class="w-full mt-2" />

                            <div class="flex items-center gap-2">
                                <i class="pi pi-map-marker text-gray-600"></i>
                                <span class="text-gray-600">{{ selectedConversation.propertyDetails.address }}</span>
                            </div>
                        </div>
                    </div>

                    <Divider />

                    <!-- Booking Info : Reservation -->
                    <div class="flex-1 overflow-y-auto p-3 space-y-3">
                        <h1 class="font-bold text-grey">Reservation</h1>

                        <!-- Première Chip : pleine largeur -->
                        <div class="w-full">
                            <Chip :label="selectedConversation.bookingDetails.numAdult + ' adulte(s)' + ' / ' + selectedConversation.bookingDetails.numChild + ' enfant(s)'" icon="pi pi-users" class="" />
                        </div>

                        <!-- Deuxième et Troisième Chip : côte à côte -->
                        <div class="grid grid-cols-2 gap-2">
                            <Chip :label="selectedConversation.bookingDetails.price + '€'" icon="pi pi-money-bill" class="" />
                            <Chip :label="differenceInDays(new Date(selectedConversation.bookingDetails.departure), new Date(selectedConversation.bookingDetails.arrival)) + ' nuit(s)'" icon="pi pi-calendar-clock" class="" />
                        </div>
                    </div>

                    <Divider />

                    <!-- Booking Info : Upsel -->
                    <div class="flex-1 overflow-y-auto p-3 space-y-3">
                        <h1 class="font-bold text-grey">Upsell</h1>

                        <!-- Première Chip : pleine largeur -->
                        <div class="w-full">
                            <Chip :label="selectedConversation.bookingDetails.numAdult + ' adulte(s)' + ' / ' + selectedConversation.bookingDetails.numChild + ' enfant(s)'" icon="pi pi-users" class="" />
                        </div>

                        <!-- Deuxième et Troisième Chip : côte à côte -->
                        <div class="grid grid-cols-2 gap-2">
                            <Chip :label="selectedConversation.bookingDetails.price + '€'" icon="pi pi-money-bill" class="" />
                            <Chip :label="differenceInDays(new Date(selectedConversation.bookingDetails.departure), new Date(selectedConversation.bookingDetails.arrival)) + ' nuit(s)'" icon="pi pi-calendar-clock" class="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { differenceInDays } from 'date-fns';
import { useMessages } from '~/composables/useMessages';

const { conversations, completedConversations, selectedConversation, isLoading, error, fetchMessages, selectConversation, sendMessage } = useMessages();
const checkInTimeValue = ref(null);
const checkOutTimeValue = ref(null);
const calendarValue = ref(null);
const searchQuery = ref('');
const newMessage = ref('');
const messageContainer = ref(null);
const isSending = ref(false);

/**
 * Returns a label for the given API source ID.
 *
 * @param {number} apiSourceId - The ID of the API source.
 * @returns {string} A string representing the source label, such as "Direct", "Airbnb", "Expedia",
 * "Booking.com", or "Unknown" if the ID does not match any known source.
 */
const getSourceLabel = (apiSourceId) => {
    switch (apiSourceId) {
        case 0:
            return 'Direct';
        case 10 || 46:
            return 'Airbnb';
        case 14:
            return 'Expedia';
        case 19:
            return 'Booking.com';
        default:
            return 'Unknown';
    }
};

/**
 * Returns a label for the given API source ID.
 *
 * @param {number} apiSourceId - The ID of the API source.
 * @returns {string} A color representing the source label, such as "Direct", "Airbnb", "Expedia",
 * "Booking.com", or "Unknown" if the ID does not match any known source.
 */
const getSourceLabelColor = (apiSourceId) => {
    switch (apiSourceId) {
        case 0:
            return '#d0d0d0';
        case 10 || 46:
            return '#f03d17';
        case 14:
            return '#fbf530';
        case 19:
            return '#3080fb';
        default:
            return '#8e8e8e';
    }
};

const filteredConversations = computed(() => {
    if (!searchQuery.value) return conversations.value;

    const query = searchQuery.value.toLowerCase();
    return conversations.value.filter((conversation) => conversation.guest.toLowerCase().includes(query) || conversation.lastMessage.toLowerCase().includes(query));
});

watch(
    () => selectedConversation.value?.messages,
    () => {
        if (selectedConversation.value) {
            nextTick(() => {
                if (messageContainer.value) {
                    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
                }
            });
        }
    },
    { deep: true }
);

const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

const formatDate = (dateString) => {
    // Split the input date string into components
    const [year, month, day] = dateString.split('-');

    // Return the date in DD-MM-YYYY format
    return `${day}-${month}-${year}`;
};

onMounted(async () => {
    await fetchMessages();
    console.log(selectedConversation);
});
</script>
