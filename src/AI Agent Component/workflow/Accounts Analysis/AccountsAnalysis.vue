<template>
    <div class="flex flex-col lg:flex-row h-full min-h-screen lg:min-h-0">
        <!-- Left Sidebar - File Upload & Management -->
        <div
            class="w-full lg:max-w-sm lg:h-full lg:border-r border-b lg:border-b-0 border-[#e0e6ed] dark:border-[#1b2e4b] overflow-y-auto bg-white dark:bg-[#0e1726]">
            <div class="p-4 lg:p-6 space-y-4 lg:space-y-6">
                <!-- Header -->
                <div>
                    <h2 class="text-xl lg:text-2xl font-semibold dark:text-white-light">Accounts Analysis</h2>
                    <p class="text-sm lg:text-base text-white-dark mt-1">Upload bank statements and analyze</p>
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
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Upload Section -->
                <div class="panel" v-if="!currentDocument">
                    <div class="mb-4">
                        <h5 class="font-semibold text-base dark:text-white-light mb-2">Upload Bank Statement</h5>
                        <p class="text-xs text-white-dark">Support: PDF format</p>
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
                        <p class="text-sm text-white-dark mb-2">Drop PDF File Here</p>
                        <p class="text-xs text-white-dark mb-3">- or -</p>
                        <button type="button" class="btn btn-primary btn-sm">Click to Upload</button>
                        <input ref="fileInput" type="file" @change="handleFileUpload" accept=".pdf" class="hidden" />
                    </div>
                </div>

                <!-- Current Document Info (Desktop Only) -->
                <div v-if="currentDocument" class="hidden lg:block space-y-4">
                    <div class="panel">
                        <div class="flex items-start justify-between mb-3">
                            <h5 class="font-semibold text-base dark:text-white-light">Current Document</h5>
                            <button @click="removeDocument"
                                class="text-danger hover:text-danger-dark transition-colors">
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
                                <p class="text-sm font-medium dark:text-white-light">Processing bank statement...</p>
                                <p class="text-xs text-white-dark mt-1">Extracting transaction data</p>
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
                    <button @click="showFilesList = !showFilesList"
                        class="lg:pointer-events-none w-full flex items-center justify-between mb-3">
                        <h5 class="font-semibold text-base dark:text-white-light">Your Files</h5>
                        <svg class="w-5 h-5 text-white-dark lg:hidden transition-transform"
                            :class="{ 'rotate-180': showFilesList }" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    <div :class="{ 'hidden lg:block': !showFilesList }">
                        <div v-if="isLoadingFiles" class="flex items-center justify-center py-8">
                            <div class="text-center">
                                <div
                                    class="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full mx-auto mb-3">
                                </div>
                                <p class="text-sm text-white-dark">Loading documents...</p>
                            </div>
                        </div>

                        <div v-else-if="uploadedFiles.length === 0" class="py-8 text-center">
                            <svg class="w-12 h-12 mx-auto text-white-dark mb-3" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p class="text-sm text-white-dark">No documents uploaded yet</p>
                        </div>

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
                                <span v-if="file.processed"
                                    class="badge bg-success text-xs flex-shrink-0">PROCESSED</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Middle - Document Preview with Tabs -->
        <div
            class="flex-1 flex flex-col bg-[#f9fafb] dark:bg-[#0e1726] border-r border-[#e0e6ed] dark:border-[#1b2e4b] overflow-hidden">
            <!-- Empty State -->
            <div v-if="!currentDocument" class="flex-1 flex items-center justify-center p-4 lg:p-6 overflow-y-auto">
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
                        Upload a bank statement PDF to analyze transactions.
                    </p>
                    <p class="text-xs lg:text-sm text-white-dark">
                        Supported: PDF format only
                    </p>
                </div>
            </div>

            <!-- Document Preview Area with Tabs -->
            <div v-else class="flex-1 flex flex-col overflow-hidden">
                <!-- Preview Header with Tabs -->
                <div class="p-4 border-b border-[#e0e6ed] dark:border-[#1b2e4b] bg-white dark:bg-[#1b2e4b]">
                    <div class="flex items-center justify-between mb-3">
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

                    <!-- Tabs -->
                    <div class="flex gap-2">
                        <button @click="activeTab = 'pdf'"
                            :class="activeTab === 'pdf' ? 'bg-primary text-white' : 'bg-[#f1f2f3] dark:bg-[#0e1726] text-gray-600 dark:text-white-dark'"
                            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            Original PDF
                        </button>
                        <button @click="activeTab = 'csv'" :disabled="!csvData"
                            :class="activeTab === 'csv' ? 'bg-primary text-white' : 'bg-[#f1f2f3] dark:bg-[#0e1726] text-gray-600 dark:text-white-dark'"
                            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            Extracted Data
                        </button>
                        <button v-if="csvData" @click="downloadCSV"
                            class="ml-auto px-4 py-2 bg-success text-white rounded-lg text-sm font-medium hover:bg-success-dark transition-colors flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Export CSV
                        </button>
                    </div>
                </div>

                <!-- Tab Content -->
                <div class="flex-1 overflow-y-auto p-6 bg-white dark:bg-[#0e1726] max-h-[calc(100vh-120px)]">
                    <!-- Loading -->
                    <div v-if="isProcessing" class="flex items-center justify-center h-full">
                        <div class="text-center">
                            <div
                                class="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4">
                            </div>
                            <p class="text-lg font-medium dark:text-white-light mb-2">Processing bank statement...</p>
                            <p class="text-sm text-white-dark">Extracting transaction data</p>
                        </div>
                    </div>

                    <!-- PDF Tab -->
                    <div v-else-if="activeTab === 'pdf' && documentPreviewUrl" class="h-[800px]">
                        <PdfViewer :url="documentPreviewUrl" />
                    </div>

                    <!-- CSV Table Tab -->
                    <div v-else-if="activeTab === 'csv' && csvData" class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-[#e0e6ed] dark:border-[#1b2e4b]">
                            <thead class="bg-gray-50 dark:bg-[#1b2e4b]">
                                <tr>
                                    <th v-for="(header, index) in csvHeaders" :key="index"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white-dark uppercase tracking-wider">
                                        {{ header }}
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white dark:bg-[#0e1726] divide-y divide-gray-200 dark:divide-gray-700">
                                <tr v-for="(row, rowIndex) in csvRows" :key="rowIndex"
                                    class="hover:bg-gray-50 dark:hover:bg-[#1b2e4b] transition-colors">
                                    <td v-for="(cell, cellIndex) in row" :key="cellIndex"
                                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white-light">
                                        {{ cell }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Upload Progress Overlay -->
        <div v-if="isProcessing && !currentDocument?.processed"
            class="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center">
            <div class="bg-white dark:bg-[#0e1726] rounded-lg p-8 max-w-md mx-4 text-center">
                <div class="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4">
                </div>
                <h3 class="text-xl font-semibold dark:text-white-light mb-2">Processing Bank Statement</h3>
                <p class="text-sm text-white-dark mb-4">
                    {{ uploadStatus }}
                </p>
                <div class="w-full bg-[#ebedf2] dark:bg-dark/40 rounded-full h-2">
                    <div class="bg-primary h-2 rounded-full transition-all duration-300"
                        :style="{ width: uploadProgress + '%' }"></div>
                </div>
                <p class="text-xs text-white-dark mt-2">{{ uploadProgress }}%</p>
            </div>
        </div>

        <!-- Right Side - Chat Interface (Desktop Only) -->
        <div class="hidden lg:flex w-full lg:w-[400px] flex-col bg-white dark:bg-[#0e1726] overflow-hidden">
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
                    <p class="text-sm text-white-dark">Upload a bank statement to start asking questions</p>
                </div>
            </div>

            <!-- Chat Area (Desktop) -->
            <div v-else class="flex-1 flex flex-col overflow-hidden h-full">
                <!-- Chat Messages -->
                <div ref="chatContainer"
                    class="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 min-h-0 max-h-[calc(100vh-150px)]">
                    <!-- Loading/Analyzing State -->
                    <div v-if="isProcessing && messages.length === 0" class="space-y-4">
                        <div class="flex gap-3">
                            <div class="flex-shrink-0">
                                <div
                                    class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                                    <div
                                        class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full">
                                    </div>
                                </div>
                            </div>
                            <div class="flex-1">
                                <div class="bg-[#f1f2f3] dark:bg-[#1b2e4b] rounded-lg p-4">
                                    <p class="text-sm dark:text-white-light">Analyzing your bank statement...</p>
                                    <p class="text-xs text-white-dark mt-2">Extracting transaction data</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Welcome Message -->
                    <div v-else-if="messages.length === 0" class="space-y-4">
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
                                <p v-if="message.role === 'user'" class="text-sm whitespace-pre-wrap text-white">
                                    {{ message.content }}
                                </p>
                                <div v-else
                                    class="text-sm prose prose-sm max-w-none dark:prose-invert prose-pre:bg-gray-800 prose-pre:text-gray-100"
                                    :class="'dark:text-white-light'" v-html="renderMarkdown(message.content)">
                                </div>
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

                    <!-- Suggested Questions -->
                    <div v-if="suggestedQuestions.length > 0 && !isTyping && !isProcessing" class="space-y-3">
                        <p class="text-xs text-white-dark font-medium">Suggested questions:</p>
                        <div class="grid grid-cols-1 gap-2">
                            <button v-for="(question, index) in suggestedQuestions" :key="index"
                                @click="askQuestion(question)"
                                class="text-left p-3 bg-white dark:bg-[#0e1726] border border-[#e0e6ed] dark:border-[#1b2e4b] rounded-lg hover:border-primary hover:shadow-md transition-all text-sm dark:text-white-light"
                                :disabled="isProcessing">
                                {{ question }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Chat Input -->
                <div class="border-t border-[#e0e6ed] dark:border-[#1b2e4b] p-4 bg-white dark:bg-[#0e1726]">
                    <form @submit.prevent="sendMessage" class="flex gap-2">
                        <input v-model="currentMessage" type="text" placeholder="Ask about transactions..."
                            class="form-input flex-1" :disabled="inputDisabled" />
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
import { ref, computed, onMounted } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import PdfViewer from '../Document Chat/PdfViewer.vue'
import axios from 'axios'
import JSZip from 'jszip'

// API Configuration
const BASE_URL = 'https://workflow.forwen.com/webhook'
const CHAT_API_URL = `${BASE_URL}/chat-with-bank-statement`
const PROCESS_API_URL = `${BASE_URL}/5f904f09-c34f-48e3-a747-f452e0498fed/chat-with-bank-statement`
const GET_DOC_API_URL = `${BASE_URL}/56086a6b-8570-4134-abb2-bcade1aa9cfb/chat-with-bank-statement`

// Initialize markdown-it
const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre class="hljs"><code>' +
                    hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                    '</code></pre>'
            } catch (__) { }
        }
        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
    }
})

