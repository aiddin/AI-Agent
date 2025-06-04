<template>
    <div class="flex h-full">
        <!-- Sidebar for file upload -->
        <div
            class="w-max-md lg:w-80 border-b lg:border-b-0 lg:border-r border-[#e0e6ed] dark:border-[#1b2e4b] overflow-y-auto">
            <div class="p-4 lg:p-6 space-y-4 lg:space-y-6">
                <div>
                    <h2 class="text-xl font-semibold dark:text-white-light">Purchase Order Information Extraction</h2>
                    <p class="text-sm text-white-dark mt-1">Turn Purchase Orders into Usable Data Instantly</p>
                </div>

                <div class="panel">
                    <div class="mb-5">
                        <h5 class="font-semibold text-lg dark:text-white-light">Upload PDF File</h5>
                    </div>
                    <div class="space-y-4">
                        <div>
                            <input type="file" id="file-input" @change="handleFileUpload" accept="application/pdf"
                                class="form-input cursor-pointer" />
                            <p class="text-xs text-white-dark mt-2">
                                Upload a purchase order in PDF format
                            </p>
                        </div>

                        <div v-if="selectedFile" class="flex items-center gap-2">
                            <span class="badge bg-secondary text-xs">
                                ✓ {{ selectedFile.name }}
                            </span>
                        </div>
                    </div>
                </div>

                <button v-if="selectedFile" @click="processFile" :disabled="processing" class="btn btn-primary w-full"
                    :class="{ 'opacity-60 pointer-events-none': processing }">
                    {{ processing ? 'Processing...' : 'Process with AI' }}
                </button>

                <div v-if="convertingImages" class="space-y-3">
                    <div class="w-full bg-[#ebedf2] dark:bg-dark/40 rounded-full h-2">
                        <div class="bg-primary h-2 rounded-full animate-pulse"></div>
                    </div>
                    <p class="text-sm text-white-dark text-center">
                        Converting PDF to images...
                    </p>
                </div>
            </div>
        </div>

        <!-- Main content area -->
        <div class="flex-1 p-6 overflow-y-auto">
            <!-- Empty state when no file is uploaded -->
            <div v-if="!selectedFile" class="w-full flex justify-center">
                    <div class="text-center items-center py-8 max-w-xl">
                        <div
                            class="flex-1 overflow-y-auto flex flex-col items-center justify-center text-center text-gray-600 text-3xl p-5">
                            <img src="/assets/images/Ai Agent_Information Extraction.png" alt="Placeholder Image"
                                width=160 height="160" class="mb-4">
                        </div>
                        <h3 class="text-lg font-semibold mb-2 dark:text-white-light">Purchase Order Information
                            Extraction</h3>
                        <p class="text-left text-white-dark mb-4 leading-relaxed">
                            The Purchase Order Information Extraction AI workflow automates data entry by extracting key
                            fields from purchase order documents, including vendor names, order numbers, and item
                            details from scanned PDFs, or emails, to ensures seamless integration into financial systems, reduces human error, and boosts
                            operational efficiency—transforming tedious paperwork into structured data ready for
                            immediate use
                        </p>
                    </div>

            </div>

            <!-- Tabs for file preview and extracted details -->
            <div v-else class="space-y-6">
                <div>
                    <h2 class="text-2xl font-semibold dark:text-white-light">Purchase Order Analysis</h2>
                    <p class="text-white-dark">View file preview and extracted details</p>
                </div>

                <!-- Tab Navigation -->
                <div class="panel">
                    <div class="flex border-b border-[#ebedf2] dark:border-[#191e3a]">
                        <button class="px-4 py-3 font-medium transition-colors duration-300" :class="{
                            'text-primary border-b-2 border-primary': activeTab === 'preview',
                            'text-white-dark hover:text-primary': activeTab !== 'preview'
                        }" @click="activeTab = 'preview'">
                            File Preview
                        </button>
                        <button class="px-4 py-3 font-medium transition-colors duration-300" :class="{
                            'text-primary border-b-2 border-primary': activeTab === 'details',
                            'text-white-dark hover:text-primary': activeTab !== 'details'
                        }" @click="activeTab = 'details'">
                            Extracted Details
                        </button>
                    </div>

                    <!-- Tab Content -->
                    <div class="p-6">
                        <!-- File Preview Tab -->
                        <div v-if="activeTab === 'preview'">
                            <div v-if="images.length > 0" class="space-y-6">
                                <div v-for="(image, index) in images" :key="index" class="text-center">
                                    <img :src="image"
                                        class="max-w-full border border-[#ebedf2] dark:border-[#191e3a] rounded-lg mx-auto" />
                                    <p class="text-sm text-white-dark mt-2">Page {{ index + 1 }}</p>
                                </div>
                            </div>
                            <div v-else-if="convertingImages" class="text-center py-8">
                                <div
                                    class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4">
                                </div>
                                <p class="text-white-dark">Converting PDF to images...</p>
                            </div>
                            <div v-else class="text-center py-8">
                                <p class="text-white-dark">No preview available. Please upload a valid PDF file.</p>
                            </div>
                        </div>

                        <!-- Extracted Details Tab -->
                        <div v-if="activeTab === 'details'">
                            <div v-if="!poData" class="text-center py-8">
                                <div v-if="processing" class="space-y-4">
                                    <div
                                        class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto">
                                    </div>
                                    <p class="text-white-dark">Processing file...</p>
                                </div>
                                <p v-else class="text-white-dark">No data available. Please process the file first.</p>
                            </div>

                            <div v-else class="space-y-6">
                                <div v-for="(po, poIndex) in poData" :key="poIndex" class="space-y-6">
                                    <!-- Company Information -->
                                    <div class="panel">
                                        <div class="mb-5">
                                            <h5 class="font-semibold text-lg dark:text-white-light">Company Information
                                            </h5>
                                        </div>
                                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label class="font-medium text-white-dark">Company:</label>
                                                <p class="mt-1 dark:text-white-light">{{
                                                    po.purchaser_company_name_with_registration_number || 'N/A' }}</p>

                                                <label class="font-medium text-white-dark mt-4 block">Address:</label>
                                                <p class="mt-1 dark:text-white-light">{{ po.purchaser_address || 'N/A'
                                                    }}</p>
                                            </div>

                                            <div>
                                                <label class="font-medium text-white-dark">Tel:</label>
                                                <p class="mt-1 dark:text-white-light">{{ po.purchaser_tel || 'N/A' }}
                                                </p>

                                                <label class="font-medium text-white-dark mt-4 block">Fax:</label>
                                                <p class="mt-1 dark:text-white-light">{{ po.purchaser_fax || 'N/A' }}
                                                </p>
                                            </div>

                                            <div>
                                                <label class="font-medium text-white-dark">Email:</label>
                                                <p class="mt-1 dark:text-white-light">{{ po.purchaser_email || 'N/A' }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- PO Details -->
                                    <div class="panel">
                                        <div class="mb-5">
                                            <h5 class="font-semibold text-lg dark:text-white-light">Purchase Order
                                                Information</h5>
                                        </div>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label class="font-medium text-white-dark">PO Number:</label>
                                                <p class="mt-1 dark:text-white-light">{{ po.po_number || 'N/A' }}</p>
                                            </div>

                                            <div>
                                                <label class="font-medium text-white-dark">PO Date:</label>
                                                <p class="mt-1 dark:text-white-light">{{ po.po_date || 'N/A' }}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Items Table -->
                                    <div class="panel">
                                        <div class="mb-5">
                                            <h5 class="font-semibold text-lg dark:text-white-light">Items</h5>
                                        </div>
                                        <div v-if="po.table && po.table.length > 0" class="table-responsive">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th v-for="(column, colIndex) in Object.keys(po.table[0])"
                                                            :key="colIndex" :class="{
                                                                'ltr:rounded-l-md rtl:rounded-r-md': colIndex === 0,
                                                                'ltr:rounded-r-md rtl:rounded-l-md': colIndex === Object.keys(po.table[0]).length - 1
                                                            }">
                                                            {{ column }}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(item, itemIndex) in po.table" :key="itemIndex"
                                                        class="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                                        <td v-for="(column, colIndex) in Object.keys(item)"
                                                            :key="colIndex" class="text-black dark:text-white">
                                                            {{ item[column] !== null ? item[column] : '-' }}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div v-else class="text-center py-8">
                                            <p class="text-white-dark">No items found in the purchase order.</p>
                                        </div>
                                    </div>

                                    <!-- Reasoning -->
                                    <div class="panel">
                                        <div class="mb-5">
                                            <h5 class="font-semibold text-lg dark:text-white-light">AI Analysis
                                                Reasoning</h5>
                                        </div>
                                        <div class="bg-[#f1f2f3] dark:bg-[#1b2e4b] rounded-lg p-4">
                                            <p v-if="po.reasoning" v-html="formatReasoning(po.reasoning)"
                                                class="text-white-dark whitespace-pre-line"></p>
                                            <p v-else class="text-white-dark">No reasoning provided.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { fromPath } from "pdf2pic";

