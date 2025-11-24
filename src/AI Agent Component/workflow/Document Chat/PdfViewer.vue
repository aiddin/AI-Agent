<template>
    <div class="pdf-viewer h-full flex flex-col">
        <!-- PDF Controls -->
        <div class="flex items-center justify-between gap-4 p-4 bg-[#f9fafb] dark:bg-[#1b2e4b] border-b border-[#e0e6ed] dark:border-[#191e3a]">
            <div class="flex items-center gap-2">
                <button @click="previousPage" :disabled="currentPage <= 1"
                    class="btn btn-sm btn-outline-primary disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <span class="text-sm dark:text-white-light whitespace-nowrap">
                    Page {{ currentPage }} / {{ totalPages }}
                </span>
                <button @click="nextPage" :disabled="currentPage >= totalPages"
                    class="btn btn-sm btn-outline-primary disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
            <div class="flex items-center gap-2">
                <button @click="zoomOut" class="btn btn-sm btn-outline-primary">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                    </svg>
                </button>
                <span class="text-sm dark:text-white-light whitespace-nowrap">{{ Math.round(scale * 100) }}%</span>
                <button @click="zoomIn" class="btn btn-sm btn-outline-primary">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- PDF Canvas Container -->
        <div class="flex-1 overflow-auto bg-gray-400 dark:bg-gray-700 p-4">
            <div v-if="isLoading" class="flex items-center justify-center h-full">
                <div class="text-center">
                    <div
                        class="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4">
                    </div>
                    <p class="text-sm dark:text-white-light">Loading PDF...</p>
                </div>
            </div>
            <div v-else-if="error" class="flex items-center justify-center h-full">
                <div class="text-center">
                    <div class="text-danger mb-4">
                        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p class="text-sm text-danger">{{ error }}</p>
                </div>
            </div>
            <div v-else class="flex justify-center">
                <canvas ref="pdfCanvas" class="shadow-lg bg-white"></canvas>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'

// Configure PDF.js worker using jsdelivr CDN (stable for v4.x)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

const props = defineProps<{
    url: string
}>()

const pdfCanvas = ref<HTMLCanvasElement | null>(null)
const isLoading = ref(true)
const error = ref('')
const currentPage = ref(1)
const totalPages = ref(0)
const scale = ref(1.0)
let pdfDoc: any = null

const loadPDF = async () => {
    try {
        isLoading.value = true
        error.value = ''

        const loadingTask = pdfjsLib.getDocument(props.url)
        pdfDoc = await loadingTask.promise
        totalPages.value = pdfDoc.numPages
        currentPage.value = 1

        await renderPage(1)
        isLoading.value = false
    } catch (err) {
        console.error('Error loading PDF:', err)
        error.value = 'Failed to load PDF. Please try again.'
        isLoading.value = false
    }
}

const renderPage = async (pageNum: number) => {
    if (!pdfDoc || !pdfCanvas.value) return

    try {
        const page = await pdfDoc.getPage(pageNum)
        const viewport = page.getViewport({ scale: scale.value })

        const canvas = pdfCanvas.value
        const context = canvas.getContext('2d')

        if (!context) return

        canvas.height = viewport.height
        canvas.width = viewport.width

        const renderContext = {
            canvasContext: context,
            viewport: viewport
        }

        await page.render(renderContext).promise
    } catch (err) {
        console.error('Error rendering page:', err)
        error.value = 'Failed to render PDF page'
    }
}

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
        renderPage(currentPage.value)
    }
}

const previousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
        renderPage(currentPage.value)
    }
}

const zoomIn = () => {
    scale.value = Math.min(scale.value + 0.25, 3)
    renderPage(currentPage.value)
}

const zoomOut = () => {
    scale.value = Math.max(scale.value - 0.25, 0.5)
    renderPage(currentPage.value)
}

onMounted(() => {
    loadPDF()
})

watch(() => props.url, () => {
    loadPDF()
})
</script>

<style scoped>
.pdf-viewer canvas {
    display: block;
    margin: 0 auto;
}
</style>