// Types
interface Document {
    id: number
    name: string
    size?: number
    processed?: boolean
    file?: File
}

interface ChatMessage {
    role: 'user' | 'assistant'
    content: string
    timestamp: string
}

// State
const currentDocument = ref<Document | null>(null)
const uploadedFiles = ref<Document[]>([])
const isProcessing = ref(false)
const isTyping = ref(false)
const isLoadingFiles = ref(false)
const messages = ref<ChatMessage[]>([])
const currentMessage = ref('')
const chatContainer = ref<HTMLElement | null>(null)
const suggestedQuestions = ref<string[]>([])
const documentPreviewUrl = ref('')
const sessionId = ref('')
const errorMessage = ref('')
const showFilesList = ref(true)
const uploadStatus = ref('Preparing document...')
const uploadProgress = ref(0)
const activeTab = ref<'pdf' | 'csv'>('pdf')
const csvData = ref<string>('')
const csvHeaders = ref<string[]>([])
const csvRows = ref<string[][]>([])

// Computed
const welcomeMessage = computed(() => {
    if (currentDocument.value) {
        return `I've analyzed "${currentDocument.value.name}". Ask me anything about the transactions!`
    }
    return 'Hello! Upload a bank statement and I\'ll help you analyze your transactions.'
})

const inputDisabled = computed(() => isTyping.value || isProcessing.value)

