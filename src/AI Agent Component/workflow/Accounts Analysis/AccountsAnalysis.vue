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

                <!-- Supporting Documents Section -->
                <div class="panel">
                    <div class="flex items-center justify-between mb-3">
                        <h5 class="font-semibold text-base dark:text-white-light">Supporting Documents</h5>
                        <!-- <button @click="fetchSupportingDocs"
                            :disabled="isLoadingSupportingDocs"
                            class="text-xs text-primary hover:text-primary-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
                            <svg v-if="!isLoadingSupportingDocs" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span v-if="isLoadingSupportingDocs" class="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                            {{ isLoadingSupportingDocs ? 'Loading...' : 'Fetch' }}
                        </button> -->
                    </div>

                    <!-- Loading State -->
                    <div v-if="isLoadingSupportingDocs" class="flex items-center justify-center py-6">
                        <div class="text-center">
                            <div class="animate-spin w-6 h-6 border-3 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                            <p class="text-xs text-white-dark">Fetching documents...</p>
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div v-else-if="supportingDocsRaw.length === 0" class="py-6 text-center">
                        <svg class="w-10 h-10 mx-auto text-white-dark mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <p class="text-xs text-white-dark">No supporting documents</p>
                        <p class="text-xs text-white-dark mt-1">Click "Fetch" to load</p>
                    </div>

                    <!-- Supporting Documents List -->
                    <div v-else>
                        <!-- Header with count and actions -->
                        <!-- <div class="flex items-center justify-between mb-3 px-1">
                            <span class="text-xs text-white-dark">{{ selectedSupportingDocs.size }} / {{ supportingDocsRaw.length }} selected</span>
                            <button @click="matchSupportingDocs"
                                :disabled="!currentDocument || selectedSupportingDocs.size === 0 || isLoadingSupportingDocs"
                                class="text-xs text-success hover:text-success-dark disabled:opacity-50 disabled:cursor-not-allowed font-medium">
                                Match Selected
                            </button>
                        </div> -->

                        <!-- Documents List -->
                        <div class="space-y-2 max-h-[300px] overflow-y-auto">
                            <div v-for="doc in supportingDocsRaw" :key="doc.id"
                                class="flex items-start gap-3 p-3 rounded-lg transition-colors"
                                :class="selectedSupportingDocs.has(doc.id)
                                    ? 'bg-primary/10 dark:bg-primary/20 ring-2 ring-primary'
                                    : 'bg-[#f1f2f3] dark:bg-[#1b2e4b] hover:bg-[#e0e6ed] dark:hover:bg-[#253b5c]'">
                                <!-- Checkbox -->
                                <div class="flex-shrink-0 mt-0.5">
                                    <input type="checkbox"
                                        :checked="selectedSupportingDocs.has(doc.id)"
                                        @click.stop="toggleSupportingDoc(doc.id)"
                                        class="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer" />
                                </div>



                                <!-- Document Info -->
                                <div class="flex-1 min-w-0">
                                    <p class="text-xs font-medium dark:text-white-light truncate">
                                        {{ doc.name }}
                                    </p>
                                    <div class="flex items-center gap-2 mt-1">
                                        <span class="text-xs text-white-dark">{{ doc.rowCount }} rows</span>
                                        <!-- <span class="text-xs font-medium" :class="doc.totalAmount >= 0 ? 'text-success' : 'text-danger'">
                                            {{ doc.totalAmount >= 0 ? '+' : '' }}{{ doc.totalAmount.toFixed(2) }}
                                        </span> -->
                                    </div>
                                </div>

                                <!-- Type Badge -->
                                <!-- <div class="flex-shrink-0">
                                    <span class="badge text-xs" :class="doc.type === 'payout' ? 'bg-info' : 'bg-warning'">
                                        {{ doc.type }}
                                    </span>
                                </div> -->
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <!-- Middle - Document Preview with Tabs -->
        <div
            class="flex-1 flex flex-col bg-[#f9fafb] dark:bg-[#0e1726] border-r border-[#e0e6ed] dark:border-[#1b2e4b] overflow-hidden">
            <!-- Document Preview Area with Tabs -->
            <div class="flex-1 flex flex-col overflow-hidden">
                <!-- Preview Header with Tabs -->
                <div class="p-4 border-b border-[#e0e6ed] dark:border-[#1b2e4b] bg-white dark:bg-[#1b2e4b]">
                    <div v-if="currentDocument" class="flex items-center justify-between mb-3">
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
                        <button @click="activeTab = 'supporting'" :disabled="supportingDocsRaw.length === 0"
                            :class="activeTab === 'supporting' ? 'bg-primary text-white' : 'bg-[#f1f2f3] dark:bg-[#0e1726] text-gray-600 dark:text-white-dark'"
                            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                            Supporting Docs
                        </button>
                        <button @click="activeTab = 'matched'" :disabled="matchedData.length === 0"
                            :class="activeTab === 'matched' ? 'bg-primary text-white' : 'bg-[#f1f2f3] dark:bg-[#0e1726] text-gray-600 dark:text-white-dark'"
                            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                            Matched
                            <span v-if="matchedData.length > 0" class="badge bg-success text-xs">{{ matchedData.length }}</span>
                        </button>
                        <button @click="activeTab = 'unmatched'" :disabled="unmatchedData.length === 0"
                            :class="activeTab === 'unmatched' ? 'bg-primary text-white' : 'bg-[#f1f2f3] dark:bg-[#0e1726] text-gray-600 dark:text-white-dark'"
                            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                            Unmatched
                            <span v-if="unmatchedData.length > 0" class="badge bg-warning text-xs">{{ unmatchedData.length }}</span>
                        </button>
                        <button @click="matchSupportingDocs"
                            :disabled="!currentDocument || selectedSupportingDocs.size === 0 || isLoadingSupportingDocs"
                            class="ml-auto px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                            <svg v-if="isLoadingSupportingDocs" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></svg>
                            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                            Process Data
                        </button>
                        <button v-if="csvData" @click="downloadCSV"
                            class="px-4 py-2 bg-success text-white rounded-lg text-sm font-medium hover:bg-success-dark transition-colors flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Export CSV
                        </button>
                    </div>
                </div>

                <!-- Tab Content -->
                <div class="flex-1 overflow-y-auto overflow-x-auto p-6 bg-white dark:bg-[#0e1726] max-h-[calc(100vh-190px)]">
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
                    <div v-else-if="activeTab === 'pdf'">
                        <div v-if="documentPreviewUrl" class="h-[800px]">
                            <PdfViewer :url="documentPreviewUrl" />
                        </div>
                        <div v-else class="flex items-center justify-center h-full py-12">
                            <div class="text-center max-w-md">
                                <div class="text-primary mb-4">
                                    <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h4 class="text-lg font-semibold dark:text-white-light mb-2">No Bank Statement</h4>
                                <p class="text-sm text-white-dark">Upload a bank statement PDF to view it here</p>
                            </div>
                        </div>
                    </div>

                    <!-- CSV Table Tab -->
                    <div v-else-if="activeTab === 'csv'">
                        <div v-if="csvData" class="overflow-auto max-h-[calc(100vh-220px)] border border-[#e0e6ed] dark:border-[#1b2e4b] rounded-lg">
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
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
                                        class="px-6 py-4 text-sm text-gray-900 dark:text-white-light">
                                        <span v-if="isTagColumn(cellIndex)" v-html="renderTagBadge(cell)"></span>
                                        <span v-else>{{ cell }}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                        <div v-else class="flex items-center justify-center h-full py-12">
                            <div class="text-center max-w-md">
                                <div class="text-primary mb-4">
                                    <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                                    </svg>
                                </div>
                                <h4 class="text-lg font-semibold dark:text-white-light mb-2">No Extracted Data</h4>
                                <p class="text-sm text-white-dark">Upload a bank statement to extract transaction data</p>
                            </div>
                        </div>
                    </div>

                    <!-- Supporting Docs Tab -->
                    <div v-else-if="activeTab === 'supporting'" class="space-y-4">
                        <div class="flex items-center justify-between">
                            <h4 class="text-lg font-semibold dark:text-white-light">Selected Supporting Documents</h4>
                            <!-- <div class="flex items-center gap-3">
                                <span class="text-sm text-white-dark">{{ selectedSupportingDocs.size }} / {{ supportingDocsRaw.length }} selected</span>
                                <button @click="matchSupportingDocs"
                                    :disabled="!currentDocument || selectedSupportingDocs.size === 0 || isLoadingSupportingDocs"
                                    class="px-4 py-2 bg-success text-white rounded-lg text-sm font-medium hover:bg-success-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    Match Selected
                                </button>
                            </div> -->
                        </div>

                        <div v-if="supportingDocsRaw.filter(doc => selectedSupportingDocs.has(doc.id)).length === 0"
                            class="flex items-center justify-center h-full py-12">
                            <div class="text-center max-w-md">
                                <div class="text-primary mb-4">
                                    <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h4 class="text-lg font-semibold dark:text-white-light mb-2">No Documents Selected</h4>
                                <p class="text-sm text-white-dark">Check documents in the sidebar to view them here</p>
                            </div>
                        </div>

                        <div v-else class="space-y-4">
                            <div v-for="doc in supportingDocsRaw.filter(d => selectedSupportingDocs.has(d.id))" :key="doc.id">
                                <div class="mb-3 flex items-center justify-between">
                                    <h5 class="font-semibold dark:text-white-light">{{ doc.name }}</h5>
                                    <span class="text-sm text-white-dark">{{ doc.rowCount }} transactions</span>
                                </div>
                                <div class="overflow-auto max-h-[400px] border border-[#e0e6ed] dark:border-[#1b2e4b] rounded-lg mb-6">
                                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead class="bg-gray-50 dark:bg-[#1b2e4b]">
                                            <tr>
                                                <th v-for="(header, index) in Object.keys(doc.csvRows[0] || {})" :key="index"
                                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white-dark uppercase tracking-wider">
                                                    {{ header }}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody class="bg-white dark:bg-[#0e1726] divide-y divide-gray-200 dark:divide-gray-700">
                                            <tr v-for="(row, rowIndex) in doc.csvRows" :key="rowIndex"
                                                class="hover:bg-gray-50 dark:hover:bg-[#1b2e4b] transition-colors">
                                                <td v-for="(value, key) in row" :key="key"
                                                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white-light">
                                                    {{ value }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Matched Tab -->
                    <div v-else-if="activeTab === 'matched'" class="space-y-6">
                        <!-- Loading State -->
                        <div v-if="isLoadingSupportingDocs" class="flex items-center justify-center py-12">
                            <div class="text-center">
                                <div class="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                                <p class="text-lg font-medium dark:text-white-light mb-2">Fetching supporting documents...</p>
                                <p class="text-sm text-white-dark">Retrieving payouts and settlements</p>
                            </div>
                        </div>

                        <!-- Empty State -->
                        <div v-else-if="matchedData.length === 0" class="flex items-center justify-center py-12">
                            <div class="text-center max-w-md">
                                <div class="text-success mb-4">
                                    <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h4 class="text-lg font-semibold dark:text-white-light mb-2">No Matched Transactions</h4>
                                <p class="text-sm text-white-dark">Click "Process Data" to match supporting documents with bank statement transactions.</p>
                            </div>
                        </div>

                        <!-- Matched Data Table -->
                        <div v-else>
                            <div class="mb-4 flex items-center justify-between">
                                <h4 class="text-lg font-semibold dark:text-white-light">Matched Transactions</h4>
                                <div class="flex items-center gap-3">
                                    <span class="badge bg-success">{{ matchedData.length }} matched</span>
                                    <button @click="downloadResultZip"
                                        :disabled="!matchResultZip"
                                        class="px-3 py-1 bg-success text-white rounded text-sm font-medium hover:bg-success-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Download ZIP
                                    </button>
                                </div>
                            </div>
                            <div class="overflow-auto max-h-[calc(100vh-300px)] border border-[#e0e6ed] dark:border-[#1b2e4b] rounded-lg">
                            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead class="bg-gray-50 dark:bg-[#1b2e4b]">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white-dark uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white-dark uppercase tracking-wider">
                                            Bank Statement ID
                                        </th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white-dark uppercase tracking-wider">
                                            Match Table
                                        </th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white-dark uppercase tracking-wider">
                                            Matched ID
                                        </th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white-dark uppercase tracking-wider">
                                            Reasoning
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white dark:bg-[#0e1726] divide-y divide-gray-200 dark:divide-gray-700">
                                    <tr v-for="(item, index) in matchedData" :key="index"
                                        class="hover:bg-gray-50 dark:hover:bg-[#1b2e4b] transition-colors">
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white-light">
                                            {{ item.id }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white-light">
                                            {{ item.bank_statement_id }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white-light">
                                            {{ item.match_table }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white-light">
                                            {{ item.matched_id }}
                                        </td>
                                        <td class="px-6 py-4 text-sm text-gray-900 dark:text-white-light max-w-md">
                                            <div class="truncate" :title="item.reasoning">{{ item.reasoning }}</div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            </div>
                        </div>
                    </div>

                    <!-- Unmatched Tab -->
                    <div v-else-if="activeTab === 'unmatched'" class="space-y-6">
                        <!-- Loading State -->
                        <div v-if="isLoadingSupportingDocs" class="flex items-center justify-center py-12">
                            <div class="text-center">
                                <div class="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                                <p class="text-lg font-medium dark:text-white-light mb-2">Processing matches...</p>
                                <p class="text-sm text-white-dark">Identifying unmatched transactions</p>
                            </div>
                        </div>

                        <!-- Empty State -->
                        <div v-else-if="unmatchedData.length === 0" class="flex items-center justify-center py-12">
                            <div class="text-center max-w-md">
                                <div class="text-warning mb-4">
                                    <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h4 class="text-lg font-semibold dark:text-white-light mb-2">No Unmatched Transactions</h4>
                                <p class="text-sm text-white-dark">All transactions have been matched, or click "Process Data" to start matching.</p>
                            </div>
                        </div>

                        <!-- Unmatched Data Table -->
                        <div v-else>
                            <div class="mb-4 flex items-center justify-between">
                                <h4 class="text-lg font-semibold dark:text-white-light">Unmatched Transactions</h4>
                                <div class="flex items-center gap-3">
                                    <span class="badge bg-warning">{{ unmatchedData.length }} unmatched</span>
                                    <button @click="downloadResultZip"
                                        :disabled="!matchResultZip"
                                        class="px-3 py-1 bg-success text-white rounded text-sm font-medium hover:bg-success-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Download ZIP
                                    </button>
                                </div>
                            </div>
                            <div class="overflow-auto max-h-[calc(100vh-300px)] border border-[#e0e6ed] dark:border-[#1b2e4b] rounded-lg">
                            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead class="bg-gray-50 dark:bg-[#1b2e4b]">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white-dark uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white-dark uppercase tracking-wider">
                                            Bank Statement ID
                                        </th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white-dark uppercase tracking-wider">
                                            Reasoning
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white dark:bg-[#0e1726] divide-y divide-gray-200 dark:divide-gray-700">
                                    <tr v-for="(item, index) in unmatchedData" :key="index"
                                        class="hover:bg-gray-50 dark:hover:bg-[#1b2e4b] transition-colors">
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white-light">
                                            {{ item.id }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white-light">
                                            {{ item.bank_statement_id }}
                                        </td>
                                        <td class="px-6 py-4 text-sm text-gray-900 dark:text-white-light max-w-md">
                                            <div class="truncate" :title="item.reasoning">{{ item.reasoning }}</div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            </div>
                        </div>
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
                                    class="text-sm prose prose-sm max-w-none dark:prose-invert prose-pre:bg-gray-800 prose-pre:text-gray-100 chat-message-content"
                                    :class="'dark:text-white-light'" v-html="renderMarkdown(message.content)"
                                    @click="handleMessageClick">
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

        <!-- Image Modal Popup -->
        <Transition name="modal-fade">
            <div v-if="lightboxImage" @click="lightboxImage = null"
                class="fixed inset-0 bg-black bg-opacity-50 z-[70] flex items-center justify-center p-4">
                <Transition name="modal-slide">
                    <div v-if="lightboxImage" @click.stop
                        class="bg-white dark:bg-[#0e1726] rounded-xl shadow-2xl max-w-4xl max-h-[85vh] overflow-hidden relative">
                        <!-- Modal Header -->
                        <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 class="text-lg font-semibold dark:text-white-light">Image Preview</h3>
                            <button @click="lightboxImage = null"
                                class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all hover:scale-110 hover:rotate-90">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <!-- Modal Body -->
                        <div class="p-6 overflow-auto max-h-[calc(85vh-80px)]">
                            <img :src="lightboxImage" alt="Enlarged view"
                                class="w-full h-auto rounded-lg" />
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
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
const SUPPORTING_DOCS_API_URL = `${BASE_URL}/supporting_docs`
const MATCH_API_URL = `${BASE_URL}/4b43dbac-2114-49a8-a6de-4de7b4b23429/chat-with-bank-statement`

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
const activeTab = ref<'pdf' | 'csv' | 'supporting' | 'matched' | 'unmatched'>('pdf')
const csvData = ref<string>('')
const csvHeaders = ref<string[]>([])
const csvRows = ref<string[][]>([])
const payoutsData = ref<any[]>([])
const settlementsData = ref<any[]>([])
const processedData = ref<any[]>([])
const matchedData = ref<any[]>([])
const unmatchedData = ref<any[]>([])
const isLoadingSupportingDocs = ref(false)
const supportingDocsRaw = ref<any[]>([])
const selectedSupportingDocs = ref<Set<number>>(new Set())
const selectedSupportingDocForView = ref<any | null>(null)
const matchResultZip = ref<Blob | null>(null)
const lightboxImage = ref<string | null>(null)

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

// Handle clicks on message content (for image lightbox)
const handleMessageClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (target.tagName === 'IMG') {
        const img = target as HTMLImageElement
        lightboxImage.value = img.src
    }
}

// Check if column is a tag column
const isTagColumn = (columnIndex: number): boolean => {
    if (!csvHeaders.value || columnIndex >= csvHeaders.value.length) return false
    const header = csvHeaders.value[columnIndex].toLowerCase()
    return header === 'tag' || header === 'tags' || header === 'label' || header === 'labels'
}

// Map to store unique tag to color assignments
const tagColorMap = new Map<string, number>()

// Generate a hash from string for consistent color assignment
const stringToHash = (str: string): number => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
    }
    return Math.abs(hash)
}

// Get unique color index for a tag
const getTagColorIndex = (tag: string): number => {
    const normalizedTag = tag.trim().toLowerCase()
    if (!tagColorMap.has(normalizedTag)) {
        const hash = stringToHash(normalizedTag)
        tagColorMap.set(normalizedTag, hash % 12) // 12 unique colors
    }
    return tagColorMap.get(normalizedTag)!
}

// Render tag badge with unique color per tag
const renderTagBadge = (cell: string): string => {
    if (!cell || typeof cell !== 'string') return cell

    const colorIndex = getTagColorIndex(cell)
    const colorClasses = [
        'badge-tag-color-0',  // Blue
        'badge-tag-color-1',  // Green
        'badge-tag-color-2',  // Purple
        'badge-tag-color-3',  // Orange
        'badge-tag-color-4',  // Pink
        'badge-tag-color-5',  // Teal
        'badge-tag-color-6',  // Red
        'badge-tag-color-7',  // Indigo
        'badge-tag-color-8',  // Yellow
        'badge-tag-color-9',  // Cyan
        'badge-tag-color-10', // Lime
        'badge-tag-color-11', // Rose
    ]

    return `<span class="csv-tag ${colorClasses[colorIndex]}">${cell}</span>`
}

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
        processedData.value = []
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
        const processResponse = await axios.get(
            `${PROCESS_API_URL}/process-document/${documentId}`,
        )

        // Get CSV text - the API returns text directly, not a Blob
        const csvText = typeof processResponse.data === 'string' ? processResponse.data : JSON.stringify(processResponse.data)
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
        // Load uploaded bank statements
        const response = await axios.get(`${CHAT_API_URL}/documents`)
        uploadedFiles.value = response.data.map((doc: any) => ({
            ...doc,
            processed: doc.processed !== undefined ? doc.processed : false
        }))

        // Automatically fetch supporting documents
        await fetchSupportingDocs()
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
    processedData.value = []
    matchedData.value = []
    unmatchedData.value = []
    matchResultZip.value = null
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
        processedData.value = []
        matchedData.value = []
        unmatchedData.value = []

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

// Parse CSV string to array of objects
const parseCSVToObjects = (csvString: string): any[] => {
    const lines = csvString.split('\n').filter(line => line.trim())
    if (lines.length === 0) return []

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
                    current += '"'
                    i++
                } else {
                    inQuotes = !inQuotes
                }
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim())
                current = ''
            } else {
                current += char
            }
        }
        result.push(current.trim())
        return result
    }

    // Parse headers
    const headers = parseLine(lines[0])

    // Parse data rows
    const dataRows = lines.slice(1).map(line => {
        const values = parseLine(line)
        const obj: any = {}
        headers.forEach((header, index) => {
            obj[header] = values[index] || ''
        })
        return obj
    })

    return dataRows
}

