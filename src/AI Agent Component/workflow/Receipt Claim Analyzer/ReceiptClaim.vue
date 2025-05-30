<template>
    <div class="flex h-full">
        <!-- Sidebar for upload -->
        <div
            class="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-[#e0e6ed] dark:border-[#1b2e4b] overflow-y-auto">
            <div class="p-4 lg:p-6 space-y-4 lg:space-y-6">
                <div>
                    <h2 class="text-xl font-semibold dark:text-white-light">Receipt Claim Analyzer</h2>
                    <p class="text-sm text-white-dark mt-1">Automate Reimbursement with Smart Receipt Analysis</p>
                </div>

                <!-- Upload Section -->
                <div class="panel">
                    <div class="mb-5">
                        <h5 class="font-semibold text-lg dark:text-white-light">Upload Receipt</h5>
                        <p class="text-sm text-white-dark">Take a photo or upload an image</p>
                    </div>

                    <div class="space-y-4">
                        <!-- Camera Button -->
                        <button @click="takePhoto" class="btn btn-primary w-full" :disabled="isLoading">
                            <icon-camera class="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                            Upload Photo
                        </button>

                        <!-- Image Preview -->
                        <div
                            class="upload-area border-2 border-dashed border-[#ebedf2] dark:border-[#191e3a] rounded-lg overflow-hidden transition-all duration-300 hover:border-primary hover:bg-primary/5">
                            <div v-if="!imageUrl && !isLoading"
                                class="flex flex-col items-center justify-center p-8 text-center">
                                <icon-gallery class="w-12 h-12 text-white-dark mb-2" />
                                <span class="text-white-dark">Your receipt image will appear here</span>
                            </div>
                            <img v-if="imageUrl" :src="imageUrl" alt="Uploaded Receipt"
                                class="w-full h-48 object-cover" />
                        </div>

                        <!-- Submit Button -->
                        <button @click="uploadImage" class="btn btn-success w-full" :disabled="isLoading || !imageUrl">
                            <icon-send class="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                            {{ isLoading ? 'Processing...' : 'Analyze Receipt' }}
                        </button>
                    </div>

                    <!-- Loading State -->
                    <div v-if="isLoading" class="mt-4">
                        <div class="flex items-center gap-3">
                            <div class="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full">
                            </div>
                            <span class="font-medium dark:text-white-light">Analyzing receipt...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main content area for results -->
        <div class="flex-1 p-6 overflow-y-auto">
            <!-- Empty State -->
            <!--
        <div v-if="!isProcessing && !hasResults" class="panel">
          <div class="text-center py-8">
            <div class="flex-1 overflow-y-auto bg-white flex flex-col items-center justify-center text-center text-gray-600 text-3xl p-5"><img src="/assets/images/Ai Agent_Data Cleansing.png" alt="Placeholder Image" width=160 height="160" class="mb-4"></div>
            <h3 class="text-lg font-semibold mb-2 dark:text-white-light">Data Cleansing</h3>
            <p class="text-white-dark">
            Managing multiple data sources can be messy, especially when you're trying to consolidate information from various databases and physical identification documents. The Data Cleansing workflow tackles this problem by comparing entries from two different database sources and verifying them against a national ID card or official document. It then intelligently merges the most accurate and up-to-date information into a unified profile. This process helps organizations maintain clean, reliable records, ensuring data integrity across systems while reducing duplication and inconsistencies.
            </p>
          </div>
        </div> -->

            <div v-if="!uploaded && !isLoading" class="panel">
                <div class="text-center py-8">
                    <div
                        class="flex-1 overflow-y-auto bg-white flex flex-col items-center justify-center text-center text-gray-600 text-3xl p-5">
                        <img src="/assets/images/Ai Agent_Receipt analyzer .png" alt="Placeholder Image" width=160
                            height="160" class="mb-4">
                    </div>
                    <h3 class="text-lg font-semibold mb-2 dark:text-white-light">Receipt Claim Analyzer</h3>
                    <p class="text-left text-white-dark mb-4 leading-relaxed">
                        Processing reimbursement claims can be time-consuming and prone to oversight. The Receipt Claim
                        Analyzer automates this by analyzing itemized receipts and determining claim eligibility based
                        on predefined rules and it verifies amounts, matches items to approved categories, and checks for duplicates, evaluating
                        claims in real-time and flagging issues before human review. This reduces processing time and
                        enhances compliance and transparency, providing users with faster, consistent outcomes.
                    </p>
                </div>
            </div>


            <!-- Results Section -->
            <div v-if="uploaded" class="space-y-6">
                <div>
                    <h1 class="text-2xl font-semibold dark:text-white-light">Expense Analysis Results</h1>
                    <p class="text-white-dark">AI-powered receipt analysis and claim verification</p>
                </div>

                <!-- Summary Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="panel border-success bg-success-light dark:bg-success/10">
                        <div class="flex items-center">
                            <div
                                class="w-12 h-12 bg-success text-white rounded-full flex items-center justify-center ltr:mr-4 rtl:ml-4">
                                <icon-circle-check class="w-6 h-6" />
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-success">Claimable Amount</h3>
                                <p class="text-2xl font-bold text-success">${{ claimable.toFixed(2) }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="panel border-danger bg-danger-light dark:bg-danger/10">
                        <div class="flex items-center">
                            <div
                                class="w-12 h-12 bg-danger text-white rounded-full flex items-center justify-center ltr:mr-4 rtl:ml-4">
                                <icon-x-circle class="w-6 h-6" />
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-danger">Not Claimable</h3>
                                <p class="text-2xl font-bold text-danger">${{ nonClaimable.toFixed(2) }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Items List -->
                <div class="panel">
                    <div class="mb-5">
                        <h5 class="font-semibold text-lg dark:text-white-light">Item Details</h5>
                        <p class="text-sm text-white-dark">Detailed breakdown of receipt items</p>
                    </div>

                    <div class="space-y-4">
                        <div v-for="(item, index) in items" :key="index"
                            class="panel border-[#e0e6ed] dark:border-[#1b2e4b]">
                            <div class="space-y-4">
                                <!-- Item Header -->
                                <div class="flex justify-between items-start">
                                    <div class="flex-1">
                                        <h6 class="font-semibold dark:text-white-light">{{ item.Description }}</h6>
                                    </div>
                                    <span v-if="item.Claimable === 'Yes'" class="badge bg-success">
                                        <icon-circle-check class="w-3 h-3 ltr:mr-1 rtl:ml-1" />
                                        Claimable
                                    </span>
                                    <span v-else class="badge bg-danger">
                                        <icon-x-circle class="w-3 h-3 ltr:mr-1 rtl:ml-1" />
                                        Not Claimable
                                    </span>
                                </div>

                                <!-- Item Details Grid -->
                                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div class="bg-[#f1f2f3] dark:bg-[#1b2e4b] rounded-lg p-3">
                                        <span class="text-xs text-white-dark">Quantity</span>
                                        <p class="font-medium dark:text-white-light">{{ item.Quantity }}</p>
                                    </div>
                                    <div class="bg-[#f1f2f3] dark:bg-[#1b2e4b] rounded-lg p-3">
                                        <span class="text-xs text-white-dark">Unit Price</span>
                                        <p class="font-medium dark:text-white-light">${{ item['Unit Price'] }}</p>
                                    </div>
                                    <div class="bg-[#f1f2f3] dark:bg-[#1b2e4b] rounded-lg p-3">
                                        <span class="text-xs text-white-dark">Discount</span>
                                        <p class="font-medium dark:text-white-light">${{ item.Discount }}</p>
                                    </div>
                                    <div class="bg-[#f1f2f3] dark:bg-[#1b2e4b] rounded-lg p-3">
                                        <span class="text-xs text-white-dark">Amount</span>
                                        <p class="font-medium dark:text-white-light">${{ item.Amount }}</p>
                                    </div>
                                </div>

                                <!-- Remark -->
                                <div v-if="item.Remark && item.Remark !== ''"
                                    class="bg-[#f1f2f3] dark:bg-[#1b2e4b] rounded-lg p-4">
                                    <label class="font-medium text-white-dark">Remark:</label>
                                    <p class="dark:text-white-light mt-1">{{ item.Remark }}</p>
                                </div>

                                <!-- Reasoning -->
                                <div v-if="item.Reasoning && item.Reasoning !== ''"
                                    class="bg-[#f1f2f3] dark:bg-[#1b2e4b] rounded-lg p-4">
                                    <label class="font-medium text-white-dark">AI Reasoning:</label>
                                    <ul class="mt-2 space-y-1">
                                        <li v-for="(reason, reasonIndex) in item.Reasoning.split('\n')"
                                            :key="reasonIndex" class="text-sm dark:text-white-light flex items-start">
                                            <span class="text-primary mr-2">•</span>
                                            <span>{{ reason.replace(/^\s*-\s*/, '') }}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Back Button -->
                    <div class="mt-6 pt-4 border-t border-[#e0e6ed] dark:border-[#1b2e4b]">
                        <button @click="backtoHome()" class="btn btn-secondary w-full">
                            <icon-arrow-left class="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                            Analyze Another Receipt
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Camera, CameraResultType } from '@capacitor/camera'
import IconCamera from '@/components/icon/icon-camera.vue'
import IconGallery from '@/components/icon/icon-gallery.vue'
import IconCircleCheck from '@/components/icon/icon-circle-check.vue'
import IconXCircle from '@/components/icon/icon-x-circle.vue'
import IconArrowLeft from '@/components/icon/icon-arrow-left.vue'
import IconSend from '@/components/icon/icon-send.vue'

export default {
    components: {
        IconCamera,
        IconGallery,
        IconCircleCheck,
        IconXCircle,
        IconArrowLeft,
        IconSend
    },
    data () {
        return {
            imageUrl: null,
            file: null,
            items: [],
            isLoading: false,
            reasoning: '',
            uploaded: false,
            claimable: 0,
            nonClaimable: 0
        }
    },

    methods: {
        async takePhoto () {
            try {
                const image = await Camera.getPhoto({
                    quality: 90,
                    allowEditing: false,
                    resultType: CameraResultType.Uri,
                })
                this.imageUrl = image.webPath
                const response = await fetch(image.webPath)
                const blob = await response.blob()
                this.file = new File([blob], 'photo.jpg', { type: blob.type })
            } catch (error) {
                console.error('Error taking photo:', error)
            }
        },

        async uploadImage () {
            if (!this.file) {
                alert('Please select an image first!')
                return
            }

            this.isLoading = true
            const formData = new FormData()
            formData.append('img', this.file)

            try {
                const response = await fetch('https://n8n.forwen.com/webhook/abc30272-a718-4474-b415-680d561be61e', {
                    method: 'POST',
                    body: formData,
                })

                if (response.ok) {
                    this.uploaded = true
                    const result = await response.json()
                    console.log('Upload successful:', result)

                    this.items = result[0].items.table
                    this.reasoning = result[0].reasoning || 'No reasoning provided'

                    // Calculate claimable and non-claimable amounts
                    this.claimable = 0
                    this.nonClaimable = 0
                    this.items.forEach(item => {
                        if (item.Claimable === "Yes") {
                            this.claimable += parseFloat(item.Amount)
                        } else {
                            this.nonClaimable += parseFloat(item.Amount)
                        }
                    })
                } else {
                    console.error('Upload failed:', response.statusText)
                    alert(response.statusText + ', Please upload again')
                }
            } catch (error) {
                console.error('Error uploading image:', error)
                this.uploaded = false
                alert(error)
            } finally {
                this.isLoading = false
            }
        },

        backtoHome () {
            this.uploaded = false
            this.claimable = 0
            this.nonClaimable = 0
            this.imageUrl = null
            this.file = null
            this.items = []
        }
    },
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

.upload-area:hover {
    border-color: var(--primary);
    background-color: rgba(var(--primary-rgb), 0.05);
}
</style>
