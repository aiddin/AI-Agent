<template>
    <div class="flex flex-col lg:flex-row h-full min-h-screen lg:min-h-0">
        <!-- Sidebar/Header for upload -->
        <div class="w-full lg:max-w-sm lg:h-full lg:border-r border-b lg:border-b-0 border-[#e0e6ed] dark:border-[#1b2e4b] flex flex-col" :class="{ 'hidden-mobile-after-upload': uploaded }" >
            <div class="p-4 lg:p-6 space-y-4 lg:space-y-6 flex-grow">
                <div>
                    <h2 class="text-xl font-semibold dark:text-white-light">Receipt Claim Analyzer</h2>
                    <p class="text-sm text-white-dark mt-1">Automate Reimbursement with Smart Receipt Analysis</p>
                </div>

                <!-- Upload Section -->
                <div class="panel">
                    <div class="mb-5">
                        <h5 class="font-semibold text-lg dark:text-white-light">Upload Receipt</h5>
                        <p class="text-sm text-white-dark">Take a photo of your receipt</p>
                    </div>

                    <div class="space-y-4">
                        <!-- Camera Button -->
                        <button @click="takePhoto" class="btn btn-primary w-full" :disabled="isLoading || compressing">
                            <icon-camera class="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                            {{ compressing ? 'Compressing...' : 'Take Photo' }}
                        </button>

                        <!-- Image Preview -->
                        <div
                            class="upload-area border-2 border-dashed border-[#ebedf2] dark:border-[#191e3a] rounded-lg overflow-hidden transition-all duration-300 hover:border-primary hover:bg-primary/5">
                            <div v-if="!imageUrl && !isLoading"
                                class="flex flex-col items-center justify-center p-6 lg:p-8 text-center">
                                <icon-gallery class="w-10 h-10 lg:w-12 lg:h-12 text-white-dark mb-2" />
                                <span class="text-white-dark text-sm lg:text-base">Your receipt image will appear here</span>
                            </div>
                            <div v-if="imageUrl">
                                <img :src="imageUrl" alt="Uploaded Receipt" class="w-full h-40 lg:h-48 object-cover" />
                                <div v-if="file" class="p-2 bg-gray-50 dark:bg-gray-800 text-xs text-center text-white-dark">
                                    Size: {{ (file.size / 1024).toFixed(1) }}KB
                                    <span v-if="file.size <= 1024 * 1024" class="text-success ml-2">✓ Optimized</span>
                                </div>
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <button @click="uploadImage" class="btn btn-success w-full" :disabled="isLoading || compressing || !imageUrl">
                            <icon-send class="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                            {{ isLoading ? 'Processing...' : 'Analyze Receipt' }}
                        </button>
                    </div>

                    <!-- Compression State -->
                    <div v-if="compressing" class="mt-4">
                        <div class="flex items-center gap-3">
                            <div class="animate-spin w-5 h-5 border-2 border-warning border-t-transparent rounded-full">
                            </div>
                            <span class="font-medium dark:text-white-light">Compressing image...</span>
                        </div>
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
        <div class="flex-1 p-4 lg:p-6 overflow-y-auto">

            <div v-if="!uploaded && !isLoading"class="w-full flex justify-center">
                    <div class="text-center items-center py-8 max-w-xl">
                        <div
                            class="flex-1 overflow-y-auto flex flex-col items-center justify-center text-center text-gray-600 text-3xl p-5">
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
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                    <div class="panel border-success bg-success-light dark:bg-success/10">
                        <div class="flex items-center">
                            <div
                                class="w-10 h-10 lg:w-12 lg:h-12 bg-success text-white rounded-full flex items-center justify-center ltr:mr-3 rtl:ml-3 lg:ltr:mr-4 lg:rtl:ml-4">
                                <icon-circle-check class="w-5 h-5 lg:w-6 lg:h-6" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <h3 class="text-base lg:text-lg font-semibold text-success truncate">Claimable Amount</h3>
                                <p class="text-xl lg:text-2xl font-bold text-success">${{ claimable.toFixed(2) }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="panel border-danger bg-danger-light dark:bg-danger/10">
                        <div class="flex items-center">
                            <div
                                class="w-10 h-10 lg:w-12 lg:h-12 bg-danger text-white rounded-full flex items-center justify-center ltr:mr-3 rtl:ml-3 lg:ltr:mr-4 lg:rtl:ml-4">
                                <icon-x-circle class="w-5 h-5 lg:w-6 lg:h-6" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <h3 class="text-base lg:text-lg font-semibold text-danger truncate">Not Claimable</h3>
                                <p class="text-xl lg:text-2xl font-bold text-danger">${{ nonClaimable.toFixed(2) }}</p>
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
                                <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                                    <div class="bg-[#f1f2f3] dark:bg-[#1b2e4b] rounded-lg p-2 lg:p-3">
                                        <span class="text-xs text-white-dark block">Quantity</span>
                                        <p class="font-medium dark:text-white-light text-sm lg:text-base truncate">{{ item.Quantity }}</p>
                                    </div>
                                    <div class="bg-[#f1f2f3] dark:bg-[#1b2e4b] rounded-lg p-2 lg:p-3">
                                        <span class="text-xs text-white-dark block">Unit Price</span>
                                        <p class="font-medium dark:text-white-light text-sm lg:text-base truncate">${{ item['Unit Price'] }}</p>
                                    </div>
                                    <div class="bg-[#f1f2f3] dark:bg-[#1b2e4b] rounded-lg p-2 lg:p-3">
                                        <span class="text-xs text-white-dark block">Discount</span>
                                        <p class="font-medium dark:text-white-light text-sm lg:text-base truncate">${{ item.Discount }}</p>
                                    </div>
                                    <div class="bg-[#f1f2f3] dark:bg-[#1b2e4b] rounded-lg p-2 lg:p-3">
                                        <span class="text-xs text-white-dark block">Amount</span>
                                        <p class="font-medium dark:text-white-light text-sm lg:text-base truncate">${{ item.Amount }}</p>
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
                    <div class="mt-6 pt-4 border-t border-[#e0e6ed] dark:border-[#1b2e4b] lg:block hidden">
                        <button @click="backtoHome()" class="btn btn-secondary w-full">
                            <icon-arrow-left class="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                            Analyze Another Receipt
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Mobile Sticky Button -->
        <div v-if="uploaded" class="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-[#0e1726] border-t border-[#e0e6ed] dark:border-[#1b2e4b] z-10">
            <button @click="backtoHome()" class="btn btn-secondary w-full">
                <icon-arrow-left class="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                Analyze Another Receipt
            </button>
        </div>
    </div>
</template>

<script>
import { Camera, CameraResultType } from '@capacitor/camera'
import imageCompression from 'browser-image-compression'
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
            nonClaimable: 0,
            compressing: false
        }
    },

    methods: {
        async compressImage(file) {
            // Check if file is larger than 1MB (1024 * 1024 bytes)
            if (file.size <= 1024 * 1024) {
                console.log('File is already under 1MB, no compression needed')
                return file
            }

            console.log(`Original file size: ${(file.size / 1024 / 1024).toFixed(2)} MB`)
            this.compressing = true

            try {
                const options = {
                    maxSizeMB: 1, // Maximum size in MB
                    maxWidthOrHeight: 1920, // Maximum width or height
                    useWebWorker: true, // Use web worker for better performance
                    fileType: 'image/jpeg', // Convert to JPEG for better compression
                    initialQuality: 0.8 // Initial quality
                }

                const compressedFile = await imageCompression(file, options)
                console.log(`Compressed file size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`)
                
                return compressedFile
            } catch (error) {
                console.error('Error compressing image:', error)
                // Return original file if compression fails
                return file
            } finally {
                this.compressing = false
            }
        },


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
                let file = new File([blob], 'photo.jpg', { type: blob.type })
                
                // Compress the image if it's too large
                file = await this.compressImage(file)
                this.file = file
                
                // Update image URL with compressed version for preview
                if (file !== blob) {
                    this.imageUrl = URL.createObjectURL(file)
                }
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
            // Clean up blob URL if it exists
            if (this.imageUrl && this.imageUrl.startsWith('blob:')) {
                URL.revokeObjectURL(this.imageUrl)
            }
            this.imageUrl = null
            this.file = null
            this.items = []
            this.compressing = false
        }
    },
}
</script>

