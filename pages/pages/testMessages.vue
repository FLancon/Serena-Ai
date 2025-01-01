<template>
    <div className="card">
        <div class="h-[calc(100vh-4rem)] flex mt-2">
            <!-- Conversations List -->
            <div class="w-96 glass rounded-l-xl flex flex-col h-full">
                <!-- Search Bar -->
                <div class="p-3 border-b border-white/10">
                    <div class="relative">
                        <input type="text" placeholder="Search messages..." class="w-full bg-white/5 text-white placeholder-white/50 rounded-lg pl-10 pr-4 py-1.5 text-sm" v-model="searchQuery" />
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute left-3 top-2 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <!-- Conversations -->
                <div class="flex-1 overflow-y-auto">
                    <div v-if="isLoading" class="p-3 text-white/50">Loading conversations...</div>
                    <div v-else-if="error" class="p-3 text-red-400">
                        {{ error }}
                    </div>
                    <div v-else class="divide-y divide-white/10">
                        <div
                            v-for="conversation in filteredConversations"
                            :key="conversation.id"
                            @click="selectConversation(conversation.id)"
                            class="p-3 hover:bg-white/5 cursor-pointer transition-colors"
                            :class="{
                                'bg-white/10': selectedConversation?.id === conversation.id
                            }"
                        >
                            <div class="flex justify-between items-start">
                                <div class="flex items-center gap-2">
                                    <h3 class="font-medium text-white">
                                        {{ capitalize(conversation.bookingDetails.firstName) }}
                                        {{ capitalize(conversation.bookingDetails.lastName) }}
                                    </h3>

                                    <span class="px-2 py-0.5 text-xs rounded-full text-white" :class="conversation.apiSourceId === 19 ? 'bg-blue-500/50' : 'bg-red-500/50'">
                                        {{ getSourceLabel(conversation.apiSourceId) }}
                                    </span>
                                </div>
                                <span class="text-xs text-white/50">{{ conversation.lastMessageTimeDistance }}</span>
                            </div>
                            <p class="text-sm text-white/70 truncate mt-0.5">
                                {{ conversation.lastMessage }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Chat Area -->
            <div class="flex-1 glass rounded-r-xl flex flex-col h-full">
                <div v-if="selectedConversation" class="flex-1 flex flex-col h-full">
                    <!-- Chat Header -->
                    <div class="p-3 border-b border-white/10">
                        <div class="flex items-center gap-2">
                            <h2 class="font-medium text-white">
                                {{ capitalize(selectedConversation.bookingDetails.firstName) }}
                                {{ capitalize(selectedConversation.bookingDetails.lastName) }}
                            </h2>
                            <span class="px-2 py-0.5 text-xs rounded-full text-white" :class="selectedConversation.apiSourceId === 19 ? 'bg-blue-500/50' : 'bg-red-500/50'">
                                {{ getSourceLabel(selectedConversation.apiSourceId) }}
                            </span>

                            <!-- BADGE ARRIVAL -->
                            <span class="px-2 py-0.5 text-xs rounded-full text-white bg-cyan-500/50 flex">
                                <svg viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-3 my-0.5 mr-1">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                                </svg>
                                {{ formatDate(selectedConversation.bookingDetails.arrival) }}
                            </span>

                            <!-- BADGE DEPARTURE -->
                            <span class="px-2 py-0.5 text-xs rounded-full text-white bg-red-500/50 flex">
                                <svg viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-3 my-0.5 mr-1">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                                </svg>

                                {{ formatDate(selectedConversation.bookingDetails.departure) }}
                            </span>
                        </div>
                        <p class="text-sm text-white/50">
                            {{ selectedConversation.propertyDetails.name }}
                        </p>
                    </div>

                    <!-- Messages -->
                    <div class="flex-1 overflow-y-auto p-3 space-y-3" ref="messageContainer">
                        <div v-for="message in selectedConversation.messages" :key="message.id" class="flex" :class="message.source === 'guest' ? 'justify-start' : 'justify-end'">
                            <div :class="['max-w-[70%] rounded-lg px-3 py-2', message.source === 'guest' ? 'bg-white/10' : 'bg-blue-500']">
                                <p class="text-white text-sm">{{ message.content }}</p>
                                <span class="text-xs mt-1 block" :class="message.source === 'guest' ? 'text-white/50' : 'text-white/70'">
                                    {{ message.time }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Input Area -->
                    <div class="p-3 border-t border-white/10">
                        <div class="flex gap-2">
                            <input type="text" placeholder="Type a message..." class="flex-1 bg-white/5 text-white placeholder-white/50 rounded-lg px-3 py-2" v-model="newMessage" @keyup.enter="handleSendMessage" />
                            <button @click="handleSendMessage" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" :disabled="!newMessage.trim() || isSending">
                                {{ isSending ? 'Sending...' : 'Send' }}
                            </button>
                        </div>
                    </div>
                </div>
                <div v-else class="flex-1 flex items-center justify-center text-white/50">Select a conversation to start messaging with a guest</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useMessages } from '~/composables/useMessages';
import { useAI } from '~/composables/useAI';

const { conversations, completedConversations, selectedConversation, isLoading, error, fetchMessages, selectConversation, sendMessage } = useMessages();

const { incomingChat } = useAI();

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

const filteredConversations = computed(() => {
    if (!searchQuery.value) return conversations.value;

    const query = searchQuery.value.toLowerCase();
    return conversations.value.filter((conversation) => conversation.guest.toLowerCase().includes(query) || conversation.lastMessage.toLowerCase().includes(query));
});

onMounted(async () => {
    await fetchMessages();
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

const handleSendMessage = async () => {
    if (!newMessage.value.trim() || isSending.value) return;

    isSending.value = true;
    try {
        // FILTRE POUR NE MARCHER QUE SUR MA RESERVATION
        if ((selectedConversation.value.bookingId = 63311557)) {
            await sendMessage(newMessage.value);
        }
    } catch (e) {
        // Error is already handled in useMessages
    } finally {
        isSending.value = false;
    }
};
</script>

<style scoped>
.message-container::-webkit-scrollbar {
    width: 6px;
}

.message-container::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
}

.message-container::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
}
</style>
