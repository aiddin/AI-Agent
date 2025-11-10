<template>
    <div class="flex flex-col lg:flex-row h-full min-h-screen lg:min-h-0">
        <!-- Left Sidebar - File Upload & Management -->
        <div
            class="w-full lg:max-w-sm lg:h-full lg:border-r border-b lg:border-b-0 border-[#e0e6ed] dark:border-[#1b2e4b] overflow-y-auto bg-white dark:bg-[#0e1726]">
            <div class="p-4 lg:p-6 space-y-4 lg:space-y-6">
                <!-- Header -->
                <div>
                    <h2 class="text-xl lg:text-2xl font-semibold dark:text-white-light">Chat with your documents</h2>
                    <p class="text-sm lg:text-base text-white-dark mt-1">Upload documents and ask questions</p>
                </div>

                <!-- Error Message -->
                <div v-if="errorMessage" class="panel bg-danger-light">
                    <div class="flex items-center gap-3">
                        <svg class="w-5 h-5 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p class="text-sm text-danger">{{ errorMessage }}</p>
                        <button @click="errorMessage = ''" class="ml-auto text-danger hover:text-danger-dark">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Upload Section -->
                <div class="panel" v-if="!currentDocument">
                    <div class="mb-4">
                        <h5 class="font-semibold text-base dark:text-white-light mb-2">Upload Document</h5>
                        <p class="text-xs text-white-dark">Support: PDF, DOC, Images, Audio, Video, Text</p>
                    </div>

                    <!-- Drag and Drop Area -->
                    <div @dragover.prevent @drop.prevent="handleDrop" @click="$refs.fileInput.click()"
                        class="border-2 border-dashed border-[#e0e6ed] dark:border-[#1b2e4b] rounded-lg p-6 lg:p-8 text-center hover:border-primary transition-colors duration-200 cursor-pointer min-h-[160px] flex flex-col justify-center items-center">
                        <div class="text-primary mb-4">
                            <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        <p class="text-sm text-white-dark mb-2">Drop File Here</p>
                        <p class="text-xs text-white-dark mb-3">- or -</p>
                        <button type="button" class="btn btn-primary btn-sm">Click to Upload</button>
                        <input ref="fileInput" type="file" @change="handleFileUpload"
                            accept=".pdf,.doc,.docx,.txt,image/*,audio/*,video/*" class="hidden" />
                    </div>
                </div>

                <!-- Current Document Info -->
                <div v-if="currentDocument" class="space-y-4">
                    <div class="panel">
                        <div class="flex items-start justify-between mb-3">
                            <h5 class="font-semibold text-base dark:text-white-light">Current Document</h5>
                            <button @click="removeDocument" class="text-danger hover:text-danger-dark transition-colors">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                        <div class="flex items-center gap-3 p-3 bg-[#f1f2f3] dark:bg-[#1b2e4b] rounded-lg">
                            <div class="text-primary flex-shrink-0">
                                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium dark:text-white-light truncate">{{ currentDocument.name }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Processing Status -->
                    <div v-if="isProcessing" class="panel">
                        <div class="flex items-center gap-3 p-3">
                            <div
                                class="animate-spin w-6 h-6 border-3 border-primary border-t-transparent rounded-full flex-shrink-0">
                            </div>
                            <div class="flex-1">
                                <p class="text-sm font-medium dark:text-white-light">Processing document...</p>
                                <p class="text-xs text-white-dark mt-1">This may take a moment</p>
                            </div>
                        </div>
                    </div>

                    <!-- Upload New Document Button -->
                    <button @click="removeDocument" class="btn btn-outline-primary w-full">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Upload New Document
                    </button>
                </div>

                <!-- Your Files Section -->
                <div class="panel">
                    <h5 class="font-semibold text-base dark:text-white-light mb-3">Your Files</h5>

                    <!-- Loading State for Files -->
                    <div v-if="isLoadingFiles" class="flex items-center justify-center py-8">
                        <div class="text-center">
                            <div class="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
                            <p class="text-sm text-white-dark">Loading documents...</p>
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div v-else-if="uploadedFiles.length === 0" class="py-8 text-center">
                        <svg class="w-12 h-12 mx-auto text-white-dark mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p class="text-sm text-white-dark">No documents uploaded yet</p>
                    </div>

                    <!-- Files List -->
                    <div v-else class="space-y-2 max-h-[300px] overflow-y-auto">
                        <div v-for="file in uploadedFiles" :key="file.id" @click="loadDocument(file)"
                            class="flex items-center gap-3 p-3 bg-[#f1f2f3] dark:bg-[#1b2e4b] rounded-lg hover:bg-[#e0e6ed] dark:hover:bg-[#253b5c] cursor-pointer transition-colors"
                            :class="{ 'ring-2 ring-primary': currentDocument && currentDocument.id === file.id }">
                            <div class="text-white-dark flex-shrink-0">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-xs font-medium dark:text-white-light truncate">{{ file.name }}</p>
                            </div>
                            <span v-if="file.processed" class="badge bg-success text-xs flex-shrink-0">PROCESSED</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Middle - Document Preview -->
        <div class="flex-1 flex flex-col bg-[#f9fafb] dark:bg-[#0e1726] border-r border-[#e0e6ed] dark:border-[#1b2e4b] overflow-hidden">
            <!-- Empty State -->
            <div v-if="!currentDocument"
                class="flex-1 flex items-center justify-center p-4 lg:p-6 overflow-y-auto">
                <div class="text-center max-w-xl">
                    <div class="mb-6">
                        <div class="text-primary mb-4">
                            <svg class="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                    <h3 class="text-xl lg:text-2xl font-semibold mb-3 dark:text-white-light">No Document Selected
                    </h3>
                    <p class="text-sm lg:text-base text-white-dark leading-relaxed mb-4">
                        Upload a document from the sidebar to view its preview here.
                    </p>
                    <p class="text-xs lg:text-sm text-white-dark">
                        Supported: PDF, Images, Audio, Video, Text, DOC, DOCX
                    </p>
                </div>
            </div>

            <!-- Document Preview Area -->
            <div v-else class="flex-1 flex flex-col overflow-hidden">
                <!-- Preview Header -->
                <div class="p-4 border-b border-[#e0e6ed] dark:border-[#1b2e4b] bg-white dark:bg-[#1b2e4b]">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="text-primary">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold dark:text-white-light">{{ currentDocument.name }}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Preview Content -->
                <div class="flex-1 overflow-y-auto p-6 bg-white dark:bg-[#0e1726]">
                    <!-- Loading Preview -->
                    <div v-if="isProcessing" class="flex items-center justify-center h-full">
                        <div class="text-center">
                            <div class="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p class="text-lg font-medium dark:text-white-light mb-2">Loading document preview...</p>
                            <p class="text-sm text-white-dark">Please wait while we prepare your document</p>
                        </div>
                    </div>

                    <!-- Image Preview -->
                    <div v-else-if="isImage(currentDocument.name)" class="flex items-center justify-center h-full">
                        <img :src="documentPreviewUrl" :alt="currentDocument.name"
                            class="max-w-full max-h-full object-contain rounded-lg shadow-lg" />
                    </div>

                    <!-- Audio Preview -->
                    <div v-else-if="isAudio(currentDocument.name)" class="flex items-center justify-center h-full">
                        <div class="w-full max-w-2xl">
                            <div class="text-primary mb-6 text-center">
                                <svg class="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                </svg>
                            </div>
                            <audio controls class="w-full" :src="documentPreviewUrl">
                                Your browser does not support the audio element.
                            </audio>
                            <p class="text-sm text-white-dark text-center mt-4">{{ currentDocument.name }}</p>
                        </div>
                    </div>

                    <!-- Video Preview -->
                    <div v-else-if="isVideo(currentDocument.name)" class="flex items-center justify-center h-full">
                        <div class="w-full max-w-4xl">
                            <video controls class="w-full rounded-lg shadow-lg" :src="documentPreviewUrl">
                                Your browser does not support the video element.
                            </video>
                            <p class="text-sm text-white-dark text-center mt-4">{{ currentDocument.name }}</p>
                        </div>
                    </div>

                    <!-- PDF Preview -->
                    <div v-else-if="isPDF(currentDocument.name)" class="h-full">
                        <iframe :src="documentPreviewUrl" class="w-full h-full rounded-lg border-0"></iframe>
                    </div>

                    <!-- Text Preview -->
                    <div v-else-if="isText(currentDocument.name)" class="prose dark:prose-invert max-w-none">
                        <pre class="whitespace-pre-wrap font-mono text-sm dark:text-white-light bg-[#f9fafb] dark:bg-[#1b2e4b] p-4 rounded-lg">{{ documentContent }}</pre>
                    </div>

                    <!-- DOC/Other Files Preview Placeholder -->
                    <div v-else class="flex items-center justify-center h-full">
                        <div class="text-center">
                            <div class="text-primary mb-4">
                                <svg class="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h4 class="text-lg font-semibold dark:text-white-light mb-2">{{ getFileType(currentDocument.name) }} Document</h4>
                            <p class="text-sm text-white-dark mb-4">{{ currentDocument.name }}</p>
                            <p class="text-xs text-white-dark">Preview not available for this file type.<br/>Use the chat to ask questions about this document.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right Side - Chat Interface -->
        <div class="w-full lg:w-[400px] flex flex-col bg-white dark:bg-[#0e1726] overflow-hidden">
            <!-- Empty State when no document -->
            <div v-if="!currentDocument" class="flex-1 flex items-center justify-center p-6">
                <div class="text-center">
                    <div class="text-primary mb-4">
                        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <h4 class="text-lg font-semibold dark:text-white-light mb-2">Ready to Chat</h4>
                    <p class="text-sm text-white-dark">Upload a document to start asking questions</p>
                </div>
            </div>

            <!-- Chat Area -->
            <div v-else class="flex-1 flex flex-col overflow-hidden">
                <!-- Chat Messages -->
                <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
                    <!-- Welcome Message (only when no messages) -->
                    <div v-if="messages.length === 0" class="space-y-4">
                        <div class="flex gap-3">
                            <div class="flex-shrink-0">
                                <div
                                    class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                            <div class="flex-1">
                                <div class="bg-[#f1f2f3] dark:bg-[#1b2e4b] rounded-lg p-4">
                                    <p class="text-sm dark:text-white-light">{{ welcomeMessage }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Chat Messages -->
                    <div v-for="(message, index) in messages" :key="index" class="flex gap-3"
                        :class="{ 'flex-row-reverse': message.role === 'user' }">
                        <div class="flex-shrink-0">
                            <div class="w-8 h-8 rounded-full flex items-center justify-center"
                                :class="message.role === 'user' ? 'bg-secondary text-white' : 'bg-primary text-white'">
                                <svg v-if="message.role === 'assistant'" class="w-5 h-5" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        </div>
                        <div class="flex-1 max-w-[80%]">
                            <div class="rounded-lg p-4"
                                :class="message.role === 'user' ? 'bg-secondary text-white' : 'bg-[#f1f2f3] dark:bg-[#1b2e4b]'">
                                <p class="text-sm whitespace-pre-wrap"
                                    :class="message.role === 'user' ? 'text-white' : 'dark:text-white-light'">{{
                                        message.content }}</p>
                            </div>
                            <p class="text-xs text-white-dark mt-1 px-1">{{ message.timestamp }}</p>
                        </div>
                    </div>

                    <!-- Loading Indicator -->
                    <div v-if="isTyping" class="flex gap-3">
                        <div class="flex-shrink-0">
                            <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        <div class="flex-1">
                            <div class="bg-[#f1f2f3] dark:bg-[#1b2e4b] rounded-lg p-4 inline-block">
                                <div class="flex gap-1">
                                    <span class="w-2 h-2 bg-primary rounded-full animate-bounce"
                                        style="animation-delay: 0ms"></span>
                                    <span class="w-2 h-2 bg-primary rounded-full animate-bounce"
                                        style="animation-delay: 150ms"></span>
                                    <span class="w-2 h-2 bg-primary rounded-full animate-bounce"
                                        style="animation-delay: 300ms"></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Suggested Questions (shown when available) -->
                    <div v-if="suggestedQuestions.length > 0 && !isTyping" class="space-y-3">
                        <p class="text-xs text-white-dark font-medium">Suggested questions:</p>
                        <div class="grid grid-cols-1 gap-2">
                            <button v-for="(question, index) in suggestedQuestions" :key="index"
                                @click="askQuestion(question)"
                                class="text-left p-3 bg-white dark:bg-[#0e1726] border border-[#e0e6ed] dark:border-[#1b2e4b] rounded-lg hover:border-primary hover:shadow-md transition-all text-sm dark:text-white-light">
                                {{ question }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Chat Input -->
                <div class="border-t border-[#e0e6ed] dark:border-[#1b2e4b] p-4 bg-white dark:bg-[#0e1726]">
                    <form @submit.prevent="sendMessage" class="flex gap-2">
                        <input
                            v-model="currentMessage"
                            type="text"
                            placeholder="Type your question..."
                            class="form-input flex-1"
                            :disabled="inputDisabled"
                        />
                        <button type="submit"
                            class="btn btn-primary flex-shrink-0 px-4 flex items-center justify-center"
                            :disabled="!currentMessage.trim() || inputDisabled">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import {
    getAllDocuments,
    uploadDocument,
    processDocument,
    initializeChat,
    sendChatMessage,
    getDocumentById,
    type Document,
    type ChatResponse
} from '@/api/documentChatApi'

// Types
interface DocumentWithFile extends Document {
    file?: File
}

interface ChatMessage {
    role: 'user' | 'assistant'
    content: string
    timestamp: string
}

// State
const currentDocument = ref<DocumentWithFile | null>(null)
const uploadedFiles = ref<DocumentWithFile[]>([])
const isProcessing = ref(false)
const isTyping = ref(false)
const isLoadingFiles = ref(false)
const messages = ref<ChatMessage[]>([])
const currentMessage = ref('')
const chatContainer = ref<HTMLElement | null>(null)
const suggestedQuestions = ref<string[]>([])
const documentPreviewUrl = ref('')
const documentContent = ref('')
const sessionId = ref('')
const errorMessage = ref('')

// Debug watchers
watch([isProcessing, isTyping], ([processing, typing]) => {
    console.log('DocumentChat State:', { isProcessing: processing, isTyping: typing, hasDocument: !!currentDocument.value, hasSession: !!sessionId.value })
})

// Computed
const welcomeMessage = computed(() => {
    if (currentDocument.value) {
        return `I've analyzed "${currentDocument.value.name}". What would you like to explore in this document?`
    }
    return 'Hello! Upload a document and I\'ll help you understand its content.'
})

const inputDisabled = computed(() => {
    const disabled = isTyping.value || isProcessing.value
    console.log('Input disabled:', disabled, { isTyping: isTyping.value, isProcessing: isProcessing.value })
    return disabled
})

// Helper functions for file type detection
const isImage = (filename) => {
    const ext = filename.split('.').pop().toLowerCase()
    return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext)
}

const isText = (filename) => {
    const ext = filename.split('.').pop().toLowerCase()
    return ['txt', 'md', 'json', 'xml', 'csv', 'log'].includes(ext)
}

const isAudio = (filename) => {
    const ext = filename.split('.').pop().toLowerCase()
    return ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac', 'wma'].includes(ext)
}

const isVideo = (filename) => {
    const ext = filename.split('.').pop().toLowerCase()
    return ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'flv'].includes(ext)
}