// Fetch Supporting Documents (without matching)
const fetchSupportingDocs = async () => {
    try {
        isLoadingSupportingDocs.value = true
        errorMessage.value = ''

        // Fetch supporting documents as RAR/ZIP file
        const supportingDocsResponse = await axios.get(SUPPORTING_DOCS_API_URL, {
            responseType: 'blob'
        })

        // Extract files from the archive
        const archiveBlob = supportingDocsResponse.data
        const zip = await JSZip.loadAsync(archiveBlob)

        // Find and extract CSV files
        const csvFiles = Object.keys(zip.files).filter(name => name.toLowerCase().endsWith('.csv'))

        // Treat each CSV file as a separate document
        supportingDocsRaw.value = []
        payoutsData.value = []
        settlementsData.value = []

        for (let i = 0; i < csvFiles.length; i++) {
            const csvFileName = csvFiles[i]
            const csvText = await zip.files[csvFileName].async('text')
            const csvRows = parseCSVToObjects(csvText)

            // Determine type from filename
            const fileName = csvFileName.toLowerCase()
            const type = fileName.includes('payout') ? 'payout' : fileName.includes('settlement') ? 'settlement' : 'other'

            // Calculate summary info
            const totalAmount = csvRows.reduce((sum, row) => sum + parseFloat(row.amount || row.Amount || 0), 0)
            const rowCount = csvRows.length

            // Create document entry for this CSV file
            const doc = {
                id: i,
                name: csvFileName.split('/').pop() || csvFileName, // Get filename without path
                type: type,
                rowCount: rowCount,
                totalAmount: totalAmount,
                csvText: csvText,
                csvRows: csvRows,
                description: `${type.charAt(0).toUpperCase() + type.slice(1)} Report - ${rowCount} transactions`
            }

            supportingDocsRaw.value.push(doc)

            // Categorize by type
            if (type === 'payout') {
                payoutsData.value.push(doc)
            } else if (type === 'settlement') {
                settlementsData.value.push(doc)
            }
        }

        // Select all by default
        selectedSupportingDocs.value = new Set(supportingDocsRaw.value.map(doc => doc.id))

    } catch (error) {
        console.error('Error fetching supporting documents:', error)
        errorMessage.value = 'Failed to fetch supporting documents. Please try again.'
    } finally {
        isLoadingSupportingDocs.value = false
    }
}