<style scoped>
/* Enhanced mobile responsive design */
@media (max-width: 1023px) {
    /* Mobile-first approach for screens smaller than lg (1024px) */
    .panel {
        border-radius: 0.75rem;
        margin-bottom: 1rem;
    }
    
    /* Ensure proper spacing on mobile */
    .space-y-4 > * + * {
        margin-top: 1rem;
    }
    
    /* Optimize button sizes for mobile */
    .btn {
        min-height: 44px; /* Minimum touch target size */
        font-size: 0.875rem;
    }
    
    /* Better text readability on mobile */
    h1 {
        font-size: 1.5rem;
        line-height: 1.4;
    }
    
    h2 {
        font-size: 1.25rem;
        line-height: 1.4;
    }
    
    h3 {
        font-size: 1.125rem;
        line-height: 1.4;
    }
}

@media (max-width: 639px) {
    /* Extra small screens (sm breakpoint) */
    .grid-cols-2 {
        grid-template-columns: repeat(1, minmax(0, 1fr));
    }
    
    /* Stack summary cards on very small screens */
    .sm\:grid-cols-2 {
        grid-template-columns: repeat(1, minmax(0, 1fr));
    }
    
    /* Optimize item detail grids for small screens */
    .lg\:grid-cols-4 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    
    /* Reduce padding on small screens */
    .p-4 {
        padding: 0.75rem;
    }
    
    /* Optimize text sizes for small screens */
    .text-xl {
        font-size: 1.125rem;
    }
    
    .text-2xl {
        font-size: 1.25rem;
    }
}

/* Enhanced hover and focus states */
.upload-area {
    transition: all 0.3s ease;
}

.upload-area:hover {
    border-color: var(--primary);
    background-color: rgba(var(--primary-rgb), 0.05);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Better focus states for accessibility */
.btn:focus {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
}

/* Smooth transitions for interactive elements */
.btn, .panel, .badge {
    transition: all 0.3s ease;
}

/* Optimize for touch devices */
@media (hover: none) and (pointer: coarse) {
    .upload-area:hover {
        transform: none;
        box-shadow: none;
    }
    
    .btn {
        min-height: 48px; /* Larger touch targets for touch devices */
    }
}

/* Dark mode optimizations */
@media (prefers-color-scheme: dark) {
    .upload-area {
        border-color: rgba(255, 255, 255, 0.1);
    }
    
    .upload-area:hover {
        border-color: var(--primary);
        background-color: rgba(var(--primary-rgb), 0.1);
    }
}

/* Landscape orientation on mobile */
@media (max-width: 1023px) and (orientation: landscape) {
    .min-h-screen {
        min-height: 100vh;
    }
    
    .lg\:min-h-0 {
        min-height: 100vh;
    }
}

/* High density displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .upload-area {
        border-width: 0.5px;
    }
}

/* Hide upload section on mobile after analysis */
@media (max-width: 1023px) {
    .hidden-mobile-after-upload {
        display: none !important;
    }
    
    /* Add bottom padding to prevent content from being hidden behind sticky button */
    .flex-1.p-4.lg\\:p-6 {
        padding-bottom: 80px;
    }
}
</style>