const isPDF = (filename) => {
    const ext = filename.split('.').pop().toLowerCase()
    return ext === 'pdf'
}

const getFileType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase()
    const typeMap = {
        'pdf': 'PDF',
        'doc': 'Word',
        'docx': 'Word',
        'xls': 'Excel',
        'xlsx': 'Excel',
        'ppt': 'PowerPoint',
        'pptx': 'PowerPoint',
        'mp3': 'Audio',
        'wav': 'Audio',
        'ogg': 'Audio',
        'm4a': 'Audio',
        'mp4': 'Video',
        'webm': 'Video',
        'mov': 'Video'
    }
    return typeMap[ext] || ext.toUpperCase()
}

// File Upload Handlers
const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
        await processDocumentFile(file)
    }
}

const handleDrop = async (event) => {
    const file = event.dataTransfer.files[0]
    if (file) {
        await processDocumentFile(file)
    }
}

const processDocumentFile = async (file) => {
    try {
        isProcessing.value = true
        isTyping.value = false
        errorMessage.value = ''

        // Step 1: Upload the document
        const uploadResponse = await uploadDocument(file)
        const documentId = uploadResponse.document_id

        // Set current document with the uploaded document ID
        currentDocument.value = {
            id: documentId,
            name: file.name,
            size: file.size,
            processed: false,
            file: file
        }

        // Generate preview for images
        if (isImage(file.name)) {
            const reader = new FileReader()
            reader.onload = (e) => {
                if (e.target?.result) {
                    documentPreviewUrl.value = e.target.result as string
                }
            }
            reader.readAsDataURL(file)
        }

        // Generate preview for audio files
        if (isAudio(file.name)) {
            const url = URL.createObjectURL(file)
            documentPreviewUrl.value = url
        }

        // Generate preview for video files
        if (isVideo(file.name)) {
            const url = URL.createObjectURL(file)
            documentPreviewUrl.value = url
        }

        // Generate preview for PDF files
        if (isPDF(file.name)) {
            const url = URL.createObjectURL(file)
            documentPreviewUrl.value = url
        }

        // Generate preview for text files
        if (isText(file.name)) {
            const reader = new FileReader()
            reader.onload = (e) => {
                if (e.target?.result) {
                    documentContent.value = e.target.result as string
                }
            }
            reader.readAsText(file)
        }

        // Step 2: Process the document
        const processResponse = await processDocument(documentId)

        if (processResponse.success) {
            currentDocument.value.processed = true

            // Step 3: Initialize chat session
            const chatResponse = await initializeChat(documentId)
            sessionId.value = chatResponse.sessionId

            // Add to uploaded files
            uploadedFiles.value.push({ ...currentDocument.value })

            // Use suggested questions from the API response
            suggestedQuestions.value = chatResponse.suggested_questions || []

            // Reset messages to show welcome message from computed property
            messages.value = []

            setTimeout(() => scrollToBottom(), 0)
        } else {
            throw new Error('Document processing failed')
        }
    } catch (error) {
        console.error('Error processing document:', error)
        errorMessage.value = 'Failed to process document. Please try again.'
        currentDocument.value = null
    } finally {
        isProcessing.value = false
    }
}