// Render markdown
const renderMarkdown = (content: string): string => md.render(content)

// Parse CSV data with proper handling of quoted fields
const parseCSV = (csvString: string) => {
    const lines = csvString.split('\n').filter(line => line.trim())
    if (lines.length === 0) return

    // Helper function to parse a CSV line respecting quoted fields
    const parseLine = (line: string): string[] => {
        const result: string[] = []
        let current = ''
        let inQuotes = false

        for (let i = 0; i < line.length; i++) {
            const char = line[i]
            const nextChar = line[i + 1]

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    // Handle escaped quotes
                    current += '"'
                    i++ // Skip next quote
                } else {
                    // Toggle quote state
                    inQuotes = !inQuotes
                }
            } else if (char === ',' && !inQuotes) {
                // Field separator outside quotes
                result.push(current.trim())
                current = ''
            } else {
                current += char
            }
        }

        // Add the last field
        result.push(current.trim())
        return result
    }

    csvHeaders.value = parseLine(lines[0])
    csvRows.value = lines.slice(1).map(line => parseLine(line))
}

// Download CSV
const downloadCSV = () => {
    if (!csvData.value) return

    const blob = new Blob([csvData.value], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${currentDocument.value?.name.replace('.pdf', '')}_transactions.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

// File Upload Handlers
const handleFileUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file && file.type === 'application/pdf') {
        await processDocumentFile(file)
    } else {
        errorMessage.value = 'Please upload a PDF file'
    }
}