// View supporting document details (only if checked)
const viewSupportingDoc = (doc: any) => {
    if (!selectedSupportingDocs.value.has(doc.id)) {
        errorMessage.value = 'Please check the document to preview it'
        setTimeout(() => {
            errorMessage.value = ''
        }, 3000)
        return
    }
    selectedSupportingDocForView.value = doc
    activeTab.value = 'supporting'
}

// Match selected supporting docs with bank statement
const matchSupportingDocs = async () => {
    if (!currentDocument.value) {
        errorMessage.value = 'Please upload a bank statement first'
        return
    }

    if (selectedSupportingDocs.value.size === 0) {
        errorMessage.value = 'Please select at least one supporting document'
        return
    }

    try {
        isLoadingSupportingDocs.value = true
        errorMessage.value = ''
        processedData.value = []

        // Call Match API with bank statement ID (POST method)
        const bankStatementId = currentDocument.value.id

        // Get selected supporting documents
        const selectedDocs = supportingDocsRaw.value.filter(doc =>
            selectedSupportingDocs.value.has(doc.id)
        )

        const matchResponse = await axios.post(
            `${MATCH_API_URL}/${bankStatementId}/match`,
            {
                supportingDocuments: selectedDocs
            },
            { responseType: 'blob' }
        )

        // Parse match response (ZIP file containing CSV)
        const zipBlob = matchResponse.data
        console.log('Match API Response (ZIP):', zipBlob)

        // Save ZIP for download
        matchResultZip.value = zipBlob

        // Extract CSV files from ZIP
        const zip = await JSZip.loadAsync(zipBlob)
        console.log('ZIP contents:', Object.keys(zip.files))

        // Find CSV files in the ZIP
        const csvFiles = Object.keys(zip.files).filter(name => name.toLowerCase().endsWith('.csv'))
        console.log('CSV files found:', csvFiles)

        if (csvFiles.length === 0) {
            throw new Error('No CSV files found in the ZIP archive')
        }

        // Extract and parse the first CSV file (or combine all if multiple)
        let allMatchedDocs: any[] = []

        for (const csvFileName of csvFiles) {
            const csvText = await zip.files[csvFileName].async('text')
            console.log(`CSV content from ${csvFileName}:`, csvText.substring(0, 500)) // Log first 500 chars

            const matchedDocs = parseCSVToObjects(csvText)
            console.log(`Parsed docs from ${csvFileName}:`, matchedDocs)

            allMatchedDocs = allMatchedDocs.concat(matchedDocs)
        }

        // If we have data, log the first row to see column names
        if (allMatchedDocs.length > 0) {
            console.log('First row columns:', Object.keys(allMatchedDocs[0]))
            console.log('First row data:', allMatchedDocs[0])
        }

        // Format matched data for display - use actual column names from response
        const matched: any[] = allMatchedDocs.map((doc: any) => {
            // Get all possible field names (case-insensitive search)
            const getField = (possibleNames: string[]) => {
                for (const name of possibleNames) {
                    // Check exact match
                    if (doc[name] !== undefined && doc[name] !== '') return doc[name]
                    // Check case-insensitive match
                    const key = Object.keys(doc).find(k => k.toLowerCase() === name.toLowerCase())
                    if (key && doc[key] !== '') return doc[key]
                }
                return null
            }

            return {
                id: getField(['id', 'ID', 'Id']) || 'N/A',
                bank_statement_id: getField(['bank_statement_id', 'Bank Statement ID', 'bank_statement_id', 'BankStatementId']) || 'N/A',
                status: (getField(['status', 'Status']) || 'unknown').toLowerCase(),
                match_table: getField(['match_table', 'Match Table', 'match_table', 'MatchTable']) || 'N/A',
                matched_id: getField(['matched_id', 'Matched ID', 'matched_id', 'MatchedId']) || 'N/A',
                reasoning: getField(['reasoning', 'Reasoning', 'reason', 'Reason']) || 'No reasoning provided',
                rawData: doc // Keep raw data for debugging
            }
        })

        console.log('Formatted matched data:', matched)
        processedData.value = matched

        // Split data into matched and unmatched
        matchedData.value = matched.filter(item => item.status === 'matched')
        unmatchedData.value = matched.filter(item => item.status === 'unmatched')

        // Switch to matched tab if there are matches, otherwise unmatched
        if (matchedData.value.length > 0) {
            activeTab.value = 'matched'
        } else if (unmatchedData.value.length > 0) {
            activeTab.value = 'unmatched'
        }
    } catch (error) {
        console.error('Error matching documents:', error)
        errorMessage.value = 'Failed to match documents. Please try again.'
    } finally {
        isLoadingSupportingDocs.value = false
    }
}

