<script setup>
const newMessage = ref('');
const isSending = ref(false);
const toast = useToast();

const handleSendMessage = (message) => {
    console.log(newMessage.value);
    toast.add({ severity: 'success', summary: 'New Message:', detail: newMessage.value, life: 3000 });
    newMessage.value = '';
};

const handleCreateImage = (message) => {
    console.log(message);
    toast.add({ severity: 'dangers', summary: 'Button:', detail: message, life: 3000 });
};
</script>

<template>
    <div className="card">
        <div class="interface-container">
            <h1 class="header">Comment puis-je vous aider ?</h1>
            <div class="input-container">
                <input type="text" placeholder="Type a message..." class="input-box" v-model="newMessage" @keyup.enter="handleSendMessage" />
                <div class="icons">
                    <i class="pi pi-paperclip p-2 cursor-pointer-"></i>
                    <i class="pi pi-microphone p-2 cursor-pointer"></i>
                </div>
            </div>
            <div class="actions">
                <Chip label="Créer une image" icon="pi pi-arrow-down" class="cursor-pointer bg-surface-100 border-solid border border-slate-200 hover:bg-surface-200" @click="handleCreateImage" />

                <Chip label="Proposer" icon="pi pi-lightbulb" class="cursor-pointer bg-surface-100 border-solid border border-slate-200 hover:bg-surface-200" @click="handleCreateImage" />

                <Chip label="Analyser" icon="pi pi-lightbulb" class="cursor-pointer bg-surface-100 border-solid border border-slate-200 hover:bg-surface-200" @click="handleCreateImage" />

                <Chip label="M'etonner" icon="pi pi-lightbulb" class="cursor-pointer bg-surface-100 border-solid border border-slate-200 hover:bg-surface-200" @click="handleCreateImage" />

                <Chip label="Plus" icon="pi pi-lightbulb" class="cursor-pointer bg-surface-100 border-solid border border-slate-200 hover:bg-surface-200" @click="handleCreateImage" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.interface-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: Arial, sans-serif;
    margin: 20px;
}

.header {
    font-size: 24px;
    margin-bottom: 20px;
}

.input-container {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 600px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 25px;
    padding: 10px 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.input-box {
    flex: 1;
    border: none;
    outline: none;
    font-size: 16px;
    background-color: transparent;
}

.icons {
    display: flex;
    align-items: center;
}

.icon {
    width: 20px;
    height: 20px;
    margin-left: 10px;
    cursor: pointer;
    background-repeat: no-repeat;
    background-size: contain;
}

.attachment {
    background-image: url('path-to-attachment-icon.svg');
}

.clipboard {
    background-image: url('path-to-clipboard-icon.svg');
}

.globe {
    background-image: url('path-to-globe-icon.svg');
}

.microphone {
    background-image: url('path-to-microphone-icon.svg');
}

.actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}

.action-button {
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    font-size: 14px;
    cursor: pointer;
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
