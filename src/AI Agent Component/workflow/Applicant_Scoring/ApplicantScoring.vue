<template>
    <div class="flex flex-col lg:flex-row h-full min-h-screen lg:min-h-0">
        <!-- Sidebar/Header Navigation -->
        <div class="w-full lg:max-w-sm lg:h-full lg:border-r border-b lg:border-b-0 border-[#e0e6ed] dark:border-[#1b2e4b] bg-white dark:bg-black">
            <div class="p-4 lg:p-6 space-y-4 lg:space-y-6">
                <div>
                    <h2 class="text-xl font-semibold dark:text-white-light">Applicant Scoring Tools</h2>
                    <p class="text-sm text-white-dark mt-1">Evaluate College Applicants with Intelligence and Fairness
                    </p>
                </div>

                <!-- Navigation Menu -->
                <div class="space-y-2">
                    <div class="nav-item" :class="{ 'active': currentPage === 'document-verification' }"
                        @click="navigateTo('document-verification')">
                        <div class="flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 min-h-[44px]"
                            :class="{
                                'bg-primary text-white': currentPage === 'document-verification',
                                'text-white-dark hover:bg-[#f1f2f3] dark:hover:bg-[#1b2e4b] hover:text-primary': currentPage !== 'document-verification'
                            }">
                            <div class="w-2 h-2 rounded-full flex-shrink-0" :class="{
                                'bg-white': currentPage === 'document-verification',
                                'bg-white-dark': currentPage !== 'document-verification'
                            }"></div>
                            <span class="font-medium text-sm lg:text-base">Upload & Verify Documents</span>
                        </div>
                    </div>

                    <div class="nav-item" :class="{ 'active': currentPage === 'candidate-scoring' }"
                        @click="navigateTo('candidate-scoring')">
                        <div class="flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 min-h-[44px]"
                            :class="{
                                'bg-primary text-white': currentPage === 'candidate-scoring',
                                'text-white-dark hover:bg-[#f1f2f3] dark:hover:bg-[#1b2e4b] hover:text-primary': currentPage !== 'candidate-scoring'
                            }">
                            <div class="w-2 h-2 rounded-full flex-shrink-0" :class="{
                                'bg-white': currentPage === 'candidate-scoring',
                                'bg-white-dark': currentPage !== 'candidate-scoring'
                            }"></div>
                            <span class="font-medium text-sm lg:text-base">Candidate Scoring</span>
                        </div>
                    </div>

                    <div class="nav-item" :class="{ 'active': currentPage === 'program-rankings' }"
                        @click="navigateTo('program-rankings')">
                        <div class="flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 min-h-[44px]"
                            :class="{
                                'bg-primary text-white': currentPage === 'program-rankings',
                                'text-white-dark hover:bg-[#f1f2f3] dark:hover:bg-[#1b2e4b] hover:text-primary': currentPage !== 'program-rankings'
                            }">
                            <div class="w-2 h-2 rounded-full flex-shrink-0" :class="{
                                'bg-white': currentPage === 'program-rankings',
                                'bg-white-dark': currentPage !== 'program-rankings'
                            }"></div>
                            <span class="font-medium text-sm lg:text-base">Program Rankings</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content Area -->
        <div class="flex-1 p-4 lg:p-6 overflow-auto">
            <div v-if="currentPage === 'default'" class="flex items-center justify-center h-full">
                <div class="w-full flex justify-center">
                    <div class="text-center items-center py-8 max-w-xl">
                        <div
                            class="flex-1 overflow-y-auto flex flex-col items-center justify-center text-center text-gray-600 text-3xl p-5">
                            <img src="/assets/images/Ai Agent_UTP applicant scoring.png" alt="Placeholder Image"
                                width=160 height="160" class="mb-4">
                        </div>
                        <h3 class="text-lg font-semibold mb-2 dark:text-white-light">Applicant Scoring</h3>
                        <p class="text-left text-white-dark mb-4 leading-relaxed">
                            The Applicant Scoring tool uses AI to streamline college admissions by rating applicants
                            based on their qualifications. It automates profile analysis, ensuring consistent and
                            unbiased evaluations, reduces administrative workload, allowing institutions to assess applications fairly
                            and efficiently. Leading to more confident, data-driven decisions.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Document Verification Page -->
            <DocumentVerification v-if="currentPage === 'document-verification'" />

            <!-- Candidate Scoring Page -->
            <CandidateScoring v-if="currentPage === 'candidate-scoring'" />

            <!-- Program Rankings Page -->
            <ProgramRankings v-if="currentPage === 'program-rankings'" />
        </div>
    </div>