// Toggle supporting doc selection
const toggleSupportingDoc = (docId: number) => {
    if (selectedSupportingDocs.value.has(docId)) {
        selectedSupportingDocs.value.delete(docId)
    } else {
        selectedSupportingDocs.value.add(docId)
    }
}

// Toggle all supporting docs selection
const toggleAllSupportingDocs = () => {
    if (selectedSupportingDocs.value.size === supportingDocsRaw.value.length) {
        selectedSupportingDocs.value.clear()
    } else {
        selectedSupportingDocs.value = new Set(supportingDocsRaw.value.map(doc => doc.id))
    }
}

// Download result ZIP file
const downloadResultZip = () => {
    if (!matchResultZip.value) return

    const url = URL.createObjectURL(matchResultZip.value)
    const link = document.createElement('a')
    link.href = url
    link.download = `match-results-${new Date().toISOString().split('T')[0]}.zip`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
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

/* Horizontal scrollbar styling */
.overflow-x-auto::-webkit-scrollbar,
.overflow-auto::-webkit-scrollbar {
    height: 8px;
    width: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track,
.overflow-auto::-webkit-scrollbar-track {
    background: #f1f2f3;
    border-radius: 4px;
}

.dark .overflow-x-auto::-webkit-scrollbar-track,
.dark .overflow-auto::-webkit-scrollbar-track {
    background: #1b2e4b;
}

.overflow-x-auto::-webkit-scrollbar-thumb,
.overflow-auto::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover,
.overflow-auto::-webkit-scrollbar-thumb:hover {
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

/* Chat message images */
.chat-message-content img {
    cursor: zoom-in;
    transition: transform 0.2s, opacity 0.2s, box-shadow 0.2s;
    border-radius: 0.5rem;
    max-width: 100%;
    height: auto;
}

.chat-message-content img:hover {
    transform: scale(1.02);
    opacity: 0.9;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Modal animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-slide-enter-active {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-slide-leave-active {
    transition: all 0.25s ease-out;
}

.modal-slide-enter-from {
    opacity: 0;
    transform: scale(0.9) translateY(-30px);
}

.modal-slide-leave-to {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
}

/* CSV Tag Styles - Colorful solid badges */
:deep(.csv-tag) {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.813rem;
    font-weight: 600;
    text-transform: capitalize;
    white-space: nowrap;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

/* Unique colorful tag badges - 12 distinct colors */
:deep(.badge-tag-color-0) {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
}

:deep(.badge-tag-color-1) {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
}

:deep(.badge-tag-color-2) {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: white;
}

:deep(.badge-tag-color-3) {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
}

:deep(.badge-tag-color-4) {
    background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
    color: white;
}

:deep(.badge-tag-color-5) {
    background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
    color: white;
}

:deep(.badge-tag-color-6) {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
}

:deep(.badge-tag-color-7) {
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    color: white;
}

:deep(.badge-tag-color-8) {
    background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%);
    color: white;
}

:deep(.badge-tag-color-9) {
    background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
    color: white;
}

:deep(.badge-tag-color-10) {
    background: linear-gradient(135deg, #84cc16 0%, #65a30d 100%);
    color: white;
}

:deep(.badge-tag-color-11) {
    background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
    color: white;
}

/* Dark mode variants */
.dark :deep(.badge-tag-color-0) {
    background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
}

.dark :deep(.badge-tag-color-1) {
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
}

.dark :deep(.badge-tag-color-2) {
    background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
}

.dark :deep(.badge-tag-color-3) {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
}

.dark :deep(.badge-tag-color-4) {
    background: linear-gradient(135deg, #f472b6 0%, #ec4899 100%);
}

.dark :deep(.badge-tag-color-5) {
    background: linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%);
}

.dark :deep(.badge-tag-color-6) {
    background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
}

.dark :deep(.badge-tag-color-7) {
    background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
}

.dark :deep(.badge-tag-color-8) {
    background: linear-gradient(135deg, #fde047 0%, #eab308 100%);
}

.dark :deep(.badge-tag-color-9) {
    background: linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%);
}

.dark :deep(.badge-tag-color-10) {
    background: linear-gradient(135deg, #a3e635 0%, #84cc16 100%);
}

.dark :deep(.badge-tag-color-11) {
    background: linear-gradient(135deg, #fb7185 0%, #f43f5e 100%);
}
</style>