export default {
    data () {
        return {
            selectedFile: null,
            images: [],
            poData: null,
            activeTab: 'preview',
            processing: false,
            convertingImages: false
        }
    },
    methods: {
        handleFileUpload (event) {
            const file = event.target.files[0]
            if (file && file.type === 'application/pdf') {
                this.selectedFile = file
                this.poData = null
                this.images = []
                this.convertPdfToImages(file)
            }
        },

        async convertPdfToImages (file) {
            this.convertingImages = true

            try {
                const formData = new FormData()
                formData.append('fileInput', file)
                formData.append('imageFormat', 'jpg')
                formData.append('singleOrMultiple', 'multiple')
                formData.append('dpi', '300')

                const response = await axios.post(
                    'https://stirlingpdf.io/api/v1/convert/pdf/img',
                    formData,
                    {
                        responseType: 'arraybuffer',
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                )

                // Process the zip file
                await this.processZipResponse(response.data)
            } catch (error) {
                console.error('Error converting PDF to images:', error)
            } finally {
                this.convertingImages = false
            }
        },

        async processZipResponse (zipData) {
            try {
                // Use JSZip to extract images from the zip file
                const JSZip = (await import('jszip')).default
                const zip = new JSZip()

                const zipContents = await zip.loadAsync(zipData)
                const imageFiles = Object.values(zipContents.files).filter(file =>
                    !file.dir && /\.(jpe?g|png)$/i.test(file.name)
                )

                // Sort image files by name to maintain order
                imageFiles.sort((a, b) => a.name.localeCompare(b.name))

                // Process each image file
                for (const file of imageFiles) {
                    const blob = await file.async('blob')
                    const imageUrl = URL.createObjectURL(blob)
                    this.images.push(imageUrl)
                }
            } catch (error) {
                console.error('Error processing zip file:', error)
            }
        },

        async processFile () {
            if (!this.selectedFile) return

            this.processing = true

            try {
                const formData = new FormData()
                formData.append('file', this.selectedFile)

                const response = await axios.post(
                    'https://n8n.forwen.com/webhook/c6622b28-df07-4f33-86b0-3233901525e1',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                )

                this.poData = response.data
                this.activeTab = 'details'
            } catch (error) {
                console.error('Error processing file:', error)
            } finally {
                this.processing = false
            }
        },

        formatReasoning (reasoning) {
            if (!reasoning) return ''
            return reasoning.replace(/\\n/g, '<br>')
        }
    }
}
</script>

<style scoped>
/* Custom styles for responsive design */
@media (max-width: 768px) {
    .w-80 {
        width: 100%;
    }

    .flex {
        flex-direction: column;
    }
}
</style>