const handleDrop = async (event: DragEvent) => {
    const file = event.dataTransfer?.files[0]
    if (file && file.type === 'application/pdf') {
        await processDocumentFile(file)
    } else {
        errorMessage.value = 'Please upload a PDF file'
    }
}

const processDocumentFile = async (file: File) => {
    let uploadProgressInterval: ReturnType<typeof setInterval> | null = null

    try {
        isProcessing.value = true
        isTyping.value = false
        errorMessage.value = ''
        uploadProgress.value = 0
        uploadStatus.value = 'Uploading bank statement...'
        csvData.value = ''
        activeTab.value = 'pdf'

        // Step 1: Upload simulation
        const uploadStartTime = Date.now()
        const uploadDuration = 6000
        uploadProgressInterval = setInterval(() => {
            const elapsed = Date.now() - uploadStartTime
            const progress = Math.min((elapsed / uploadDuration) * 35, 35)
            uploadProgress.value = Math.floor(progress)
        }, 100)

        // Upload the document
        const formData = new FormData()
        formData.append('file', file)
        const uploadResponse = await axios.post(`${CHAT_API_URL}/documents`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })

        if (uploadProgressInterval) clearInterval(uploadProgressInterval)
        uploadProgress.value = 40
        uploadStatus.value = 'Document uploaded successfully'
        const documentId = uploadResponse.data.document_id

        currentDocument.value = {
            id: documentId,
            name: file.name,
            size: file.size,
            processed: false,
            file: file
        }

        // Generate PDF preview
        const url = URL.createObjectURL(file)
        documentPreviewUrl.value = url

        // Step 2: Process the document (get CSV)
        uploadProgress.value = 50
        uploadStatus.value = 'Extracting transaction data...'
        const processResponse = await axios.post(
            `${PROCESS_API_URL}/process-document/${documentId}`,
            null,
            { responseType: 'blob' }
        )

        // Convert blob to text for CSV
        const csvText = await processResponse.data.text()
        csvData.value = csvText
        parseCSV(csvText)

        uploadProgress.value = 70
        uploadStatus.value = 'Transactions extracted successfully'
        currentDocument.value.processed = true

        // Step 3: Initialize chat session
        uploadProgress.value = 85
        uploadStatus.value = 'Initializing chat session...'
        const chatResponse = await axios.post(`${CHAT_API_URL}/chat`, { documentId })
        sessionId.value = chatResponse.data.sessionId
        suggestedQuestions.value = chatResponse.data.suggested_questions || []

        uploadProgress.value = 100
        uploadStatus.value = 'Ready to chat!'

        // Add to uploaded files
        uploadedFiles.value.push({ ...currentDocument.value })
        messages.value = []

        setTimeout(() => scrollToBottom(), 0)
    } catch (error) {
        console.error('Error processing bank statement:', error)
        errorMessage.value = 'Failed to process bank statement. Please try again.'
        currentDocument.value = null
        uploadProgress.value = 0
        uploadStatus.value = 'Upload failed'
        if (uploadProgressInterval) clearInterval(uploadProgressInterval)
    } finally {
        setTimeout(() => {
            isProcessing.value = false
        }, 500)
    }
}