const generateSuggestedQuestions = (fileName) => {
    // Mock suggested questions based on document type
    const extension = fileName.split('.').pop().toLowerCase()

    if (extension === 'pdf' || extension === 'doc' || extension === 'docx') {
        suggestedQuestions.value = [
            'What is the main topic of this document?',
            'Can you summarize the key points?',
            'What are the important dates mentioned?',
            'Who are the main parties involved?'
        ]
    } else {
        suggestedQuestions.value = [
            'What information does this document contain?',
            'Can you summarize this document?',
            'What are the key details?'
        ]
    }
}

// Load all documents on component mount
onMounted(async () => {
    isLoadingFiles.value = true
    try {
        console.log('Loading documents from database...')
        const docs = await getAllDocuments()
        uploadedFiles.value = docs.map(doc => ({
            ...doc,
            // Keep the processed status from the API, or assume false if not provided
            processed: doc.processed !== undefined ? doc.processed : false
        }))
        console.log(`Loaded ${uploadedFiles.value.length} documents from database`)
        console.log('Documents:', uploadedFiles.value.map(d => ({ id: d.id, name: d.name, processed: d.processed })))
    } catch (error) {
        console.error('Error loading documents from database:', error)
        errorMessage.value = 'Failed to load documents from database'
    } finally {
        isLoadingFiles.value = false
    }
})