</template>

<script>
import DocumentVerification from './DocumentVerification.vue'
import CandidateScoring from './CandidateScoring.vue'
import ProgramRankings from './ProgramRankings.vue'
export default {
    components: {
        DocumentVerification,
        CandidateScoring,
        ProgramRankings
    },
    data () {
        return {
            currentPage: 'default',
            mobileMenuOpen: false,
            isMobile: false
        }
    },
    mounted () {
        this.checkMobile()
        window.addEventListener('resize', this.checkMobile)

        // Reset scroll positions when component is mounted
        this.resetScrollPositions()
    },
    beforeUnmount () {
        window.removeEventListener('resize', this.checkMobile)
    },
    methods: {
        checkMobile () {
            this.isMobile = window.innerWidth < 768
            if (!this.isMobile) {
                this.mobileMenuOpen = false
            }
        },
        toggleMenu () {
            this.mobileMenuOpen = !this.mobileMenuOpen
        },
        navigateTo (page) {
            this.currentPage = page
            // Close menu on mobile after navigation
            if (this.isMobile) {
                this.mobileMenuOpen = false
            }

            // Reset scroll positions when navigating between pages
            this.$nextTick(() => {
                this.resetScrollPositions()
            })
        },
        getCurrentPageTitle () {
            switch (this.currentPage) {
                case 'document-verification':
                    return 'Upload & Verify Documents'
                case 'candidate-scoring':
                    return 'Candidate Scoring'
                case 'program-rankings':
                    return 'Program Rankings'
                default:
                    return ''
            }
        },
        resetScrollPositions () {
            // Reset scroll position for the content area
            const contentElement = this.$el.querySelector('.flex-1')
            if (contentElement) {
                contentElement.scrollTop = 0
            }

            // Reset scroll positions for any scrollable elements within the component
            const scrollableElements = this.$el.querySelectorAll('*')
            scrollableElements.forEach(element => {
                if (element.scrollHeight > element.clientHeight ||
                    element.scrollWidth > element.clientWidth) {
                    element.scrollTop = 0
                    element.scrollLeft = 0
                }
            })
        }
    }
}
</script>

<style scoped>
/* Enhanced mobile responsive design */
@media (max-width: 1023px) {
    /* Mobile-first approach for screens smaller than lg (1024px) */
    .space-y-2 > * + * {
        margin-top: 0.5rem;
    }
    
    .space-y-4 > * + * {
        margin-top: 1rem;
    }
    
    .space-y-6 > * + * {
        margin-top: 1.5rem;
    }
    
    /* Better text readability on mobile */
    h2 {
        font-size: 1.25rem;
        line-height: 1.4;
    }
    
    h3 {
        font-size: 1.125rem;
        line-height: 1.4;
    }
    
    /* Optimize navigation for mobile */
    .min-h-\[44px\] {
        font-size: 0.875rem;
    }
}

@media (max-width: 639px) {
    /* Extra small screens (sm breakpoint) */
    .p-4 {
        padding: 0.75rem;
    }
    
    /* Stack navigation menu on small screens */
    .space-y-2 {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    /* Optimize text sizes for small screens */
    .text-xl {
        font-size: 1.125rem;
    }
    
    .text-lg {
        font-size: 1rem;
    }
}

/* Enhanced navigation item styles */
.nav-item {
    transition: all 0.3s ease;
}

.nav-item:hover {
    transform: translateX(2px);
}

.nav-item.active {
    transform: translateX(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Focus states for accessibility */
.nav-item:focus,
.nav-item:focus-within {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
    border-radius: 0.5rem;
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
    .nav-item:hover {
        transform: none;
    }
    
    .min-h-\[44px\] {
        min-height: 48px;
    }
    
    .nav-item .min-h-\[44px\] {
        padding: 0.875rem 0.75rem;
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

/* Enhanced visual hierarchy */
.bg-white.dark\:bg-black {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

@media (min-width: 1024px) {
    .lg\:border-r {
        box-shadow: 1px 0 3px rgba(0, 0, 0, 0.1);
    }
}

/* Smooth transitions for all interactive elements */
.cursor-pointer {
    transition: all 0.3s ease;
}

.rounded-lg {
    transition: all 0.3s ease;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
    .nav-item {
        border: 1px solid transparent;
    }
    
    .nav-item.active {
        border-color: var(--primary);
    }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
    .nav-item,
    .cursor-pointer,
    .rounded-lg {
        transition: none;
    }
    
    .nav-item:hover,
    .nav-item.active {
        transform: none;
    }
}
</style>