// Load all documents
onMounted(async () => {
    isLoadingFiles.value = true
    try {
        const response = await axios.get(`${CHAT_API_URL}/documents`)
        uploadedFiles.value = response.data.map((doc: any) => ({
            ...doc,
            processed: doc.processed !== undefined ? doc.processed : false
        }))
    } catch (error) {
        console.error('Error loading documents:', error)
        errorMessage.value = 'Failed to load documents'
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
    csvData.value = ''
    csvHeaders.value = []
    csvRows.value = []
    activeTab.value = 'pdf'
}

const loadDocument = async (file: Document) => {
    try {
        currentDocument.value = file
        messages.value = []
        errorMessage.value = ''
        isProcessing.value = true
        isTyping.value = false
        csvData.value = ''
        csvHeaders.value = []
        csvRows.value = []

        // Initialize chat session
        const chatResponse = await axios.post(`${CHAT_API_URL}/chat`, { documentId: file.id })
        sessionId.value = chatResponse.data.sessionId
        suggestedQuestions.value = chatResponse.data.suggested_questions || []

        // Fetch document file (returns ZIP with PDF and CSV)
        if (!file.file && file.id) {
            const response = await axios.get(`${GET_DOC_API_URL}/documents/${file.id}`, {
                responseType: 'blob'
            })

            const zipBlob = response.data

            // Extract files from ZIP
            const zip = await JSZip.loadAsync(zipBlob)

            // Extract PDF file
            const pdfFile = Object.keys(zip.files).find(name => name.toLowerCase().endsWith('.pdf'))
            if (pdfFile) {
                const pdfBlob = await zip.files[pdfFile].async('blob')
                const fetchedFile = new File([pdfBlob], pdfFile, { type: 'application/pdf' })
                currentDocument.value = { ...file, file: fetchedFile }
                const url = URL.createObjectURL(pdfBlob)
                documentPreviewUrl.value = url
            }

            // Extract CSV file
            const csvFile = Object.keys(zip.files).find(name => name.toLowerCase().endsWith('.csv'))
            if (csvFile) {
                const csvText = await zip.files[csvFile].async('text')
                csvData.value = csvText
                parseCSV(csvText)
                console.log('CSV extracted from ZIP:', csvFile)
            }
        }

        setTimeout(() => scrollToBottom(), 0)
    } catch (error) {
        console.error('Error loading document:', error)
        errorMessage.value = 'Failed to load document'
        currentDocument.value = null
    } finally {
        isProcessing.value = false
    }
}

// Chat Functions
const sendMessage = async () => {
    if (!currentMessage.value.trim() || !currentDocument.value || !sessionId.value) return

    const userMessage: ChatMessage = {
        role: 'user',
        content: currentMessage.value,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    messages.value.push(userMessage)
    const messageToSend = currentMessage.value
    currentMessage.value = ''

    setTimeout(() => scrollToBottom(), 0)

    try {
        isTyping.value = true

        const response = await axios.post(`${CHAT_API_URL}/chat`, {
            sessionId: sessionId.value,
            documentId: currentDocument.value.id,
            chatInput: messageToSend
        })

        messages.value.push({
            role: 'assistant',
            content: response.data.message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })

        if (response.data.suggested_questions?.length > 0) {
            suggestedQuestions.value = response.data.suggested_questions
        }
    } catch (error) {
        console.error('Error sending message:', error)
        errorMessage.value = 'Failed to send message'
        messages.value.push({
            role: 'assistant',
            content: 'Sorry, I encountered an error. Please try again.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })
    } finally {
        isTyping.value = false
        setTimeout(() => scrollToBottom(), 0)
    }
}

const askQuestion = (question: string) => {
    currentMessage.value = question
    sendMessage()
}

const scrollToBottom = () => {
    if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
}
</script>

<style scoped>
/* Same styling as DocumentChat */
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

.transition-colors {
    transition-property: color, background-color, border-color;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 200ms;
}

/* Table styling */
table {
    font-size: 0.875rem;
}

table thead {
    position: sticky;
    top: 0;
    z-index: 10;
}

/* Prose/markdown styling */
.prose {
    color: inherit;
}

.prose h1,
.prose h2,
.prose h3 {
    color: inherit;
    font-weight: 600;
    margin-top: 1em;
    margin-bottom: 0.5em;
}

.prose code {
    background-color: rgba(0, 0, 0, 0.1);
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-size: 0.875em;
}

.dark .prose code {
    background-color: rgba(255, 255, 255, 0.1);
}
</style>