const removeDocument = () => {
    currentDocument.value = null
    messages.value = []
    suggestedQuestions.value = []
    sessionId.value = ''
    documentPreviewUrl.value = ''
    documentContent.value = ''
}

const loadDocument = async (file) => {
    try {
        currentDocument.value = file
        messages.value = []
        errorMessage.value = ''
        isProcessing.value = true
        isTyping.value = false // Ensure typing is false when loading

        console.log('Loading document:', file.name, 'ID:', file.id)

        // Check if document needs processing first
        // Documents loaded from database might not be processed yet
        if (!file.processed) {
            console.log('Document not processed yet, processing now...')
            try {
                const processResponse = await processDocument(file.id)
                if (processResponse.success) {
                    file.processed = true
                    console.log('Document processed successfully')
                } else {
                    console.warn('Document processing returned success: false')
                }
            } catch (error) {
                console.error('Document processing failed:', error)
                // Continue anyway - might already be processed
            }
        }

        // Initialize chat session for the selected document
        const chatResponse = await initializeChat(file.id)
        sessionId.value = chatResponse.sessionId

        console.log('Chat session initialized:', chatResponse.sessionId)

        // Use suggested questions from the API response
        suggestedQuestions.value = chatResponse.suggested_questions || []

        // Messages are already reset to empty array at the start of this function
        // The welcome message will be shown via the welcomeMessage computed property

        setTimeout(() => scrollToBottom(), 0)

        // Fetch the document file from database if file object doesn't exist
        if (!file.file && file.id) {
            try {
                console.log('Fetching document file from database...')
                const { blob, fileName, mimeType } = await getDocumentById(file.id)

                // Create a File object from the blob
                const fetchedFile = new File([blob], fileName, { type: mimeType })

                // Update the current document with the file object
                currentDocument.value = {
                    ...file,
                    file: fetchedFile
                }

                // Update the uploaded files list as well
                const fileIndex = uploadedFiles.value.findIndex(f => f.id === file.id)
                if (fileIndex !== -1) {
                    uploadedFiles.value[fileIndex].file = fetchedFile
                }

                console.log('Document file fetched successfully:', fileName, mimeType)
            } catch (error) {
                console.error('Failed to fetch document file:', error)
                // Continue anyway - chat will still work without preview
            }
        }

        // Load file preview if the file object exists (either from upload or from database)
        const fileToPreview = currentDocument.value?.file || file.file
        if (fileToPreview && currentDocument.value) {
            const fileName = currentDocument.value.name || file.name

            // Reload preview for images
            if (isImage(fileName)) {
                const reader = new FileReader()
                reader.onload = (e) => {
                    if (e.target?.result) {
                        documentPreviewUrl.value = e.target.result as string
                    }
                }
                reader.readAsDataURL(fileToPreview)
            }

            // Reload preview for audio files
            if (isAudio(fileName)) {
                const url = URL.createObjectURL(fileToPreview)
                documentPreviewUrl.value = url
            }

            // Reload preview for video files
            if (isVideo(fileName)) {
                const url = URL.createObjectURL(fileToPreview)
                documentPreviewUrl.value = url
            }

            // Reload preview for PDF files
            if (isPDF(fileName)) {
                const url = URL.createObjectURL(fileToPreview)
                documentPreviewUrl.value = url
            }

            // Reload preview for text files
            if (isText(fileName)) {
                const reader = new FileReader()
                reader.onload = (e) => {
                    if (e.target?.result) {
                        documentContent.value = e.target.result as string
                    }
                }
                reader.readAsText(fileToPreview)
            }
        }
    } catch (error) {
        console.error('Error loading document:', error)
        errorMessage.value = 'Failed to load document. Please try again.'
        currentDocument.value = null
    } finally {
        isProcessing.value = false
    }
}

// Chat Functions
const sendMessage = async () => {
    if (!currentMessage.value.trim() || !currentDocument.value || !sessionId.value) return

    const userMessage: ChatMessage = {
        role: 'user' as const,
        content: currentMessage.value,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    messages.value.push(userMessage)
    const messageToSend = currentMessage.value
    currentMessage.value = ''

    // Scroll to bottom
    setTimeout(() => scrollToBottom(), 0)

    try {
        // Show typing indicator
        isTyping.value = true

        // Send message to API
        const chatResponse = await sendChatMessage(
            sessionId.value,
            currentDocument.value.id,
            messageToSend
        )

        // Add AI response
        messages.value.push({
            role: 'assistant' as const,
            content: chatResponse.message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })

        // Update suggested questions if provided
        if (chatResponse.suggested_questions && chatResponse.suggested_questions.length > 0) {
            suggestedQuestions.value = chatResponse.suggested_questions
        }
    } catch (error) {
        console.error('Error sending message:', error)
        errorMessage.value = 'Failed to send message. Please try again.'

        // Add error message to chat
        messages.value.push({
            role: 'assistant' as const,
            content: 'Sorry, I encountered an error processing your message. Please try again.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })
    } finally {
        isTyping.value = false

        // Scroll to bottom
        setTimeout(() => scrollToBottom(), 0)
    }
}

const askQuestion = (question) => {
    currentMessage.value = question
    sendMessage()
}

const scrollToBottom = () => {
    if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
}

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
</script>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #555;
}

/* Smooth animations */
.transition-colors {
    transition-property: color, background-color, border-color;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 200ms;
}
</style>
